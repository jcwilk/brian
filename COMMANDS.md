# 🧠 Brian - Quick Command Reference

## Start the Application

### Terminal 1 - Backend
```bash
cd /Users/spencermartin/brian
source venv/bin/activate
python -m brian.main
```
✅ Backend running at: http://localhost:8000  
📖 API docs at: http://localhost:8000/docs

### Terminal 2 - Frontend
```bash
cd /Users/spencermartin/brian/frontend
npm run dev
```
✅ Frontend running at: http://localhost:5173

## Development Commands

### Frontend

```bash
# Install dependencies (if needed)
npm install

# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linter
npm run lint

# Add shadcn/ui components
npx shadcn@latest add dialog
npx shadcn@latest add dropdown-menu
npx shadcn@latest add select
npx shadcn@latest add textarea
npx shadcn@latest add tabs
```

### Backend

```bash
# Activate virtual environment
source venv/bin/activate

# Install dependencies (if needed)
pip install -r requirements.txt

# Run the server
python -m brian.main

# Run with auto-reload (development)
uvicorn brian.main:create_app --reload --factory

# Run tests (when you add them)
pytest

# Check database
sqlite3 ~/.brian/brian.db
```

## Useful Git Commands

```bash
# Check status
git status

# Create a new branch
git checkout -b feature/your-feature-name

# Stage changes
git add .

# Commit changes
git commit -m "Description of changes"

# Push to remote
git push origin feature/your-feature-name

# View commit history
git log --oneline

# Discard changes
git checkout -- filename
```

## Database Commands

```bash
# Open database
sqlite3 ~/.brian/brian.db

# Inside sqlite3:
.tables                    # List tables
.schema knowledge_items    # Show table schema
SELECT * FROM knowledge_items LIMIT 10;  # Query data
.quit                      # Exit
```

## Quick Testing

### Test Backend API
```bash
# Health check
curl http://localhost:8000/health

# Get all items
curl http://localhost:8000/api/v1/items

# Create an item
curl -X POST http://localhost:8000/api/v1/items \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test Item",
    "content": "This is a test",
    "item_type": "note",
    "tags": ["test"]
  }'

# Search
curl "http://localhost:8000/api/v1/search?q=test"

# Get stats
curl http://localhost:8000/api/v1/stats
```

### Test Frontend
Just open http://localhost:5173 in your browser!

## Troubleshooting

### Port Already in Use

```bash
# Find process using port 8000
lsof -i :8000

# Kill process
kill -9 <PID>

# Or use different port
uvicorn brian.main:create_app --factory --port 8001
```

### Node Modules Issues

```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Python Environment Issues

```bash
# Recreate virtual environment
rm -rf venv
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

### Clear Database (Start Fresh)

```bash
rm ~/.brian/brian.db
python -m brian.main  # Will recreate database
```

## VS Code Tips

### Recommended Extensions
- ESLint
- Tailwind CSS IntelliSense
- Python
- Prettier

### Keyboard Shortcuts
- `Cmd+P` - Quick file open
- `Cmd+Shift+P` - Command palette
- `Cmd+B` - Toggle sidebar
- `Cmd+J` - Toggle terminal
- `Cmd+K Cmd+S` - Keyboard shortcuts reference

## Browser DevTools

### Useful Tabs
- **Console** - See logs and errors
- **Network** - Monitor API calls
- **Application** - View localStorage, cookies
- **Elements** - Inspect DOM and styles

### Console Commands
```javascript
// Clear console
clear()

// View all React components (with React DevTools)
$r

// Copy object to clipboard
copy(object)
```

## Environment Variables

### Frontend (.env)
```env
VITE_API_BASE_URL=http://localhost:8000/api/v1
```

### Backend (config.py or .env)
```env
DEBUG=true
DB_PATH=~/.brian/brian.db
API_HOST=0.0.0.0
API_PORT=8000
```

## Quick Fixes

### Frontend not updating?
```bash
# Hard refresh
Cmd+Shift+R (Mac) / Ctrl+Shift+R (Windows)

# Or clear cache
rm -rf .vite
npm run dev
```

### Tailwind classes not working?
```bash
# Rebuild
npm run dev

# Check tailwind.config.js content paths
```

### API CORS errors?
Check that backend CORS middleware allows frontend origin:
```python
allow_origins=["http://localhost:5173"]
```

## Production Deployment

### Build Frontend
```bash
cd frontend
npm run build
# Output in dist/ folder
```

### Run Backend in Production
```bash
# Use gunicorn or similar
gunicorn brian.main:create_app --factory -w 4 -k uvicorn.workers.UvicornWorker
```

---

**Pro Tip**: Keep this file open in a separate terminal tab for quick reference! 🚀
