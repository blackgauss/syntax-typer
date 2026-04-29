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
    this.renderLoading();
    try {
      this.snippet = await fetchSnippet();
    } catch (e) {
      this.renderError("Could not reach the backend at http://localhost:8000 — is it running?\n\nRun: make backend");
      return;
    }
    this.render();
    this.keyLogger.attach(this.container);
    this.resultsPanel = new ResultsPanel(
      this.container.querySelector<HTMLElement>("#results")!
    );

    pluginManager.triggerTestStart(this.snippet);

    const input = this.container.querySelector<HTMLTextAreaElement>("#typing-input")!;
    input.addEventListener("input", () => this.onInput(input));

    // Clicking the display focuses the hidden input
    const display = this.container.querySelector<HTMLPreElement>("#snippet-display")!;
    display.addEventListener("click", () => input.focus());

    // Auto-focus on load
    input.focus();
  }

  private renderLoading() {
    this.container.innerHTML = `
      <header><h1>Syntax Typer</h1></header>
      <main><p class="status-msg">Loading snippet…</p></main>
    `;
  }

  private renderError(msg: string) {
    this.container.innerHTML = `
      <header><h1>Syntax Typer</h1></header>
      <main>
        <pre class="status-msg error">${msg}</pre>
        <button class="btn-retry" onclick="location.reload()">Retry</button>
      </main>
    `;
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

    // Live diff render directly into the display
    const states = diffChars(target, typed);
    const display = this.container.querySelector<HTMLPreElement>("#snippet-display")!;
    display.innerHTML = renderDiff(states, this.snippet.language);

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
    input.blur();

    // Mark the display as done
    const display = this.container.querySelector<HTMLPreElement>("#snippet-display")!;
    display.classList.add("is-done");

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
    const display = this.container.querySelector<HTMLPreElement>("#snippet-display")!;
    display.addEventListener("click", () => input.focus());
    input.focus();
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
        <div class="display-wrapper">
          <pre id="snippet-display" tabindex="0">${renderDiff(states, this.snippet.language)}</pre>
          <div class="click-to-focus">Click to focus</div>
          <textarea
            id="typing-input"
            autocomplete="off"
            autocorrect="off"
            autocapitalize="off"
            spellcheck="false"
            tabindex="-1"
            aria-hidden="true"
          ></textarea>
        </div>
        <div id="results"></div>
      </main>
    `;
  }
}
