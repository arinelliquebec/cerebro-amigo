# 03 — Descomissionamento do RDS + limpeza (Fase 4 do runbook)

> **Modo de execução:** os comandos abaixo são executados **manualmente pelo operador**,
> na ordem. Nenhum deles foi executado pela sessão que gerou este plano. Após a execução,
> a verificação (§6) confirma via describes e o ADR-077 vira `Implemented`.
> Plano gerado em 2026-07-06T21:00Z com estado real da conta (describes read-only).

---

## 0. GATES — NÃO EXECUTE NADA ANTES DESTES DOIS ✋

### Gate 1 — Checkup ainda está no RDS (verificado 2026-07-06T20:51Z) 🔴

O SSM `/cerebro-amigo/checkup/database-url` ainda aponta para
`cerebro-postgres-enc...rds.amazonaws.com`. **Deletar o RDS agora derruba o checkup.**
O flip está 100% preparado (schema local fresh, rota SG+TLS+role testada). Executar:

```bash
# 1) Flip da DSN (a senha é lida do .env do box; não passa pelo seu shell)
aws ssm send-command --region sa-east-1 --instance-ids i-057860cd97edafefb --document-name AWS-RunShellScript --parameters 'commands=["C=$(grep ^PG_LOCAL_CHECKUP_PASSWORD= /opt/cerebro-amigo-v3/.env | cut -d= -f2-); aws ssm put-parameter --region sa-east-1 --name /cerebro-amigo/checkup/database-url --type SecureString --overwrite --value postgresql://checkup_app:${C}@172.31.4.97:5432/cerebro_v3?sslmode=require"]'

# 2) Instâncias novas do ASG leem o parâmetro novo
aws autoscaling start-instance-refresh --region sa-east-1 --auto-scaling-group-name cerebro-checkup-asg

# 3) Validar (após o refresh terminar — acompanhe):
aws autoscaling describe-instance-refreshes --region sa-east-1 --auto-scaling-group-name cerebro-checkup-asg --query 'InstanceRefreshes[0].{S:Status,P:PercentageComplete}'
curl -s -o /dev/null -w "%{http_code}\n" https://checkup.cerebroamigo.com.br/api/health   # 200
# Zero conexões checkup_app no RDS = flip completo.
```

### Gate 2 — 72 h de observação estável 🔴 (abre em **2026-07-09T20:25Z**)

Cutover: 2026-07-06T20:25Z (tag `migration/postgres-selfhosted-cutover`). Antes de executar:
- [ ] Data ≥ 2026-07-09T20:25Z.
- [ ] 6 alarmes `cerebro-pg-*`/`cerebro-ec2-cpu-credits-low` sem ALARM no período
      (exceção documentada: ALARM proposital da simulação de falha em 06/07 20:43Z):
      `aws cloudwatch describe-alarm-history --region sa-east-1 --start-date 2026-07-06T20:45:00Z --history-item-type StateUpdate --query 'AlarmHistoryItems[?contains(HistorySummary,\`to ALARM\`)].[AlarmName,Timestamp]' --output table`
- [ ] 3 backups diários verdes: `aws s3 ls s3://cerebro-amigo-db-backups/postgres/daily/` (07, 08, 09/07)
      e `last-success` fresco. Restore-test: manual de 06/07 = PASS; o dominical roda 12/07 (não bloqueia).
- [ ] Checkup operando no banco local (Gate 1) sem erro por pelo menos 24 h.

---

## 1. Snapshot final (seguro de arrependimento) — ANTES de mexer na proteção

```bash
SNAP="cerebro-postgres-enc-final-adr077-$(date +%Y%m%d)"
aws rds create-db-snapshot --region sa-east-1 --db-instance-identifier cerebro-postgres-enc --db-snapshot-identifier "$SNAP"
aws rds wait db-snapshot-available --region sa-east-1 --db-snapshot-identifier "$SNAP"
# Confirmar: Status=available e Encrypted=true (KMS ae3bc623-... — por isso a chave KMS NÃO será deletada)
aws rds describe-db-snapshots --region sa-east-1 --db-snapshot-identifier "$SNAP" --query 'DBSnapshots[0].{Status:Status,Encrypted:Encrypted,Kms:KmsKeyId,Size:AllocatedStorage}'
```

## 2. Desabilitar deletion protection (só depois do snapshot available)

```bash
aws rds modify-db-instance --region sa-east-1 --db-instance-identifier cerebro-postgres-enc --no-deletion-protection --apply-immediately
aws rds wait db-instance-available --region sa-east-1 --db-instance-identifier cerebro-postgres-enc
```

## 3. Delete da instância

