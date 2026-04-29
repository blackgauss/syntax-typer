export interface ResultsData {
  wpmGross: number;
  wpmNet: number;
  accuracy: number;
  corrections: number;
  timeTakenSeconds: number;
}

export class ResultsPanel {
  private container: HTMLElement;

  constructor(container: HTMLElement) {
    this.container = container;
  }

  render(data: ResultsData) {
    this.container.innerHTML = `
      <div class="results-panel">
        <h2>Results</h2>
        <ul>
          <li>Gross WPM: <strong>${data.wpmGross}</strong></li>
          <li>Net WPM: <strong>${data.wpmNet}</strong></li>
          <li>Accuracy: <strong>${data.accuracy.toFixed(1)}%</strong></li>
          <li>Corrections: <strong>${data.corrections}</strong></li>
          <li>Time: <strong>${data.timeTakenSeconds.toFixed(1)}s</strong></li>
        </ul>
      </div>
    `;
  }

  clear() {
    this.container.innerHTML = "";
  }
}
