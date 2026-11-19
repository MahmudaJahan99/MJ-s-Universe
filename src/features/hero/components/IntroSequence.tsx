import { useEffect, useRef, useState } from "react";

import styles from "./IntroSequence.module.css";

type IntroSequenceProps = {
  onComplete: () => void;
};

// Skip the completely black first frame of aa.mp4.
const LOOP_START_TIME = 0.04;

function IntroSequence({ onComplete }: IntroSequenceProps) {
  const introVideoRef = useRef<HTMLVideoElement>(null);
  const loopVideoRef = useRef<HTMLVideoElement>(null);
  const hasPlayedLoopAudioRef = useRef(false);

  const [hasStarted, setHasStarted] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  const startExperience = async () => {
    const introVideo = introVideoRef.current;

    if (!introVideo || hasStarted) return;

    try {
      introVideo.muted = false;
      introVideo.volume = 1;

      await introVideo.play();

      setHasStarted(true);
    } catch (error) {
      console.error("Unable to start intro video:", error);
    }
  };

  // Start the looping video without displaying its black first frame.
  const transitionToLoop = async () => {
    if (isTransitioning || isCompleted) return;

    const introVideo = introVideoRef.current;
    const loopVideo = loopVideoRef.current;

    if (!loopVideo) return;

    try {
      if (introVideo) {
        introVideo.pause();
      }

      loopVideo.muted = false;
      loopVideo.volume = 1;

      loopVideo.currentTime = LOOP_START_TIME;

      await loopVideo.play();
    } catch {
      loopVideo.muted = true;

      try {
        await loopVideo.play();
      } catch (error) {
        console.warn("Loop video playback failed:", error);
      }
    }

    setIsTransitioning(true);
  };

  // Manually restart the video, skipping its black first frame.
  const restartLoop = async () => {
    const loopVideo = loopVideoRef.current;

    if (!loopVideo) return;

    try {
      loopVideo.currentTime = LOOP_START_TIME;
      await loopVideo.play();
    } catch (error) {
      console.error("Unable to restart looping video:", error);
    }
  };
  const handleTransitionEnd = (
    event: React.TransitionEvent<HTMLVideoElement>,
  ) => {
    if (
      event.target !== event.currentTarget ||
      !isTransitioning ||
      isCompleted
    ) {
      return;
    }

    setIsCompleted(true);
    onComplete();
  };

  const handleSkip = () => {
    void transitionToLoop();
  };

  const handleLoopTimeUpdate = () => {
    const loopVideo = loopVideoRef.current;

    if (!loopVideo || hasPlayedLoopAudioRef.current) {
      return;
    }

    if (
      loopVideo.duration &&
      loopVideo.currentTime >= loopVideo.duration - 0.2
    ) {
      loopVideo.muted = true;
      hasPlayedLoopAudioRef.current = true;
    }
  };

  const handleIntroError = () => {
  console.warn("Intro video failed to load.");

  if (hasStarted) {
    void transitionToLoop();
  }
};

  useEffect(() => {
    const cinematic = document.querySelector(`.${styles.cinematic}`);

    const loopVideo = loopVideoRef.current;

    if (!cinematic || !loopVideo || !isCompleted) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          void loopVideo.play().catch((error) => {
            console.warn("Background playback failed:", error);
          });
        } else {
          loopVideo.pause();
        }
      },
      {
        threshold: 0.1,
      },
    );

    observer.observe(cinematic);

    return () => {
      observer.disconnect();
      loopVideo.pause();
    };
  }, [isCompleted]);

  return (
    <section
      className={`${styles.cinematic} ${isCompleted ? styles.completed : ""}`}
    >
      {/* Intro video */}
      <video
        ref={introVideoRef}
        className={`${styles.video} ${isTransitioning ? styles.hidden : ""}`}
        src="/videos/universe-birth.mp4"
        muted
        playsInline
        preload="auto"
        onEnded={transitionToLoop}
        onError={handleIntroError}
        aria-hidden="true"
      />

      {/* Looping background video */}
      <video
        ref={loopVideoRef}
        className={`${styles.video} ${
          isTransitioning ? styles.visible : styles.hidden
        }`}
        src="/videos/universe-loop.mp4"
        muted
        playsInline
        preload="auto"
        onEnded={restartLoop}
        onTimeUpdate={handleLoopTimeUpdate}
        onTransitionEnd={handleTransitionEnd}
        aria-hidden="true"
      />

      {/* Dark overlay */}
      <div className={styles.overlay} />

      {/* Entrance screen */}
      {!hasStarted && (
        <div className={styles.entryScreen}>
          <p className={styles.eyebrow}>A NEW WORLD AWAITS</p>

          <h1>Enter the universe.</h1>

          <p className={styles.subtitle}>An immersive experience with sound.</p>

          <button
            className={styles.enterButton}
            type="button"
            onClick={startExperience}
          >
            Enter experience <span aria-hidden="true">↗</span>
          </button>
        </div>
      )}

      {/* Skip control */}
      {hasStarted && !isTransitioning && (
        <button
          className={styles.skipButton}
          type="button"
          onClick={handleSkip}
        >
          Skip intro
        </button>
      )}
    </section>
  );
}

export default IntroSequence;
