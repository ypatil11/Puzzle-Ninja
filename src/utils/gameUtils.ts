// Game constants
export const TARGET_SEQUENCE = "80139522";

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
 * Creates an initial shuffled sequence of numbers
 * Ensures the sequence is not already in the winning state
 */
export function createInitialSequence(): string[] {
  const targetDigits = TARGET_SEQUENCE.split("");
  let shuffled: string[];
  
  // Keep shuffling until we get a sequence different from the target
  do {
    shuffled = shuffleArray(targetDigits);
  } while (shuffled.join("") === TARGET_SEQUENCE);
  
  return shuffled;
}

/**
 * Checks if the current sequence matches the target sequence
 */
export function checkWinCondition(sequence: string[]): boolean {
  return sequence.join("") === TARGET_SEQUENCE;
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
 * Swaps two elements in an array and returns a new array
 */
export function swapElements<T>(array: T[], index1: number, index2: number): T[] {
  const newArray = [...array];
  [newArray[index1], newArray[index2]] = [newArray[index2], newArray[index1]];
  return newArray;
}
