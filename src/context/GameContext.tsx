"use client";

import React, { createContext, useContext, useState } from "react";
import { UserData } from "@/types";

interface GameContextType {
  userData: UserData | null;
  setUserData: (data: UserData) => void;
  resetGame: () => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export function GameProvider({ children }: { children: React.ReactNode }) {
  const [userData, setUserData] = useState<UserData | null>(null);

  const resetGame = () => {
    setUserData(null);
  };

  return (
    <GameContext.Provider value={{ userData, setUserData, resetGame }}>
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error("useGame must be used within a GameProvider");
  }
  return context;
}
