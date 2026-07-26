"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  ArrowRight,
  BrainCircuit,
  FileClock,
  LayoutDashboard,
  LogOut,
  Network,
  ShieldCheck,
} from "lucide-react"
import { Logo } from "@/components/logo"
import styles from "@/app/demo/demo.module.css"

const steps = [
  { href: "/demo", label: "Dashboard", detail: "See the workspace", icon: LayoutDashboard },
  { href: "/demo/patient", label: "Patient record", detail: "Inspect the timeline", icon: FileClock },
  { href: "/demo/briefing", label: "AI briefing", detail: "Review the boundary", icon: BrainCircuit },
  { href: "/#architecture", label: "Architecture", detail: "Trace the real stack", icon: Network },
] as const

const currentStep = (pathname: string) => {
  if (pathname.startsWith("/demo/briefing")) return 2
  if (pathname.startsWith("/demo/patient")) return 1
  return 0
}

const TourNavigation = ({ active }: { active: number }) => (
  <nav className={styles.tourNav} aria-label="Four-step product tour">
    {steps.map((step, index) => {
      const Icon = step.icon
      const selected = index === active
      return (
        <Link
          aria-current={selected ? "step" : undefined}
          className={selected ? styles.activeStep : ""}
          href={step.href}
          key={step.label}
        >
          <span className={styles.stepNumber}>{String(index + 1).padStart(2, "0")}</span>
          <Icon aria-hidden="true" />
          <span><strong>{step.label}</strong><small>{step.detail}</small></span>
        </Link>
      )
    })}
  </nav>
)

const DemoSidebar = ({ active }: { active: number }) => (
  <aside className={styles.sidebar} aria-label="Demo tour">
    <Link className={styles.brand} href="/" aria-label="Cérebro Amigo home">
      <Logo size="md" variant="light" />
    </Link>

    <div className={styles.account}>
      <span>PORTFOLIO DEMO ACCOUNT</span>
      <strong>Dr. Morgan · fictional</strong>
      <small><ShieldCheck aria-hidden="true" /> Read-only session</small>
    </div>

    <TourNavigation active={active} />

    <div className={styles.runtimeNote}>
      <span>DEMO BOUNDARY</span>
      <p>Three synthetic patients. No real health data. No write actions.</p>
    </div>
  </aside>
)

const DemoTopbar = ({ active }: { active: number }) => (
  <header className={styles.topbar}>
    <div>
      <span>LIVE PORTFOLIO TOUR</span>
      <strong>STEP {active + 1} / 4</strong>
    </div>
    <Link href="/medico">Exit demo <LogOut aria-hidden="true" /></Link>
  </header>
)

const DemoNotice = () => (
  <div className={styles.demoNotice} role="note">
    <ShieldCheck aria-hidden="true" />
    <p><strong>Fictional data only.</strong> This resilient read-only tour does not require credentials or the clinical backend.</p>
  </div>
)

const NextStep = ({ step }: { step: (typeof steps)[number] }) => (
  <footer className={styles.nextStep}>
    <span>TOUR CONTINUES</span>
    <div><p>Next: <strong>{step.label}</strong></p><Link href={step.href}>Continue tour <ArrowRight aria-hidden="true" /></Link></div>
  </footer>
)

export const DemoShell = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname()
  const active = currentStep(pathname)
  const next = steps[active + 1]

  return (
    <main className={styles.demo} lang="en">
      <a className={styles.skipLink} href="#demo-content">Skip to demo content</a>
      <DemoSidebar active={active} />

      <section className={styles.workspace}>
        <DemoTopbar active={active} />
        <DemoNotice />

        <div className={styles.content} id="demo-content" tabIndex={-1}>{children}</div>

        {next && <NextStep step={next} />}
      </section>
    </main>
  )
}
