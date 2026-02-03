# Development Guidelines

## Code Quality Standards

### File Structure and Organization
- **ES Modules (Client)**: Use `import/export` syntax for all client-side code
- **CommonJS (Server)**: Use `require/module.exports` for server-side code
- **Single Responsibility**: Each file exports one primary component/function
- **Named Exports**: Use default exports for components, named exports for utilities
- **File Extensions**: `.jsx` for React components, `.js` for utilities and configs

### Code Formatting Patterns
- **Indentation**: 2 spaces (consistent across all files)
- **Line Endings**: CRLF (`\r\n`) for Windows compatibility
- **Trailing Commas**: Used in object literals and arrays
- **Semicolons**: Consistently used in server code, optional in client code
- **String Quotes**: Single quotes for imports, double quotes for JSX attributes
- **Object Syntax**: Shorthand property names where applicable

### Naming Conventions
- **Components**: PascalCase (e.g., `FocusDetector`, `TeacherDashboard`)
- **Files**: Match component names exactly (e.g., `FocusDetector.jsx`)
- **Functions**: camelCase (e.g., `onFocusUpdate`, `onResults`)
- **Constants**: UPPER_SNAKE_CASE for environment variables (e.g., `SOCKET_URL`, `PUBLISHABLE_KEY`)
- **CSS Classes**: Tailwind utility classes with kebab-case
- **Database Models**: PascalCase with Schema suffix (e.g., `SessionSchema`)

### Documentation Standards
- **Inline Comments**: Use `//` for single-line explanations above complex logic
- **Section Comments**: Number and describe major code sections (e.g., `// 1. Setup Middleware`)
- **State Comments**: Document UI states (e.g., `/* STATE 1: NOT LOGGED IN */`)
- **Configuration Comments**: Explain non-obvious config options
- **Minimal Comments**: Code should be self-documenting; comment only when necessary

## Architectural Patterns

### React Component Patterns (5/5 files)
```jsx
// Functional components with hooks
export default function ComponentName() {
  const [state, setState] = useState(initialValue);
  const ref = useRef(null);
  
  useEffect(() => {
    // Side effects
  }, [dependencies]);
  
  return (
    <div className="tailwind-classes">
      {/* JSX content */}
    </div>
  );
}
```

### Configuration Export Pattern (5/5 config files)
```javascript
// ES Module default export for configs
export default {
  // configuration object
}

// Or with defineConfig helper
export default defineConfig({
  // configuration
})
```

### Service Module Pattern (1/1 service file)
```javascript
// Singleton service exports
import io from 'socket.io-client';

const SOCKET_URL = 'http://localhost:5000';

export const socket = io(SOCKET_URL, {
  autoConnect: false,
});
```

### Utility Function Pattern (1/1 utility file)
```javascript
// Named export for reusable utilities
export function utilityName(...inputs) {
  return processedResult;
}
```

## React-Specific Conventions

### Hooks Usage
- **useState**: For component-level state management
- **useEffect**: For side effects, external library initialization, cleanup
- **useRef**: For DOM references and mutable values that don't trigger re-renders
- **useUser**: Clerk hook for authentication state (used in 1/3 page components)

### Component Structure Order
1. Import statements (external libraries first, then local imports)
2. Component function declaration
3. Hooks (useState, useRef, useEffect in that order)
4. Event handlers and helper functions
5. Return statement with JSX

### Conditional Rendering Pattern
```jsx
{!condition ? (
  /* Negative case */
  <Component />
) : (
  /* Positive case */
  <Component />
)}
```

### Props Destructuring
- Destructure props in function parameters: `function Component({ prop1, prop2 })`
- Use callback props with `on` prefix: `onFocusUpdate`, `onResults`

## Styling Conventions

### Tailwind CSS Patterns (4/4 UI files)
- **Utility-First**: Use Tailwind utilities directly in className
- **Responsive Design**: Mobile-first with responsive prefixes
- **Color Palette**: Consistent use of `indigo-*`, `slate-*`, `green-*`, `red-*`
- **Spacing**: Consistent spacing scale (2, 4, 6, 8, 10)
- **Layout**: Flexbox-first approach (`flex`, `items-center`, `justify-center`)

### Common Class Combinations
```jsx
// Buttons
className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-bold hover:bg-indigo-700 transition shadow-md"

// Cards/Containers
className="p-8 bg-white rounded-xl shadow-lg border border-slate-200"

// Text Hierarchy
className="text-5xl font-bold text-indigo-600"  // Headings
className="text-xl text-slate-600"              // Subheadings
className="text-lg text-slate-700"              // Body
```

### Class Name Utility
- Use `cn()` utility from `utils/cn.js` for conditional classes
- Wraps `clsx` for combining class names

