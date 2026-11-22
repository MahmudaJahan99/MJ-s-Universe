import { useEffect, useRef, useState } from "react";

import styles from "./StardustTitle.module.css";

type StardustTitleProps = {
  text: string;
  isVisible: boolean;
};

type ParticleTarget = {
  x: number;
  y: number;
};

type Particle = {
  x: number;
  y: number;

  startX: number;
  startY: number;

  targetX: number;
  targetY: number;

  previousX: number;
  previousY: number;

  progress: number;
  speed: number;

  size: number;
  opacity: number;

  angle: number;
  swirl: number;

  phase: number;
  twinkle: number;

  color: string;
  sparkle: boolean;
};

// --------------------------------------------------
// PARTICLE GENERATION
// --------------------------------------------------

function createParticles(
  targets: ParticleTarget[],
  width: number,
  height: number,
): Particle[] {
  const centerX = width / 2;
  const centerY = height / 2;

  const colors = [
    "233, 227, 215", // Starlight
    "214, 185, 135", // Champagne
    "184, 169, 201", // Lavender
  ];

  return targets.map((target) => {
    const angle = Math.random() * Math.PI * 2;

    const radius = 0.75 + Math.random() * 0.25;

    const startX = Math.max(
      3,
      Math.min(width - 3, centerX + Math.cos(angle) * width * 0.48 * radius),
    );

    const startY = Math.max(
      3,
      Math.min(height - 3, centerY + Math.sin(angle) * height * 0.48 * radius),
    );

    return {
      x: startX,
      y: startY,

      startX,
      startY,

      targetX: target.x,
      targetY: target.y,

      previousX: startX,
      previousY: startY,

      progress: 0,
speed: 0.0004 + Math.random() * 0.0001,

      size: Math.random() * 1.4 + 0.6,
      opacity: Math.random() * 0.5 + 0.5,

      angle,
      swirl: Math.random() * 35 + 15,

      phase: Math.random() * Math.PI * 2,
      twinkle: Math.random() * 0.7 + 0.3,

      color: colors[Math.floor(Math.random() * colors.length)],
      sparkle: Math.random() < 0.018,
    };
  });
}

// --------------------------------------------------
// PARTICLE RENDERING
// --------------------------------------------------

function drawParticles(
  context: CanvasRenderingContext2D,
  particles: Particle[],
  width: number,
  height: number,
  time: number,
  delta: number,
) {
  context.clearRect(0, 0, width, height);

  context.globalCompositeOperation = "lighter";

  particles.forEach((particle) => {
    particle.previousX = particle.x;
    particle.previousY = particle.y;

    // Progress from 0 to 1.
    particle.progress = Math.min(1, particle.progress + delta * particle.speed);

    // Ease-out movement.
    const easedProgress = 1 - Math.pow(1 - particle.progress, 3);

    // Base journey.
    const baseX =
      particle.startX + (particle.targetX - particle.startX) * easedProgress;

    const baseY =
      particle.startY + (particle.targetY - particle.startY) * easedProgress;

    // Curved, swirling movement.
    const swirlAmount =
      Math.sin(particle.progress * Math.PI * 3 + particle.angle) *
      particle.swirl *
      (1 - easedProgress);

    particle.x =
      baseX + Math.cos(particle.angle + particle.progress * 5) * swirlAmount;

    particle.y =
      baseY + Math.sin(particle.angle + particle.progress * 5) * swirlAmount;

    // Settle precisely on the letter coordinates.
    if (particle.progress >= 1) {
      particle.x = particle.targetX;
      particle.y = particle.targetY;
    }

    // Twinkle.
    const twinkle =
      0.7 + Math.sin(time * 0.004 + particle.phase) * 0.3 * particle.twinkle;

    const alpha = particle.opacity * twinkle;

    // Light trails.
    if (particle.progress < 0.98) {
      context.beginPath();

      context.moveTo(particle.previousX, particle.previousY);

      context.lineTo(particle.x, particle.y);

      context.strokeStyle = `rgba(${particle.color}, ${alpha * 0.22})`;

      context.lineWidth = Math.max(0.5, particle.size * 0.7);

      context.lineCap = "round";

      context.stroke();
    }

    // Outer glow.
    context.beginPath();

    context.arc(particle.x, particle.y, particle.size * 3.5, 0, Math.PI * 2);

    context.fillStyle = `rgba(${particle.color}, ${alpha * 0.16})`;

    context.fill();

    // Bright particle core.
    context.beginPath();

    context.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);

    context.fillStyle = `rgba(${particle.color}, ${alpha})`;

    context.fill();

    // Four-point sparkles.
    if (particle.sparkle && alpha > 0.25) {
      const sparkleSize = particle.size * 4;

      context.beginPath();

      context.moveTo(particle.x - sparkleSize, particle.y);

      context.lineTo(particle.x + sparkleSize, particle.y);

      context.moveTo(particle.x, particle.y - sparkleSize);

      context.lineTo(particle.x, particle.y + sparkleSize);

      context.strokeStyle = `rgba(255, 245, 225, ${alpha * 0.75})`;

      context.lineWidth = 0.7;

      context.stroke();
    }
  });

  context.globalCompositeOperation = "source-over";
}

// --------------------------------------------------
// MAIN COMPONENT
// --------------------------------------------------

