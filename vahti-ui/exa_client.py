"""Exa AI Search integration for Cancer Strategy Monitor.

Follows the canonical 'build-with-exa' skill specification:
- Uses POST https://api.exa.ai/search
- Recommended request: query + bare contents: {"highlights": True} + type: "auto"
- Supplies 'objective' for LLM search turns
- Pure Python standard library (urllib.request), zero external pip dependencies
"""
import json
import os
import urllib.error
import urllib.request

EXA_SEARCH_URL = "https://api.exa.ai/search"


def get_exa_key() -> str:
    """Read EXA_API_KEY dynamically from environment."""
    return os.environ.get("EXA_API_KEY", "").strip()


def exa_search(
    query: str,
    objective: str | None = None,
    num_results: int | None = None,
    include_domains: list[str] | None = None,
    timeout: int = 15,
) -> list[dict]:
    """Execute an Exa semantic web search.

    Args:
        query: Natural language retrieval intent.
        objective: Goal for this search turn; say which documents should rank first,
                   which should be excluded, and what specific facts or figures to pull.
        num_results: Optional result count limit (defaults to Exa server default 10).
        include_domains: Optional list of domains if hard filtering is needed.
        timeout: Request timeout in seconds.

    Returns:
        List of result dicts containing id, title, url, author, highlights, etc.
    """
    key = get_exa_key()
    if not key:
        return []

    # Canonical request shape per build-with-exa guidance
    payload = {
        "query": query,
        "type": "auto",
        "contents": {
            "highlights": True
        }
    }

    if objective:
        payload["objective"] = objective
    if num_results is not None:
        payload["numResults"] = num_results
    if include_domains:
        payload["includeDomains"] = include_domains

    data = json.dumps(payload).encode("utf-8")
    req = urllib.request.Request(
        EXA_SEARCH_URL,
        data=data,
        headers={
            "Content-Type": "application/json",
            "x-api-key": key,
            "User-Agent": "CancerStrategyMonitor/1.0",
        },
    )

    try:
        with urllib.request.urlopen(req, timeout=timeout) as resp:
            body = json.loads(resp.read().decode("utf-8"))
            return body.get("results", [])
    except urllib.error.HTTPError as e:
        err_msg = e.read().decode("utf-8", errors="ignore")[:300]
        print(f"[Exa] HTTP error {e.code}: {err_msg}")
        return []
    except Exception as e:
        print(f"[Exa] Request error: {e}")
        return []


def format_exa_evidence(results: list[dict]) -> str:
    """Format Exa search results with highlights into grounded context for the LLM."""
    if not results:
        return ""

    lines = [
        "## VERIFIED WEB RESEARCH EVIDENCE (Exa Neural Search):",
        "Base external health policy, international comparisons, and research claims on these verified excerpts. Cite them using [Title](url) markdown links.",
        ""
    ]

    for r in results:
        title = r.get("title") or r.get("url") or "Research Source"
        url = r.get("url") or ""
        author = r.get("author")
        author_str = f" (by {author})" if author else ""
        lines.append(f"### [{title}]({url}){author_str}")

        highlights = r.get("highlights") or []
        if highlights:
            for h in highlights[:2]:
                clean_h = h.strip().replace("\n\n", "\n").replace("\n", "\n> ")
                lines.append(f"> {clean_h}")
        lines.append("")

    return "\n".join(lines).strip()
