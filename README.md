<<<<<<< HEAD
# EduPlay: UnityLearn — Gamified Learning Platform

A modern, responsive, student-focused educational SaaS frontend built with **React 19**, **Vite**, **Tailwind CSS**, **React Router**, **Lucide React**, and **Recharts**.

---

## 🌟 Key Features

### 1. 🚀 Gamified Core Mechanics
* **Dynamic XP & Leveling Engine**: Real-time XP accumulation with rank promotions (`Level 7: Code Conjurer` up to `Level 10: Legendary Grandmaster`).
* **Level-Up Celebrations**: Full-screen modal with particle confetti bursts and Web Audio synthesizer fanfares.
* **Daily Streaks**: Unbroken habit tracking with flame animations and streak protection shields.
* **Collector Badges**: 25 collectible achievement badges categorized by *Streaks*, *Learning*, *Mastery*, and *Special* (including progress tracking for locked badges).
* **Weekly Diamond Leagues**: Top 3 interactive podium display with crowns, rank promotions, and division standings.
* **Sound Effects Synthesizer**: Asset-free, zero-latency Web Audio API synthesizers for positive feedback, level ups, and clicks (toggleable in Settings).

### 2. 🎮 Interactive Quests & Simulators
* **Interactive Lesson Runner**: Step-by-step concept walkthrough with syntax-highlighted code, interactive knowledge-check quizzes with instant explanations, and a browser-based Python simulation lab that evaluates automated test cases in real-time.
* **Daily Challenge Card & Modal**: Interactive quest ("*Debug the Infinite Loop!*") with countdown timer, logic bug analysis, and +100 XP / +1 day streak rewards.
* **Practice & Blitz Arena**: 45-second rapid-fire quiz mode and live code sandbox.

### 3. 🗺️ Adaptive Learning Paths
* Visual, connected milestone skill trees with completed, in-progress, and locked nodes.
* Track paths for **Full-Stack Web Architect**, **Python Data & Automation Specialist**, and **AI & Neural Networks Engineer**.

### 4. 📊 Cognitive Analytics
* **Weekly Learning Hours & XP**: Interactive Recharts bar chart showing daily study volume and XP velocity.
* **6-Week Quiz Accuracy Progression**: Gradient-filled Recharts area chart tracking retention over time.
* **Skill Competency Breakdown**: Real-time mastery percentages across Python, Web, Algorithms, AI, Security, and System Design.
* **28-Day Habit Consistency Heatmap**: Visual consistency map of study days.

### 5. 📚 Course Catalog & Curriculum Details
* Course listing with search and filters by difficulty (**All**, **Beginner**, **Intermediate**, **Advanced**) and category tracks.
* Course cards with difficulty badges, lesson counts, XP available, student enrollment, and progress bars.
* Detailed Course Page with syllabus accordion, instructor profiles, and lesson launchers.
* **Continue Learning Card**: Python Programming at 65% progress with instant "Continue Learning" action.

### 6. 🔐 Authentication & Onboarding
* **Login Page**: Clean form card with 1-click "*Quick Demo Login as Alex*", validation states, and password toggles.
* **Register Page**: Learning goal track selector, input validation, and starter XP rewards.
* **Forgot Password Page**: Two-step email recovery simulation.

---

## 🛠️ Tech Stack

* **Framework**: React 19 + Vite
* **Routing**: React Router DOM
* **Styling**: Tailwind CSS with custom purple/blue educational palette, soft shadows, and glassmorphism
* **Icons**: Lucide React
* **Charts**: Recharts
* **Gamification FX**: Canvas Confetti + Web Audio API Synthesizer
* **Persistence**: Client-side `localStorage` state management

---

## 🏃 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Run the Development Server
In a separate terminal, start the backend:
```bash
cd backend
npm install
npm run dev
```

Then start the frontend from the project root:
```bash
npm run dev
```

