export interface Movie {
  emojiPuzzle: string;
  answer: string;
  year: number;
  leadActor: string;
  famousQuote: string;
  difficulty: string;
  industry: string;
}

export interface GameState {
  currentMovie: Movie;
  score: number;
  showHint: boolean;
  userGuess: string;
  feedback: string;
  isCorrect: boolean;
  showSolution: boolean;
}

export interface GameSettings {
  industry: "bollywood" | "hollywood" | "both";
  difficulty: "easy" | "medium" | "hard" | "progressive";
  hintsEnabled: boolean;
}

export interface UserData {
  name: string;
  settings: GameSettings;
}
