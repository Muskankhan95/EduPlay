import React, { useState, useEffect } from 'react';
import { conceptMatchPairs } from '../../data/gameData';
import { soundFx } from '../../utils/sound';
import { triggerCelebration, triggerStars } from '../../utils/confetti';
import {
  Sparkles,
  Zap,
  RotateCcw,
  CheckCircle2,
  Trophy,
  ArrowRight,
  Flame,
  X
} from 'lucide-react';

export const ConceptMatchGame = ({ onExit, addXPToUser }) => {
  const [cards, setCards] = useState([]);
  const [selectedCards, setSelectedCards] = useState([]);
  const [matchedPairIds, setMatchedPairIds] = useState([]);
  const [mismatchedCardIds, setMismatchedCardIds] = useState([]);
  const [score, setScore] = useState(0);
  const [totalXP, setTotalXP] = useState(0);
  const [floatingMatchText, setFloatingMatchText] = useState(null);
  const [isCompleted, setIsCompleted] = useState(false);

  // Initialize and shuffle cards
  useEffect(() => {
    initGame();
  }, []);

  const initGame = () => {
    const deck = [];
    conceptMatchPairs.forEach((pair) => {
      deck.push({
        id: `${pair.id}-term`,
        pairId: pair.id,
        type: 'term',
        text: pair.term,
        icon: pair.icon,
        color: pair.color,
      });
      deck.push({
        id: `${pair.id}-def`,
        pairId: pair.id,
        type: 'def',
        text: pair.definition,
        icon: '💡',
        color: pair.color,
      });
    });

    // Shuffle deck
    const shuffled = [...deck].sort(() => Math.random() - 0.5);
    setCards(shuffled);
    setSelectedCards([]);
    setMatchedPairIds([]);
    setMismatchedCardIds([]);
    setScore(0);
    setTotalXP(0);
    setFloatingMatchText(null);
    setIsCompleted(false);
  };

  const handleCardClick = (card) => {
    if (
      matchedPairIds.includes(card.pairId) ||
      selectedCards.some((c) => c.id === card.id) ||
      selectedCards.length >= 2
    ) {
      return;
    }

    soundFx.playClick();
    const newSelected = [...selectedCards, card];
    setSelectedCards(newSelected);

    if (newSelected.length === 2) {
      const [cardA, cardB] = newSelected;

      // Check if both are same pair and different types (one term, one definition)
      const isMatch = cardA.pairId === cardB.pairId && cardA.type !== cardB.type;

      if (isMatch) {
        soundFx.playMatch();
        setMatchedPairIds((prev) => {
          const updated = [...prev, cardA.pairId];
          if (updated.length === conceptMatchPairs.length) {
            // All matched!
            setTimeout(() => {
              setIsCompleted(true);
              soundFx.playBossDefeat();
              triggerCelebration();
              if (addXPToUser) addXPToUser(100, "Concept Match Gauntlet Complete");
            }, 500);
          }
          return updated;
        });

        setScore((prev) => prev + 150);
        setTotalXP((prev) => prev + 20);
        setFloatingMatchText("✨ MATCH! +20 XP");
        if (addXPToUser) addXPToUser(20, "Concept Match");

        setTimeout(() => {
          setSelectedCards([]);
          setFloatingMatchText(null);
        }, 600);
      } else {
        soundFx.playHeartLost();
        setMismatchedCardIds([cardA.id, cardB.id]);
        setFloatingMatchText("Try Again!");

        setTimeout(() => {
          setSelectedCards([]);
          setMismatchedCardIds([]);
          setFloatingMatchText(null);
        }, 900);
      }
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6 animate-fadeIn">
      {/* Top Bar */}
      <div className="flex items-center justify-between p-4 bg-slate-900/80 backdrop-blur-md rounded-2xl border border-white/10">
        <div className="flex items-center gap-3">
          <button
            onClick={onExit}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
          <div>
            <span className="text-[10px] font-black uppercase tracking-wider text-emerald-400 block">
              Puzzle Mode
            </span>
            <h2 className="text-base sm:text-lg font-black text-white">Concept Match Grid</h2>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/30 text-xs font-black">
            <Zap className="w-3.5 h-3.5 fill-amber-400" />
            <span>+{totalXP} XP</span>
          </div>

          <div className="text-xs font-bold text-slate-300 bg-white/5 px-3 py-1 rounded-full border border-white/10">
            Matched: {matchedPairIds.length} / {conceptMatchPairs.length}
          </div>
        </div>
      </div>

      {/* Floating Match Toast */}
      {floatingMatchText && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-50 pointer-events-none animate-bounce">
          <div className="px-6 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-black text-sm shadow-xl shadow-emerald-500/30 border border-emerald-300 flex items-center gap-2">
            <Sparkles className="w-4 h-4 fill-white" />
            <span>{floatingMatchText}</span>
          </div>
        </div>
      )}

      {/* Instructions */}
      <p className="text-xs sm:text-sm text-slate-400 text-center">
        Click a <strong>term</strong> card and its corresponding <strong>definition</strong> to pair them up.
      </p>

      {/* Cards Grid */}
      {!isCompleted ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
          {cards.map((card) => {
            const isMatched = matchedPairIds.includes(card.pairId);
            const isSelected = selectedCards.some((c) => c.id === card.id);
            const isMismatched = mismatchedCardIds.includes(card.id);

            let cardStyle = "bg-slate-800/90 hover:bg-slate-750 border-slate-700 text-white shadow-soft-sm hover:scale-[1.02] cursor-pointer";

            if (isMatched) {
              cardStyle = "bg-emerald-950/40 border-emerald-500/40 text-emerald-300 opacity-60 pointer-events-none";
            } else if (isSelected) {
              cardStyle = "bg-indigo-600 border-indigo-400 text-white shadow-glow-primary scale-105 ring-2 ring-indigo-300";
            } else if (isMismatched) {
              cardStyle = "bg-rose-950/60 border-rose-500 text-rose-300 animate-shake";
            }

            return (
              <div
                key={card.id}
                onClick={() => handleCardClick(card)}
                className={`min-h-[110px] sm:min-h-[130px] p-4 rounded-3xl border-2 transition-all duration-200 flex flex-col justify-between select-none ${cardStyle}`}
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="text-xl">{card.icon}</span>
                  <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-white/10 text-slate-300">
                    {card.type === 'term' ? 'Concept' : 'Definition'}
                  </span>
                </div>

                <div className="my-auto">
                  <p
                    className={`font-black ${
                      card.type === 'term'
                        ? 'text-sm sm:text-base tracking-wider'
                        : 'text-xs sm:text-sm leading-snug font-medium text-slate-200'
                    }`}
                  >
                    {card.text}
                  </p>
                </div>

                {isMatched && (
                  <div className="flex items-center gap-1 text-[11px] font-bold text-emerald-400">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Matched
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        /* Victory Screen */
        <div className="p-8 rounded-3xl bg-slate-900 border border-white/10 text-center max-w-md mx-auto space-y-6 animate-scaleUp text-white">
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-emerald-500 to-teal-500 flex items-center justify-center text-4xl mx-auto shadow-glow-primary animate-bounce">
            🧩
          </div>

          <div>
            <h3 className="text-2xl font-black">All Concepts Matched!</h3>
            <p className="text-xs text-slate-400 mt-1">
              You matched all {conceptMatchPairs.length} programming definitions flawlessly!
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950 flex items-center justify-around">
            <div>
              <span className="text-[10px] text-slate-500 uppercase font-bold">Total XP</span>
              <p className="text-xl font-black text-amber-400">+{totalXP + 100} XP</p>
            </div>
            <div className="h-8 w-px bg-slate-800" />
            <div>
              <span className="text-[10px] text-slate-500 uppercase font-bold">Score</span>
              <p className="text-xl font-black text-white">{score + 500}</p>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={initGame}
              className="flex-1 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Play Again</span>
            </button>
            <button
              onClick={onExit}
              className="flex-1 py-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs transition-all cursor-pointer"
            >
              Back to Hub
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