function StardustTitle({ text, isVisible }: StardustTitleProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const titleRef = useRef<HTMLHeadingElement>(null);

  const [isHardened, setIsHardened] = useState(false);

  // ------------------------------------------------
  // TITLE REVEAL TIMING
  // ------------------------------------------------

//   useEffect(() => {
//     if (!isVisible) {
//       setIsHardened(false);
//       return;
//     }

//     const prefersReducedMotion = window.matchMedia(
//       "(prefers-reduced-motion: reduce)",
//     ).matches;

//     if (prefersReducedMotion) {
//       setIsHardened(true);
//       return;
//     }

//     const timer = window.setTimeout(() => {
//       setIsHardened(true);
//     }, 4200);

//     return () => window.clearTimeout(timer);
//   }, [text, isVisible]);

useEffect(() => {
  if (!isVisible) return;

  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  if (prefersReducedMotion) {
    setIsHardened(true);
    return;
  }

  const timer = window.setTimeout(() => {
    setIsHardened(true);
  }, 2400);

  return () => window.clearTimeout(timer);
}, [isVisible, text]);

  // ------------------------------------------------
  // CANVAS AND PARTICLE ANIMATION
  // ------------------------------------------------

  useEffect(() => {
    const canvas = canvasRef.current;

    if (!canvas || !isVisible) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    // Show static typography instead of animating particles.
    if (prefersReducedMotion) {
      particlesRef.current = [];
      return;
    }

    const visibleContext = canvas.getContext("2d");

    if (!visibleContext) return;

    let isCancelled = false;
    let animationFrameId = 0;
    let previousFrameTime = 0;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    // ----------------------------------------------
    // GENERATE TEXT TARGETS
    // ----------------------------------------------

    const generateTextPoints = () => {
      if (isCancelled) return;

      const width = canvas.clientWidth;
      const height = canvas.clientHeight;

      if (!width || !height) return;

      // High-resolution visible canvas.
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);

      visibleContext.setTransform(dpr, 0, 0, dpr, 0, 0);

      const titleElement = titleRef.current;

      if (!titleElement) return;

      const titleStyles = window.getComputedStyle(titleElement);

      const titleRect = titleElement.getBoundingClientRect();

      const canvasRect = canvas.getBoundingClientRect();

      // Offscreen canvas for text sampling.
      const offscreenCanvas = document.createElement("canvas");

      offscreenCanvas.width = width;
      offscreenCanvas.height = height;

      const context = offscreenCanvas.getContext("2d");

      if (!context) return;

      // Match the actual heading typography.
      context.font = [
        titleStyles.fontStyle,
        titleStyles.fontWeight,
        titleStyles.fontSize,
        titleStyles.fontFamily,
      ].join(" ");

      context.textAlign = "center";
      context.textBaseline = "alphabetic";
      context.fillStyle = "#ffffff";

      const centerX = titleRect.left - canvasRect.left + titleRect.width / 2;

      const centerY = titleRect.top - canvasRect.top + titleRect.height / 2;

      const metrics = context.measureText(text);

      const baselineY =
        centerY +
        (metrics.actualBoundingBoxAscent - metrics.actualBoundingBoxDescent) /
          2;

      context.fillText(text, centerX, baselineY);

      // Extract visible text pixels.
      const imageData = context.getImageData(0, 0, width, height);

      const pixels = imageData.data;

      const points: ParticleTarget[] = [];

      const samplingGap = 5;

      for (let y = 0; y < height; y += samplingGap) {
        for (let x = 0; x < width; x += samplingGap) {
          const pixelIndex = (y * width + x) * 4;

          const alpha = pixels[pixelIndex + 3];

          if (alpha > 100) {
            points.push({ x, y });
          }
        }
      }

      particlesRef.current = createParticles(points, width, height);

      // Reset frame timing when particles regenerate.
      previousFrameTime = 0;

      console.log(`Generated ${points.length} text particles.`);
    };

    // ----------------------------------------------
    // SINGLE ANIMATION LOOP
    // ----------------------------------------------

    const animate = (time: number) => {
      if (isCancelled) return;

      const delta = previousFrameTime
        ? Math.min(time - previousFrameTime, 32)
        : 16;

      previousFrameTime = time;

      const width = canvas.clientWidth;
      const height = canvas.clientHeight;

      if (width && height) {
        drawParticles(
          visibleContext,
          particlesRef.current,
          width,
          height,
          time,
          delta,
        );
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    // ----------------------------------------------
    // RESPONSIVE CANVAS
    // ----------------------------------------------

    const resizeObserver = new ResizeObserver(() => {
      generateTextPoints();
    });

    // Wait for fonts before measuring the heading.
    void document.fonts.ready.then(() => {
      if (isCancelled) return;

      generateTextPoints();

      resizeObserver.observe(canvas);

      animationFrameId = requestAnimationFrame(animate);
    });

    // ----------------------------------------------
    // CLEANUP
    // ----------------------------------------------

    return () => {
      isCancelled = true;

      resizeObserver.disconnect();

      cancelAnimationFrame(animationFrameId);

      particlesRef.current = [];
      visibleContext.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight);
    };
  }, [text, isVisible]);

  // ------------------------------------------------
  // RENDER
  // ------------------------------------------------

  return (
    <div className={`${styles.container} ${isVisible ? styles.visible : ""}`}>
      <canvas
        ref={canvasRef}
        className={`${styles.canvas} ${
          isHardened ? styles.particlesSettled : ""
        }`}
        aria-hidden="true"
      />

      <h1
        ref={titleRef}
        className={`${styles.fallbackTitle} ${
          isHardened ? styles.titleRevealed : ""
        }`}
      >
        {text}
      </h1>
    </div>
  );
}

export default StardustTitle;
