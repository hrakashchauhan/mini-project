# FocusAI - Complete Setup and Run Guide

## Issues Fixed:

### 1. **index.html Corruption**
   - FIXED: Removed "cd" command from beginning of file
   - File now starts properly with <!doctype html>

### 2. **App.jsx Routing Issue**
   - FIXED: Replaced incorrect ClassroomLayout implementation with proper React Router
   - Now correctly routes to Landing, TeacherDashboard, and StudentLobby pages

### 3. **Server API Mismatch**
   - FIXED: Server now has correct API endpoints:
     - POST /api/create-session (for teachers)
     - POST /api/join-session (for students)
   - FIXED: Socket events now match client expectations:
     - join-room
     - focus-update / receive-focus-update
     - send-question / receive-question

### 4. **Missing Dependencies**
   - All dependencies already installed:
     - @heroicons/react
     - clsx
     - simple-peer
     - socket.io-client

### 5. **Tailwind Configuration**
   - FIXED: Removed duplicate tailwind.config.js from src/
   - Root tailwind.config.js is properly configured

### 6. **Utils Directory**
   - CREATED: src/utils/cn.js for className utilities

## How to Run:

### Step 1: Start the Server
```bash
cd "d:\mini project\server"
npm run dev
```
Server will start on http://localhost:5000

### Step 2: Start the Client (in a new terminal)
```bash
cd "d:\mini project\client"
npm run dev
```
Client will start on http://localhost:5173

### Step 3: Access the Application
Open your browser and go to: http://localhost:5173

## Application Flow:

1. **Landing Page (/)**: 
   - Sign in as Teacher or Student using Clerk authentication
   - Redirects to /teacher or /student based on selection

2. **Teacher Dashboard (/teacher)**:
   - Click "Start Class" to create a session
   - Get a unique 6-character session code
   - Monitor students in real-time as they join
   - See focus status (FOCUSED/DISTRACTED) for each student
   - Send questions to students

3. **Student Lobby (/student)**:
   - Enter the session code provided by teacher
   - Click "Enter Class" to join
   - AI-powered focus detection starts automatically
   - Focus status sent to teacher in real-time

## Key Features Working:

✅ Clerk Authentication
✅ Session Creation (Teacher)
✅ Session Joining (Student)
✅ Real-time Socket.io Communication
✅ Focus Detection with MediaPipe
✅ Live Student Monitoring
✅ MongoDB Session Storage
✅ Responsive Tailwind UI

## Environment Variables:

### Client (.env.local):
```
VITE_CLERK_PUBLISHABLE_KEY=pk_test_YWxpdmUtc25pcGUtMjQuY2xlcmsuYWNjb3VudHMuZGV2JA
```

### Server (.env):
```
MONGO_URI=mongodb+srv://admin:FocusAI%40123@focusai.ipuz8u8.mongodb.net/?retryWrites=true&w=majority&appName=FocusAI
PORT=5000
```

## Troubleshooting:

### Port 5000 Already in Use:
```bash
netstat -ano | findstr :5000
taskkill /F /PID <PID_NUMBER>
```

### Client Not Connecting to Server:
- Ensure server is running on port 5000
- Check CORS settings allow localhost:5173
- Verify MongoDB connection is successful

### Focus Detection Not Working:
- Allow camera permissions in browser
- Ensure MediaPipe scripts load from CDN
- Check browser console for errors

## Tech Stack:

**Frontend:**
- React 19.2.0
- Vite (rolldown-vite)
- Tailwind CSS 3.4.17
- Clerk Authentication
- Socket.io Client
- MediaPipe Face Mesh
- React Router DOM

**Backend:**
- Node.js + Express
- Socket.io Server
- MongoDB + Mongoose
- CORS enabled

## Project Structure:

```
mini project/
├── client/                 # React frontend
│   ├── src/
│   │   ├── pages/         # Landing, TeacherDashboard, StudentLobby
│   │   ├── components/    # FocusDetector, layouts, features
│   │   ├── services/      # socket.js
│   │   ├── utils/         # cn.js
│   │   ├── App.jsx        # Router configuration
│   │   ├── main.jsx       # Entry point with ClerkProvider
│   │   └── index.css      # Tailwind imports
│   ├── index.html         # HTML entry (FIXED)
│   └── package.json
│
└── server/                # Node.js backend
    ├── models/
    │   └── Session.js     # MongoDB schema
    ├── index.js           # Express + Socket.io server (FIXED)
    ├── .env               # Environment variables
    └── package.json
```

## All Files Corrected:

1. ✅ client/index.html - Removed corruption
2. ✅ client/src/App.jsx - Fixed routing
3. ✅ server/index.js - Complete rewrite with correct API
4. ✅ client/src/utils/cn.js - Created utility file

## Ready to Run!

The application is now fully configured and synchronized. All components, features, and pages are properly integrated and will render correctly.
