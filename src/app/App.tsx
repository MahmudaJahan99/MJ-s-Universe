import { useState } from "react";

import IntroSequence from "../features/hero/components/IntroSequence";
import Footer from "../components/layout/Footer/Footer";

import styles from "./App.module.css";
import HeroSection from "../features/hero/components/HeroSection/HeroSection";

function App() {
  const [isHeroVisible, setIsHeroVisible] = useState(false);

  return (
    <div className={styles.app}>
      <IntroSequence onComplete={() => setIsHeroVisible(true)} />

      {isHeroVisible && (
        <>
          <main className={styles.main}>
            <HeroSection />
          </main>

          <Footer />
        </>
      )}
    </div>
  );
}

export default App;
