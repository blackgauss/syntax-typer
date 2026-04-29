from fastapi import APIRouter, HTTPException
from snippets_store.loader import load_snippets

router = APIRouter()


@router.get("/")
def get_snippets():
    return load_snippets()


@router.get("/{snippet_id}")
def get_snippet(snippet_id: str):
    snippets = load_snippets()
    match = next((s for s in snippets if s["id"] == snippet_id), None)
    if not match:
        raise HTTPException(status_code=404, detail="Snippet not found")
    return match
