import confetti from 'canvas-confetti';

export const triggerCelebration = () => {
  // Fire dual side cannons
  const count = 200;
  const defaults = {
    origin: { y: 0.7 },
    zIndex: 9999,
  };

  function fire(particleRatio, opts) {
    confetti({
      ...defaults,
      ...opts,
      particleCount: Math.floor(count * particleRatio),
    });
  }

  fire(0.25, {
    spread: 26,
    startVelocity: 55,
    colors: ['#6366f1', '#a855f7', '#ec4899', '#eab308']
  });
  fire(0.2, {
    spread: 60,
    colors: ['#4f46e5', '#3b82f6', '#10b981', '#f59e0b']
  });
  fire(0.35, {
    spread: 100,
    decay: 0.91,
    scalar: 0.8,
  });
  fire(0.1, {
    spread: 120,
    startVelocity: 25,
    decay: 0.92,
    scalar: 1.2,
  });
  fire(0.1, {
    spread: 120,
    startVelocity: 45,
  });
};

export const triggerStars = () => {
  confetti({
    shapes: ['star'],
    colors: ['#FFE838', '#FFD000', '#FFA800', '#6366f1'],
    particleCount: 50,
    spread: 80,
    origin: { y: 0.6 },
    zIndex: 9999,
  });
};
