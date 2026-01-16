#!/bin/bash

# brian startup script - runs both backend and frontend

echo "🧠 Starting brian..."
echo ""

# Check if we're in the right directory
if [ ! -f "brian/main.py" ]; then
    echo "❌ Error: Please run this script from the brian directory"
    exit 1
fi

# Start backend
echo "🔧 Starting FastAPI backend..."
source venv/bin/activate
python -m brian.main &
BACKEND_PID=$!
echo "✅ Backend started (PID: $BACKEND_PID)"

# Wait for backend to be ready
echo "⏳ Waiting for backend to be ready..."
sleep 3

# Start frontend
echo "🎨 Starting React frontend..."
cd frontend
npm run dev &
FRONTEND_PID=$!
echo "✅ Frontend started (PID: $FRONTEND_PID)"

echo ""
echo "🎉 brian is running!"
echo ""
echo "📍 Backend:  http://127.0.0.1:8080"
echo "📍 Frontend: http://localhost:3000"
echo "📍 API Docs: http://127.0.0.1:8080/docs"
echo ""
echo "Press Ctrl+C to stop both servers"
echo ""

# Wait for Ctrl+C
trap "echo ''; echo '🛑 Stopping brian...'; kill $BACKEND_PID $FRONTEND_PID; exit" INT
wait
