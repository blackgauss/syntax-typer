from plugins.base_plugin import BasePlugin


class MemoryModePlugin(BasePlugin):
    """Removes the code from the snippet after the first view.
    Forces the user to type from memory once the snippet is loaded.
    """

    name = "memory_mode"
    description = "Hides snippet code after first view to test memory recall."

    def on_snippet_load(self, snippet: dict) -> dict:
        # Strip the code — frontend receives metadata only.
        # The actual code is delivered once via WebSocket then cleared.
        modified = dict(snippet)
        modified["code"] = ""
        modified["memory_mode"] = True
        return modified
