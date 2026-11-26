import CosmicButton from "../../../../components/layout/ui/CTAButton/CosmicButton";
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
        {/* Eyebrow */}
        <p className={styles.eyebrow}>
          A Mind Full Of Possibilities & Potentials
        </p>

        {/* Title */}
        <StardustTitle text="Mahmuda Jahan" isVisible={isNameVisible} />

        {/* Role */}
        <p
          className={`${styles.role} ${
            isRoleVisible ? styles.visible : styles.hidden
          }`}
        >
          Frontend Developer · Creative Thinker · Eternal Explorer
        </p>

        {/* Description */}
        <p
          className={`${styles.description} ${
            isIntroVisible ? styles.visible : styles.hidden
          }`}
        >
          I turn ideas into interfaces, pixels into experiences, and curiosity
          into code.
        </p>

        <CosmicButton
          className={`${styles.cta} ${
            isCtaVisible ? styles.visible : styles.hidden
          }`}
          arrowDirection="down"
          onClick={() => {
            document
              .getElementById("projects")
              ?.scrollIntoView({ behavior: "smooth" });
          }}
        >
          Explore my work
        </CosmicButton>
      </div>
    </section>
  );
}

export default HeroSection;
