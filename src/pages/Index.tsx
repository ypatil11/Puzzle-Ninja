
import React from "react";
import GameBoard from "../components/GameBoard";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 md:p-8">
      <GameBoard />
      
      <footer className="mt-10 text-xs text-center text-gray-500 dark:text-gray-400 animate-fade-in" style={{ animationDelay: "0.6s" }}>
        <p>Drag tiles to arrange them in the correct order. You can also click to select and then click another tile to swap.</p>
      </footer>
    </div>
  );
};

export default Index;
