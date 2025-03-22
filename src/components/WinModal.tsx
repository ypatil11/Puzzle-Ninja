
import React, { useEffect } from "react";
import { Award, Clock, Trophy } from "lucide-react";
import { formatTime } from "../utils/gameUtils";

interface WinModalProps {
  isOpen: boolean;
  onClose: () => void;
  time: number;
  bestTime: number | null;
}

const WinModal: React.FC<WinModalProps> = ({ isOpen, onClose, time, bestTime }) => {
  useEffect(() => {
    // Play celebration animation on win
    if (isOpen) {
      const tiles = document.querySelectorAll('.number-tile');
      tiles.forEach((tile, i) => {
        setTimeout(() => {
          tile.classList.add('celebrate');
          setTimeout(() => tile.classList.remove('celebrate'), 500);
        }, i * 100);
      });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const isNewBestTime = bestTime !== null && time <= bestTime;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="glass rounded-2xl p-6 md:p-8 w-full max-w-sm animate-scale-in">
        <div className="flex flex-col items-center text-center">
          <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center mb-4 animate-float">
            <Award className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
          </div>
          
          <h2 className="text-2xl md:text-3xl font-medium mb-2">You Win!</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            Congratulations! You've successfully arranged the sequence.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full mb-6">
            <div className="flex flex-col items-center p-3 rounded-xl bg-white/50 dark:bg-white/5 border border-gray-200 dark:border-gray-700">
              <Clock className="w-5 h-5 text-gray-600 dark:text-gray-300 mb-1" />
              <div className="text-sm text-gray-500 dark:text-gray-400">Your Time</div>
              <div className="font-mono font-medium">{formatTime(time)}</div>
            </div>
            
            {bestTime !== null && (
              <div className="flex flex-col items-center p-3 rounded-xl bg-white/50 dark:bg-white/5 border border-gray-200 dark:border-gray-700">
                <Trophy className="w-5 h-5 text-amber-500 mb-1" />
                <div className="text-sm text-gray-500 dark:text-gray-400">Best Time</div>
                <div className="font-mono font-medium">
                  {formatTime(bestTime)}
                  {isNewBestTime && (
                    <span className="text-xs text-emerald-600 dark:text-emerald-400 ml-1">
                      (New!)
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>
          
          <button
            onClick={onClose}
            className="w-full py-3 px-4 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-xl font-medium hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors"
          >
            Play Again
          </button>
        </div>
      </div>
    </div>
  );
};

export default WinModal;
