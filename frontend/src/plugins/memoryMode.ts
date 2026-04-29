import { IPlugin } from "./PluginManager";

/**
 * Memory Mode Plugin
 *
 * When the backend returns a snippet with `memory_mode: true` and a
 * `reveal_until` epoch timestamp, this plugin hides the snippet display
 * after the reveal window expires, forcing the user to type from memory.
 */
export const memoryModePlugin: IPlugin = {
  name: "memory_mode",
  description: "Hides the snippet after a short reveal window.",
  enabled: false, // opt-in

  onTestStart(snippet) {
    const s = snippet as Record<string, unknown>;
    if (!s.memory_mode || !s.reveal_until) return;

    const revealUntilMs = (s.reveal_until as number) * 1000;
    const delay = revealUntilMs - Date.now();
    const display = document.getElementById("snippet-display");
    if (!display) return;

    if (delay <= 0) {
      hideDisplay(display);
      return;
    }

    console.log(`[memory_mode] Hiding snippet in ${(delay / 1000).toFixed(1)}s`);
    setTimeout(() => hideDisplay(display), delay);
  },
};

function hideDisplay(el: HTMLElement) {
  el.style.filter = "blur(8px)";
  el.style.userSelect = "none";
  el.style.pointerEvents = "none";
  el.title = "Memory mode — snippet hidden";
  console.log("[memory_mode] Snippet hidden.");
}
