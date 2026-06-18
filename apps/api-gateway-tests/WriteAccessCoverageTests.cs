using ApiGateway.Auth;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Routing;
using Microsoft.Extensions.DependencyInjection;
using Xunit;

namespace ApiGateway.Tests;

/// <summary>
/// Cobertura do gate de escrita do trial (ADR-065, mitigação R2): garante que NENHUM
/// grupo de mutação gateado por assinatura ficou sem RequireWriteAccess (vazaria escrita
/// no trial). A única exceção permitida é a allowlist de pacientes (CRUD = lock-in);
/// endpoints de IA já são cobertos pelo RequireFeature (bloqueiam o trial pelo plano nulo).
/// Introspecciona o EndpointDataSource pela metadata marcadora.
/// </summary>
[Collection("tenant")]
public sealed class WriteAccessCoverageTests
{
    private readonly TenantIsolationFixture _fx;
    public WriteAccessCoverageTests(TenantIsolationFixture fx) => _fx = fx;

    private static readonly string[] VerbosMutacao = { "POST", "PUT", "PATCH", "DELETE" };

    // Allowlist de escrita no trial: só pacientes CRUD (o cap é tratado no handler).
    private static readonly HashSet<string> PacientesAllowlist = new()
    {
        "api/v1/pacientes", "api/v1/pacientes/", "api/v1/pacientes/importar",
    };

    [Fact]
    public void TodoGrupoDeEscritaGateado_TemReadOnlyOuFeature()
    {
        var eds = _fx.Services.GetRequiredService<EndpointDataSource>();
        var faltando = new List<string>();

        foreach (var ep in eds.Endpoints.OfType<RouteEndpoint>())
        {
            // Só interessam endpoints gateados por assinatura (dashboard do médico).
            if (ep.Metadata.GetMetadata<AssinaturaGated>() is null) continue;

            // Só verbos de mutação.
            var verbos = ep.Metadata.GetMetadata<HttpMethodMetadata>()?.HttpMethods
                ?? (IReadOnlyList<string>)Array.Empty<string>();
            if (!verbos.Any(v => VerbosMutacao.Contains(v))) continue;

            var rota = (ep.RoutePattern.RawText ?? "").TrimStart('/');

            // Allowlist: pacientes CRUD pode escrever no trial (não recebe o gate).
            if (PacientesAllowlist.Contains(rota)) continue;

            var temReadOnly = ep.Metadata.GetMetadata<ReadOnlyTrialGated>() is not null;
            var temFeature = ep.Metadata.GetMetadata<FeatureGated>() is not null;
            if (!temReadOnly && !temFeature)
                faltando.Add($"{string.Join(",", verbos)} {rota}");
        }

        Assert.True(faltando.Count == 0,
            "Endpoints de mutação gateados por assinatura SEM RequireWriteAccess/RequireFeature " +
            "(vazam escrita no trial — ADR-065 R2):\n" + string.Join("\n", faltando));
    }
}
