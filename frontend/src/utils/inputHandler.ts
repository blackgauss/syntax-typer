/**
 * Normalise a raw keydown event value into a printable character
 * or a named special key token.
 */
export function normaliseKey(key: string): string {
  switch (key) {
    case "Enter":
      return "\n";
    case "Tab":
      return "    "; // 4 spaces
    default:
      return key;
  }
}

/**
 * Returns true if the key should be ignored for scoring purposes.
 */
export function isIgnoredKey(key: string): boolean {
  return ["Shift", "Control", "Alt", "Meta", "CapsLock", "Escape",
    "ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown",
    "Home", "End", "PageUp", "PageDown", "Insert",
    "F1","F2","F3","F4","F5","F6","F7","F8","F9","F10","F11","F12",
  ].includes(key);
}
