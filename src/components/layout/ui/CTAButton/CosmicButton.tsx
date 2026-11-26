import type { ButtonHTMLAttributes, CSSProperties } from "react";
import styles from "./CosmicButton.module.css";

type CosmicButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary";
  showStars?: boolean;
  showArrow?: boolean;
  arrowDirection?: "up" | "down";
};

const particleGroups = [
  // Top
  {
    direction: [0, -1],
    positions: [
      [12, 0],
      [37, 0],
      [63, 0],
      [88, 0],
    ],
  },
  // Top-right
  {
    direction: [1, -1],
    positions: [
      [88, 0],
      [94, 2],
      [98, 6],
      [100, 12],
    ],
  },
  // Right
  {
    direction: [1, 0],
    positions: [
      [100, 12],
      [100, 37],
      [100, 63],
      [100, 88],
    ],
  },
  // Bottom-right
  {
    direction: [1, 1],
    positions: [
      [100, 88],
      [98, 94],
      [94, 98],
      [88, 100],
    ],
  },
  // Bottom
  {
    direction: [0, 1],
    positions: [
      [88, 100],
      [63, 100],
      [37, 100],
      [12, 100],
    ],
  },
  // Bottom-left
  {
    direction: [-1, 1],
    positions: [
      [12, 100],
      [6, 98],
      [2, 94],
      [0, 88],
    ],
  },
  // Left
  {
    direction: [-1, 0],
    positions: [
      [0, 88],
      [0, 63],
      [0, 37],
      [0, 12],
    ],
  },
  // Top-left
  {
    direction: [-1, -1],
    positions: [
      [0, 12],
      [2, 6],
      [6, 2],
      [12, 0],
    ],
  },
];

const stars = particleGroups.flatMap((group, groupIndex) =>
  group.positions.map(([x, y], particleIndex) => ({
    id: `${groupIndex}-${particleIndex}`,
    style: {
      "--start-x": `${x}%`,
      "--start-y": `${y}%`,
      "--drift-x": `${group.direction[0] * (55 + particleIndex * 12)}px`,
      "--drift-y": `${group.direction[1] * (55 + particleIndex * 12)}px`,
      "--delay": `${particleIndex * 0.12}s`,
      "--duration": `${1.1 + (particleIndex % 3) * 0.2}s`,
      "--size": `${4 + (particleIndex % 3) * 2}px`,
    } as CSSProperties,
  })),
);

function CosmicButton({
  children,
  variant = "primary",
  showStars = true,
  showArrow = true,
  arrowDirection = "up",
  className = "",
  type = "button",
  ...props
}: CosmicButtonProps) {
  return (
    <button
      type={type}
      className={`${styles.button} ${styles[variant]} ${styles[arrowDirection]} ${className}`}
      {...props}
    >
      {showStars && (
        <span className={styles.starField} aria-hidden="true">
          {stars.map((star) => (
            <span key={star.id} className={styles.star} style={star.style} />
          ))}
        </span>
      )}

      <span className={styles.content}>{children}</span>

      {showArrow && (
        <span className={styles.arrow} aria-hidden="true">
          {arrowDirection === "down" ? "↓" : "↗"}
        </span>
      )}
    </button>
  );
}

export default CosmicButton;
