# Cursor MCP (RAG)

This repo is registered in the shared [rag-mcp](https://github.com/BranislavDurina/rag-mcp) stack as project `branislavdurina-github-io`.

- **RAG knowledge:** `http://localhost:8001/mcp/branislavdurina-github-io/`
- **Ingest root (in Docker):** `/data/branislavdurina` → `../branislavdurina.github.io`

No `db-explorer` — this is a static site with no application database.

Start or restart the stack from the `rag-mcp` repo, then check ingest:

```bash
docker compose up -d
docker compose logs ingest --tail 30
```

See [docs/MULTI-PROJECT.md](https://github.com/BranislavDurina/rag-mcp/blob/main/docs/MULTI-PROJECT.md) in rag-mcp for full setup details.
