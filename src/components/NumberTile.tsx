
import React from "react";
import { cn } from "@/lib/utils";
import { EMPTY_TILE, getTileColor } from "../utils/gameUtils";

interface NumberTileProps {
  number: string;
  index: number;
  isCorrect: boolean;
  isAdjacentToEmpty: boolean;
  onClick: (index: number) => void;
  isDarkMode: boolean;
}

const NumberTile: React.FC<NumberTileProps> = ({ 
  number, 
  index, 
  isCorrect, 
  isAdjacentToEmpty, 
  onClick,
  isDarkMode
}) => {
  const isEmpty = number === EMPTY_TILE;
  
  const handleClick = () => {
    if (isAdjacentToEmpty) {
      onClick(index);
    }
  };

  return (
    <div
      className={cn(
        "number-tile flex items-center justify-center font-mono font-bold select-none",
        "text-3xl md:text-4xl lg:text-5xl w-16 h-16 md:w-20 md:h-20 lg:w-24 lg:h-24",
        "rounded-xl shadow-md transition-all duration-300",
        isEmpty ? "invisible" : (isCorrect ? getTileColor(number, isDarkMode) : isDarkMode ? "bg-gray-800 text-white" : "bg-gray-100 text-gray-800"),
        isAdjacentToEmpty && !isEmpty ? "cursor-pointer transform hover:scale-105" : "cursor-default",
        isCorrect && !isEmpty ? "ring-2 ring-green-500 dark:ring-green-400" : "",
      )}
      onClick={handleClick}
      style={{
        transition: "transform 0.2s, opacity 0.2s, background-color 0.3s",
      }}
      aria-label={`Tile ${number}`}
      role="button"
      tabIndex={isEmpty ? -1 : 0}
    >
      {number}
    </div>
  );
};

export default NumberTile;
