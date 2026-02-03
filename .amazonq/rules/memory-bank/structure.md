# Project Structure

## Directory Organization

### Root Level
```
mini project/
├── client/          # React frontend application
├── server/          # Node.js backend server
├── focus-app/       # Additional application module
├── start-client.bat # Windows script to launch client
└── start-server.bat # Windows script to launch server
```

### Client Application (`/client`)
```
client/
├── public/          # Static assets (vite.svg)
├── src/
│   ├── assets/      # Image and media files (react.svg)
│   ├── components/  # Reusable React components
│   │   ├── features/     # Feature-specific components
│   │   │   ├── ClassroomGrid.jsx    # Grid layout for student videos
│   │   │   ├── VideoPlayer.jsx      # Individual video player
│   │   │   └── VideoPreview.jsx     # Video preview component
│   │   ├── layout/       # Layout components
│   │   │   └── ClassroomLayout.jsx  # Main classroom layout wrapper
│   │   ├── ClassroomLayout.jsx      # Classroom layout (duplicate)
│   │   └── FocusDetector.jsx        # AI focus detection component
│   ├── pages/       # Page-level components (routes)
│   │   ├── Landing.jsx              # Landing/home page
│   │   ├── StudentLobby.jsx         # Student session join page
│   │   └── TeacherDashboard.jsx     # Teacher control panel
│   ├── services/    # External service integrations
│   │   └── socket.js                # Socket.io client configuration
│   ├── utils/       # Utility functions
│   │   └── cn.js                    # Class name utility (tailwind-merge)
│   ├── App.jsx      # Root application component
│   ├── App.css      # Application styles
│   ├── main.jsx     # Application entry point
│   └── index.css    # Global styles (Tailwind imports)
├── eslint.config.js      # ESLint configuration
├── vite.config.js        # Vite build configuration
├── tailwind.config.js    # Tailwind CSS configuration
├── postcss.config.js     # PostCSS configuration
├── package.json          # Client dependencies
└── index.html            # HTML entry point
```

### Server Application (`/server`)
```
server/
├── models/          # Database models
│   └── Session.js   # Session schema (MongoDB)
├── index.js         # Server entry point with Socket.io
├── Session.js       # Session model (duplicate)
├── package.json     # Server dependencies
├── .env             # Environment variables
└── server_log.txt   # Server logs
```

## Core Components and Relationships

### Frontend Architecture
- **Entry Point**: `main.jsx` initializes React with ClerkProvider for authentication
- **Router**: `App.jsx` manages routing between Landing, StudentLobby, and TeacherDashboard
- **Layout System**: ClassroomLayout wraps classroom views with consistent structure
- **Feature Components**: 
  - FocusDetector handles AI-based attention monitoring
  - VideoPlayer/VideoPreview manage video streaming
  - ClassroomGrid displays multiple student feeds
- **Services**: Socket.js manages WebSocket connections to backend

### Backend Architecture
- **Server Core**: Express.js HTTP server with Socket.io for real-time communication
- **Database**: MongoDB with Mongoose ODM for session persistence
- **API Endpoints**:
  - POST `/api/create-session` - Teacher creates new classroom
  - POST `/api/join-session` - Student joins existing classroom
- **Socket Events**:
  - `join-room` - User joins a session room
  - `focus-update` - Student sends focus status
  - `send-question` - Teacher broadcasts question
  - `receive-focus-update` - Broadcast focus changes
  - `receive-question` - Broadcast questions to room

### Data Flow
1. **Authentication**: Clerk handles user authentication on frontend
2. **Session Creation**: Teacher creates session → Backend generates code → Stored in MongoDB
3. **Session Join**: Student enters code → Backend validates → Adds to participants
4. **Real-Time Updates**: Socket.io maintains bidirectional communication
5. **Focus Detection**: MediaPipe analyzes video → Sends updates via Socket.io → Teacher dashboard updates

## Architectural Patterns

### Client-Side Patterns
- **Component-Based Architecture**: React functional components with hooks
- **Feature-Based Organization**: Components grouped by functionality
- **Service Layer**: Separate socket service for backend communication
- **Utility Functions**: Shared helpers in utils directory
- **CSS-in-JS**: Tailwind CSS with utility-first approach

### Server-Side Patterns
- **MVC-Inspired**: Models separate from route handlers
- **Event-Driven**: Socket.io for real-time event handling
- **RESTful API**: HTTP endpoints for session management
- **Middleware Stack**: CORS, JSON parsing, error handling

### Communication Patterns
- **WebSocket**: Real-time bidirectional communication via Socket.io
- **REST API**: HTTP endpoints for session CRUD operations
- **Pub/Sub**: Room-based message broadcasting for classroom events
