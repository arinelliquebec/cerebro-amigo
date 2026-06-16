namespace ApiGateway.Services;

/// <summary>
/// Catálogo de planos — fonte da verdade server-side (ADR-059). São 3 planos
/// fixos, então é uma CONSTANTE (sem tabela `plano_catalogo`, sem migration).
///
/// Reusa os códigos físicos já existentes em `assinaturas.plano` (TEXT, sem CHECK):
/// `pro`/`starter`/`enterprise` — re-rotulados e re-precificados. `trial` continua
/// aceito como LEGADO (read-only), mas não é oferecido. Nunca renomear linhas.
///
/// O valor cobrado vem SEMPRE daqui — o cliente nunca manda valor.
///
/// Cadência (ADR-055 Fase 2): Inicial = MONTHLY (self-checkout público); os 2 planos
/// de Consultoria = QUARTERLY (contrato de 3 meses, venda assistida → admin ativa).
///
/// MRR: `assinaturas.valor_mensal` guarda a MENSALIDADE-EQUIVALENTE (não o valor do
/// ciclo), p/ `SUM(valor_mensal) WHERE status='ativa'` seguir recorrente-mensal sem
/// inflar 3× nos trimestrais. O valor do ciclo vive só na subscription do Asaas.
/// </summary>
public sealed record PlanoCatalogo(
    string Codigo,
    string Label,
    decimal ValorCiclo,             // cobrado por ciclo no Asaas (mensal ou trimestral)
    decimal ValorMensalEquivalente, // gravado em valor_mensal (MRR coerente)
    string Cycle,                   // "MONTHLY" | "QUARTERLY"
    bool SelfCheckout);             // true = médico assina sozinho; false = admin ativa

public static class PlanCatalog
{
    public static readonly IReadOnlyDictionary<string, PlanoCatalogo> Planos =
        new Dictionary<string, PlanoCatalogo>(StringComparer.OrdinalIgnoreCase)
        {
            ["pro"]        = new("pro",        "Inicial (Solo Pro)",  497.00m,  497.00m,  "MONTHLY",   true),
            ["starter"]    = new("starter",    "Solo Consultoria",   4023.00m, 1490.00m, "QUARTERLY", false),
            ["enterprise"] = new("enterprise", "Clínica Consultoria", 7830.00m, 2900.00m, "QUARTERLY", false),
        };

    public static PlanoCatalogo? TryGet(string? codigo) =>
        codigo is not null && Planos.TryGetValue(codigo, out var p) ? p : null;

    /// Cadência do Asaas para um código de plano; default MONTHLY p/ legado/desconhecido.
    public static string CycleDe(string? codigo) => TryGet(codigo)?.Cycle ?? "MONTHLY";

    /// Códigos que o médico pode assinar sozinho (só Inicial). Consultoria = admin ativa.
    public static IReadOnlyList<string> CodigosSelfCheckout =>
        Planos.Values.Where(p => p.SelfCheckout).Select(p => p.Codigo).ToList();
}
