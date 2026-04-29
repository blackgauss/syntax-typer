import { KeyLogger } from "./KeyLogger";
import { ResultsPanel } from "./ResultsPanel";
import { fetchSnippet, Snippet } from "../api/client";
import { diffChars, renderDiff } from "../utils/diff";
import { buildScore } from "../utils/scoring";
import { pluginManager } from "../plugins/PluginManager";

export class TypingTest {
  private container: HTMLElement;
  private keyLogger = new KeyLogger();
  private resultsPanel: ResultsPanel | null = null;
  private snippet: Snippet | null = null;
  private startTime: number | null = null;
  private corrections = 0;
  private finished = false;

  constructor(container: HTMLElement) {
    this.container = container;
  }

  async init() {
    this.snippet = await fetchSnippet();
    this.render();
    this.keyLogger.attach(this.container);
    this.resultsPanel = new ResultsPanel(
      this.container.querySelector<HTMLElement>("#results")!
    );

    pluginManager.triggerTestStart(this.snippet);

    const input = this.container.querySelector<HTMLTextAreaElement>("#typing-input")!;
    input.addEventListener("input", () => this.onInput(input));
  }

  private onInput(input: HTMLTextAreaElement) {
    if (this.finished || !this.snippet) return;

    const typed = input.value;
    const target = this.snippet.code;

    // Start the timer on first character
    if (typed.length >= 1 && this.startTime === null) {
      this.startTime = Date.now();
    }

    // Running correction count
    this.corrections = this.keyLogger.getLogs().filter((e) => e.isCorrection).length;

    // Live diff render
    const states = diffChars(target, typed);
    const display = this.container.querySelector<HTMLPreElement>("#snippet-display")!;
    display.innerHTML = renderDiff(states);

    pluginManager.triggerKeyPress(typed[typed.length - 1] ?? "", Date.now());

    // Completion check
    if (typed === target) {
      this.finish(typed, target);
    }
  }

  private finish(typed: string, target: string) {
    this.finished = true;
    const score = buildScore(typed, target, this.corrections, this.startTime!, Date.now());

    this.resultsPanel?.render(score);
    pluginManager.triggerTestEnd(score);

    const input = this.container.querySelector<HTMLTextAreaElement>("#typing-input")!;
    input.disabled = true;

    const retry = document.createElement("button");
    retry.textContent = "Try Again";
    retry.className = "btn-retry";
    retry.addEventListener("click", () => this.reset());
    this.container.querySelector("#results")!.appendChild(retry);
  }

  private async reset() {
    this.finished = false;
    this.startTime = null;
    this.corrections = 0;
    this.keyLogger.reset();
    this.snippet = await fetchSnippet();
    this.render();
    this.keyLogger.attach(this.container);
    this.resultsPanel = new ResultsPanel(
      this.container.querySelector<HTMLElement>("#results")!
    );
    const input = this.container.querySelector<HTMLTextAreaElement>("#typing-input")!;
    input.addEventListener("input", () => this.onInput(input));
    pluginManager.triggerTestStart(this.snippet);
  }

  private render() {
    if (!this.snippet) return;
    const states = diffChars(this.snippet.code, "");
    this.container.innerHTML = `
      <header>
        <h1>Syntax Typer</h1>
      </header>
      <main>
        <div class="snippet-meta">
          <span class="snippet-title">${this.snippet.title}</span>
          <span class="snippet-lang">${this.snippet.language}</span>
          <span class="snippet-diff">${this.snippet.difficulty}</span>
        </div>
        <pre id="snippet-display">${renderDiff(states)}</pre>
        <textarea
          id="typing-input"
          autocomplete="off"
          autocorrect="off"
          autocapitalize="off"
          spellcheck="false"
          placeholder="Start typing..."
        ></textarea>
        <div id="results"></div>
      </main>
    `;
  }
}
