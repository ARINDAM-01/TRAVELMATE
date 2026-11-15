# TravelMate
> **"Explore More. Plan Smarter. Travel Better."**

TravelMate is an AI-powered full-stack travel planning platform that empowers travelers to discover global destinations, generate personalized itineraries, visualize spatial travel connections through interactive Cytoscape network graphs, explore geographic routes via OpenStreetMap & OSRM, manage trip expenses with Recharts analytics, and organize multi-stop journeys.

---

## 🌟 Key Highlights

- **🤖 AI Itinerary Studio**: Powered by Google Gemini with strict Zod structured output schema validation. Automatically generates morning, afternoon, and evening activities, transportation modes, and estimated budgets.
- **🕸️ Interactive Cytoscape.js Travel Graph**: Model destinations, attractions, hotels, and transit hubs as graph nodes and connections. Execute Dijkstra, A* (with Haversine spatial heuristics), BFS, DFS, and Kruskal's Minimum Spanning Tree (MST).
- **🗺️ Geographic Route Engine**: Leaflet & OpenStreetMap interactive maps with real-world road geometry and distance/duration calculations via the Open Source Routing Machine (OSRM).
- **💰 Budget & Expense Manager**: Log actual vs estimated expenditures, breakdown categories, view daily spending bar charts and category distribution pie charts.
- **🔒 Production-Grade Security**: Bcrypt password hashing (12 salt rounds), JSON Web Tokens (JWT), HTTP-only cookies, Express rate limiters, Helmet security headers, CORS origin whitelisting, and centralized error handling.
- **📱 Dark Glassmorphic Design**: Tailored midnight navy aesthetic (`#07111F`), neon accents (`#3B82F6`, `#22D3EE`, `#8B5CF6`), backdrop blurs, and Framer Motion micro-interactions.

---

## 🏗️ Architecture & Technology Stack

### Frontend
- **Framework**: React 18, Vite
- **Styling**: Tailwind CSS with dark glassmorphic design system
- **Routing**: React Router DOM (v6) with authenticated protected routes and public share links
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Network Graph Visualization**: Cytoscape.js with COSE and preset geometry layouts
- **Maps**: React Leaflet, Leaflet 1.9, OpenStreetMap tiles
- **Charts**: Recharts (Pie and Bar charts)
- **HTTP Client**: Axios with credentials, request/response interceptors

### Backend
- **Runtime**: Node.js (v20+), Express.js
- **Database ORM**: Prisma ORM with PostgreSQL
- **Authentication**: JWT, bcryptjs, HTTP-only cookie support
- **AI Integration**: `@google/generative-ai` (Gemini 1.5 Flash) with server-side validation
- **Routing Engine**: OSRM (Open Source Routing Machine) API integration
- **Security**: Helmet, CORS, Express-Rate-Limit, Zod request body validation

---

## 📁 Project Structure

```
travelmate/
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma       # 13 relational models (User, Trip, GraphNode, etc.)
│   │   └── seed.js             # Realistic demo destinations, attractions & trips
│   ├── src/
│   │   ├── config/             # Environment config and Prisma database client
│   │   ├── controllers/        # Auth, Trips, AI, Graph, Maps, Expenses, Favorites
│   │   ├── middleware/         # Auth verification, rate limiting, error handling
│   │   ├── routes/             # RESTful API route definitions
│   │   ├── services/           # Graph algorithms, Gemini AI, OSRM routing
│   │   ├── utils/              # JWT, standard responses, constants
│   │   ├── validators/         # Zod schemas for input validation
│   │   ├── app.js              # Express application assembly
│   │   └── server.js           # Server listen & graceful shutdown
│   ├── tests/
│   │   └── graphAlgorithms.test.js # Unit test suite for Dijkstra, A*, BFS, DFS, MST
│   ├── package.json
│   └── .env.example
├── frontend/
│   ├── public/                 # Static assets and icons
│   ├── src/
│   │   ├── components/
│   │   │   ├── common/         # Button, Input, Modal, Spinner, Skeletons, EmptyState
│   │   │   └── layout/         # Navbar, Footer, Sidebar
│   │   ├── context/            # AuthContext (login, register, session persistence)
│   │   ├── layouts/            # DashboardLayout with responsive sidebar
│   │   ├── pages/              # Landing, Dashboard, Trips, AIPlanner, Explore, GraphPage, Maps, Budget, Favorites, Settings, SharedTrip
│   │   ├── services/           # Axios API configuration & interceptors
│   │   ├── utils/              # Constants, styles, formatting utilities
│   │   ├── App.jsx             # React Router routing table
│   │   ├── index.css           # Tailwind base, dark glass utilities, Leaflet overrides
│   │   └── main.jsx            # Application root entry
│   ├── package.json
│   ├── tailwind.config.js
│   ├── vite.config.js
│   └── .env.example
└── README.md
```

---

## 🚀 Local Development Setup

### Prerequisites
- Node.js v18 or higher (v20+ recommended)
- npm v9+
- PostgreSQL database instance (local or hosted e.g. Render / Neon / Supabase)

### 1. Backend Configuration
```bash
cd backend
cp .env.example .env
```

Configure your `.env` variables:
```env
PORT=5000
NODE_ENV=development
DATABASE_URL=postgresql://user:password@localhost:5432/travelmate?schema=public
JWT_SECRET=super_secure_travelmate_secret_minimum_32_characters_long
COOKIE_SECRET=secure_cookie_secret_value
GEMINI_API_KEY=your_gemini_api_key_here
FRONTEND_URL=http://localhost:5173
```

Install backend dependencies and generate Prisma client:
```bash
npm install
npx prisma generate
```

Run database migrations and seed realistic demo data:
```bash
npx prisma migrate dev --name init
npm run seed
```

