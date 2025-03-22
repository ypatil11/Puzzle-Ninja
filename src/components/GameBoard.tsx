
import React, { useState, useEffect, useCallback } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { TouchBackend } from "react-dnd-touch-backend";
import { RefreshCw } from "lucide-react";
import NumberTile from "./NumberTile";
import WinModal from "./WinModal";
import { 
  TARGET_SEQUENCE, 
  createInitialSequence, 
  checkWinCondition, 
  swapElements,
  formatTime 
} from "../utils/gameUtils";

// Create a custom backend based on device type
const DndBackend = 'ontouchstart' in window || navigator.maxTouchPoints > 0
  ? TouchBackend
  : HTML5Backend;

const GameBoard: React.FC = () => {
  // State
  const [sequence, setSequence] = useState<string[]>(createInitialSequence());
  const [hasWon, setHasWon] = useState<boolean>(false);
  const [time, setTime] = useState<number>(0);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(true);
  const [bestTime, setBestTime] = useState<number | null>(null);
  
  // Load best time from local storage
  useEffect(() => {
    const savedBestTime = localStorage.getItem("number-puzzle-best-time");
    if (savedBestTime) {
      setBestTime(parseInt(savedBestTime, 10));
    }
  }, []);

  // Check win condition effect
  useEffect(() => {
    if (checkWinCondition(sequence)) {
      setHasWon(true);
      setIsTimerRunning(false);
      
      // Update best time if this run was faster
      if (bestTime === null || time < bestTime) {
        setBestTime(time);
        localStorage.setItem("number-puzzle-best-time", time.toString());
      }
    }
  }, [sequence, time, bestTime]);

  // Timer effect
  useEffect(() => {
    let interval: number | undefined;
    
    if (isTimerRunning) {
      interval = window.setInterval(() => {
        setTime((prevTime) => prevTime + 1);
      }, 1000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTimerRunning]);

  // Move number function (handles drag and drop)
  const moveNumber = useCallback((fromIndex: number, toIndex: number) => {
    setSequence((prevSequence) => swapElements(prevSequence, fromIndex, toIndex));
  }, []);

  // Reset game function
  const resetGame = useCallback(() => {
    setSequence(createInitialSequence());
    setHasWon(false);
    setTime(0);
    setIsTimerRunning(true);
  }, []);

  // Function to determine if a digit is in the correct position
  const isDigitCorrect = (digit: string, index: number): boolean => {
    return TARGET_SEQUENCE[index] === digit && hasWon;
  };

  return (
    <DndProvider backend={DndBackend}>
      <div className="game-container flex flex-col items-center justify-center w-full animate-fade-in">
        {/* Game header */}
        <div className="flex flex-col items-center mb-8 w-full">
          <div className="text-xs uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-1 animate-slide-down">
            Number Puzzle
          </div>
          <h1 className="text-3xl md:text-4xl font-light mb-2 tracking-tight animate-slide-down" style={{ animationDelay: "0.1s" }}>
            Arrange the Sequence
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-300 text-center max-w-md animate-slide-down" style={{ animationDelay: "0.2s" }}>
            Drag the numbers to arrange them in the correct order: <span className="font-mono font-medium">{TARGET_SEQUENCE}</span>
          </p>
        </div>
        
        {/* Controls and timer */}
        <div className="flex items-center justify-between w-full max-w-md mb-8 px-4 md:px-0 animate-slide-down" style={{ animationDelay: "0.3s" }}>
          <button 
            onClick={resetGame}
            className="reset-button glass"
            aria-label="Reset game"
          >
            <RefreshCw className="w-5 h-5 md:w-6 md:h-6" />
          </button>
          
          <div className="timer-container glass px-4 py-2 rounded-full">
            <span>Time: {formatTime(time)}</span>
            {bestTime !== null && (
              <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">
                Best: {formatTime(bestTime)}
              </span>
            )}
          </div>
        </div>
        
        {/* Game board */}
        <div className="glass rounded-2xl p-6 md:p-8 w-full max-w-md animate-scale-in" style={{ animationDelay: "0.4s" }}>
          <div className="grid grid-cols-4 gap-3 md:gap-4">
            {sequence.map((digit, index) => (
              <NumberTile
                key={index}
                number={digit}
                index={index}
                isCorrect={isDigitCorrect(digit, index)}
                moveNumber={moveNumber}
              />
            ))}
          </div>
        </div>
        
        {/* Win modal */}
        <WinModal 
          isOpen={hasWon} 
          onClose={resetGame} 
          time={time} 
          bestTime={bestTime} 
        />
      </div>
    </DndProvider>
  );
};

export default GameBoard;
