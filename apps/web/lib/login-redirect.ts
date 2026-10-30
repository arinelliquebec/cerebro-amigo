// 401 numa chamada ao BFF = sessão expirada. Hard reload para /login é
// deliberado: derruba TODO estado client-side (cache de formulários, dados de
// paciente em memória) antes do middleware revalidar a sessão — router.push
// preservaria esse estado em memória.
export function irParaLogin(): void {
  // eslint-disable-next-line @next/next/no-location-assign-relative-destination
  window.location.href = "/login"
}
