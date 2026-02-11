# AGENTS.md - Developer Guide for AI Agents

## Project Overview

**Brian** is a personal knowledge management system with three components:
- **Backend** (Python/FastAPI) - REST API and SQLite database
- **Frontend** (React/Vite) - Web UI with D3.js graph visualization  
- **MCP Server** (Python) - Goose AI assistant integration via Model Context Protocol

## Using Goose with Brian

**Always explicitly enable the Brian extension** when invoking Goose:

```bash
goose run --with-extension "BRIAN_DB_PATH=~/.brian/brian.db BRIAN_LOG_DIR=$(pwd) $(pwd)/venv/bin/python -m brian_mcp.server" -t "your task"
```

This ensures Brian MCP tools are available without depending on config file settings.

**For convenience in examples below, this is shown as:**
```bash
# The full extension command for Brian
EXTENSION="BRIAN_DB_PATH=~/.brian/brian.db BRIAN_LOG_DIR=$(pwd) $(pwd)/venv/bin/python -m brian_mcp.server"
goose run --with-extension "$EXTENSION" -t "task"
```

## Key Architecture Points

### Database
- **SQLite with autocommit mode** (`isolation_level=None`)
- **Schema versioning:** Check `SCHEMA_VERSION` in `brian/database/schema.py`
- **Migrations:** Auto-apply on startup, defined in `brian/database/migrations.py`
- **Primary keys:** TEXT UUIDs, not INTEGER rowids

### Component Separation
- MCP server and REST API share repository code but run in **separate processes**
- Each maintains its own database connection
- Changes to MCP code require restarting Goose

## Key Gotcha: FTS5 with TEXT Primary Keys

SQLite FTS5 with `content='table', content_rowid='rowid'` fails when the table uses TEXT UUIDs instead of INTEGER rowids. Symptom: `sqlite3.OperationalError: no such column: T.item_id` on DELETE/UPDATE.

**Solution (already applied in schema v7):** Use external content mode (`content=''`) with manual trigger sync. Pattern to remember when creating FTS tables in projects using UUID primary keys.

## Common Tasks

### Adding an MCP Tool

**Pattern:** Define in `@server.list_tools()`, implement in `_handle_call_tool_impl()`, use existing global repos.

```python
# In @server.list_tools()
Tool(name="tool_name", description="...", inputSchema={...}),

# In _handle_call_tool_impl()
elif name == "tool_name":
    result = repo.method(arguments["param"])  # repo already initialized
    return [TextContent(type="text", text=json.dumps(result))]
```

Test via Goose (requires restart to reload).

### Database Migration

**Pattern:** Increment version, add migration SQL, update schema definition. Migrations auto-apply on next startup.

```python
# schema.py
SCHEMA_VERSION = N  # Increment

# migrations.py
N: ["ALTER TABLE...", "CREATE INDEX..."]

# schema.py - update SCHEMA_SQL string
```

Test by restarting services (`./stop.sh && ./start.sh`) or calling `db.initialize()`.

### Adding REST Endpoint

**Pattern:** Define route in `brian/api/routes.py`, get repos via `get_repositories()`, use HTTPException for errors.

```python
@router.post("/items/{item_id}/action")
async def action(item_id: str):
    repo, _, _, _, _, _ = get_repositories()
    if not (item := repo.get_by_id(item_id)):
        raise HTTPException(status_code=404, detail="Not found")
    return item.to_dict()
```

## Debugging

**Logs:** `mcp.log`, `backend.log`, `frontend.log` (project dir or ~/.brian/)

**Approach:** Test components in isolation before debugging integration:

```bash
# Test MCP server directly
./venv/bin/python -m brian_mcp.server

# Test backend directly
./venv/bin/python -m brian.main

# Test database operations
./venv/bin/python -c "from brian.database.repository import KnowledgeRepository; \
  from brian.database.connection import Database; \
  repo = KnowledgeRepository(Database('~/.brian/brian.db')); \
  print(len(repo.get_all(limit=5)))"
```

**Common issues:**
- **MCP:** Tool name mismatch between definition and handler, or must restart Goose after code changes
- **Database:** FTS errors with empty queries (use `get_all()` not `search("")`), or locked DB from competing connections
- **Backend:** Port 8080 already in use (`lsof -i :8080`)

## Development Workflow

```bash
./start.sh  # Backend on :8080, Frontend on :5173

# Test changes via appropriate interface
curl http://localhost:8080/api/items  # REST API
EXTENSION="BRIAN_DB_PATH=~/.brian/brian.db BRIAN_LOG_DIR=$(pwd) $(pwd)/venv/bin/python -m brian_mcp.server"
goose run --with-extension "$EXTENSION" -t "test"  # MCP

./stop.sh
```

## Testing

**Pattern:** Test at the layer you're modifying - database changes at repo layer, MCP tools via Goose, REST via curl.

```bash
# Database layer
./venv/bin/python -c "from brian.database.repository import KnowledgeRepository; \
  from brian.database.connection import Database; \
  print(len(KnowledgeRepository(Database('~/.brian/brian.db')).get_all(limit=5)))"

# MCP layer
EXTENSION="BRIAN_DB_PATH=~/.brian/brian.db BRIAN_LOG_DIR=$(pwd) $(pwd)/venv/bin/python -m brian_mcp.server"
goose run --with-extension "$EXTENSION" -t "test tool"

# REST API layer
curl -X POST http://localhost:8080/api/endpoint -d '{"key":"value"}'
```

## Key Patterns

**Repository access:**
- REST API: Call `get_repositories()` in each handler
- MCP: Use global `repo`, `region_repo`, `profile_repo`, `project_repo` (initialized by `init_services()`)

**Error handling:**
- REST API: `raise HTTPException(status_code=404, detail="msg")`
- MCP: Return `TextContent` with `{"error": "msg"}` dict

## Environment

- Python: `./venv/bin/python`
- Frontend: `pnpm` (not npm)
- Database: `~/.brian/brian.db` (override via `BRIAN_DB_PATH`)

## Working Principles

- Read code before making assumptions about implementation
- Check schema version before database operations
- Test each layer independently (DB → API → MCP)
- MCP server uses stdio protocol - log to files, not stderr
