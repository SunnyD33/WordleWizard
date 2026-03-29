import { GuessRow } from '../types/wordle';

export interface FilterResult {
  correctPositions: Map<number, string>; // position -> letter
  wrongPositions: Map<string, Set<number>>; // letter -> positions where it can't be
  requiredLetters: Set<string>; // letters that must be in the word
  excludedLetters: Set<string>; // letters that must not be in the word
}

/**
 * Analyzes all guesses to build filtering criteria
 */
export function analyzeGuesses(guesses: GuessRow[]): FilterResult {
  const correctPositions = new Map<number, string>();
  const wrongPositions = new Map<string, Set<number>>();
  const requiredLetters = new Set<string>();
  const excludedLetters = new Set<string>();

  guesses.forEach((row) => {
    row.tiles.forEach((tile, index) => {
      if (!tile.letter) return;

      const letter = tile.letter.toLowerCase();

      if (tile.status === 'correct') {
        correctPositions.set(index, letter);
        requiredLetters.add(letter);
      } else if (tile.status === 'wrong-position') {
        requiredLetters.add(letter);
        if (!wrongPositions.has(letter)) {
          wrongPositions.set(letter, new Set());
        }
        wrongPositions.get(letter)!.add(index);
      } else if (tile.status === 'not-in-word') {
        // Only exclude if the letter isn't marked correct or wrong-position elsewhere
        const isRequiredElsewhere = requiredLetters.has(letter);
        if (!isRequiredElsewhere) {
          excludedLetters.add(letter);
        }
      }
    });
  });

  return {
    correctPositions,
    wrongPositions,
    requiredLetters,
    excludedLetters,
  };
}

/**
 * Filters words based on guess criteria
 */
export function filterWords(wordList: string[], guesses: GuessRow[], hardMode = false): string[] {
  // If no guesses have been made, return empty array
  const hasAnyInput = guesses.some(row => 
    row.tiles.some(tile => tile.letter && tile.status !== 'empty')
  );
  
  if (!hasAnyInput) {
    return [];
  }

  const criteria = analyzeGuesses(guesses);

  return wordList.filter((word) => {
    const lowerWord = word.toLowerCase();

    // Check correct positions (green letters)
    for (const [position, letter] of criteria.correctPositions.entries()) {
      if (lowerWord[position] !== letter) {
        return false;
      }
    }

    // Check required letters (yellow letters must be in word)
    for (const letter of criteria.requiredLetters) {
      if (!lowerWord.includes(letter)) {
        return false;
      }
    }

    // Check wrong positions (yellow letters can't be in specific positions)
    for (const [letter, positions] of criteria.wrongPositions.entries()) {
      for (const position of positions) {
        if (lowerWord[position] === letter) {
          return false;
        }
      }
    }

    // Check excluded letters (gray letters must not be in word)
    for (const letter of criteria.excludedLetters) {
      if (lowerWord.includes(letter)) {
        return false;
      }
    }

    return true;
  });
}

/**
 * Get top N word suggestions
 */
export function getTopSuggestions(wordList: string[], guesses: GuessRow[], limit = 20, hardMode = false): string[] {
  const filtered = filterWords(wordList, guesses, hardMode);
  return filtered.slice(0, limit);
}
