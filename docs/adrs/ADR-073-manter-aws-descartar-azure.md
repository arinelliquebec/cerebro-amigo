# ADR-073 — Manter a infra na AWS; Azure descartado no piloto (custo/crédito)

- **Status:** Accepted
- **Data:** 2026-06-22
- **Decisores:** Rafael Arinelli (responsável / decisão de custo)
- **Categoria:** Infra / custo / cloud
- **Contexto relacionado:** ADR-043 (HA/SPOF + Single-AZ piloto), ADR-044 (LLM Anthropic
  API direta), ADR-045 (checkup desacoplado ALB+ASG), ADR-028 (RAG pgvector / embeddings
  Bedrock), `docs/infra-baseline.md`, `docs/runbooks/cost-guardrails.md`.

## Contexto

Plataforma em piloto pré-receita (sem paciente pagante; ~1 médico testando, podendo chegar
a 2-3 a qualquer momento). Crédito AWS limitado a **$200** (resta ~$128,86); **AWS Activate
negado** → não há mais crédito AWS a caminho. Cogitou-se **migrar toda a infra de AWS
(`sa-east-1`) para Azure**, usando **App Service** (um para o checkup, um "geral" para back +
front Next.js) e **Azure Database for PostgreSQL Flexible Server Multi-AZ**, com a motivação
de "aproveitar o pagamento só daqui a um mês" e fugir do crédito que está acabando. Azure
está **pay-as-you-go** (sem crédito).

## Decisão

**Não migrar. Manter a infra na AWS `sa-east-1`.** Reafirma a postura AWS-only por residência
de dado (LGPD categoria especial) já registrada no `CLAUDE.md` ("Azure: REMOVIDO. Não
reintroduzir").

## Razões

1. **Sem crédito dos dois lados.** Activate negado e Azure pay-as-you-go → a comparação volta
   a ser custo absoluto em dólar. O argumento "é só crédito" deixou de valer.
2. **Azure como proposto é ~4× mais caro, do bolso.** App Service Premium (para rodar os 5
   serviços) + **PostgreSQL Flexible Server Multi-AZ zone-redundant** (HA **dobra** o compute
   e força o tier General Purpose; Burstable não tem zone-redundant) ≈ **$670–950/mês** em
   Brazil South (prêmio regional ~60%), contra **~$82/mês** brutos hoje na AWS.
3. **Comparação distorcida.** A AWS de hoje roda **Single-AZ de propósito** no piloto
   (ADR-043 Adendo); o pedido Azure embute **Multi-AZ**. Se o objetivo fosse HA, religar
   Multi-AZ no RDS atual custa **+~$38/mês**, não ~$500.
4. **Savings Plan é sunk e segue cobrando.** EC2 Instance SP família `t3`, $0,0772/hr
   (~$56/mês), comprometido até **2027-06-18**. Migrar **não livra** desse commit → pagaria
   Azure **+** SP AWS ocioso em paralelo (~12 meses de double-pay).
5. **AWS já está no piso.** Cost Explorer (MTD jun/2026): ~$82/mês brutos — **RDS ~$0**
   (grandfathered), EC2 sob o SP (sunk), e só ~$26/mês "vivo" (ELB ~$9 + IPv4 ~$10 + Tax ~$7).
   Corte adicional rende ~$5–15/mês e esbarra no isolamento do checkup (ADR-045). A gordura
   óbvia já saiu (right-size `t3.medium`, Single-AZ, prune de disco, pools, guardrails).
6. **Bloqueio técnico.** O RAG/embeddings (ADR-028) usa **Bedrock Cohere multilingual
   in-region** por LGPD; Azure não tem equivalente trivial in-region (e o Azure OpenAI foi
   removido do projeto). A residência de dado força região no Brasil nas duas nuvens — o
   prêmio regional não é alavanca de economia de ninguém. O **LLM é neutro**: Anthropic API
   direta (ADR-044) é cloud-agnóstica (HTTPS), não favorece nenhuma nuvem.

## Gatilhos para reabrir

1. **Crédito Azure gordo aprovado** (Microsoft for Startups Founders Hub — independe do
   Activate negado): reavaliar Azure, mas **enxuto** (Azure Container Apps + Postgres
   **Burstable** single-zone), **nunca** App Service Premium + Multi-AZ — que queimaria o
   crédito ~4× mais rápido. Resolver antes o caminho de embeddings (ADR-028).
2. **2027-06-18 (vence o SP):** na própria AWS, avaliar Graviton `t4g` + Compute/t4g Savings
   Plan + imagens ARM no CI (já mapeado em `docs/infra-baseline.md` §5). O piso cai de ~$82
   para ~$26/mês + o que se escolher rodar.

## Consequências

- **Mantém** os guardrails de custo já no ar (budget `cerebro-amigo-mensal` $120 + Cost
  Anomaly $20) e a postura Single-AZ de piloto (ADR-043). Runway de crédito/caixa preservado
  (não se gasta semanas de engenharia migrando, nem se duplica a conta com o SP).
- **Ação aberta (FinOps, baixo impacto):** setar retenção nos 3 log groups de Lambda sem TTL
  (`cerebro-cleanup-magic-links`, `cerebro-rds-backup-check`, `cerebro-resend-webhook`) e
  **investigar os log groups `/ecs/cerebro/*`** (resíduo de experimento ECS? confirmar que não
  há cluster/tasks Fargate cobrando em silêncio).
- **Próximo passo de runway é externo à infra:** aplicar no Founders Hub para destravar
  crédito — que rende muito mais aplicado à AWS enxuta atual do que a um Azure caro.
