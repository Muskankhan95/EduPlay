import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { Check, X, Crosshair as CrosshairIcon, Sparkles } from 'lucide-react';

export const AnswerTarget = ({
  answerText,
  index,
  difficulty = 'easy',
  isAnswered = false,
  isSelected = false,
  isCorrect = null,
  onShoot,
  onHoverStart,
  onHoverEnd,
}) => {
  const targetRef = useRef(null);

  // Floating bob animation based on index & difficulty
  const floatingTransitions = {
    easy: {
      y: [0, -6, 0],
      transition: {
        repeat: Infinity,
        duration: 3 + index * 0.4,
        ease: 'easeInOut',
      },
    },
    medium: {
      y: [0, -10, 0],
      x: [0, index % 2 === 0 ? 6 : -6, 0],
      transition: {
        repeat: Infinity,
        duration: 4 + index * 0.3,
        ease: 'easeInOut',
      },
    },
    hard: {
      y: [0, -14, 0],
      x: [0, index % 2 === 0 ? 12 : -12, 0],
      transition: {
        repeat: Infinity,
        duration: 3.5 + index * 0.2,
        ease: 'easeInOut',
      },
    },
  };

  const handleClick = (e) => {
    if (isAnswered) return;
    const rect = targetRef.current?.getBoundingClientRect();
    const coords = rect
      ? { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 }
      : { x: e.clientX, y: e.clientY };

    onShoot(answerText, coords);
  };

  // Determine visual target card state
  let borderClasses = "border-cyan-500/40 hover:border-cyan-400 bg-slate-900/80 shadow-[0_0_15px_rgba(6,182,212,0.15)]";
  let targetIconColor = "text-cyan-400";
  let textColor = "text-white";

  if (isAnswered) {
    if (isSelected && isCorrect) {
      borderClasses = "border-emerald-500 bg-emerald-950/80 shadow-[0_0_30px_rgba(16,185,129,0.5)] ring-2 ring-emerald-400";
      targetIconColor = "text-emerald-400";
      textColor = "text-emerald-200";
    } else if (isSelected && !isCorrect) {
      borderClasses = "border-rose-500 bg-rose-950/80 shadow-[0_0_30px_rgba(244,63,94,0.5)] ring-2 ring-rose-400 animate-shake";
      targetIconColor = "text-rose-400";
      textColor = "text-rose-200";
    } else {
      borderClasses = "border-slate-800 bg-slate-950/60 opacity-40";
      textColor = "text-slate-500";
    }
  }

  return (
    <motion.div
      animate={isAnswered ? {} : floatingTransitions[difficulty] || floatingTransitions.easy}
      className="w-full"
    >
      <motion.button
        ref={targetRef}
        type="button"
        disabled={isAnswered}
        onClick={handleClick}
        onMouseEnter={() => onHoverStart(answerText)}
        onMouseLeave={onHoverEnd}
        whileHover={{ scale: isAnswered ? 1 : 1.05 }}
        whileTap={{ scale: isAnswered ? 1 : 0.95 }}
        className={`w-full relative overflow-hidden rounded-3xl border-2 p-5 sm:p-6 text-center backdrop-blur-md transition-all duration-200 flex flex-col items-center justify-center gap-2.5 cursor-pointer group select-none min-h-[130px] sm:min-h-[150px] ${borderClasses}`}
      >
        {/* Subtle background radar circles */}
        <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none">
          <div className="w-24 h-24 rounded-full border border-white" />
          <div className="w-16 h-16 rounded-full border border-white absolute" />
        </div>

        {/* Target Ring & Icon */}
        <div className="relative">
          <div
            className={`w-12 h-12 rounded-full border-2 border-dashed border-current flex items-center justify-center transition-transform group-hover:rotate-45 ${targetIconColor}`}
          >
            <span className="text-xl">🎯</span>
          </div>

          {/* Correct / Incorrect Badge Overlay */}
          {isAnswered && isSelected && (
            <div
              className={`absolute -top-1 -right-2 w-6 h-6 rounded-full flex items-center justify-center text-white text-xs shadow-md animate-scaleUp ${
                isCorrect ? 'bg-emerald-500' : 'bg-rose-500'
              }`}
            >
              {isCorrect ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : <X className="w-3.5 h-3.5 stroke-[3]" />}
            </div>
          )}
        </div>

        {/* Target Answer Text */}
        <h4 className={`text-base sm:text-lg font-black tracking-wide uppercase font-mono ${textColor}`}>
          {answerText}
        </h4>

        {/* Hover Target Lock Indicator */}
        <div className="text-[10px] uppercase font-bold tracking-widest text-cyan-300 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
          <CrosshairIcon className="w-3 h-3" />
          <span>TARGET LOCKED</span>
        </div>
      </motion.button>
    </motion.div>
  );
};
