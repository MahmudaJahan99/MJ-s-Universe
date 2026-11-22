import useHeroReveal from "../../hooks/useHeroReveal";
import StardustTitle from "../StardustTitle/StardustTitle";

import styles from "./HeroSection.module.css";

function HeroSection() {
  const { isNameVisible, isRoleVisible, isIntroVisible, isCtaVisible } =
    useHeroReveal();

  return (
    <section id="home" className={styles.hero} aria-label="Home">
      <div
        className={`${styles.heroContent} ${
          isNameVisible ? styles.visible : styles.hidden
        }`}
      >
        <p className={styles.eyebrow}>PERSONAL UNIVERSE</p>
        {/* 
        <h1>
          Welcome to my <span>personal</span> universe.
        </h1> */}
        <StardustTitle text="Mahmuda Jahan" isVisible={isNameVisible} />

        <p
          className={`${styles.role} ${
            isRoleVisible ? styles.visible : styles.hidden
          }`}
        >
          FRONTEND DEVELOPER
        </p>

        <p
          className={`${styles.description} ${
            isIntroVisible ? styles.visible : styles.hidden
          }`}
        >
          A universe of ideas, creativity, and code.
        </p>

        <a
          href="#projects"
          className={`${styles.cta} ${
            isCtaVisible ? styles.visible : styles.hidden
          }`}
        >
          Explore my work
          <span aria-hidden="true"> ↗</span>
        </a>
      </div>

      <div className={styles.scrollIndicator}>
        <span>SCROLL TO EXPLORE</span>
        <span aria-hidden="true">↓</span>
      </div>
    </section>
  );
}

export default HeroSection;
