# 🧠 brian - Quick Start Guide

## Installation

### Step 1: Navigate to the project
```bash
cd /Users/spencermartin/brian
```

### Step 2: Run the installation script
```bash
./install.sh
```

**OR** install manually:
```bash
# Create virtual environment
python3 -m venv venv

# Activate it
source venv/bin/activate

# Install dependencies
pip install fastapi "uvicorn[standard]" pydantic python-multipart aiofiles
```

## Running brian

### Start the server
```bash
# Make sure you're in the brian directory
cd /Users/spencermartin/brian

# Activate virtual environment
source venv/bin/activate

# Run brian
python -m brian.main
```

The server will start at: **http://127.0.0.1:8080**

Open your browser and go to that URL to use brian! 🎉

## What You'll See

### Three Amazing Views:

1. **📱 Feed View** (Default)
   - Reddit-style cards showing all your knowledge
   - Filter by type: Links 🔗, Notes 📝, Snippets 💻, Papers 📄
   - Sort by date, votes, or alphabetically
   - Favorite items with a star ⭐
   - Vote up/down on items

2. **⏰ Time Machine View**
   - Travel through your knowledge timeline
   - See what you saved on any date
   - Navigate month by month
   - Beautiful visual timeline

3. **🕸️ Graph View**
   - Interactive network visualization
   - See connections between your knowledge
   - Drag nodes around
   - Zoom and explore

## Quick Actions

### Keyboard Shortcuts
- **Cmd/Ctrl + K**: Focus search
- **Cmd/Ctrl + N**: Add new item
- **Escape**: Close modal

### Adding Knowledge
1. Click the "Add Knowledge" button (top right)
2. Choose type: Link, Note, Snippet, or Paper
3. Fill in title and content (Markdown supported!)
4. Add tags (comma-separated)
5. Save!

### Searching
- Use the search bar at the top
- Full-text search across all your knowledge
- Results update as you type

## API Documentation

Once the server is running, visit:
**http://127.0.0.1:8080/docs**

This shows the interactive API documentation (Swagger UI) where you can:
- See all available endpoints
- Test API calls directly
- View request/response schemas

## Database Location

Your knowledge is stored at:
```
~/.brian/brian.db
```

This is a SQLite database file. You can:
- Back it up by copying this file
- Move it to another computer
- Open it with any SQLite browser

## Troubleshooting

### Port already in use?
Edit `brian/config.py` and change the port:
```python
API_PORT = int(os.getenv("BRIAN_PORT", "8081"))  # Change 8080 to 8081
```

### Can't install dependencies?
Try installing them one at a time:
```bash
source venv/bin/activate
pip install fastapi
pip install uvicorn
pip install pydantic
pip install python-multipart
pip install aiofiles
```

### Database errors?
Delete the database and start fresh:
```bash
rm ~/.brian/brian.db
```
Then restart brian - it will create a new database.

## What's Next?

### Immediate Features (Already Built!)
- ✅ Full-text search
- ✅ Tag-based organization
- ✅ Favorites and voting
- ✅ Multiple content types
- ✅ Timeline view
- ✅ Knowledge graph visualization
- ✅ Markdown support
- ✅ RESTful API

### Coming Soon (To Build)
- 🔄 Desktop app wrapper (Electron/Tauri)
- 🔄 Quick capture hotkey
- 🔄 Link metadata extraction
- 🔄 Code syntax highlighting
- 🔄 Export/Import functionality
- 🔄 Browser extension for quick saves

## Architecture

```
brian/
├── brian/                  # Main application package
│   ├── api/               # API routes and endpoints
│   ├── database/          # Database schema and connection
│   ├── models/            # Data models
│   ├── static/            # Frontend assets (CSS, JS)
│   ├── templates/         # HTML templates
│   ├── config.py          # Configuration
│   └── main.py            # Application entry point
├── venv/                  # Virtual environment
├── README.md              # Project overview
├── QUICKSTART.md          # This file!
└── install.sh             # Installation script
```

## Contributing Ideas

Want to extend brian? Here are some ideas:

1. **Add more visualizations**: Heatmaps, word clouds, etc.
2. **Integration with other tools**: Notion, Obsidian, Roam
3. **AI features**: Auto-tagging, summarization, recommendations
4. **Mobile app**: React Native or Flutter
5. **Collaboration**: Share knowledge bases with others
6. **Themes**: Dark mode, custom color schemes
7. **Plugins**: Extension system for custom functionality

## Need Help?

The code is well-documented and follows these patterns:
- **Database**: SQLite with migrations (inspired by Goose)
- **API**: FastAPI with async/await
- **Frontend**: Vanilla JavaScript (no framework overhead)
- **Styling**: Modern CSS with CSS variables for theming

Check the inline comments in the code for more details!

---

**Enjoy building your second brain with brian! 🧠✨**
