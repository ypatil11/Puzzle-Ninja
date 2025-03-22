
import React from "react";
import GameBoard from "../components/GameBoard";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 md:p-8 overflow-hidden">
      <GameBoard />
      
      <footer className="mt-10 text-xs text-center text-gray-500 dark:text-gray-400 animate-fade-in max-w-md mx-auto" style={{ animationDelay: "0.6s" }}>
        <p>Click tiles adjacent to the empty space to move them. Arrange the numbers in the correct order to win.</p>
      </footer>
    </div>
  );
};

export default Index;
