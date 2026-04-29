export interface KeyEvent {
  key: string;
  timestamp: number;
  isCorrection: boolean;
  isSpecial: boolean;
}

type KeyHandler = (event: KeyEvent) => void;

export class KeyLogger {
  private log: KeyEvent[] = [];
  private handlers: KeyHandler[] = [];
  private _input: HTMLTextAreaElement | null = null;

  onKey(handler: KeyHandler) {
    this.handlers.push(handler);
  }

  attach(container: HTMLElement) {
    const input = container.querySelector<HTMLTextAreaElement>("#typing-input");
    if (!input) return;
    this._input = input;
    input.focus();

    const wrapper = container.querySelector<HTMLElement>(".display-wrapper");

    input.addEventListener("focus", () => wrapper?.classList.add("is-focused"));
    input.addEventListener("blur",  () => wrapper?.classList.remove("is-focused"));

    input.addEventListener("keydown", (e: KeyboardEvent) => {
      // Intercept Tab — insert 4 spaces, never shift focus
      if (e.key === "Tab") {
        e.preventDefault();
        const start = input.selectionStart ?? 0;
        const end = input.selectionEnd ?? 0;
        input.value =
          input.value.substring(0, start) + "    " + input.value.substring(end);
        input.selectionStart = input.selectionEnd = start + 4;
        // Manually fire input event so TypingTest.onInput() picks up the change
        input.dispatchEvent(new Event("input", { bubbles: true }));
        "    ".split("").forEach((_, i) =>
          this._emit({ key: " ", timestamp: Date.now() + i, isCorrection: false, isSpecial: false })
        );
        return;
      }

      const event: KeyEvent = {
        key: e.key,
        timestamp: Date.now(),
        isCorrection: e.key === "Backspace",
        isSpecial: ["Enter", "Backspace", "Shift", "Control", "Alt", "Meta"].includes(e.key),
      };
      this._emit(event);
    });
  }

  private _emit(event: KeyEvent) {
    this.log.push(event);
    this.handlers.forEach((h) => h(event));
  }

  getLogs(): KeyEvent[] {
    return [...this.log];
  }

  reset() {
    this.log = [];
    if (this._input) this._input.value = "";
  }
}
