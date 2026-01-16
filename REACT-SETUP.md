# 🧠 brian - React Frontend Setup

## 🎨 Beautiful Monochrome Knowledge Base

You now have a stunning React frontend with shadcn/ui components and Framer Motion animations!

---

## 🚀 Quick Start (3 Steps)

### Step 1: Install Frontend Dependencies
```bash
cd /Users/spencermartin/brian/frontend
npm install
```

This will install:
- React 19
- shadcn/ui components
- Tailwind CSS
- Framer Motion
- Zustand
- And more...

### Step 2: Start the Backend
```bash
cd /Users/spencermartin/brian
source venv/bin/activate
python -m brian.main
```

Backend will run at: **http://127.0.0.1:8080**

### Step 3: Start the Frontend (in another terminal)
```bash
cd /Users/spencermartin/brian/frontend
npm run dev
```

Frontend will run at: **http://localhost:3000**

### OR Use the Startup Script (Both at Once)
```bash
cd /Users/spencermartin/brian
./start-brian.sh
```

---

## 🎯 What You'll See

### Monochrome Beauty
- **Pure grayscale design** - No colors, just elegant black, white, and grays
- **Light/Dark mode** - Toggle with the moon/sun icon
- **Smooth transitions** - Everything animates beautifully
- **Modern UI** - Clean, minimalist, professional

### Main Features

#### 1. **Feed View** (Default)
- Grid of animated knowledge cards
- Each card shows:
  - Type emoji (🔗 📝 💻 📄)
  - Title and content preview
  - Tags
  - Vote count with up/down arrows
  - Favorite star
  - Edit and delete buttons (on hover)
- **Filters:**
  - Type: All, Links, Notes, Snippets, Papers
  - Sort: Newest, Recently Updated, Most Voted, Alphabetical
  - Favorites Only toggle
- **Stats Bar:**
  - Total items count
  - Total tags count
  - Total connections count

#### 2. **Time Machine View**
- Coming soon - will show timeline of your knowledge
- Placeholder with animated clock icon

#### 3. **Graph View**
- Coming soon - will show network visualization
- Placeholder with animated network icon

#### 4. **Search**
- Real-time search as you type
- Searches across titles and content
- Keyboard shortcut: **Cmd/Ctrl + K**

#### 5. **Add/Edit Modal**
- Click "Add Knowledge" button or press **Cmd/Ctrl + N**
- Choose type: Link, Note, Snippet, or Paper
- Fill in:
  - Title (required)
  - Content (required, Markdown supported)
  - URL (for links/papers)
  - Language (for snippets)
  - Tags (comma-separated)
- Beautiful slide-in animation

---

## 🎨 Design System

### Monochrome Theme

#### Light Mode Colors
```
Background: Pure white (#FFFFFF)
Foreground: Near black (#0D0D0D)
Cards: Off-white (#FAFAFA)
Primary: Dark gray (#1A1A1A)
Secondary: Light gray (#F0F0F0)
Border: Medium gray (#E6E6E6)
```

#### Dark Mode Colors
```
Background: Near black (#0D0D0D)
Foreground: Off-white (#FAFAFA)
Cards: Dark gray (#141414)
Primary: Light gray (#FAFAFA)
Secondary: Medium dark (#1F1F1F)
Border: Dark border (#262626)
```

### Typography
- **Font**: System font stack (San Francisco on Mac, Segoe UI on Windows)
- **Headings**: Bold, tight tracking
- **Body**: Regular weight, comfortable line height

### Animations
All powered by Framer Motion:
- **Page transitions**: Fade in/out
- **Card entrance**: Staggered with slight scale
- **Hover effects**: Lift cards up 4px
- **Modal**: Scale + fade from center
- **Layout changes**: Smooth position transitions

---

## 🎮 Keyboard Shortcuts

- **Cmd/Ctrl + K**: Focus search bar
- **Cmd/Ctrl + N**: Open "Add Knowledge" modal
- **Escape**: Close modal

---

## 📁 Project Structure

