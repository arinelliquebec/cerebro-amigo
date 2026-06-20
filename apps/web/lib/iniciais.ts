/**
 * Iniciais (até 2) de um nome, p/ avatares/fallbacks.
 * `fallback` é o que retorna quando o nome é vazio/nulo (default "·").
 * Pura — serve em Server e Client Components.
 *
 * skipcq JS-0117 abaixo: é export de ES module (module scope), não global. A regra
 * `no-implicit-globals` não vale p/ módulos — DeepSource marca falso-positivo só
 * porque o arquivo é novo (a baseline não é re-escaneada).
 */
export function iniciais(nome?: string | null, fallback = "·"): string { // skipcq: JS-0117
  if (!nome) return fallback
  const partes = nome.trim().split(/\s+/).filter(Boolean)
  const ini = (partes[0]?.[0] ?? "") + (partes.length > 1 ? partes[partes.length - 1][0] : "")
  return ini.toUpperCase() || fallback
}
