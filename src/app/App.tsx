import { useState } from "react";

import IntroSequence from "../features/hero/components/IntroSequence";
import Footer from "../components/layout/Footer/Footer";

import styles from "./App.module.css";

function App() {
  const [isHeroVisible, setIsHeroVisible] = useState(false);

  return (
    <div className={styles.app}>
      <IntroSequence onComplete={() => setIsHeroVisible(true)} />

      {isHeroVisible && (
        <>
          <main className={styles.main}>
            <section id="home" className={styles.hero} aria-label="Home">
              <div className={styles.heroContent}>
                <p className={styles.eyebrow}>PERSONAL UNIVERSE</p>

                <h1>Welcome to my universe.</h1>

                <p className={styles.description}>
                  A universe of ideas, creativity, and code.
                </p>

                <a href="#projects" className={styles.cta}>
                  Explore my work
                  <span aria-hidden="true"> ↗</span>
                </a>
              </div>

              <div className={styles.scrollIndicator}>
                <span>SCROLL TO EXPLORE</span>
                <span aria-hidden="true">↓</span>
              </div>
            </section>
          </main>

          <Footer />
        </>
      )}
    </div>
  );
}

export default App;