```
brian/
├── frontend/                    # React app
│   ├── src/
│   │   ├── api/                # API client
│   │   │   └── client.js       # Connects to FastAPI
│   │   ├── components/         # React components
│   │   │   ├── ui/            # shadcn/ui base components
│   │   │   │   ├── button.jsx
│   │   │   │   └── card.jsx
│   │   │   ├── Navbar.jsx     # Top navigation
│   │   │   ├── ViewSwitcher.jsx
│   │   │   ├── StatsBar.jsx
│   │   │   ├── FilterBar.jsx
│   │   │   ├── KnowledgeCard.jsx
│   │   │   └── ItemModal.jsx
│   │   ├── views/             # Main views
│   │   │   ├── FeedView.jsx
│   │   │   ├── TimelineView.jsx
│   │   │   └── GraphView.jsx
│   │   ├── store/             # State management
│   │   │   └── useStore.js    # Zustand store
│   │   ├── lib/               # Utilities
│   │   │   └── utils.js
│   │   ├── App.jsx            # Main app
│   │   ├── main.jsx           # Entry point
│   │   └── index.css          # Global styles + theme
│   ├── package.json           # Dependencies
│   ├── vite.config.js         # Vite config
│   ├── tailwind.config.js     # Tailwind config
│   └── components.json        # shadcn/ui config
├── brian/                      # Python backend
│   └── ... (FastAPI app)
└── start-brian.sh             # Startup script
```

---

## 🎯 Next Steps

### 1. Test It Out!
- Create some knowledge items
- Try different types (links, notes, snippets, papers)
- Add tags
- Vote on items
- Toggle favorites
- Search for items
- Switch between light/dark mode

### 2. Customize the Theme
Edit `frontend/src/index.css` to adjust the monochrome shades:

```css
:root {
  --background: 0 0% 100%;  /* Adjust lightness (0-100%) */
  --foreground: 0 0% 5%;    /* Adjust darkness */
  /* ... etc */
}
```

### 3. Add More Components from react-bits-temp
You have access to amazing animations! Copy components from:
```
/Users/spencermartin/react-bits-temp/src/
```

Examples:
- **Text Animations**: Fuzzy, glitch, scramble, gradient effects
- **GSAP Animations**: Scroll-triggered effects
- **Three.js**: 3D visualizations
- **Particle Effects**: Interactive backgrounds

### 4. Build Timeline View
Replace the placeholder in `frontend/src/views/TimelineView.jsx` with:
- Vertical timeline component
- Date navigation (month/year selector)
- Grouped items by date
- Scroll animations

### 5. Build Graph View
Replace the placeholder in `frontend/src/views/GraphView.jsx` with:
- D3.js force-directed graph
- Or React Flow for easier implementation
- Show items as nodes
- Show connections as edges
- Interactive drag and zoom

### 6. Add Markdown Rendering
Install and use:
```bash
npm install react-markdown
```

Then render markdown in `KnowledgeCard.jsx` and item detail views.

### 7. Add Code Syntax Highlighting
Install:
```bash
npm install react-syntax-highlighter
```

Use for code snippets in the content display.

---

## 🐛 Troubleshooting

### Frontend won't start?
```bash
# Clear node_modules and reinstall
cd frontend
rm -rf node_modules package-lock.json
npm install
```

### Backend connection errors?
Make sure backend is running at http://127.0.0.1:8080
```bash
cd /Users/spencermartin/brian
source venv/bin/activate
python -m brian.main
```

### Port already in use?
Change the port in `frontend/vite.config.js`:
```js
server: {
  port: 3001,  // Change from 3000
  // ...
}
```

### Theme not working?
Check that `index.css` is imported in `main.jsx` and the theme class is applied to `<html>` element.

---

## 📚 Resources

- **shadcn/ui**: https://ui.shadcn.com/
- **Framer Motion**: https://www.framer.com/motion/
- **Tailwind CSS**: https://tailwindcss.com/
- **Zustand**: https://github.com/pmndrs/zustand
- **Lucide Icons**: https://lucide.dev/
- **React**: https://react.dev/

---

## 🎉 You're All Set!

Your beautiful monochrome knowledge base is ready to use. Start building your second brain with brian! 🧠✨

**Questions or issues?** Check the code comments - everything is well-documented!

---

**Built with ❤️ for your brain**
