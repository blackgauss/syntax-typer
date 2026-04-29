from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes import snippets, languages, plugins as plugins_route
from routes.plugins import plugin_manager


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: discover and load all plugins
    plugin_manager.discover()
    yield
    # Shutdown: clean up plugins
    plugin_manager.shutdown()


app = FastAPI(title="Syntax Typer API", version="0.2.0", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(snippets.router, prefix="/snippets", tags=["snippets"])
app.include_router(languages.router, prefix="/languages", tags=["languages"])
app.include_router(plugins_route.router, prefix="/plugins", tags=["plugins"])


@app.get("/health")
def health():
    return {
        "status": "ok",
        "plugins_loaded": len(plugin_manager.plugins),
    }
