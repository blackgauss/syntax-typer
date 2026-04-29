/**
 * Calculate gross WPM (all keystrokes, no penalty).
 * Standard: 5 keystrokes = 1 word.
 */
export function calcGrossWpm(totalKeystrokes: number, seconds: number): number {
  if (seconds === 0) return 0;
  return Math.round((totalKeystrokes / 5) / (seconds / 60));
}

/**
 * Calculate net WPM (subtract errors).
 */
export function calcNetWpm(
  totalKeystrokes: number,
  corrections: number,
  seconds: number
): number {
  if (seconds === 0) return 0;
  const gross = totalKeystrokes / 5 / (seconds / 60);
  const errorPenalty = corrections / (seconds / 60);
  return Math.max(0, Math.round(gross - errorPenalty));
}

/**
 * Calculate accuracy as a percentage.
 */
export function calcAccuracy(
  correctChars: number,
  totalChars: number
): number {
  if (totalChars === 0) return 100;
  return (correctChars / totalChars) * 100;
}
