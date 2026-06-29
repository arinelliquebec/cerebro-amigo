# RoPA — Registro de Operações de Tratamento (entrada: BFF na Vercel)

> **Status:** RASCUNHO para revisão do Encarregado (DPO) / jurídico. Não é aconselhamento jurídico.
> Categoria especial (saúde mental, LGPD art. 11) — tratamento reforçado.
> Contexto técnico: **ADR-074** (migração do `apps/web` — landing + dashboard + portal + BFF — para a Vercel).
>
> Esta é a entrada do RoPA referente à operação afetada pelo ADR-074. As demais operações de
> tratamento da plataforma (gateway .NET, serviços Python, RDS, checkup) devem compor o RoPA
> completo — este arquivo cobre o recorte do suboperador novo (Vercel).

## 1. Controlador

| Campo | Valor |
|---|---|
| Razão social | `[RAZÃO SOCIAL DO CONTROLADOR]` |
| CNPJ | `[CNPJ]` |
| Encarregado (DPO) | `[NOME]` — `[e-mail de contato do Encarregado]` |
| Canal do titular | `[e-mail/endereço para exercício de direitos — art. 18]` |

> ⚠️ **Gap a sanar:** confirmar designação formal do Encarregado (LGPD art. 41). É quem assina o
> sign-off que destrava o cutover de DNS do ADR-074.

## 2. Operação de tratamento

| Campo | Descrição |
|---|---|
| Nome da operação | BFF web (landing + dashboard médico + portal do paciente `/p/*`) hospedado na Vercel |
| Finalidade | Servir a interface web e intermediar (proxy server-side) as requisições do navegador ao gateway de aplicação (.NET), no contexto de acompanhamento clínico entre consultas |
| Natureza | O BFF é **stateless**: não persiste dado clínico nem abre conexão com o banco. **Trata dado clínico em trânsito** (proxy de prontuário, mensagens, humor, áudio) entre o navegador e o gateway |
| Hipótese legal (tratamento) | Saúde: art. 11, II, "a"/"f" (tutela da saúde, por profissional/serviço de saúde) e/ou consentimento (art. 11, I) conforme o fluxo. `[confirmar com jurídico]` |

## 3. Categorias de titulares e de dados

| Titulares | Dados tratados (em trânsito pelo BFF) |
|---|---|
| Pacientes | Dado de saúde (categoria especial): conteúdo de mensagens, registros de humor, áudios transcritos, prescrições, evolução clínica; identificadores (nome, e-mail) |
| Profissionais (médicos) | Nome, e-mail, registro profissional (CRM), dados de autenticação |

## 4. Operadores e suboperadores

| Agente | Papel | Localização do tratamento |
|---|---|---|
| AWS (EC2/RDS, `sa-east-1`) | Operador (infra de aplicação e **armazenamento em repouso**) | Brasil (São Paulo) |
| **Vercel Inc. (EUA)** | **Suboperador (NOVO — ADR-074)**: hospedagem e execução do BFF web | Funções fixadas em **`gru1` (São Paulo)** — processamento no Brasil; **controlador da operação é entidade nos EUA** → ver §5 |
| Anthropic (API LLM) | Suboperador (já registrado em operação própria — ADR-044) | Fora do escopo desta entrada |

> Confirmar a lista de subprocessadores da própria Vercel (infra subjacente) no DPA e mantê-la
> anexada a este registro.

## 5. Transferência internacional de dados (LGPD art. 33)

| Campo | Valor |
|---|---|
| Há transferência internacional? | **Sim.** A Vercel é empresa dos EUA; ainda que as funções rodem em `gru1` (Brasil), a operadora é estrangeira → enquadra-se como transferência internacional |
| País de destino | Estados Unidos (controle da operadora) / processamento em `gru1` (BR) |
| Base legal pretendida (art. 33) | **Cláusulas-padrão contratuais da ANPD** (Resolução CD/ANPD nº 19/2024). `[Confirmar com jurídico: as SCCs da UE no DPA da Vercel NÃO substituem automaticamente as cláusulas-padrão da ANPD — pode ser necessário anexar o modelo da ANPD ao contrato.]` |
| Instrumento contratual | DPA (Data Processing Addendum) da Vercel, assinado/aceito + (se aplicável) cláusulas-padrão ANPD anexas |
| Salvaguardas | `gru1` (processamento no Brasil); dado em repouso permanece na AWS `sa-east-1` cifrado (não se move); proibição de log de corpo (conteúdo clínico) — ver §6 e RIPD |

## 6. Medidas de segurança e minimização

- **Dado em repouso não se move** — permanece cifrado no RDS `sa-east-1` (ADR-018/054). A operação na Vercel toca só o trânsito.
- **Sem log de conteúdo clínico cru** (Regra 3 do projeto) — auditado em `lib/gateway.ts`, `lib/gateway-paciente.ts`, `lib/teleconsulta-proxy.ts`, `app/api/paciente/conversation/route.ts`; confirmar que a observabilidade da Vercel não capture corpo de SSE/proxy.
- **Autenticação de origem** `X-Edge-Auth` (ADR-074) + `INTERNAL_API_TOKEN` + TLS fim-a-fim entre BFF e gateway.
- **Deployment Protection** obrigatório nos Previews (preview com dado clínico não pode ser público — ADR-074 §3).
- **Trilhas de auditoria** imutáveis no gateway/RDS (não no BFF).

## 7. Retenção

Dado clínico: mantido pelo prazo da prestação do serviço e obrigações legais; em trânsito no BFF
não há retenção (stateless). Detalhe na operação de armazenamento (RDS) do RoPA completo.

## 8. Pendências para fechar o registro

1. Preencher identificação do controlador + Encarregado (§1).
2. Confirmar hipótese legal de tratamento (§2) e base do art. 33 (§5) com jurídico.
3. Assinar/aceitar o DPA da Vercel + (se for o caso) anexar cláusulas-padrão ANPD.
4. Anexar a lista de subprocessadores da Vercel.
5. Vincular ao RIPD (`docs/lgpd/ripd-transferencia-vercel.md`).
