import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { InteractiveObject } from './InteractiveObject';
import { ChevronLeft, ChevronRight, Sparkles, MapPin } from 'lucide-react';

export const EduQuestEnvironment = ({
  level,
  currentChamberId,
  onNavigateChamber,
  currentClue,
  inspectedObjects = [],
  discoveredClues = [],
  unlockedDoors = [],
  onInspectObject,
}) => {
  if (!level) return null;

  const chambers = level.chambers || [];
  const currentChamber =
    chambers.find((c) => c.id === currentChamberId) || chambers[0];
  const chamberIndex = chambers.findIndex((c) => c.id === currentChamber?.id);

  // Prev / Next chamber handlers
  const handlePrevChamber = () => {
    if (chamberIndex > 0) {
      onNavigateChamber(chambers[chamberIndex - 1].id);
    }
  };

  const handleNextChamber = () => {
    if (chamberIndex < chambers.length - 1) {
      onNavigateChamber(chambers[chamberIndex + 1].id);
    }
  };

  // Chamber objects
  const chamberObjects =
    currentChamber?.objectIds
      ?.map((objId) => level.objects?.[objId])
      ?.filter(Boolean) || [];

  return (
    <div className="w-full max-w-5xl mx-auto flex flex-col gap-5">
      {/* Chamber Navigation Bar / Tabs */}
      <div className="flex items-center justify-between gap-2 overflow-x-auto pb-1 px-2 select-none">
        <div className="flex items-center gap-2 mx-auto">
          {chambers.map((chamber, idx) => {
            const isActive = chamber.id === currentChamber?.id;
            const hasClueTarget = currentClue?.targetChamberId === chamber.id;

            return (
              <button
                key={chamber.id}
                onClick={() => onNavigateChamber(chamber.id)}
                className={`relative px-4 py-2.5 rounded-2xl font-bold text-xs sm:text-sm transition-all flex items-center gap-2 cursor-pointer border ${
                  isActive
                    ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white border-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.35)] scale-105'
                    : 'bg-slate-900/80 text-slate-400 border-slate-800 hover:text-slate-200 hover:border-slate-700'
                }`}
              >
                <span className="text-base">{chamber.icon}</span>
                <span>{chamber.name}</span>

                {/* Beacon dot if active clue is inside this chamber */}
                {hasClueTarget && (
                  <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping absolute -top-1 -right-1" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* 2.5D Chamber Stage Card */}
      <div className="relative rounded-3xl bg-slate-900/90 border border-slate-800 backdrop-blur-2xl p-6 sm:p-10 shadow-2xl overflow-hidden min-h-[380px] sm:min-h-[440px] flex flex-col justify-between">
        {/* Background Atmospheric Pillars & Torches */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-950/40 via-slate-950/80 to-slate-950 pointer-events-none" />
        <div className="absolute inset-0 opacity-[0.04] bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />

        {/* Ambient Cyan Torches (left and right) */}
        <div className="absolute top-12 left-6 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-12 right-6 w-32 h-32 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Chamber Header & Subtitle */}
        <div className="relative z-10 text-center space-y-1.5 mb-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800/80 border border-slate-700/80 text-emerald-400 text-xs font-mono font-bold uppercase tracking-wider">
            <MapPin className="w-3.5 h-3.5" />
            <span>{currentChamber?.subtitle || 'Active Chamber'}</span>
          </div>

          <h2 className="text-xl sm:text-2xl font-black text-white font-display tracking-tight flex items-center justify-center gap-2">
            <span>{currentChamber?.icon}</span>
            <span>{currentChamber?.name}</span>
          </h2>

          <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto leading-relaxed">
            {currentChamber?.description}
          </p>
        </div>

        {/* Chamber Objects Display Grid */}
        <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 sm:gap-6 justify-items-center items-center my-auto py-4">
          <AnimatePresence mode="popLayout">
            {chamberObjects.map((obj) => {
              const isTargetOfActiveClue = currentClue?.targetObjectId === obj.id;
              const isInspected = inspectedObjects.includes(obj.id);
              const isSolved = discoveredClues.some((c) => c.targetObjectId === obj.id);
              const isDoorUnlocked = unlockedDoors.includes(obj.id);

              return (
                <InteractiveObject
                  key={obj.id}
                  object={obj}
                  isTargetOfActiveClue={isTargetOfActiveClue}
                  isInspected={isInspected}
                  isSolved={isSolved}
                  isDoorUnlocked={isDoorUnlocked}
                  onInspect={onInspectObject}
                />
              );
            })}
          </AnimatePresence>
        </div>

        {/* Bottom Chamber Navigation Controls */}
        <div className="relative z-10 flex items-center justify-between pt-4 border-t border-slate-800/80 mt-4 text-xs font-bold text-slate-400">
          <button
            onClick={handlePrevChamber}
            disabled={chamberIndex === 0}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-xl transition-colors cursor-pointer ${
              chamberIndex > 0
                ? 'hover:text-white hover:bg-slate-800 text-slate-300'
                : 'opacity-30 cursor-not-allowed'
            }`}
          >
            <ChevronLeft className="w-4 h-4" />
            <span>{chamberIndex > 0 ? chambers[chamberIndex - 1].name : 'Start'}</span>
          </button>

          <span className="text-[11px] font-mono text-slate-500">
            Chamber {chamberIndex + 1} of {chambers.length}
          </span>

          <button
            onClick={handleNextChamber}
            disabled={chamberIndex === chambers.length - 1}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-xl transition-colors cursor-pointer ${
              chamberIndex < chambers.length - 1
                ? 'hover:text-white hover:bg-slate-800 text-slate-300'
                : 'opacity-30 cursor-not-allowed'
            }`}
          >
            <span>
              {chamberIndex < chambers.length - 1
                ? chambers[chamberIndex + 1].name
                : 'Inner Sanctum'}
            </span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default EduQuestEnvironment;
