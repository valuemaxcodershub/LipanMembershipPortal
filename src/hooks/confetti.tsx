"use client";

import { useCallback } from "react";
import confetti from "canvas-confetti";

type Position = "top" | "bottom" | "left" | "right" | "center" | "sides";

interface ConfettiOptions {
  particleCount?: number;
  spread?: number;
  startVelocity?: number;
  gravity?: number;
  ticks?: number;
  origin?: { x: number; y: number };
  duration?: number; // only for continuous effects
}

export function useConfetti() {
  const fireConfetti = useCallback(
    (position: Position, options: ConfettiOptions = {}) => {
      const {
        particleCount = 100,
        spread = 60,
        startVelocity = 70,
        gravity = 0.8,
        ticks = 200,
        duration,
      } = options;

      // calculate origin based on position
      let origins: { x: number; y: number }[] = [];

      switch (position) {
        case "top":
          origins = [{ x: 0.5, y: 0 }];
          break;
        case "bottom":
          origins = [{ x: 0.5, y: 1 }];
          break;
        case "left":
          origins = [{ x: 0, y: 0.5 }];
          break;
        case "right":
          origins = [{ x: 1, y: 0.5 }];
          break;
        case "center":
          origins = [{ x: 0.5, y: 0.5 }];
          break;
        case "sides":
          origins = [
            { x: 0, y: 0.5 },
            { x: 1, y: 0.5 },
          ];
          break;
      }

      // single burst or continuous
      const shoot = () => {
        origins.forEach((origin) => {
          confetti({
            particleCount,
            spread,
            startVelocity,
            gravity,
            ticks,
            origin,
          });
        });
      };

      if (duration) {
        const end = Date.now() + duration;
        (function frame() {
          shoot();
          if (Date.now() < end) {
            requestAnimationFrame(frame);
          }
        })();
      } else {
        shoot();
      }
    },
    []
  );

  return fireConfetti;
}
