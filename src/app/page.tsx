"use client";

import { useGame } from "@/context/GameContext";
import HomeScreen from "@/components/HomeScreen";
import GameBoard from "@/components/GameBoard";
import movies from "@/data/movies.json";

export default function Home() {
  const { userData } = useGame();

  return (
    <main>
      {userData ? (
        <GameBoard
          movies={movies.filter(
            (movie) =>
              userData.settings.industry === "both" ||
              movie.industry === userData.settings.industry
          )}
          settings={userData.settings}
        />
      ) : (
        <HomeScreen />
      )}
    </main>
  );
}
