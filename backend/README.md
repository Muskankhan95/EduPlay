# 🎮 EduPlay: UnityLearn — Backend REST API Server

A modular, production-ready Node.js & Express REST API server providing full backend support for the **EduPlay: UnityLearn** gamified learning platform frontend running at `http://localhost:5173`.

---

## ⚡ Quick Start

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Start the Server
* **Development (auto-reload on save)**:
  ```bash
  npm run dev
  ```
* **Production**:
  ```bash
  npm start
  ```

Server will run on: [http://localhost:5000](http://localhost:5000)  
Health Check: [http://localhost:5000/api/health](http://localhost:5000/api/health)

Run the frontend from the project root with `npm run dev` in a separate terminal. For a separately hosted frontend, set `CLIENT_ORIGIN` in the backend environment and `VITE_API_URL` in the frontend environment.

---

## 🛠️ Tech Stack & Architecture

- **Runtime**: Node.js (ES Modules)
- **Framework**: Express.js
- **Security**: JWT (`jsonwebtoken`) + Password Hashing (`bcryptjs`)
- **CORS**: Configured for the frontend origin in `CLIENT_ORIGIN` (defaults to `http://localhost:5173`). Local Vite development proxies `/api` requests to this server.
- **Logging**: Morgan HTTP logger
- **Persistence**: High-performance atomic JSON database engine (`src/db/jsonDb.js`) stored in `src/data/`. Zero external database daemons required — persistent across restarts, lightweight, and Git-friendly.

---

## 📂 Project Structure

```
backend/
├── package.json
├── .env
├── server.js                        # Main Express app & route mounting
└── src/
    ├── config/
    │   └── index.js                 # Environment config & secrets
    ├── db/
    │   ├── jsonDb.js                # Async thread-safe JSON DB engine
    │   └── seedData.js              # Initial seed data for users, courses, badges
    ├── middleware/
    │   ├── auth.js                  # JWT verification & demo user fallback
    │   └── errorHandler.js          # Unified 404 & error handlers
    ├── controllers/
    │   ├── authController.js        # Register, login, demo-login, forgot-password
    │   ├── userController.js        # Profiles, preferences, XP, streak engine
    │   ├── courseController.js      # Courses, curriculum, lesson completions
    │   ├── quizController.js        # Target Blaster/EduQuest results & adaptive AI
    │   ├── dailyChallengeController.js # Daily logic quests & streak rewards
    │   ├── leaderboardController.js # Diamond League rankings
    │   ├── badgeController.js       # Badge unlock system & milestones
    │   ├── analyticsController.js   # Weekly hours, skill radar, accuracy history
    │   ├── notificationController.js# Real-time event notifications
    │   ├── gameController.js        # Question banks & mini-game mechanics
    │   └── learningPathController.js# Milestone skill trees
    └── routes/                      # Express route definitions
```

---

## 📡 API Endpoints Reference

### 🔐 Authentication (`/api/auth`)
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/auth/register` | Register new user with starter XP bonus |
| `POST` | `/api/auth/login` | Login with email and password |
| `POST` | `/api/auth/demo-login` | Instant 1-click login as Alex Morgan (Lv. 7) |
| `POST` | `/api/auth/forgot-password` | Request password reset token |
| `GET` | `/api/auth/me` | Fetch authenticated user data (JWT required) |

### 👤 User & Gamification (`/api/user`)
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/user/profile/:id?` | Get user profile stats, badges, and league |
| `PUT` | `/api/user/profile` | Update profile bio, avatar, and role |
| `PUT` | `/api/user/preferences` | Update sound/confetti/theme settings |
| `POST` | `/api/user/add-xp` | Award XP, auto-calculate level-ups & notifications |
| `POST` | `/api/user/streak` | Increment unbroken daily streak |
| `POST` | `/api/user/reset-demo` | Reset demo account back to default state |

### 📚 Courses & Curriculum (`/api/courses`)
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/courses` | List courses with `?category`, `?difficulty`, `?search` |
| `GET` | `/api/courses/:id` | Get full course syllabus, modules, and lessons |
| `POST` | `/api/courses/:courseId/lessons/:lessonId/complete` | Complete lesson, track progress & award XP |
| `POST` | `/api/courses/:id/enroll` | Enroll in course |

### 🎯 Quizzes & Adaptive Learning (`/api/quiz`)
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/quiz/complete` | Record quiz results, calculate accuracy & update adaptive weaknesses |
| `GET` | `/api/quiz/adaptive-recommendations` | Get personalized weak-topic recommendations |
| `GET` | `/api/quiz/history` | View recent quiz and game attempts |

### 🔥 Daily Challenge (`/api/daily-challenge`)
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/daily-challenge` | Retrieve active daily coding challenge |
| `POST` | `/api/daily-challenge/submit` | Submit answer (`{ optionId }`), award XP & streak |

### 🏆 Leaderboards & Achievements
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/leaderboard?league=Diamond` | Diamond League live rankings |
| `GET` | `/api/badges` | 25 Collector badges & unlock progression |
| `POST` | `/api/badges/:id/unlock` | Unlock specific achievement |

### 📊 Cognitive Analytics & Notifications
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/analytics` | Analytics summary |
| `GET` | `/api/analytics/weekly` | Weekly study hours & XP velocity |
| `GET` | `/api/analytics/skills` | Radar competency breakdown |
| `GET` | `/api/analytics/accuracy` | 6-week quiz accuracy progression |
| `GET` | `/api/notifications` | User alerts and level-up notifications |
| `PUT` | `/api/notifications/:id/read` | Mark notification as read |
| `PUT` | `/api/notifications/read-all` | Mark all notifications read |

---

## 🧪 Testing with curl or PowerShell

```powershell
# Health check
Invoke-RestMethod -Uri "http://localhost:5000/api/health"

# Get courses
Invoke-RestMethod -Uri "http://localhost:5000/api/courses"

# 1-Click Demo Login
Invoke-RestMethod -Method Post -Uri "http://localhost:5000/api/auth/demo-login"

# Submit Daily Challenge
$body = @{ optionId = 'opt-1' } | ConvertTo-Json
Invoke-RestMethod -Method Post -Uri "http://localhost:5000/api/daily-challenge/submit" -ContentType "application/json" -Body $body
```
