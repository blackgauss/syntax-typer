from fastapi import APIRouter
from plugins.manager import PluginManager

router = APIRouter()

# Shared manager instance — imported by main.py
plugin_manager = PluginManager()


@router.get("/")
def list_plugins():
    """List all registered plugins and their status."""
    return plugin_manager.list_info()


@router.post("/{plugin_name}/enable")
def enable_plugin(plugin_name: str):
    for p in plugin_manager.plugins:
        if p.name == plugin_name:
            p.enabled = True
            return {"status": "enabled", "plugin": plugin_name}
    return {"error": f"Plugin '{plugin_name}' not found"}, 404


@router.post("/{plugin_name}/disable")
def disable_plugin(plugin_name: str):
    for p in plugin_manager.plugins:
        if p.name == plugin_name:
            p.enabled = False
            return {"status": "disabled", "plugin": plugin_name}
    return {"error": f"Plugin '{plugin_name}' not found"}, 404
