import { GuessRow, LetterStatus } from '../types/wordle';

export interface ValidationResult {
  isValid: boolean;
  errorMessage?: string;
}

/**
 * Validates a guess against hard mode rules.
 * In hard mode:
 * - Any revealed green letters must be used in the same position
 * - Any revealed yellow letters must be used somewhere in the word
 */
export function validateHardModeGuess(
  currentGuess: GuessRow,
  previousGuesses: GuessRow[]
): ValidationResult {
  // Get all previous guesses that have been filled
  const filledPreviousGuesses = previousGuesses.filter(row =>
    row.tiles.some(tile => tile.letter && tile.status !== 'empty')
  );

  // If no previous guesses, validation passes
  if (filledPreviousGuesses.length === 0) {
    return { isValid: true };
  }

  // Extract current guess letters
  const currentLetters = currentGuess.tiles.map(tile => tile.letter.toLowerCase());

  // Track required green positions
  const requiredPositions = new Map<number, string>();
  
  // Track required yellow letters
  const requiredLetters = new Set<string>();

  // Analyze all previous guesses
  filledPreviousGuesses.forEach(row => {
    row.tiles.forEach((tile, index) => {
      if (!tile.letter) return;
      
      const letter = tile.letter.toLowerCase();

      if (tile.status === 'correct') {
        // Green letter - must be in same position
        requiredPositions.set(index, letter);
      } else if (tile.status === 'wrong-position') {
        // Yellow letter - must be included somewhere
        requiredLetters.add(letter);
      }
    });
  });

  // Validate green letters (correct positions)
  for (const [position, requiredLetter] of requiredPositions.entries()) {
    if (currentLetters[position] !== requiredLetter) {
      const positionDisplay = position + 1; // 1-indexed for user display
      return {
        isValid: false,
        errorMessage: `${requiredLetter.toUpperCase()} must be in position ${positionDisplay}`,
      };
    }
  }

  // Validate yellow letters (must be included)
  for (const requiredLetter of requiredLetters) {
    if (!currentLetters.includes(requiredLetter)) {
      return {
        isValid: false,
        errorMessage: `Guess must contain ${requiredLetter.toUpperCase()}`,
      };
    }
  }

  return { isValid: true };
}
