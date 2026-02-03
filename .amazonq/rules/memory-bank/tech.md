# Technology Stack

## Programming Languages
- **JavaScript (ES6+)**: Primary language for both frontend and backend
- **JSX**: React component syntax
- **CSS**: Styling with Tailwind utility classes

## Frontend Technologies

### Core Framework
- **React 19.2.0**: UI library with latest features
- **React DOM 19.2.0**: React rendering for web
- **Vite (rolldown-vite 7.2.5)**: Build tool and dev server with fast HMR

### UI & Styling
- **Tailwind CSS 3.4.17**: Utility-first CSS framework
- **PostCSS 8.5.6**: CSS processing with Autoprefixer
- **clsx 2.1.1**: Conditional class name utility
- **tailwind-merge 3.4.0**: Merge Tailwind classes intelligently

### Authentication
- **@clerk/clerk-react 5.59.4**: User authentication and management

### Routing
- **react-router-dom 7.12.0**: Client-side routing

### Real-Time Communication
- **socket.io-client 4.8.3**: WebSocket client for real-time updates

### Video & AI
- **react-webcam 7.2.0**: Webcam access component
- **@mediapipe/face_mesh 0.4.1633559619**: AI-powered facial detection
- **@mediapipe/camera_utils 0.3.1675466862**: Camera utilities for MediaPipe
- **simple-peer 9.11.1**: WebRTC peer-to-peer connections

### UI Components
- **@heroicons/react 2.2.0**: Icon library

### Development Tools
- **ESLint 9.39.1**: Code linting with React-specific plugins
  - eslint-plugin-react-hooks 7.0.1
  - eslint-plugin-react-refresh 0.4.24
- **@vitejs/plugin-react 5.1.1**: Vite React plugin with Fast Refresh

## Backend Technologies

### Runtime & Framework
- **Node.js**: JavaScript runtime
- **Express.js 4.21.2**: Web application framework

### Database
- **MongoDB**: NoSQL database
- **Mongoose 8.9.5**: MongoDB ODM for data modeling

### Real-Time Communication
- **socket.io 4.8.3**: WebSocket server for bidirectional communication

### Middleware & Utilities
- **cors 2.8.5**: Cross-Origin Resource Sharing
- **dotenv 16.4.7**: Environment variable management

### Development Tools
- **nodemon 3.1.9**: Auto-restart server on file changes

## Build System & Configuration

### Client Build System
- **Vite**: Modern build tool with:
  - Fast HMR (Hot Module Replacement)
  - Optimized production builds
  - ES modules support
  - Plugin-based architecture

### Configuration Files
- `vite.config.js`: Vite build configuration
- `tailwind.config.js`: Tailwind CSS customization
- `postcss.config.js`: PostCSS plugins (Tailwind, Autoprefixer)
- `eslint.config.js`: ESLint rules and plugins

## Development Commands

### Client (Frontend)
```bash
npm run dev      # Start development server (Vite)
npm run build    # Build for production
npm run lint     # Run ESLint
npm run preview  # Preview production build
```

### Server (Backend)
```bash
npm start        # Start production server
npm run dev      # Start development server with nodemon
```

### Quick Start Scripts
- `start-client.bat`: Windows batch script to launch client
- `start-server.bat`: Windows batch script to launch server

## Environment Variables

### Client (.env.local)
- `VITE_CLERK_PUBLISHABLE_KEY`: Clerk authentication key

### Server (.env)
- `PORT`: Server port (default: 5000)
- `MONGO_URI`: MongoDB connection string

## Development Environment
- **Operating System**: Windows (batch scripts provided)
- **Package Manager**: npm
- **Module System**: 
  - Client: ES Modules (type: "module")
  - Server: CommonJS (require/module.exports)

## API Integration Points
- **Clerk API**: User authentication and session management
- **MongoDB Atlas**: Cloud database hosting
- **Socket.io**: Real-time WebSocket communication
- **MediaPipe**: Google's ML solution for face detection

## Browser Requirements
- Modern browsers with WebRTC support
- Webcam access permissions
- JavaScript enabled
- WebSocket support
