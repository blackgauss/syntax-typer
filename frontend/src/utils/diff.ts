import Prism from "prismjs";
import "prismjs/components/prism-python";
import "prismjs/components/prism-typescript";
import "prismjs/components/prism-javascript";

export interface CharState {
  char: string;
  status: "pending" | "correct" | "incorrect" | "cursor";
}

/**
 * Diff typed input against the target snippet char by char.
 */
export function diffChars(target: string, typed: string): CharState[] {
  return target.split("").map((char, i) => {
    if (i === typed.length) return { char, status: "cursor" };
    if (i > typed.length)  return { char, status: "pending" };
    return { char, status: typed[i] === char ? "correct" : "incorrect" };
  });
}

/**
 * Map a Prism language name to the grammar key.
 */
function prismLang(language: string): string {
  const map: Record<string, string> = {
    typescript: "typescript",
    javascript: "javascript",
    python: "python",
  };
  return map[language.toLowerCase()] ?? "javascript";
}

/**
 * Build a flat char→token map from Prism's tokenization.
 * Each index in the source code maps to a Prism token class (or "").
 */
function buildTokenMap(code: string, language: string): string[] {
  const grammar = Prism.languages[prismLang(language)];
  if (!grammar) return Array(code.length).fill("");

  const tokens = Prism.tokenize(code, grammar);
  const result: string[] = [];

  function walk(token: string | Prism.Token) {
    if (typeof token === "string") {
      for (const _ch of token) result.push("");
    } else {
      const cls = `token ${Array.isArray(token.type) ? token.type.join(" ") : token.type}`;
      const content = Array.isArray(token.content) ? token.content : [token.content];
      content.forEach((child) => {
        if (typeof child === "string") {
          for (const _ch of child) result.push(cls);
        } else {
          walk(child);
        }
      });
    }
  }

  tokens.forEach(walk);
  return result;
}

/**
 * Render the snippet as overlaid spans:
 * - Outer span: Prism token class (colour)
 * - Inner span: typing state (correct / incorrect / pending / cursor)
 */
export function renderDiff(
  states: CharState[],
  language = "typescript"
): string {
  const code = states.map((s) => s.char).join("");
  const tokenMap = buildTokenMap(code, language);

  return states
    .map(({ char, status }, i) => {
      const tokenCls = tokenMap[i] ?? "";
      const typingCls = `char ${status}`;

      // Newlines: render as visible line breaks, not inside a span
      if (char === "\n") {
        return `<span class="${tokenCls}"><span class="${typingCls} newline"> </span></span>\n`;
      }

      const display = char === " " ? "&nbsp;" : char
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");

      return `<span class="${tokenCls}"><span class="${typingCls}">${display}</span></span>`;
    })
    .join("");
}
