# ADR-059 — Pricing: sem plano grátis, Inicial pago + 2 planos Consultoria (contrato 3 meses)

- **Status:** Accepted
- **Data:** 2026-06-16
- **Decisor:** Dono (Rafael).
- **Relacionados:** ADR-055 (sem trial / paywall / cadência — Fase 2 implementada aqui),
  ADR-034 (cobrança do médico via Asaas, Fluxo A), ADR-060 (plataforma de personalização —
  desenho que dá lastro à "consultoria"), skill `dotnet-gateway`.

## Contexto

O `/precos` ainda anunciava **"Início — grátis 14 dias"**, embora o backend já não tenha trial
(ADR-055: onboarding nasce `pendente` + prazo de pagamento). O dono decidiu um modelo **pago e
premium** que embute os custos de IA/infra e cria um tier de alto valor com consultoria:

- **Tirar o grátis.** Plano de entrada vira **pago, mensal**.
- **2 planos superiores** = **contrato de 3 meses** (cobrança trimestral) com **consultoria
  personalizada** (features sob medida — ver ADR-060).

## Decisão

### Catálogo (constante única, sem tabela)
São 3 planos fixos → `PlanCatalog` (`apps/api-gateway/Services/PlanCatalog.cs`) é a **fonte da
verdade server-side**, não uma tabela `plano_catalogo`. O valor cobrado vem **sempre** daqui; o
cliente nunca manda valor. Reusa os **códigos físicos** já existentes em `assinaturas.plano`
(TEXT, sem CHECK) — re-rotulados/re-precificados, **sem migration**. `trial` fica legado.

| Código | Label | Cadência | Cycle Asaas | Valor cobrado | `valor_mensal` | Contratação |
|---|---|---|---|---|---|---|
| `pro` | Inicial (Solo Pro) | mensal | MONTHLY | R$ 497/mês | 497 | self-checkout público |
| `starter` | Solo Consultoria | trimestral (3m) | QUARTERLY | R$ 4.023/tri | 1.490 | Falar com a equipe → admin ativa |
| `enterprise` | Clínica Consultoria | trimestral (3m) | QUARTERLY | a partir de R$ 7.830/tri | 2.900 | Falar com a equipe → admin ativa |

Trimestral = 3× mensalidade − 10% (ADR-055). O "contrato de 3 meses" é materializado pelo
`cycle=QUARTERLY` (paga o trimestre adiantado); cancelar no meio não devolve o ciclo pago.

### Cadência por plano
`AsaasClient.CriarAssinaturaAsync` ganhou o parâmetro `cycle` (default MONTHLY, retrocompatível).
O self-checkout (`/minha-assinatura/cobranca`) e o admin ("Ativar cobrança") derivam o `cycle` e o
valor do `PlanCatalog`.

### Consultoria = venda assistida
Só o **Inicial** é self-checkout público. Os planos Consultoria **rejeitam** self-checkout
(`plano_consultoria_fale_com_equipe`) — o admin os ativa via "Ativar cobrança" (reusa ADR-034),
cobrando o valor do trimestre. A **consultoria personalizada** é promessa de serviço, não feature
de código (ADR-060); vive como copy no `/precos` (+ opcional `assinaturas.notas`). **Nada é
construído de consultoria agora.**

### MRR = mensalidade-equivalente
`assinaturas.valor_mensal` guarda a **mensalidade-equivalente** (497 / 1.490 / 2.900), não o valor
do ciclo. Assim `SUM(valor_mensal) WHERE status='ativa'` (cockpit/MRR) segue recorrente-mensal sem
inflar 3× nos trimestrais. O valor do trimestre (4.023 / 7.830) vive só na subscription do Asaas.

### Margem de IA
O preço embute IA + infra. Haiku é o default + spend-limit no Console → custo LLM/médico << preço;
monitorar por médico em `/admin/custos` (Custos de IA).

## Consequências

- **Sem migration** (`plano` sem CHECK; `notas`/`valor_mensal` já existem). `trial` aceito como
  legado em todos os enums (gateway + admin Zod). `pendente` adicionado aos enums do admin
  (planos+status) para os médicos de self-signup (que nascem `pendente`) editarem corretamente.
- **Go-live do pricing pago real depende de Asaas PROD** (ADR-055 Fase C) + `ASAAS_WEBHOOK_TOKEN`.
  Em sandbox o fluxo testa; cobrança real só após prod.
- **3 fontes de display** (PlanCatalog autoritativo; `/precos` e `dashboard/financeiro` só exibem) —
  manter sincronizadas; valor cobrado é sempre server-side.

## Regras respeitadas
- **Paywall/clinical-safety** (ADR-055) intactos — `AssinaturaGate` não foi tocado; crise nunca gateada.
- Catálogo server-side; cliente nunca define preço.
