"use client";

import { useState, useEffect } from "react";
import { Movie, GameState, GameSettings } from "@/types";
import Button from "./ui/Button";
import AutocompleteInput from "./ui/AutocompleteInput";
import ScoreDisplay from "./ui/ScoreDisplay";
import ThemeToggle from "./ui/ThemeToggle";

interface GameBoardProps {
  movies: Movie[];
  settings: GameSettings;
}

// Fisher-Yates shuffle algorithm
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

// Get random movies by difficulty
function getRandomMoviesByDifficulty(
  movies: Movie[],
  difficulty: string,
  count: number
): Movie[] {
  const filteredMovies = movies.filter((m) => m.difficulty === difficulty);
  return shuffleArray(filteredMovies).slice(0, count);
}

export default function GameBoard({ movies, settings }: GameBoardProps) {
  const [sessionMovies, setSessionMovies] = useState<Movie[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [sessionScore, setSessionScore] = useState(0);
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize session with 15 movies in progressive difficulty
  const initializeSession = () => {
    let filteredMovies = [...movies];

    // Filter by difficulty if not progressive
    if (settings.difficulty !== "progressive") {
      filteredMovies = filteredMovies.filter(
        (m) => m.difficulty === settings.difficulty
      );
    }

    // Get movies based on difficulty setting
    let selectedMovies: Movie[];
    if (settings.difficulty === "progressive") {
      const easyMovies = getRandomMoviesByDifficulty(filteredMovies, "easy", 5);
      const mediumMovies = getRandomMoviesByDifficulty(
        filteredMovies,
        "medium",
        5
      );
      const hardMovies = getRandomMoviesByDifficulty(filteredMovies, "hard", 5);
      selectedMovies = [...easyMovies, ...mediumMovies, ...hardMovies];
    } else {
      selectedMovies = shuffleArray(filteredMovies).slice(0, 15);
    }

    setSessionMovies(selectedMovies);
    setIsInitialized(true);
  };

  useEffect(() => {
    initializeSession();
  }, [movies, settings]);

  const [gameState, setGameState] = useState<GameState>({
    currentMovie: movies[0], // Temporary initial state
    score: 0,
    showHint: false,
    userGuess: "",
    feedback: "",
    isCorrect: false,
    showSolution: false,
  });

  // Update game state when session movies are initialized
  useEffect(() => {
    if (isInitialized && sessionMovies.length > 0) {
      setGameState((prev) => ({
        ...prev,
        currentMovie: sessionMovies[0],
      }));
    }
  }, [isInitialized, sessionMovies]);

  const handleSubmit = () => {
    const isCorrect =
      gameState.userGuess.toLowerCase() ===
      gameState.currentMovie.answer.toLowerCase();
    setGameState((prev) => ({
      ...prev,
      isCorrect,
      feedback: isCorrect ? "Correct! 🎉" : "Try Again! 😅",
      score: isCorrect ? prev.score + 1 : prev.score,
    }));
    if (isCorrect) {
      setSessionScore((prev) => prev + 1);
    }
  };

  const handleNext = () => {
    const nextIndex = currentIndex + 1;

    if (nextIndex >= sessionMovies.length) {
      setGameOver(true);
      return;
    }

    setCurrentIndex(nextIndex);
    setGameState((prev) => ({
      ...prev,
      currentMovie: sessionMovies[nextIndex],
      userGuess: "",
      feedback: "",
      showHint: false,
      isCorrect: false,
      showSolution: false,
    }));
  };

  const handleSkip = () => {
    const nextIndex = currentIndex + 1;

    if (nextIndex >= sessionMovies.length) {
      setGameOver(true);
      return;
    }

    setCurrentIndex(nextIndex);
    setGameState((prev) => ({
      ...prev,
      currentMovie: sessionMovies[nextIndex],
      userGuess: "",
      feedback: "Question Skipped!",
      showHint: false,
      isCorrect: false,
      showSolution: false,
    }));

    // Clear the feedback message after 5 seconds
    setTimeout(() => {
      setGameState((prev) => ({
        ...prev,
        feedback: "",
      }));
    }, 5000);
  };

  const resetGame = () => {
    initializeSession();
    setCurrentIndex(0);
    setGameOver(false);
    setSessionScore(0);
    setGameState({
      currentMovie: sessionMovies[0],
      score: 0,
      showHint: false,
      userGuess: "",
      feedback: "",
      isCorrect: false,
      showSolution: false,
    });
  };

  const toggleHint = () => {
    setGameState((prev) => ({
      ...prev,
      showHint: !prev.showHint,
    }));
  };

  const showSolution = () => {
    setGameState((prev) => ({
      ...prev,
      showSolution: true,
      feedback: `The answer is: ${prev.currentMovie.answer}`,
    }));
  };

  if (gameOver) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 p-4">
        <ThemeToggle />
        <div className="max-w-2xl w-full bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 space-y-6 text-center">
          <h2 className="text-3xl font-bold text-gray-800 dark:text-white">
            Game Over!
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Your final score: {sessionScore}/15
          </p>
          <div className="flex justify-center gap-4">
            <Button onClick={resetGame} variant="success">
              Play Again
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 p-4">
      <ThemeToggle />
      <div className="max-w-2xl w-full bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 space-y-6">
        <div className="flex justify-between items-center">
          <ScoreDisplay score={gameState.score} />
          <div className="text-gray-600 dark:text-gray-300">
            Question {currentIndex + 1}/15
          </div>
        </div>
        <div className="text-6xl text-center mb-8">
          {gameState.currentMovie.emojiPuzzle}
        </div>
        <div className="flex justify-center gap-2 mb-4">
          <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-100 rounded-full text-sm">
            {gameState.currentMovie.difficulty}
          </span>
          <span className="px-3 py-1 bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-100 rounded-full text-sm">
            {gameState.currentMovie.industry}
          </span>
        </div>
        <div className="flex gap-2">
          <AutocompleteInput
            value={gameState.userGuess}
            onChange={(value) =>
              setGameState((prev) => ({ ...prev, userGuess: value }))
            }
            placeholder="Enter movie name..."
            disabled={gameState.isCorrect || gameState.showSolution}
            movies={movies}
          />
          <Button
            onClick={handleSubmit}
            disabled={gameState.isCorrect || gameState.showSolution}
          >
            Submit
          </Button>
        </div>
        <div className="flex gap-2 justify-center">
          {settings.hintsEnabled && (
            <Button onClick={toggleHint} variant="secondary">
              {gameState.showHint ? "Hide Hint" : "Show Hint"}
            </Button>
          )}
          <Button
            onClick={showSolution}
            variant="secondary"
            disabled={gameState.isCorrect || gameState.showSolution}
          >
            Show Solution
          </Button>
          <Button
            onClick={handleSkip}
            variant="secondary"
            disabled={gameState.isCorrect || gameState.showSolution}
          >
            Skip
          </Button>
        </div>
        {settings.hintsEnabled && gameState.showHint && (
          <div className="text-center text-gray-600 dark:text-gray-300">
            <p>Lead Actor: {gameState.currentMovie.leadActor}</p>
            <p>Year: {gameState.currentMovie.year}</p>
          </div>
        )}
        {gameState.feedback && (
          <div
            className={`text-center text-lg font-semibold ${
              gameState.isCorrect
                ? "text-green-600 dark:text-green-400"
                : gameState.showSolution
                ? "text-blue-600 dark:text-blue-400"
                : "text-red-600 dark:text-red-400"
            }`}
          >
            {gameState.feedback}
          </div>
        )}
        {(gameState.isCorrect || gameState.showSolution) && (
          <Button onClick={handleNext} variant="success">
            Next Puzzle
          </Button>
        )}
      </div>
    </div>
  );
}
