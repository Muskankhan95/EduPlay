import React, { useState } from 'react';
import { useEduQuest } from '../../hooks/useEduQuest';
import { EduQuestHUD } from './EduQuestHUD';
import { EduQuestEnvironment } from './EduQuestEnvironment';
import { CluePanel } from './CluePanel';
import { InspectionModal } from './InspectionModal';
import { RiddleModal } from './RiddleModal';
import { LevelCompleteModal } from './LevelCompleteModal';
import { ReviewMistakesModal } from './ReviewMistakesModal';
import { EduQuestMap } from './EduQuestMap';
import { RotateCcw, BookOpen, ArrowRight, ShieldAlert, Sparkles } from 'lucide-react';

export const EduQuest = ({
  initialWorldId = 'python-world',
  initialLevelId = 'py-level-1',
  userId = 'usr_101',
  courses = [],
  addXPToUser = null,
  onExit = () => window.history.back(),
}) => {
  const [viewMode, setViewMode] = useState('quest'); // 'quest' | 'map'
  const [showLoreModal, setShowLoreModal] = useState(false);

  const quest = useEduQuest({
    initialWorldId,
    initialLevelId,
    userId,
    courses,
    addXPToUser,
  });

  const {
    worlds,
    currentWorld,
    setCurrentWorldId,
    worldLevels,
    currentLevel,
    currentLevelId,
    setCurrentLevelId,
    currentChamberId,
    navigateChamber,
    currentClue,
    currentClueIndex,
    cluesList,
    discoveredClues,
    inspectedObjects,
    unlockedDoors,
    inventory,
    score,
    xpEarned,
    lives,
    maxLives,
    hintsUsed,
    mistakesHistory,
    timeElapsed,
    activeInspection,
    inspectObject,
    closeInspection,
    activeChallenge,
    challengeFeedback,
    revealedHintIndex,
    requestHint,
    submitChallengeAnswer,
    proceedToNextClue,
    closeChallenge,
    levelCompleted,
    isGameOver,
    restartLevel,
    completedLevels,
    isLevelUnlocked,
    soundMuted,
    toggleSound,
    adaptiveResult,
  } = quest;

  const handleSelectLevelFromMap = (lvlId) => {
    setCurrentLevelId(lvlId);
    setViewMode('quest');
  };

  return (
    <div className="relative min-h-screen w-full bg-slate-950 text-slate-100 flex flex-col justify-between selection:bg-emerald-500 selection:text-white">
      {/* Background Ambience */}
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-950/20 via-slate-950 to-slate-950 pointer-events-none" />

      {/* Top HUD */}
      <EduQuestHUD
        worldName={currentWorld?.name}
        worldIcon={currentWorld?.icon}
        levelTitle={currentLevel?.title}
        mission={currentLevel?.mission}
        lives={lives}
        maxLives={maxLives}
        xpEarned={xpEarned}
        timeElapsed={timeElapsed}
        currentClueNumber={currentClueIndex + 1}
        totalClues={cluesList.length}
        soundMuted={soundMuted}
        onToggleSound={toggleSound}
        onOpenMap={() => setViewMode(viewMode === 'map' ? 'quest' : 'map')}
        onExit={onExit}
      />

      {/* Main Screen Content */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center p-4 sm:p-6 max-w-6xl mx-auto w-full my-auto">
        {viewMode === 'map' ? (
          <EduQuestMap
            worlds={worlds}
            currentWorld={currentWorld}
            onSelectWorld={(wId) => setCurrentWorldId(wId)}
            worldLevels={worldLevels}
            completedLevels={completedLevels}
            isLevelUnlocked={isLevelUnlocked}
            onSelectLevel={handleSelectLevelFromMap}
            onClose={() => setViewMode('quest')}
          />
        ) : (
          <div className="w-full flex flex-col gap-6">
            {/* 2.5D Chamber Environment Stage */}
            <EduQuestEnvironment
              level={currentLevel}
              currentChamberId={currentChamberId}
              onNavigateChamber={navigateChamber}
              currentClue={currentClue}
              inspectedObjects={inspectedObjects}
              discoveredClues={discoveredClues}
              unlockedDoors={unlockedDoors}
              onInspectObject={inspectObject}
            />

            {/* Active Clue Panel & Inventory */}
            <CluePanel
              currentClue={currentClue}
              totalClues={cluesList.length}
              inventory={inventory}
              chambers={currentLevel?.chambers || []}
              currentChamberId={currentChamberId}
              onNavigateChamber={navigateChamber}
            />
          </div>
        )}
      </main>

      {/* Modals & Overlays */}
      {/* 1. Object Inspection Dialog */}
      <InspectionModal
        inspection={activeInspection}
        onClose={closeInspection}
      />

      {/* 2. Riddle / Question Puzzle Challenge */}
      <RiddleModal
        challenge={activeChallenge}
        feedback={challengeFeedback}
        revealedHintIndex={revealedHintIndex}
        onRequestHint={requestHint}
        onSubmitAnswer={submitChallengeAnswer}
        onProceed={proceedToNextClue}
        onClose={closeChallenge}
        lives={lives}
      />

      {/* 3. Level Complete Modal */}
      {levelCompleted && (
        <LevelCompleteModal
          level={currentLevel}
          score={score}
          xpEarned={xpEarned}
          timeElapsed={timeElapsed}
          hintsUsed={hintsUsed}
          accuracy={
            mistakesHistory.length > 0
              ? Math.round(
                  (cluesList.length / (cluesList.length + mistakesHistory.length)) * 100
                )
              : 100
          }
          adaptiveResult={adaptiveResult}
          onReviewClues={() => setShowLoreModal(true)}
          onContinueMap={() => setViewMode('map')}
          onExitHub={onExit}
        />
      )}

      {/* 4. Game Over / Shields Depleted Graceful Transition */}
      {isGameOver && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md">
          <div className="w-full max-w-md rounded-3xl bg-slate-900 border border-slate-700 p-6 sm:p-8 text-center space-y-4 shadow-2xl">
            <div className="w-16 h-16 rounded-2xl bg-amber-500/20 border border-amber-500/40 text-amber-400 flex items-center justify-center text-3xl mx-auto">
              <ShieldAlert className="w-8 h-8" />
            </div>

            <h3 className="text-xl font-black text-white font-display">
              Learning Round Complete
            </h3>
            <p className="text-xs sm:text-sm text-slate-300">
              The temple runes tested your endurance! Review the clues below or re-calibrate to explore again anytime.
            </p>

            <div className="flex flex-col sm:flex-row gap-2.5 pt-2">
              <button
                onClick={() => setShowLoreModal(true)}
                className="flex-1 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs border border-slate-600 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <BookOpen className="w-4 h-4 text-emerald-400" />
                <span>Review Clues</span>
              </button>

              <button
                onClick={restartLevel}
                className="flex-1 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-slate-950 font-black text-xs shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Try Again</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 5. Codex / Discovered Lore & Mistakes Review Modal */}
      <ReviewMistakesModal
        clues={discoveredClues}
        mistakes={mistakesHistory}
        isOpen={showLoreModal}
        onClose={() => setShowLoreModal(false)}
      />
    </div>
  );
};

export default EduQuest;
