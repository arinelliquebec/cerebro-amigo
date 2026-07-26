import Link from "next/link"
import { ArrowRight, CalendarClock, FileText, ShieldCheck } from "lucide-react"
import { demoPatients, demoTimeline } from "@/lib/portfolio-demo"
import styles from "../demo.module.css"

const weeklyMood = [5, 5, 6, 6, 6, 7]

export default function DemoPatientPage() {
  const patient = demoPatients[0]

  return (
    <>
      <header className={styles.patientHeader}>
        <div className={styles.patientIdentity}><span>{patient.initials}</span><div><p>PATIENT RECORD / SYNTHETIC PROFILE</p><h1>{patient.name}</h1><small>Fictional patient · no direct identifiers</small></div></div>
        <div className={styles.patientMeta}><span><CalendarClock aria-hidden="true" /> Next demo visit · 7 days</span><span><ShieldCheck aria-hidden="true" /> Physician-owned record</span></div>
      </header>

      <div className={styles.recordGrid}>
        <section className={styles.timeline} aria-labelledby="timeline-title">
          <header><p>REPORTED FACTS</p><h2 id="timeline-title">Between-appointment timeline</h2></header>
          <ol>
            {demoTimeline.map((entry) => (
              <li key={`${entry.time}-${entry.source}`}>
                <time>{entry.time}</time>
                <span className={styles.timelineNode} aria-hidden="true" />
                <div><small>{entry.source}</small><strong>{entry.title}</strong><p>{entry.detail}</p></div>
              </li>
            ))}
          </ol>
        </section>

        <aside className={styles.patientReadout}>
          <p>SIX-WEEK SYNTHETIC TRACE</p>
          <h2>Reported mood entries</h2>
          <div className={styles.moodBars} aria-label="Six synthetic weekly mood values: 5, 5, 6, 6, 6 and 7 out of 10">
            {weeklyMood.map((value, index) => <span key={`${value}-${index}`} style={{ height: `${value * 10}%` }}><i>{value}</i></span>)}
          </div>
          <dl>
            <div><dt>Source</dt><dd>Patient-reported demo entries</dd></div>
            <div><dt>Interpretation</dt><dd>Reserved for the physician</dd></div>
            <div><dt>Automation</dt><dd>Organization only</dd></div>
          </dl>
          <Link href="/demo/briefing"><FileText aria-hidden="true" /> Open AI-assisted briefing <ArrowRight aria-hidden="true" /></Link>
        </aside>
      </div>
    </>
  )
}