```bash
aws rds delete-db-instance --region sa-east-1 --db-instance-identifier cerebro-postgres-enc --skip-final-snapshot
aws rds wait db-instance-deleted --region sa-east-1 --db-instance-identifier cerebro-postgres-enc   # ~5-10 min
```

> Rollback pós-delete: `aws rds restore-db-instance-from-db-snapshot` a partir do `$SNAP`
> (endpoint novo → flip reverso das DSNs; RTO de horas). O snapshot final fica retido
> indefinidamente (custa ~R$ 2/mês; reavaliar em 6 meses).

## 4. Limpeza de acessórios e custos silenciosos

Re-scan de 2026-07-06 (pós-discovery): **zero** EIPs não associadas, **zero** volumes EBS
`available`, **zero** NAT gateways, **zero** snapshots EBS órfãos — não há comando de release
de EIP/volume/NAT a executar (a conta já estava limpa; os 9 IPv4 públicos ≈ R$ 170/mês são
estruturais dos 2 ALBs + 3 instâncias — otimização separada, fora deste plano).

Sobram exatamente estes:

```bash
# 4a. Snapshot manual antigo da NOSSA instância (redundante após o snapshot final)
aws rds delete-db-snapshot --region sa-east-1 --db-snapshot-identifier cerebro-postgres-enc-pre-singleaz-2026-06-21

# 4b. ⚠️ mybestbrain-db-snapshot: é de OUTRA instância (mybestbrain-db, projeto distinto,
#     NÃO cifrado, criado 2026-06-11) e pode ser o único backup daquele projeto.
#     SÓ execute com confirmação explícita do dono (Patrick):
# aws rds delete-db-snapshot --region sa-east-1 --db-snapshot-identifier mybestbrain-db-snapshot

# 4c. Alarmes RDS órfãos — pertencem ao stack CFN cerebro-observabilidade-piloto
#     (cerebro-rds-conexoes-altas, cerebro-rds-cpu-alta, cerebro-rds-storage-baixo).
#     NÃO deletar na mão (drift): remover os 3 recursos AWS::CloudWatch::Alarm de
#     infra/aws/observability-piloto.yaml e atualizar o stack:
aws cloudformation update-stack --region sa-east-1 --stack-name cerebro-observabilidade-piloto --template-body file://infra/aws/observability-piloto.yaml
#     (o stack rds-backup-alarm.yaml, se dedicado ao RDS, pode ser deletado inteiro:
#      conferir `aws cloudformation describe-stacks --stack-name <nome>` antes)

# 4d. Security group do RDS (após o delete da instância; nada mais o referencia)
aws ec2 delete-security-group --region sa-east-1 --group-id sg-01b07c7f4a5e0b2c5

# 4e. SNS órfão de alertas de backup do RDS (sem event subscriptions ativas — verificado)
aws sns delete-topic --region sa-east-1 --topic-arn arn:aws:sns:sa-east-1:004177894935:cerebro-amigo-rds-backup-alertas
```

**Não tocar:** chave KMS `ae3bc623-...` (cifra o snapshot final — deletá-la inutiliza o
seguro de arrependimento) · subnet group `default` (grátis) · RI do RDS (payment-failed,
sem cobrança) · regra 5432 checkup→box no `cerebro-app-sg` (é do banco novo).

## 5. Economia mensal estimada (registrar no ADR após execução)

| Item | R$/mês |
|---|---:|
| RDS db.t4g.small Single-AZ + 20 GB gp3 + backup (steady-state, câmbio 5,18) | **−291** |
| Novos custos permanentes: EBS 20 GB (+16) · S3 backups (+2) · snapshots DLM (+2) · 12 métricas + 6 alarmes CloudWatch (+25) · snapshot final RDS retido (+2) | **+47** |
| **Economia líquida** | **≈ R$ 244/mês (~R$ 2.930/ano)** |

(Junho real do RDS foi US$ 102 bruto — mês atípico de cutovers; a base honesta é o
steady-state. Crédito AWS acabou em junho: a economia aparece integral na fatura de agosto.)

## 6. Verificação pós-execução (rodada pela sessão do Claude, read-only)

- `describe-db-instances` → `DBInstanceNotFound` para `cerebro-postgres-enc`.
- `describe-db-snapshots` → snapshot final `available` + `Encrypted=true`; `pre-singleaz` ausente.
- SG `sg-01b07c7f4a5e0b2c5` inexistente; alarmes `cerebro-rds-*` ausentes; topic SNS ausente.
- Stack clínico + checkup saudáveis no banco local; alarmes `cerebro-pg-*` OK.
- ADR-077 → `Status: Implemented` com a economia realizada e a data.

**Status: AGUARDANDO GATES (checkup flip + 72 h) e execução manual.**
