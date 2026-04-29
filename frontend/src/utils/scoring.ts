export interface ScoreResult {
  wpmGross: number;
  wpmNet: number;
  accuracy: number;
  corrections: number;
  timeTakenSeconds: number;
  correctChars: number;
  totalChars: number;
}

/**
 * Calculate gross WPM (all keystrokes, no penalty).
 * Standard: 5 keystrokes = 1 word.
 */
export function calcGrossWpm(totalKeystrokes: number, seconds: number): number {
  if (seconds === 0) return 0;
  return Math.round(totalKeystrokes / 5 / (seconds / 60));
}

/**
 * Calculate net WPM (subtract error penalty).
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
export function calcAccuracy(correctChars: number, totalChars: number): number {
  if (totalChars === 0) return 100;
  return (correctChars / totalChars) * 100;
}

/**
 * Build a full ScoreResult from raw session data.
 */
export function buildScore(
  typed: string,
  target: string,
  corrections: number,
  startTime: number,
  endTime: number
): ScoreResult {
  const seconds = (endTime - startTime) / 1000;
  let correctChars = 0;
  for (let i = 0; i < typed.length; i++) {
    if (typed[i] === target[i]) correctChars++;
  }
  return {
    wpmGross: calcGrossWpm(typed.length, seconds),
    wpmNet: calcNetWpm(typed.length, corrections, seconds),
    accuracy: calcAccuracy(correctChars, target.length),
    corrections,
    timeTakenSeconds: seconds,
    correctChars,
    totalChars: target.length,
  };
}
