export interface KeyEvent {
  key: string;
  timestamp: number;
  isCorrection: boolean;
  isSpecial: boolean;
}

export class KeyLogger {
  private log: KeyEvent[] = [];

  attach(container: HTMLElement) {
    const input = container.querySelector<HTMLTextAreaElement>("#typing-input");
    if (!input) return;

    input.addEventListener("keydown", (e: KeyboardEvent) => {
      // Intercept Tab — insert 4 spaces instead of moving focus
      if (e.key === "Tab") {
        e.preventDefault();
        const start = input.selectionStart ?? 0;
        const end = input.selectionEnd ?? 0;
        input.value =
          input.value.substring(0, start) + "    " + input.value.substring(end);
        input.selectionStart = input.selectionEnd = start + 4;
      }

      this.log.push({
        key: e.key,
        timestamp: Date.now(),
        isCorrection: e.key === "Backspace",
        isSpecial: ["Tab", "Enter", "Backspace", "Shift", "Control", "Alt"].includes(e.key),
      });
    });
  }

  getLogs(): KeyEvent[] {
    return [...this.log];
  }

  reset() {
    this.log = [];
  }
}
