import importlib
import os
import pkgutil
from plugins.base_plugin import BasePlugin


class PluginManager:
    """Discovers and manages backend plugins."""

    def __init__(self):
        self._plugins: list[BasePlugin] = []

    def discover(self, plugin_dir: str = os.path.dirname(__file__)):
        """Auto-discover plugins by scanning subdirectories for plugin.py files."""
        for finder, name, ispkg in pkgutil.iter_modules([plugin_dir]):
            if not ispkg:
                continue
            try:
                module = importlib.import_module(f"plugins.{name}.plugin")
                for attr in dir(module):
                    cls = getattr(module, attr)
                    if (
                        isinstance(cls, type)
                        and issubclass(cls, BasePlugin)
                        and cls is not BasePlugin
                    ):
                        self._plugins.append(cls())
                        print(f"[PluginManager] Loaded plugin: {cls.name}")
            except (ImportError, AttributeError) as e:
                print(f"[PluginManager] Failed to load plugin '{name}': {e}")

    def register(self, plugin: BasePlugin):
        """Manually register a plugin instance."""
        self._plugins.append(plugin)

    def run_on_snippet_load(self, snippet: dict) -> dict:
        for plugin in self._plugins:
            snippet = plugin.on_snippet_load(snippet)
        return snippet

    def run_on_result_save(self, result: dict) -> dict:
        for plugin in self._plugins:
            result = plugin.on_result_save(result)
        return result

    @property
    def plugins(self) -> list[BasePlugin]:
        return list(self._plugins)