## Backend Patterns

### Express Server Structure (1/1 server file)
```javascript
// 1. Imports and initialization
const express = require('express');
require('dotenv').config();

// 2. Middleware setup
app.use(cors({ /* config */ }));
app.use(express.json());

// 3. Database connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ Database Connected"))
  .catch(err => console.error("❌ DB Error:", err));

// 4. Socket.io event handlers
io.on('connection', (socket) => {
  socket.on('event-name', (data) => { /* handler */ });
});

// 5. API routes
app.post('/api/endpoint', async (req, res) => { /* handler */ });

// 6. Server start
server.listen(PORT, () => console.log(`🚀 Server running`));
```

### Mongoose Schema Pattern (1/1 model file)
```javascript
const Schema = new mongoose.Schema({
  field: { type: Type, required: true, unique: true },
  arrayField: [Type],
  defaultField: { type: Type, default: value }
});

module.exports = mongoose.model('ModelName', Schema);
```

### Socket.io Event Naming
- **Kebab-case**: Use hyphens for event names (e.g., `join-room`, `focus-update`)
- **Action-based**: Name events as actions (e.g., `send-question`, `receive-question`)
- **Bidirectional**: Pair send/receive events for clarity

## Error Handling

### API Error Pattern
```javascript
try {
  // Operation
  res.json({ success: true, data });
} catch (error) {
  res.status(500).json({ success: false, error: error.message });
}
```

### Console Logging
- Use emojis for visual distinction: `✅`, `❌`, `⚡`, `🚀`, `🧠`
- Log connection events with socket IDs
- Log errors with descriptive prefixes

## Environment Configuration

### Client Environment Variables
- Prefix with `VITE_`: Required for Vite to expose to client
- Validate presence: Throw error if missing critical keys
- Access via `import.meta.env.VITE_*`

### Server Environment Variables
- Use `dotenv` package with `.env` file
- Access via `process.env.*`
- Provide defaults: `process.env.PORT || 5000`

## Build Configuration

### Vite Configuration
- Use `defineConfig` helper for type safety
- Exclude heavy libraries from pre-bundling: `optimizeDeps.exclude`
- Keep configuration minimal and focused

### ESLint Configuration
- Use flat config format with `defineConfig`
- Extend recommended configs: `js.configs.recommended`
- Add React-specific plugins: `react-hooks`, `react-refresh`
- Custom rules for unused vars: Allow uppercase constants

### PostCSS Configuration
- Minimal plugin setup: `tailwindcss` and `autoprefixer`
- Export as default object

## External Library Integration

### MediaPipe Pattern (1/1 AI component)
```javascript
// Access via window global (loaded in index.html)
const faceMesh = new window.FaceMesh({
  locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`
});

faceMesh.setOptions({ /* config */ });
faceMesh.onResults(callbackFunction);
```

### Clerk Authentication Pattern (2/2 auth files)
```javascript
// Wrap app with provider
<ClerkProvider publishableKey={PUBLISHABLE_KEY}>
  <App />
</ClerkProvider>

// Use hooks in components
const { isSignedIn, user } = useUser();

// SignInButton with redirect
<SignInButton mode="modal" forceRedirectUrl="/path">
  <button>Login</button>
</SignInButton>
```

### React Router Pattern (1/1 routing file)
```javascript
<BrowserRouter>
  <Routes>
    <Route path="/" element={<Component />} />
  </Routes>
</BrowserRouter>
```

## Code Idioms

### Async/Await Pattern
- Always use `async/await` for asynchronous operations
- Wrap in try/catch for error handling
- Use in API routes and database operations

### Destructuring Pattern
- Destructure imports: `import { specific } from 'package'`
- Destructure props: `function Component({ prop })`
- Destructure request body: `const { field } = req.body`

### Ternary for Conditional Rendering
- Use ternary operator for simple conditionals in JSX
- Use logical AND (`&&`) for single condition rendering

### Arrow Functions
- Use arrow functions for callbacks and event handlers
- Use regular functions for component definitions (better stack traces)

## Database Patterns

### Session Code Generation
```javascript
const sessionCode = Math.random().toString(36).substring(2, 8).toUpperCase();
```

### Participant Management
```javascript
if (!session.participants.includes(studentId)) {
  session.participants.push(studentId);
  await session.save();
}
```

## Real-Time Communication

### Socket Connection Pattern
```javascript
// Client: Manual connection control
export const socket = io(URL, { autoConnect: false });
socket.connect(); // When ready

// Server: Room-based broadcasting
socket.join(roomId);
io.to(roomId).emit('event', data);
```

### Event Data Structure
```javascript
// Consistent data shape
{
  roomId: string,
  userId: string,
  status/data: any
}
```
