import React from "react";

interface ScoreDisplayProps {
  score: number;
}

const ScoreDisplay: React.FC<ScoreDisplayProps> = ({ score }) => {
  return (
    <div className="flex items-center justify-center gap-2">
      <span className="text-2xl font-bold text-gray-800 dark:text-gray-50">
        Score:
      </span>
      <span className="text-3xl font-bold text-blue-600">{score}</span>
    </div>
  );
};

export default ScoreDisplay;
