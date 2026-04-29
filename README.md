# Syntax Typer

A code-pattern typing test. Type over syntax-highlighted snippets and get WPM + accuracy stats. Supports multiple languages, a plug-and-play snippet store, and a plugin system.

---

## Quick Start

```bash
make install   # first time only — installs Python + JS deps
make dev       # runs both servers concurrently
```

- Frontend: http://localhost:5173  
- Backend API: http://localhost:8000  
- API docs: http://localhost:8000/docs  

---

## Requirements

- **Python 3.12+** with [`uv`](https://github.com/astral-sh/uv)
  ```bash
  curl -LsSf https://astral.sh/uv/install.sh | sh
  ```
- **Node 18+** with npm

---

## Commands

```bash
make dev        # run both servers concurrently
make backend    # run backend only  (port 8000)
make frontend   # run frontend only (port 5173)
make install    # install all dependencies
make clean      # remove build artifacts + pycache
```

---

## Adding Snippets

Drop a YAML file into `snippets/<language>/` and restart the backend — it auto-loads on startup.

```yaml
id: py_list_comp
language: python
title: List Comprehension
difficulty: beginner
tags: [lists, comprehension]
code: |
  squares = [x**2 for x in range(10)]
  print(squares)
```

---

## Plugin System

Backend plugins live in `backend/plugins/`. Subclass `BasePlugin` and drop it in a subdirectory — auto-discovered on startup.

```python
from plugins.base_plugin import BasePlugin

class MyPlugin(BasePlugin):
    name = "my_plugin"
    description = "Does something cool."

    def on_snippet_load(self, snippet: dict) -> dict:
        # modify snippet before it reaches the client
        return snippet
```

Place it at `backend/plugins/my_plugin/plugin.py`.

Enable/disable without restarting:
```bash
curl -X POST http://localhost:8000/plugins/my_plugin/enable
curl -X POST http://localhost:8000/plugins/my_plugin/disable
```

### Built-in: Memory Mode

Hides the snippet after a 5-second reveal window — type from memory. Enabled by default. Disable via:
```bash
curl -X POST http://localhost:8000/plugins/memory_mode/disable
```

---

## Project Structure

```
syntax-typer/
├── backend/               # Python + FastAPI
│   ├── main.py
│   ├── routes/            # snippets, languages, plugins
│   ├── plugins/           # base class + auto-discovery + memory_mode
│   └── snippets_store/    # YAML loader
├── frontend/              # TypeScript + Vite
│   └── src/
│       ├── components/    # TypingTest, KeyLogger, ResultsPanel
│       ├── plugins/       # PluginManager, memoryMode
│       └── utils/         # diff, scoring, inputHandler
└── snippets/              # plug-and-play YAML snippet packs
    ├── python/
    └── typescript/
```
