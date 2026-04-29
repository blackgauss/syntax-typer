from abc import ABC, abstractmethod


class BasePlugin(ABC):
    """Abstract base class for all Syntax Typer backend plugins."""

    name: str = "base"
    description: str = ""

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
