import importlib
import os
import pkgutil
from plugins.base_plugin import BasePlugin


class PluginManager:
    """Discovers and manages backend plugins.

    Usage:
        manager = PluginManager()
        manager.discover()           # auto-scan plugins/ subdirectories
        manager.register(MyPlugin()) # or register manually

    Hooks are called in registration order.
    Disabled plugins (enabled=False) are skipped.
    """

    def __init__(self):
        self._plugins: list[BasePlugin] = []

    def discover(self, plugin_dir: str | None = None):
        """Auto-discover plugins by scanning for plugin.py in each subdirectory."""
        if plugin_dir is None:
            plugin_dir = os.path.dirname(__file__)

        for _finder, name, ispkg in pkgutil.iter_modules([plugin_dir]):
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
                        instance = cls()
                        self._plugins.append(instance)
                        instance.on_startup()
                        print(f"[PluginManager] ✓ Loaded: {cls.name} — {cls.description}")
            except (ImportError, AttributeError) as e:
                print(f"[PluginManager] ✗ Failed to load '{name}': {e}")

    def register(self, plugin: BasePlugin):
        """Manually register a plugin instance."""
        self._plugins.append(plugin)
        plugin.on_startup()

    def shutdown(self):
        for plugin in self._plugins:
            plugin.on_shutdown()

    # ── Hook runners ──────────────────────────────────────────────

    def run_on_snippet_load(self, snippet: dict) -> dict:
        for plugin in self._active():
            snippet = plugin.on_snippet_load(snippet)
        return snippet

    def run_on_result_save(self, result: dict) -> dict:
        for plugin in self._active():
            result = plugin.on_result_save(result)
        return result

    def _active(self) -> list[BasePlugin]:
        return [p for p in self._plugins if p.enabled]

    @property
    def plugins(self) -> list[BasePlugin]:
        return list(self._plugins)

    def list_info(self) -> list[dict]:
        return [
            {"name": p.name, "description": p.description, "enabled": p.enabled}
            for p in self._plugins
        ]
