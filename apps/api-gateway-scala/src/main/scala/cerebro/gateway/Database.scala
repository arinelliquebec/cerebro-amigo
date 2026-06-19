package cerebro.gateway

import cats.effect.{IO, Resource}
import doobie.hikari.HikariTransactor
import com.zaxxer.hikari.HikariConfig

/** Transactor Doobie (HikariCP). Conecta como `cerebro_gateway` (NOBYPASSRLS) —
  * a RLS de tenant (ADR-042) vale por baixo. As credenciais do `DbConfig` definem
  * o role; nunca usar um role com BYPASSRLS aqui.
  */
object Database:
  def transactor(cfg: DbConfig): Resource[IO, HikariTransactor[IO]] =
    val hikari = new HikariConfig()
    hikari.setJdbcUrl(cfg.jdbcUrl)
    hikari.setUsername(cfg.user)
    hikari.setPassword(cfg.password)
    hikari.setDriverClassName("org.postgresql.Driver")
    hikari.setMaximumPoolSize(40) // espelha DB_MAX_POOL_SIZE default do .NET
    hikari.setPoolName("cerebro-gateway-scala")
    HikariTransactor.fromHikariConfig[IO](hikari)