Start the backend API server:
```bash
npm run dev
# Server listens at http://localhost:5000
```

### 2. Frontend Configuration
```bash
cd ../frontend
cp .env.example .env
```

Configure frontend `.env`:
```env
VITE_API_URL=http://localhost:5000/api
```

Install dependencies and start development server:
```bash
npm install
npm run dev
# Frontend runs at http://localhost:5173
```

---

## 🔑 Demo Login Credentials

Once the seed script executes, you can sign in directly:
- **Email**: `demo@travelmate.com`
- **Password**: `Demo123!`

---

## 🌐 API Route Specifications

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `POST` | `/api/auth/register` | Register new user account | No |
| `POST` | `/api/auth/login` | Authenticate and obtain JWT token | No |
| `POST` | `/api/auth/logout` | Invalidate cookie session | Yes |
| `GET` | `/api/auth/me` | Fetch authenticated user profile | Yes |
| `PUT` | `/api/auth/profile` | Update profile preferences and currency | Yes |
| `PUT` | `/api/auth/change-password` | Update account password | Yes |
| `GET` | `/api/trips` | List paginated user trips | Yes |
| `POST` | `/api/trips` | Create new expedition | Yes |
| `GET` | `/api/trips/:id` | Get trip with full itinerary days & activities | Yes |
| `PUT` | `/api/trips/:id` | Update trip attributes | Yes |
| `DELETE` | `/api/trips/:id` | Delete trip record | Yes |
| `POST` | `/api/trips/:id/duplicate` | Duplicate trip and all activities | Yes |
| `GET` | `/api/trips/dashboard` | Aggregated user metrics and upcoming trips | Yes |
| `POST` | `/api/ai/generate-itinerary` | Generate structured AI itinerary via Gemini | Yes |
| `POST` | `/api/ai/save-itinerary` | Save generated itinerary to database | Yes |
| `GET` | `/api/destinations` | Browse & search destinations | No |
| `GET` | `/api/destinations/:id` | Destination details with attractions | No |
| `GET` | `/api/graph/:tripId` | Get Cytoscape nodes and edges for trip | Yes |
| `POST` | `/api/graph/nodes` | Add node to graph network | Yes |
| `PUT` | `/api/graph/nodes/:id` | Update node coordinates or attributes | Yes |
| `DELETE` | `/api/graph/nodes/:id` | Remove node from graph | Yes |
| `POST` | `/api/graph/edges` | Connect two nodes | Yes |
| `DELETE` | `/api/graph/edges/:id` | Remove connection | Yes |
| `POST` | `/api/graph/shortest-path` | Execute Dijkstra, A*, BFS, or DFS pathfinding | Yes |
| `GET` | `/api/graph/:tripId/mst` | Compute Kruskal's Minimum Spanning Tree | Yes |
| `POST` | `/api/map/route` | Calculate road route with OSRM GeoJSON | Yes |
| `GET` | `/api/map/:tripId` | Get trip geographic markers | Yes |
| `GET` | `/api/expenses/:tripId` | Get all trip expenses | Yes |
| `POST` | `/api/expenses` | Log new expense entry | Yes |
| `PUT` | `/api/expenses/:id` | Update expense entry | Yes |
| `DELETE` | `/api/expenses/:id` | Delete expense entry | Yes |
| `GET` | `/api/analytics/:tripId` | Category breakdown & daily spending analytics | Yes |
| `GET` | `/api/favorites` | List user bookmarked destinations | Yes |
| `POST` | `/api/favorites` | Add destination to favorites | Yes |
| `DELETE` | `/api/favorites/:id` | Remove destination from favorites | Yes |
| `POST` | `/api/shared/trips/:id/share`| Generate shareable token | Yes |
| `GET` | `/api/shared/:token` | View public shared trip itinerary | Optional |
| `GET` | `/api/health` | Service health & database connectivity | No |

---

## 🚢 Render Deployment Guide

TravelMate is configured for deployment on Render.

### 1. PostgreSQL Database on Render
1. Create a new **PostgreSQL Database** on Render.
2. Note the Internal and External `DATABASE_URL`.

### 2. Backend Web Service on Render
1. Create a **Web Service** on Render connected to this repository.
2. Configure settings:
   - **Root Directory**: `backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install && npx prisma generate`
   - **Start Command**: `npx prisma migrate deploy && npm start`
3. Add Environment Variables:
   - `NODE_ENV`: `production`
   - `PORT`: `5000`
   - `DATABASE_URL`: *(Your Render PostgreSQL connection string)*
   - `JWT_SECRET`: *(Secure string of 32+ characters)*
   - `COOKIE_SECRET`: *(Secure secret)*
   - `GEMINI_API_KEY`: *(Your Google AI Studio Gemini API key)*
   - `FRONTEND_URL`: *(Your frontend URL on Render)*

### 3. Frontend Static Site on Render
1. Create a **Static Site** on Render connected to this repository.
2. Configure settings:
   - **Root Directory**: `frontend`
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `dist`
3. Add Environment Variables:
   - `VITE_API_URL`: `https://travelmate-3102.onrender.com/api`

---

## 🧪 Automated Testing

### Backend Unit Tests
Run the graph algorithm and API test suite:
```bash
cd backend
npm test
```
The test suite validates:
- **Dijkstra**: Computes exact lowest-weight paths across weighted networks.
- **A***: Evaluates spatial heuristic convergence using Haversine formulas.
- **BFS**: Identifies minimum hop connections across graphs.
- **DFS**: Verifies graph traversal paths.
- **Kruskal's MST**: Computes optimal spanning trees with Disjoint Set Union (DSU).
- **Connected Components**: Identifies subgraphs and disconnected islands.

---

## 📄 License
MIT License. Built for full-stack travel planning and interactive graph exploration.
