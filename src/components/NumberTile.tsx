
import React, { useRef } from "react";
import { useDrag, useDrop } from "react-dnd";

interface NumberTileProps {
  number: string;
  index: number;
  isCorrect: boolean;
  moveNumber: (fromIndex: number, toIndex: number) => void;
}

type DragItem = {
  index: number;
  type: string;
};

const ITEM_TYPE = "number-tile";

const NumberTile: React.FC<NumberTileProps> = ({ number, index, isCorrect, moveNumber }) => {
  const ref = useRef<HTMLDivElement>(null);

  // Setup drag functionality
  const [{ isDragging }, drag] = useDrag({
    type: ITEM_TYPE,
    item: { index } as DragItem,
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  // Setup drop functionality
  const [{ isOver }, drop] = useDrop({
    accept: ITEM_TYPE,
    drop: (item: DragItem) => {
      if (item.index !== index) {
        moveNumber(item.index, index);
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });

  // Combine drag and drop refs
  drag(drop(ref));

  return (
    <div
      ref={ref}
      className={`number-tile text-3xl md:text-4xl lg:text-5xl w-12 h-12 md:w-16 md:h-16 lg:w-20 lg:h-20
        ${isDragging ? "opacity-50" : "opacity-100"}
        ${isOver ? "bg-gray-100 dark:bg-gray-800" : ""}
        ${isCorrect ? "winner-tile" : ""}
      `}
      style={{
        transform: `${isDragging ? "scale(1.05)" : "scale(1)"}`,
        transition: "transform 0.2s, opacity 0.2s, background-color 0.3s",
      }}
    >
      {number}
    </div>
  );
};

export default NumberTile;
