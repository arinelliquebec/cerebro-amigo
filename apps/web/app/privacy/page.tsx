import Link from "next/link"
import { PublicFooter, PublicHeader } from "@/components/public/public-chrome"
import access from "@/components/access/signal-access.module.css"
import styles from "@/components/public/public-surface.module.css"

export const metadata = { title: "Privacy Policy — Cérebro Amigo", description: "Cérebro Amigo privacy policy", alternates: { canonical: "https://www.cerebroamigo.com.br/privacy" } }

export default function PrivacyPage() {
  return (
    <main className={`${access.page} ${styles.contentPage}`} lang="en">
      <PublicHeader />
      <div className={styles.legalWrap}>
        <aside className={styles.legalAside}>
          <p>POLICY / DATA BOUNDARY</p><h1>Privacy policy</h1><p>Last updated: June 2026</p>
        </aside>
        <div className={styles.legalBody}>
          <section><h2>1. Commitment to Brazil’s LGPD</h2><p>Cérebro Amigo processes personal data under Brazil’s General Data Protection Law (LGPD — Law 13,709/2018). Health data is treated as sensitive personal data and receives stronger safeguards and data-minimization controls.</p></section>
          <section><h2>2. Data we process</h2><p><strong>Professional data:</strong> name, email address, professional registration, and authentication data. <strong>Patient data:</strong> mental-health information, mood entries, transcribed voice journals, prescriptions, and clinical history, processed only to support care between appointments.</p></section>
          <section><h2>3. Use of artificial intelligence</h2><p>Language models may support transcription, record organization, and pre-appointment briefings. Crisis and risk messaging is fixed and human-approved, never generated dynamically by AI. Patient data is not used to train third-party models.</p></section>
          <section><h2>4. Storage and security</h2><p>Clinical production data is stored in Brazil. Security controls include encryption in transit and at rest, tenant isolation, minimized access, and immutable audit trails for access to health data. Temporary audio is removed after transcription according to the service workflow.</p></section>
          <section><h2>5. Data-subject rights</h2><p>Patients and professionals may request access, correction, anonymization, or deletion where applicable. Requests can be sent to <Link href="mailto:arinpar@gmail.com">arinpar@gmail.com</Link>.</p></section>
          <section><h2>6. Retention</h2><p>Health data is retained only for the period necessary to provide the service and comply with legal obligations. After the relationship ends, data may be anonymized or removed according to legal requirements and valid requests.</p></section>
        </div>
      </div>
      <PublicFooter />
    </main>
  )
}
