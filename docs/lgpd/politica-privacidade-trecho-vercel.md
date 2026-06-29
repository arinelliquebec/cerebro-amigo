# Política de Privacidade — trecho a inserir (suboperadores + transferência internacional)

> **Status:** RASCUNHO para revisão do Encarregado (DPO) / jurídico. Não é aconselhamento jurídico.
> Decorre do ADR-074 (BFF web na Vercel) — divulgação ao titular (LGPD art. 9 — transparência;
> art. 33 — transferência internacional).
>
> **Onde aplicar:** `apps/web/app/privacy/page.tsx`. Inserir como **§5 (nova)** logo após a seção
> "4. Armazenamento e segurança"; renumerar a antiga §5 (Direitos do titular) → §6 e §6 (Retenção)
> → §7. Atualizar "Última atualização" para o mês do deploy.
>
> ⚠️ **Não aplicar antes do sign-off** do Encarregado e da assinatura do DPA/base de transferência —
> a política não deve afirmar transferência que ainda não está contratualmente coberta.

---

## Texto proposto (linguagem ao titular)

**5. Operadores, suboperadores e transferência internacional**

Para operar a plataforma, contamos com fornecedores que tratam dados em nosso nome (operadores),
sob contrato e instruções, exclusivamente para as finalidades aqui descritas:

- **Amazon Web Services (AWS)** — infraestrutura de aplicação e **armazenamento dos dados**, na
  região São Paulo (`sa-east-1`), no Brasil.
- **Vercel Inc. (Estados Unidos)** — hospedagem e execução da **interface web**, com funções de
  processamento fixadas na região de **São Paulo (`gru1`)**. A Vercel processa dados **em trânsito**
  (intermediação entre o seu navegador e nossos servidores de aplicação); **não armazena** seu
  conteúdo clínico, que permanece cifrado no Brasil.

Por a Vercel ser empresa sediada nos Estados Unidos, há **transferência internacional de dados**.
Essa transferência é amparada por **cláusulas contratuais de proteção de dados** firmadas com o
fornecedor, nos termos do art. 33 da LGPD, e pelas salvaguardas técnicas descritas nesta Política
(processamento no Brasil, cifragem, minimização e não-registro do conteúdo). Mantemos registro
atualizado dos nossos operadores e suboperadores, disponível mediante solicitação ao nosso
Encarregado.

---

## JSX pronto para colar (entre a §4 e a antiga §5)

```tsx
          <section>
            <h2 className="text-xl font-semibold text-navy mb-3">
              5. Operadores, suboperadores e transferência internacional
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              Para operar a plataforma, contamos com fornecedores que tratam dados em nosso nome
              (operadores), sob contrato e instruções, exclusivamente para as finalidades aqui
              descritas:
            </p>
            <ul className="text-muted-foreground leading-relaxed mt-2 list-disc pl-5 space-y-1">
              <li>
                <strong>Amazon Web Services (AWS)</strong> — infraestrutura de aplicação e
                armazenamento dos dados, na região São Paulo (sa-east-1), no Brasil.
              </li>
              <li>
                <strong>Vercel Inc. (Estados Unidos)</strong> — hospedagem e execução da interface
                web, com funções fixadas na região de São Paulo (gru1). A Vercel processa dados em
                trânsito (intermediação entre o seu navegador e nossos servidores); não armazena seu
                conteúdo clínico, que permanece cifrado no Brasil.
              </li>
            </ul>
            <p className="text-muted-foreground leading-relaxed mt-2">
              Por a Vercel ser empresa sediada nos Estados Unidos, há transferência internacional de
              dados, amparada por cláusulas contratuais de proteção de dados firmadas com o
              fornecedor (art. 33 da LGPD) e pelas salvaguardas técnicas desta Política
              (processamento no Brasil, cifragem, minimização e não-registro do conteúdo). Mantemos
              registro atualizado de operadores e suboperadores, disponível mediante solicitação ao
              nosso Encarregado.
            </p>
          </section>
```

Depois do bloco acima, renumerar:
- "5. Direitos do titular" → **"6. Direitos do titular"**
- "6. Retenção" → **"7. Retenção"**

E na linha de data: `Última atualização: junho de 2026` → o mês do deploy.

> Sugestão: ao aplicar, considerar também citar o **Encarregado (DPO)** e o **canal de contato**
> (art. 41) na §6 (Direitos do titular), que hoje diz genericamente "entre em contato com o
> responsável".
