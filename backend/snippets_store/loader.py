import os
import yaml

SNIPPETS_DIR = os.path.join(os.path.dirname(__file__), "../../snippets")


def load_snippets() -> list[dict]:
    """Load all YAML snippet files from the snippets directory."""
    snippets = []
    for lang in sorted(os.listdir(SNIPPETS_DIR)):
        lang_path = os.path.join(SNIPPETS_DIR, lang)
        if not os.path.isdir(lang_path):
            continue
        for fname in sorted(os.listdir(lang_path)):
            if fname.endswith(".yaml") or fname.endswith(".yml"):
                with open(os.path.join(lang_path, fname)) as f:
                    data = yaml.safe_load(f)
                    if data:
                        snippets.append(data)
    return snippets


def get_languages() -> list[str]:
    """Return a list of language names based on subdirectory names."""
    return [
        d
        for d in sorted(os.listdir(SNIPPETS_DIR))
        if os.path.isdir(os.path.join(SNIPPETS_DIR, d))
    ]
