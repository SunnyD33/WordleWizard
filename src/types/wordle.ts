export type LetterStatus = 'empty' | 'correct' | 'wrong-position' | 'not-in-word';

export interface LetterTile {
  letter: string;
  status: LetterStatus;
}

export interface GuessRow {
  tiles: LetterTile[];
}

export interface GameState {
  guesses: GuessRow[];
  currentRow: number;
  currentTile: number;
}
