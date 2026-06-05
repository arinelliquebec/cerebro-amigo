import { PerfilView } from "@/components/rede/perfil-view"

export default async function PerfilPage({
  params,
}: {
  params: Promise<{ handle: string }>
}) {
  const { handle } = await params
  return <PerfilView handle={handle} />
}
