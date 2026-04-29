import time
from plugins.base_plugin import BasePlugin

# Seconds the user has to read the snippet before it is hidden.
REVEAL_WINDOW_SECONDS = 5


class MemoryModePlugin(BasePlugin):
    """Memory Mode — shows the snippet briefly, then hides it.

    The snippet code is delivered once in full. After REVEAL_WINDOW_SECONDS
    the frontend should hide the display (enforced via the `memory_mode` flag
    and `reveal_until` epoch timestamp in the response).
    """

    name = "memory_mode"
    description = "Shows snippet briefly then hides it — type from memory."
    enabled = True

    def on_startup(self) -> None:
        print(f"[{self.name}] Plugin active — reveal window: {REVEAL_WINDOW_SECONDS}s")

    def on_snippet_load(self, snippet: dict) -> dict:
        modified = dict(snippet)
        modified["memory_mode"] = True
        modified["reveal_until"] = time.time() + REVEAL_WINDOW_SECONDS
        return modified

    def on_result_save(self, result: dict) -> dict:
        result["memory_mode"] = True
        return result

