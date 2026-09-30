import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export const Crosshair = ({ isLocked = false, isHovered = false }) => {
  const [mousePosition, setMousePosition] = useState({ x: -100, y: -100 });
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Only track mouse on desktop pointers
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
      if (!isVisible) setIsVisible(true);
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <motion.div
      className="fixed pointer-events-none z-50 -translate-x-1/2 -translate-y-1/2 hidden md:block"
      style={{
        left: mousePosition.x,
        top: mousePosition.y,
      }}
      animate={{
        scale: isLocked ? 1.3 : isHovered ? 1.15 : 1,
        rotate: isHovered ? 45 : 0,
      }}
      transition={{ type: 'spring', damping: 20, stiffness: 300 }}
    >
      {/* Outer Ring with Neon Glow */}
      <div
        className={`w-12 h-12 rounded-full border-2 transition-colors duration-200 relative flex items-center justify-center ${
          isLocked
            ? 'border-emerald-400 shadow-[0_0_20px_#10b981]'
            : isHovered
            ? 'border-amber-400 shadow-[0_0_15px_#f59e0b]'
            : 'border-cyan-400/80 shadow-[0_0_10px_#06b6d4]'
        }`}
      >
        {/* Crosshair Ticks */}
        <div className="absolute top-0 w-0.5 h-2 bg-current" />
        <div className="absolute bottom-0 w-0.5 h-2 bg-current" />
        <div className="absolute left-0 h-0.5 w-2 bg-current" />
        <div className="absolute right-0 h-0.5 w-2 bg-current" />

        {/* Center Target Dot */}
        <div
          className={`w-2 h-2 rounded-full transition-colors ${
            isLocked ? 'bg-emerald-400' : isHovered ? 'bg-amber-400' : 'bg-cyan-400'
          }`}
        />

        {/* Target Lock Pulse Effect */}
        {isHovered && (
          <motion.div
            className="absolute inset-0 rounded-full border border-dashed border-amber-300"
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 3, ease: 'linear' }}
          />
        )}
      </div>
    </motion.div>
  );
};
