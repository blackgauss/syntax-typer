import { KeyLogger } from "./KeyLogger";
import { fetchSnippet } from "../api/client";

export class TypingTest {
  private container: HTMLElement;
  private keyLogger: KeyLogger;

  constructor(container: HTMLElement) {
    this.container = container;
    this.keyLogger = new KeyLogger();
  }

  async init() {
    const snippet = await fetchSnippet();
    this.render(snippet);
    this.keyLogger.attach(this.container);
  }

  private render(snippet: { title: string; code: string }) {
    this.container.innerHTML = `
      <header>
        <h1>Syntax Typer</h1>
      </header>
      <main>
        <div class="snippet-meta">
          <span class="snippet-title">${snippet.title}</span>
        </div>
        <pre id="snippet-display">${snippet.code}</pre>
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
