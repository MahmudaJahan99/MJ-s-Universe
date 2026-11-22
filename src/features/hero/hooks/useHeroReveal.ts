import { useEffect, useState } from "react";
import type { HeroRevealStage } from "../types/hero.types";

function useHeroReveal() {
  const [currentStage, setCurrentStage] = useState<HeroRevealStage>("idle");

  useEffect(() => {
    const stages: { stage: HeroRevealStage; delay: number }[] = [
      { stage: "name", delay: 0 },
      { stage: "role", delay: 2400 },
      { stage: "intro", delay: 2800 },
      { stage: "cta", delay: 3300 },
      { stage: "navigation", delay: 3900 },
      { stage: "complete", delay: 4600 },
    ];

    const timers = stages.map(({ stage, delay }) =>
      setTimeout(() => {
        setCurrentStage(stage);
      }, delay),
    );

    return () => {
      timers.forEach(clearTimeout);
    };
  }, []);

  return {
    currentStage,

    isNameVisible: currentStage !== "idle",

    isRoleVisible: ["role", "intro", "navigation", "cta", "complete"].includes(
      currentStage,
    ),

    isIntroVisible: ["intro", "navigation", "cta", "complete"].includes(
      currentStage,
    ),

    isNavigationVisible: ["navigation", "cta", "complete"].includes(
      currentStage,
    ),

    isCtaVisible: ["cta", "complete"].includes(currentStage),

    isComplete: currentStage === "complete",
  };
}

export default useHeroReveal;
