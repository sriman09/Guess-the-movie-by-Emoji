"use client";

import { useState } from "react";
import { useGame } from "@/context/GameContext";
import { GameSettings } from "@/types";
import Button from "./ui/Button";
import ThemeToggle from "./ui/ThemeToggle";

const defaultSettings: GameSettings = {
  industry: "both",
  difficulty: "progressive",
  hintsEnabled: true,
};

export default function HomeScreen() {
  const { setUserData } = useGame();
  const [name, setName] = useState("");
  const [settings, setSettings] = useState<GameSettings>(defaultSettings);

  const handleStartGame = () => {
    if (!name.trim()) {
      alert("Please enter your name");
      return;
    }
    setUserData({ name, settings });
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 p-4">
      <ThemeToggle />
      <div className="max-w-2xl w-full bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 space-y-6">
        <h1 className="text-4xl font-bold text-center text-gray-800 dark:text-white mb-8">
          Guess the Movie by Emoji
        </h1>

        <div className="space-y-6">
          <div className="space-y-2">
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Enter Your Name
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              placeholder="Your name"
            />
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
              Game Settings
            </h2>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Industry
              </label>
              <select
                value={settings.industry}
                onChange={(e) =>
                  setSettings((prev) => ({
                    ...prev,
                    industry: e.target.value as GameSettings["industry"],
                  }))
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              >
                <option value="both">Both</option>
                <option value="bollywood">Bollywood</option>
                <option value="hollywood">Hollywood</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Difficulty
              </label>
              <select
                value={settings.difficulty}
                onChange={(e) =>
                  setSettings((prev) => ({
                    ...prev,
                    difficulty: e.target.value as GameSettings["difficulty"],
                  }))
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              >
                <option value="progressive">Progressive</option>
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="hints"
                checked={settings.hintsEnabled}
                onChange={(e) =>
                  setSettings((prev) => ({
                    ...prev,
                    hintsEnabled: e.target.checked,
                  }))
                }
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
              />
              <label
                htmlFor="hints"
                className="text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Enable Hints
              </label>
            </div>
          </div>

          <div className="flex justify-center">
            <Button onClick={handleStartGame} variant="success">
              Start Game
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
