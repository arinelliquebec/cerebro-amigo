import Link from "next/link"
import { PublicFooter, PublicHeader } from "@/components/public/public-chrome"
import access from "@/components/access/signal-access.module.css"
import styles from "@/components/public/public-surface.module.css"

export const metadata = { title: "Terms of Use — Cérebro Amigo", description: "Cérebro Amigo terms of use", alternates: { canonical: "https://www.cerebroamigo.com.br/terms" } }

export default function TermsPage() {
  return (
    <main className={`${access.page} ${styles.contentPage}`} lang="en">
      <PublicHeader />
      <div className={styles.legalWrap}>
        <aside className={styles.legalAside}><p>TERMS / OPERATING BOUNDARY</p><h1>Terms of use</h1><p>Last updated: June 2026</p></aside>
        <div className={styles.legalBody}>
          <section><h2>1. Nature of the platform</h2><p>Cérebro Amigo is clinical-management software for psychiatrists. It does not replace clinical judgment and does not provide diagnoses or prescriptions. Every therapeutic decision remains the responsibility of the licensed healthcare professional.</p></section>
          <section><h2>2. Permitted use</h2><p>Professional access is limited to properly registered healthcare professionals. Sharing access credentials or using the platform outside legitimate clinical-practice management is prohibited.</p></section>
          <section><h2>3. Data and privacy</h2><p>Patient data is processed under Brazil’s LGPD (Law 13,709/2018). See the <Link href="/privacy">Privacy Policy</Link> for information about collection, safeguards, retention, and data-subject rights.</p></section>
          <section><h2>4. Responsibility and availability</h2><p>Cérebro Amigo is provided without a guarantee of uninterrupted availability. Healthcare professionals retain final responsibility for clinical decisions, regardless of information organized or displayed by the platform.</p></section>
          <section><h2>5. Contact</h2><p>Questions about these terms can be sent to <Link href="mailto:arinpar@gmail.com">arinpar@gmail.com</Link>.</p></section>
        </div>
      </div>
      <PublicFooter />
    </main>
  )
}
