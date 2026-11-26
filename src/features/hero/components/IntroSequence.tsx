import { useEffect, useRef, useState } from "react";

import styles from "./IntroSequence.module.css";
import CosmicButton from "../../../components/layout/ui/CTAButton/CosmicButton";

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
  const [isMuted, setIsMuted] = useState(false);

  // Start the intro video when the user clicks the button.
  const startExperience = async () => {
    const introVideo = introVideoRef.current;

    if (!introVideo || hasStarted) return;

    try {
      introVideo.muted = isMuted;
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

      loopVideo.muted = isMuted;
      loopVideo.volume = 1;

      loopVideo.currentTime = LOOP_START_TIME;

      await loopVideo.play();
    } catch {
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

  // Mark the intro sequence as completed when the transition to the loop video ends.
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

  // Handle the skip button click by transitioning to the loop video immediately.
  const handleSkip = () => {
    void transitionToLoop();
  };

  // Toggle audio for both videos.
  const toggleMute = () => {
    setIsMuted((prev) => !prev);
  };

  // Mute the loop video when it reaches the end to prevent audio from playing after the intro sequence.
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

  // Handle the error event for the intro video by logging a warning and transitioning to the loop video if the intro has already started.
  const handleIntroError = () => {
    console.warn("Intro video failed to load.");

    if (hasStarted) {
      void transitionToLoop();
    }
  };

  // Mute or unmute the intro and loop videos based on the isMuted state.
  useEffect(() => {
    if (introVideoRef.current) {
      introVideoRef.current.muted = isMuted;
    }

    if (loopVideoRef.current) {
      loopVideoRef.current.muted = isMuted;
    }
  }, [isMuted]);

  // Use an IntersectionObserver to play or pause the loop video based on its visibility in the viewport.
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
          <p className={styles.eyebrow}>Every Universe Begins With An Idea</p>

          <p className={styles.subtitle}>
            Somewhere between creativity, curiosity, chaos, and code, my
            universe began to take shape. A world where my ideas come alive,
            where imagination meets creation, and where you get to explore a
            little piece of my mind.
          </p>

          <p className={styles.question}>Curious enough to step in?</p>

          <CosmicButton showArrow={false} onClick={startExperience}>
            LET THERE BE LIGHT
          </CosmicButton>
        </div>
      )}

      {/* Top-right controls */}
      {hasStarted && !isTransitioning && (
        <div className={styles.controls}>
          <button
            className={styles.skipButton}
            type="button"
            onClick={handleSkip}
          >
            Skip
          </button>

          <button
            type="button"
            className={styles.muteButton}
            onClick={toggleMute}
            aria-label={isMuted ? "Unmute audio" : "Mute audio"}
            aria-pressed={isMuted}
          >
            {isMuted ? "UNMUTE" : "MUTE"}
          </button>
        </div>
      )}
    </section>
  );
}

export default IntroSequence;
