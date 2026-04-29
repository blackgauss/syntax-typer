from fastapi import APIRouter
from snippets_store.loader import get_languages

router = APIRouter()


@router.get("/")
def list_languages():
    return get_languages()
