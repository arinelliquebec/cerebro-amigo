package cerebro.gateway

import com.dimafeng.testcontainers.PostgreSQLContainer
import com.dimafeng.testcontainers.munit.TestContainerForAll
import doobie.*
import doobie.implicits.*
import org.testcontainers.utility.DockerImageName
import java.sql.{DriverManager, Statement}
import java.util.UUID
import scala.io.Source

/** Gate de isolamento de tenant do api-gateway-scala (ADR-067) — porte do
  * `apps/api-gateway-tests/RlsTests.cs`. Prova, no MESMO caminho de produção
  * (HikariTransactor como `gw_test` NOBYPASSRLS + `TenantSession.withMedico`), que:
  *   1. médico A não enxerga prescrição do paciente do médico B (RLS barra);
  *   2. médico B só vê a sua;
  *   3. SEM tenant setado, o role do gateway não vê nada (fail-closed).
  *
  * Sobe pgvector:pg16 (mesma imagem do fixture .NET), aplica TODAS as
  * `infra/migrations/0*.sql` (exceto least_privilege_roles, com roles stubadas) e
  * semeia dois tenants. É a barreira que tem de estar VERDE antes de o BFF flipar
  * qualquer endpoint que leia tabela com RLS.
  */
class TenantIsolationSpec extends munit.CatsEffectSuite with TestContainerForAll:

  override val containerDef: PostgreSQLContainer.Def =
    PostgreSQLContainer.Def(
      dockerImageName = DockerImageName.parse("pgvector/pgvector:pg16").asCompatibleSubstituteFor("postgres"),
      databaseName = "cerebro_v3_test",
    )

  // ── Dois tenants ──
  private val usuarioA  = UUID.randomUUID()
  private val usuarioB  = UUID.randomUUID()
  private val medicoA   = UUID.randomUUID()
  private val medicoB   = UUID.randomUUID()
  private val pacienteA = UUID.randomUUID()
  private val pacienteB = UUID.randomUUID()
  private val gwPassword = "gw_test_pw"

  // Setup roda uma vez, com a conexão admin (superuser do container).
  override def afterContainersStart(pg: PostgreSQLContainer): Unit =
    val conn = DriverManager.getConnection(pg.jdbcUrl, pg.username, pg.password)
    try
      val st = conn.createStatement()
      stubRoles(st)
      applyMigrations(st)
      seed(st)
      createGatewayRole(st)
    finally conn.close()

  // Transactor como gw_test (NOBYPASSRLS) — a RLS da 0037/0038 VALE aqui.
  private def gwXa(pg: PostgreSQLContainer) =
    Database.transactor(DbConfig(pg.jdbcUrl, "gw_test", gwPassword))

  test("médico A não vê prescrição do paciente de B (RLS barra cross-tenant)") {
    withContainers { pg =>
      gwXa(pg).use { xa =>
        TenantSession
          .withMedico(medicoA)(
            sql"SELECT COALESCE(string_agg(medicamento, ','), '') FROM prescricoes".query[String].unique
          )
          .transact(xa)
          .map { meds =>
            assert(meds.contains("Escitalopram"), s"deveria ver a própria prescrição; veio: '$meds'")
            assert(!meds.contains("Sertralina"), s"VAZOU prescrição do tenant B: '$meds'")
          }
      }
    }
  }

  test("médico B vê só a própria prescrição") {
    withContainers { pg =>
      gwXa(pg).use { xa =>
        TenantSession
          .withMedico(medicoB)(
            sql"SELECT COALESCE(string_agg(medicamento, ','), '') FROM prescricoes".query[String].unique
          )
          .transact(xa)
          .map { meds =>
            assert(meds.contains("Sertralina"), s"deveria ver a própria prescrição; veio: '$meds'")
            assert(!meds.contains("Escitalopram"), s"VAZOU prescrição do tenant A: '$meds'")
          }
      }
    }
  }

  test("sem tenant setado, o role do gateway não vê prescrição nenhuma (fail-closed)") {
    withContainers { pg =>
      gwXa(pg).use { xa =>
        sql"SELECT COUNT(*) FROM prescricoes"
          .query[Long]
          .unique
          .transact(xa)
          .map(c => assertEquals(c, 0L, "RLS deveria barrar tudo sem app.current_medico"))
      }
    }
  }

  // ── helpers de setup (espelham TenantIsolationFixture.cs) ──

  private def stubRoles(st: Statement): Unit =
    st.execute("""
      DO $$ BEGIN
        IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname='cerebro_gateway') THEN CREATE ROLE cerebro_gateway NOLOGIN; END IF;
        IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname='cerebro_workers') THEN CREATE ROLE cerebro_workers NOLOGIN; END IF;
      END $$;""")

  private def applyMigrations(st: Statement): Unit =
    val dir = findMigrationsDir()
    val files = dir
      .listFiles((_, n) => n.matches("0.*\\.sql") && !n.contains("least_privilege_roles"))
      .sortBy(_.getName)
    for f <- files do
      val sql = Source.fromFile(f, "UTF-8").mkString
      try st.execute(sql)
      catch case e: Exception => throw new RuntimeException(s"falha ao aplicar ${f.getName}: ${e.getMessage}", e)

  private def seed(st: Statement): Unit =
    st.execute(s"""
      INSERT INTO usuarios (id, email, senha_hash, nome, role) VALUES
        ('$usuarioA','medico.a@example.com','x','Médico A','medico'),
        ('$usuarioB','medico.b@example.com','x','Médico B','medico');
      INSERT INTO medicos (id, usuario_id, nome, crm) VALUES
        ('$medicoA','$usuarioA','Médico A','CRM-A'),
        ('$medicoB','$usuarioB','Médico B','CRM-B');
      INSERT INTO clientes (id, email, nome) VALUES
        ('$pacienteA','paciente.a@example.com','Paciente A'),
        ('$pacienteB','paciente.b@example.com','Paciente B');
      INSERT INTO pacientes (cliente_id, medico_responsavel_id) VALUES
        ('$pacienteA','$medicoA'),('$pacienteB','$medicoB');
      INSERT INTO prescricoes (id, paciente_id, medico_id, medicamento, dose_descricao, ativa) VALUES
        ('${UUID.randomUUID()}','$pacienteB','$medicoB','Sertralina 50mg','1x ao dia',TRUE),
        ('${UUID.randomUUID()}','$pacienteA','$medicoA','Escitalopram 10mg','1x ao dia',TRUE);
    """)

  // gw_test: NOSUPERUSER NOBYPASSRLS — espelha cerebro_gateway de prod (0036).
  private def createGatewayRole(st: Statement): Unit =
    st.execute(s"""
      DROP ROLE IF EXISTS gw_test;
      CREATE ROLE gw_test LOGIN PASSWORD '$gwPassword' NOSUPERUSER NOBYPASSRLS;
      GRANT USAGE ON SCHEMA public TO gw_test;
      GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO gw_test;
      GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO gw_test;""")

  private def findMigrationsDir(): java.io.File =
    var d = new java.io.File(System.getProperty("user.dir")).getAbsoluteFile
    while d != null do
      val cand = new java.io.File(d, "infra/migrations")
      if cand.isDirectory then return cand
      d = d.getParentFile
    throw new RuntimeException("infra/migrations não encontrado subindo a partir de " + System.getProperty("user.dir"))
