from abc import ABC


class BasePlugin(ABC):
    """Abstract base class for all Syntax Typer backend plugins.

    To create a plugin:
    1. Create a subdirectory under backend/plugins/<your_plugin>/
    2. Add a plugin.py with a class that inherits BasePlugin
    3. Override any hooks you need — all hooks are optional (no-op by default)
    4. The PluginManager will auto-discover it on startup
    """

    name: str = "base"
    description: str = ""
    enabled: bool = True

    def on_snippet_load(self, snippet: dict) -> dict:
        """Called after a snippet is loaded, before it is sent to the client.
        Override to modify the snippet (e.g. hide code for memory mode).
        """
        return snippet

    def on_result_save(self, result: dict) -> dict:
        """Called after a typing session ends, before the result is saved.
        Override to post-process or enrich result data.
        """
        return result

    def on_startup(self) -> None:
        """Called once when the plugin is first loaded."""

    def on_shutdown(self) -> None:
        """Called when the server is shutting down."""