Visit [http://localhost:5173](http://localhost:5173) in your browser. Vite proxies `/api` requests to the backend at `http://localhost:5000`.

For deployments where the API is hosted separately, set `VITE_API_URL` to its API base URL (for example, `https://api.example.com/api`) and set the backend `CLIENT_ORIGIN` to the deployed frontend origin.

### 3. Build for Production
```bash
npm run build
```
=======
# 🎮⚡ EDUPLAY: UNITYLEARN

<p align="center">

```text
╔══════════════════════════════════════════════════════════════╗
║                                                              ║
║              🎮  E D U P L A Y  🎮                         ║
║                                                              ║
║           ⚡ TURN LEARNING INTO A GAME ⚡                    ║
║                                                              ║
║          LEARN  •  PLAY  •  EARN  •  LEVEL UP              ║
║                                                              ║
╚══════════════════════════════════════════════════════════════╝
```

</p>

<p align="center">

![Status](https://img.shields.io/badge/STATUS-IN%20DEVELOPMENT-00ff9d?style=for-the-badge\&logo=github)
![Game](https://img.shields.io/badge/TYPE-GAMIFIED%20LEARNING-7c3aed?style=for-the-badge\&logo=gamepad)
![React](https://img.shields.io/badge/REACT-19-61dafb?style=for-the-badge\&logo=react\&logoColor=black)
![Node](https://img.shields.io/badge/NODE.JS-BACKEND-339933?style=for-the-badge\&logo=node.js\&logoColor=white)

</p>

---

## 🕹️ START GAME

> **EduPlay: UnityLearn** is not just another learning platform.
>
> It is a **gamified full-stack learning world** where students learn concepts by **playing interactive games, solving challenges, completing simulations and earning rewards.**

```text
          ┌─────────────────────────┐
          │      🎮 PLAYER          │
          │                         │
          │       STUDENT           │
          └────────────┬────────────┘
                       │
                       ▼
              ┌────────────────┐
              │   📚 LEARN     │
              └───────┬────────┘
                      │
                      ▼
              ┌────────────────┐
              │   🎯 PLAY      │
              └───────┬────────┘
                      │
                      ▼
              ┌────────────────┐
              │   ⚡ EARN XP   │
              └───────┬────────┘
                      │
                      ▼
              ┌────────────────┐
              │   🏆 LEVEL UP  │
              └───────┬────────┘
                      │
                      ▼
              ┌────────────────┐
              │ 🔓 UNLOCK MORE │
              └────────────────┘
```

---

# 🌌 ENTER THE EDUVERSE

```text
                         🌌 EDUVERSE
                             │
       ┌─────────────────────┼─────────────────────┐
       │                     │                     │
       ▼                     ▼                     ▼
  🧠 LOGIC ZONE        🗃️ DATA ZONE          🌐 NETWORK ZONE
       │                     │                     │
       ▼                     ▼                     ▼
   Logic Games          Algorithm Games       Packet Games

       ┌─────────────────────┼─────────────────────┐
       │                     │                     │
       ▼                     ▼                     ▼
  💾 SYSTEM ZONE       🗄️ DATABASE ZONE       ⚡ DIGITAL ZONE
       │                     │                     │
       ▼                     ▼                     ▼
   CPU Challenges       DB Challenges         Circuit Games
```

Each zone contains **missions, challenges and interactive simulations**.

---

# 🎯 MISSION SYSTEM

Every topic becomes a mission.

```text
╔════════════════════════════════════╗
║ 🎯 MISSION: SAVE THE DATA TRAIN   ║
╠════════════════════════════════════╣
║                                    ║
║ Topic: Sorting Algorithms          ║
║ Difficulty: ⭐⭐                   ║
║ Reward: +150 XP                    ║
║                                    ║
║ Objective:                         ║
║ Sort the data before the timer     ║
║ reaches ZERO!                      ║
║                                    ║
║              [ START MISSION ]     ║
╚════════════════════════════════════╝
```

---

# 🔫 TARGET BLASTER

Traditional quiz?

```text
❌ Select A
❌ Select B
❌ Select C
❌ Select D
```

EduPlay:

```text
             🎯 STACK

        🎯 QUEUE       🎯 ARRAY


             🎯 TREE

                 🔫
              PLAYER
```

**Aim → Shoot → Answer → Learn → Earn XP**

```text
🎯 TARGET HIT!

████████████████████ 100%

        +20 XP
        🔥 COMBO ×3

        PERFECT SHOT!
```

Wrong answer?

```text
💥 MISS!

┌──────────────────────────────┐
│ 💡 HINT                     │
│                              │
│ LIFO means:                  │
│ Last In → First Out          │
└──────────────────────────────┘
```

---

#
>>>>>>> 04a182ace40747a80122552d19a8113e93a541da
