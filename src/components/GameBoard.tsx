
import React, { useState, useEffect, useCallback } from "react";
import { RefreshCw, Moon, Sun } from "lucide-react";
import NumberTile from "./NumberTile";
import WinModal from "./WinModal";
import { Button } from "./ui/button";
import { 
  TARGET_SEQUENCE,
  EMPTY_TILE, 
  createInitialSequence, 
  checkWinCondition, 
  formatTime,
  moveTile,
  isValidMove
} from "../utils/gameUtils";

const GameBoard: React.FC = () => {
  // State
  const [sequence, setSequence] = useState<string[]>(createInitialSequence());
  const [hasWon, setHasWon] = useState<boolean>(false);
  const [time, setTime] = useState<number>(0);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(true);
  const [bestTime, setBestTime] = useState<number | null>(null);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    // Check for user's system preference
    if (typeof window !== 'undefined') {
      return window.matchMedia?.('(prefers-color-scheme: dark)').matches || false;
    }
    return false;
  });
  
  // Apply dark mode class to the body
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);
  
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

  // Handle tile click function
  const handleTileClick = useCallback((index: number) => {
    if (hasWon) return;
    
    setSequence((prevSequence) => moveTile(prevSequence, index));
  }, [hasWon]);

  // Reset game function
  const resetGame = useCallback(() => {
    setSequence(createInitialSequence());
    setHasWon(false);
    setTime(0);
    setIsTimerRunning(true);
  }, []);

  // Toggle dark mode
  const toggleDarkMode = useCallback(() => {
    setIsDarkMode((prev) => !prev);
  }, []);

  // Function to determine if a digit is in the correct position
  const isDigitCorrect = (digit: string, index: number): boolean => {
    // The winning sequence has TARGET_SEQUENCE followed by EMPTY_TILE
    const targetWithEmpty = TARGET_SEQUENCE.split("").concat([EMPTY_TILE]);
    return targetWithEmpty[index] === digit;
  };

  // Find empty space index
  const emptyIndex = sequence.indexOf(EMPTY_TILE);

  // Check if a tile is adjacent to the empty space
  const isAdjacentToEmpty = (index: number): boolean => {
    return isValidMove(index, emptyIndex);
  };

  return (
    <div className="game-container flex flex-col items-center justify-center w-full animate-fade-in">
      {/* Game header */}
      <div className="flex flex-col items-center mb-8 w-full">
        <div className="text-xs uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-1 animate-slide-down">
          Number Puzzle
        </div>
        <h1 className="text-3xl md:text-4xl font-light mb-2 tracking-tight animate-slide-down" style={{ animationDelay: "0.1s" }}>
          Slide to Rearrange
        </h1>
        <p className="text-sm text-gray-600 dark:text-gray-300 text-center max-w-md animate-slide-down" style={{ animationDelay: "0.2s" }}>
          Click tiles next to the empty space to slide them.
        </p>
      </div>
      
      {/* Controls and timer */}
      <div className="flex items-center justify-between w-full max-w-md mb-8 px-4 md:px-0 animate-slide-down" style={{ animationDelay: "0.3s" }}>
        <div className="flex gap-2">
          <Button 
            onClick={resetGame}
            size="icon"
            variant="ghost"
            className="glass"
            aria-label="Reset game"
          >
            <RefreshCw className="w-5 h-5 md:w-6 md:h-6" />
          </Button>
          
          <Button 
            onClick={toggleDarkMode}
            size="icon"
            variant="ghost"
            className="glass"
            aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
          >
            {isDarkMode ? (
              <Sun className="w-5 h-5 md:w-6 md:h-6" />
            ) : (
              <Moon className="w-5 h-5 md:w-6 md:h-6" />
            )}
          </Button>
        </div>
        
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
        <div className="grid grid-cols-3 gap-2 md:gap-3 lg:gap-4">
          {sequence.map((digit, index) => (
            <NumberTile
              key={index}
              number={digit}
              index={index}
              isCorrect={isDigitCorrect(digit, index)}
              isAdjacentToEmpty={isAdjacentToEmpty(index)}
              onClick={handleTileClick}
              isDarkMode={isDarkMode}
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
  );
};

export default GameBoard;
