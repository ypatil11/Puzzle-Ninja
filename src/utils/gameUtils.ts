
// Game constants
export const TARGET_SEQUENCE = "80139522";
export const EMPTY_TILE = " "; // Empty space representation

/**
 * Shuffles an array using the Fisher-Yates algorithm
 */
export function shuffleArray<T>(array: T[]): T[] {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}

/**
 * Creates an initial shuffled sequence for sliding puzzle
 * Ensures the sequence is solvable and not already in the winning state
 */
export function createInitialSequence(): string[] {
  // Add digits from target sequence plus an empty space
  const targetDigits = TARGET_SEQUENCE.split("");
  const sequenceWithEmpty = [...targetDigits, EMPTY_TILE];
  
  let shuffled: string[];
  let attempts = 0;
  
  // Keep shuffling until we get a solvable sequence different from the target
  do {
    shuffled = shuffleArray(sequenceWithEmpty);
    attempts++;
    // Prevent infinite loop if we're unlucky
    if (attempts > 100) {
      // Fall back to a known solvable state
      shuffled = [...targetDigits, EMPTY_TILE];
      shuffled.splice(3, 0, shuffled.pop()!);
      break;
    }
  } while (!isSolvable(shuffled) || isWinningState(shuffled));
  
  return shuffled;
}

/**
 * Checks if the puzzle is in a winning state
 * The empty space should be at the end in the winning state
 */
export function isWinningState(sequence: string[]): boolean {
  // The winning sequence should have the TARGET_SEQUENCE followed by the empty space
  const targetWithEmpty = TARGET_SEQUENCE.split("").concat([EMPTY_TILE]);
  return sequence.join("") === targetWithEmpty.join("");
}

/**
 * Determines if a sliding puzzle configuration is solvable
 * For a 3x3 puzzle, the number of inversions plus the row of the empty space (from bottom) must be even
 */
export function isSolvable(sequence: string[]): boolean {
  // Count inversions in the sequence (excluding the empty tile)
  const sequenceWithoutEmpty = sequence.filter(item => item !== EMPTY_TILE);
  let inversions = 0;
  
  for (let i = 0; i < sequenceWithoutEmpty.length - 1; i++) {
    for (let j = i + 1; j < sequenceWithoutEmpty.length; j++) {
      if (parseInt(sequenceWithoutEmpty[i]) > parseInt(sequenceWithoutEmpty[j])) {
        inversions++;
      }
    }
  }
  
  // Find position of empty tile
  const emptyIndex = sequence.indexOf(EMPTY_TILE);
  // Calculate row from bottom (0-indexed)
  const emptyRow = Math.floor(emptyIndex / 3);
  
  // For 3x3 puzzles, puzzle is solvable if:
  // - Empty space is on an even row from the bottom and inversions is odd, or
  // - Empty space is on an odd row from the bottom and inversions is even
  return (emptyRow % 2 === 0 && inversions % 2 === 1) || 
         (emptyRow % 2 === 1 && inversions % 2 === 0);
}

/**
 * Checks if the current sequence matches the win condition
 */
export function checkWinCondition(sequence: string[]): boolean {
  return isWinningState(sequence);
}

/**
 * Formats time in seconds to mm:ss format
 */
export function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
}

/**
 * Gets adjacent indexes to a specific position in a 3x3 grid
 */
export function getAdjacentIndexes(index: number): number[] {
  const row = Math.floor(index / 3);
  const col = index % 3;
  
  const adjacent: number[] = [];
  
  // Check up
  if (row > 0) adjacent.push(index - 3);
  // Check down
  if (row < 2) adjacent.push(index + 3);
  // Check left
  if (col > 0) adjacent.push(index - 1);
  // Check right
  if (col < 2) adjacent.push(index + 1);
  
  return adjacent;
}

/**
 * Checks if a move is valid (tile is adjacent to empty space)
 */
export function isValidMove(tileIndex: number, emptyIndex: number): boolean {
  const adjacentToEmpty = getAdjacentIndexes(emptyIndex);
  return adjacentToEmpty.includes(tileIndex);
}

/**
 * Moves a tile to the empty space if it's a valid move
 */
export function moveTile(sequence: string[], tileIndex: number): string[] {
  const emptyIndex = sequence.indexOf(EMPTY_TILE);
  
  if (isValidMove(tileIndex, emptyIndex)) {
    const newSequence = [...sequence];
    // Swap tile with empty space
    [newSequence[tileIndex], newSequence[emptyIndex]] = [newSequence[emptyIndex], newSequence[tileIndex]];
    return newSequence;
  }
  
  // Return unchanged sequence if move is invalid
  return sequence;
}

/**
 * Gets a color for a tile based on its number
 */
export function getTileColor(number: string, isDarkMode: boolean): string {
  if (number === EMPTY_TILE) return "";
  
  const colors = {
    light: [
      "bg-blue-100 text-blue-900 hover:bg-blue-200", // 8
      "bg-amber-100 text-amber-900 hover:bg-amber-200", // 0
      "bg-emerald-100 text-emerald-900 hover:bg-emerald-200", // 1
      "bg-purple-100 text-purple-900 hover:bg-purple-200", // 3
      "bg-rose-100 text-rose-900 hover:bg-rose-200", // 9
      "bg-cyan-100 text-cyan-900 hover:bg-cyan-200", // 5
      "bg-fuchsia-100 text-fuchsia-900 hover:bg-fuchsia-200", // 2
      "bg-orange-100 text-orange-900 hover:bg-orange-200", // 2 (second 2)
      "bg-teal-100 text-teal-900 hover:bg-teal-200", // empty
    ],
    dark: [
      "bg-blue-900 text-blue-100 hover:bg-blue-800", // 8
      "bg-amber-900 text-amber-100 hover:bg-amber-800", // 0
      "bg-emerald-900 text-emerald-100 hover:bg-emerald-800", // 1
      "bg-purple-900 text-purple-100 hover:bg-purple-800", // 3
      "bg-rose-900 text-rose-100 hover:bg-rose-800", // 9
      "bg-cyan-900 text-cyan-100 hover:bg-cyan-800", // 5
      "bg-fuchsia-900 text-fuchsia-100 hover:bg-fuchsia-800", // 2
      "bg-orange-900 text-orange-100 hover:bg-orange-800", // 2 (second 2)
      "bg-teal-900 text-teal-100 hover:bg-teal-800", // empty
    ]
  };
  
  // Map each number to a color
  const colorMap: {[key: string]: number} = {
    "8": 0,
    "0": 1,
    "1": 2,
    "3": 3,
    "9": 4,
    "5": 5,
    "2": 6
  };
  
  // For the second "2" in the sequence, use a different color index
  const currentSequence = TARGET_SEQUENCE.split("");
  const firstTwoIndex = currentSequence.indexOf("2");
  const secondTwoIndex = currentSequence.indexOf("2", firstTwoIndex + 1);
  
  const colorIndex = colorMap[number] !== undefined ? 
    (number === "2" && parseInt(number) === secondTwoIndex ? 7 : colorMap[number]) : 
    number.charCodeAt(0) % 8;
  
  return isDarkMode ? colors.dark[colorIndex] : colors.light[colorIndex];
}
