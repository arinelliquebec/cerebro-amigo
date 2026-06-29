# RIPD — Relatório de Impacto à Proteção de Dados Pessoais

## Tratamento: BFF web na Vercel + transferência internacional (ADR-074)

> **Status:** RASCUNHO para revisão/assinatura do Encarregado (DPO) / jurídico. Não é aconselhamento jurídico.
> LGPD art. 38 (RIPD pode ser exigido pela ANPD) + art. 5º, XVII. Categoria especial (saúde mental).

---

## 1. Identificação

| Campo | Valor |
|---|---|
| Controlador | `[RAZÃO SOCIAL / CNPJ]` |
| Encarregado (DPO) | `[NOME / e-mail]` |
| Operação avaliada | Migração do `apps/web` (landing + dashboard + portal + **BFF**) da AWS (EC2 `sa-east-1`) para a **Vercel** (ADR-074) |
| Data | `[data da avaliação]` |
| Decisão | `[ ] Aprovado · [ ] Aprovado com ressalvas · [ ] Reprovado` — Encarregado: `__________` |

## 2. Descrição do tratamento e do fluxo

- O `apps/web` é um **BFF stateless**: serve a interface e faz **proxy server-side** das requisições do navegador ao gateway de aplicação (.NET) em `https://api.cerebroamigo.com.br`. Não persiste dado nem conecta ao banco.
- Após o ADR-074, esse processamento **em trânsito** passa a ocorrer em funções da Vercel fixadas em **`gru1` (São Paulo)**.
- **Dado em repouso não se move**: continua cifrado no RDS `sa-east-1` (ADR-018/054).
- Categorias de dado em trânsito: conteúdo clínico (mensagens, humor, áudio transcrito, prescrições, evolução) + identificadores de paciente e médico.

## 3. Necessidade e proporcionalidade

| Critério | Avaliação |
|---|---|
| Finalidade legítima | Sim — operar a plataforma de acompanhamento clínico; separar front-end do backend clínico; reduzir cold start (Fluid Compute) |
| Necessidade | A operação é necessária para servir a UI/BFF; alternativa (manter no EC2) foi avaliada no ADR-074 (rejeitada por custo/cold start/ociosidade do Pro) |
| Minimização | O BFF não persiste dado; trata só o necessário em trânsito; **não loga corpo** (Regra 3) |
| Adequação ao titular | O titular (paciente/médico) já usa a plataforma para essa finalidade; sem novo uso secundário |

## 4. Riscos identificados

| # | Risco | Prob. | Impacto | Avaliação |
|---|---|---|---|---|
| R1 | **Transferência internacional** de dado de categoria especial a operadora dos EUA (suboperador estrangeiro) | Média | Alto | Mitigado, não eliminado — ver §5 |
| R2 | Captura de **conteúdo clínico** por observabilidade/log da Vercel (corpo de SSE/proxy) | Baixa | Alto | Mitigado: código não loga corpo; **ação:** confirmar que telemetria da Vercel não capture corpo |
| R3 | Acesso governamental estrangeiro a dado em trânsito (ex.: legislação dos EUA) | Baixa | Alto | Residual — `gru1` reduz superfície (processamento no BR); SCC/DPA como salvaguarda contratual |
| R4 | Exposição de **Preview** com dado clínico | Baixa | Alto | Mitigado: Deployment Protection obrigatório nos Previews (ADR-074 §3); Preview sem `EDGE_AUTH_SECRET` recebe 403 do gateway |
| R5 | Gateway exposto à internet aberta (egress dinâmico da Vercel, sem IP fixo) | Média | Médio | Mitigado: `X-Edge-Auth` fail-closed (live) + `login_rate_limits` (0043); WAF planejado (PR #164) |

## 5. Medidas e salvaguardas

- **Base legal de transferência (art. 33):** cláusulas-padrão contratuais da ANPD (Res. CD/ANPD 19/2024) + DPA da Vercel. `[validar com jurídico — ver RoPA §5]`
- **`gru1`** — processamento no Brasil; **sem** `functionFailoverRegions` para fora do país.
- **Dado em repouso permanece na AWS `sa-east-1`** cifrado (não transferido).
- **Sem log de corpo clínico** (Regra 3) — auditado nos pontos de proxy; confirmar telemetria Vercel.
- **`X-Edge-Auth`** (autenticação de origem, fail-closed) + TLS fim-a-fim BFF↔gateway.
- **Deployment Protection** nos Previews.
- **DPA assinado** + registro de suboperador no RoPA.

## 6. Risco residual e conclusão

Após as salvaguardas, o risco residual concentra-se em **R1/R3** (transferência internacional de
dado sensível a operadora estrangeira), inerente à escolha de fornecedor e **não eliminável**,
apenas mitigado (gru1 + DPA/SCC + minimização + não-log de corpo). É uma **aceitação consciente
do responsável**, registrada no ADR-074 ("Consequências aceitas").

**Bloqueadores do cutover (devem estar concluídos antes do flip de DNS):**
1. DPA da Vercel assinado/aceito.
2. Base de transferência do art. 33 definida (recomendado: cláusulas-padrão ANPD).
3. RoPA atualizado (suboperador Vercel) — `docs/lgpd/ropa-vercel.md`.
4. Política de Privacidade atualizada (divulgação do suboperador + transferência) — `docs/lgpd/politica-privacidade-trecho-vercel.md`.
5. Confirmação de que a observabilidade da Vercel não captura corpo de SSE/proxy.
6. **Sign-off do Encarregado** (assinatura no §1).

## 7. Gatilhos de reavaliação

Mudança na base legal de transferência; exigência regulatória de residência estrita;
incidente envolvendo a Vercel; oferta de egress estático que reabra a opção VPC-privada
(ADR-074, "Gatilhos de revisão").
