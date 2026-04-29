export interface CharState {
  char: string;
  status: "pending" | "correct" | "incorrect" | "cursor";
}

/**
 * Diff typed input against the target snippet char by char.
 * Returns an array of CharState for rendering.
 */
export function diffChars(target: string, typed: string): CharState[] {
  return target.split("").map((char, i) => {
    if (i === typed.length) {
      return { char, status: "cursor" };
    }
    if (i > typed.length) {
      return { char, status: "pending" };
    }
    return {
      char,
      status: typed[i] === char ? "correct" : "incorrect",
    };
  });
}

/**
 * Render CharState[] into an HTML string for the snippet display.
 */
export function renderDiff(states: CharState[]): string {
  return states
    .map(({ char, status }) => {
      const display = char === "\n" ? "\n" : char === " " ? "&nbsp;" : char;
      if (status === "cursor") {
        return `<span class="char cursor">${display}</span>`;
      }
      return `<span class="char ${status}">${display}</span>`;
    })
    .join("");
}
