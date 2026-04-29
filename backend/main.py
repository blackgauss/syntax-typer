from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes import snippets, languages

app = FastAPI(title="Syntax Typer API", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(snippets.router, prefix="/snippets", tags=["snippets"])
app.include_router(languages.router, prefix="/languages", tags=["languages"])


@app.get("/health")
def health():
    return {"status": "ok"}
