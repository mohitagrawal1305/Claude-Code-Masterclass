// this page should be used only as a splash page to decide where a user should be navigated to
// when logged in --> to /heists
// when not logged in --> to /login

import { Clock8, ChevronRight } from "lucide-react";
import styles from "./page.module.css";

export default function Home() {
  return (
    <div className={styles.wrapper}>
      {/* Background atmosphere */}
      <div className={styles.grid} aria-hidden />
      <div className={styles.orbPurple} aria-hidden />
      <div className={styles.orbPink} aria-hidden />

      <main className={styles.main}>
        {/* Status badge */}
        <div className={styles.badge}>
          <span className={styles.pulseDot} />
          Mission briefing open
        </div>

        {/* Title */}
        <h1 className={styles.title}>
          P<Clock8 className="logo" strokeWidth={2.75} />
          cket{" "}
          <span className={styles.titleAccent}>Heist</span>
        </h1>

        <p className={styles.tagline}>Tiny missions. Big office mischief.</p>

        <p className={styles.description}>
          Turn your workplace into a playground. Plan clever pranks, assign
          missions to fellow troublemakers, and orchestrate harmless chaos that
          keeps everyone smiling. The best agents leave no fingerprints — only
          laughter.
        </p>

        {/* CTAs */}
        <div className={styles.ctas}>
          <a href="/signup" className={styles.btnRegister}>
            Register for free
            <ChevronRight size={15} />
          </a>
          <a href="/login" className={styles.btnLogin}>
            Log in
          </a>
        </div>

        {/* Stats */}
        <div className={styles.stats}>
          <div className={styles.stat}>
            <span className={styles.statNum} style={{ color: "var(--color-primary)" }}>
              120+
            </span>
            <span className={styles.statLabel}>Heists completed</span>
          </div>
          <div className={styles.stat}>
            <span className={styles.statNum} style={{ color: "var(--color-secondary)" }}>
              34
            </span>
            <span className={styles.statLabel}>Active agents</span>
          </div>
          <div className={styles.stat}>
            <span className={styles.statNum} style={{ color: "var(--color-success)" }}>
              98%
            </span>
            <span className={styles.statLabel}>Smiles generated</span>
          </div>
        </div>
      </main>
    </div>
  );
}
