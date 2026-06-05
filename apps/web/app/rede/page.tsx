import { Header } from "@/components/header"
import { Feed } from "@/components/rede/feed"

export const metadata = {
  title: "Comunidade",
}

export default function RedePage() {
  return (
    <div className="min-h-screen">
      <Header title="Comunidade" subtitle="Rede de médicos verificados" />
      <div className="p-8">
        <Feed />
      </div>
    </div>
  )
}
