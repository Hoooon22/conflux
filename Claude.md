# Claude.md

This file provides comprehensive guidance, roadmap, and execution rules for OpenAI Agents/Claude CLI when working with the **Conflux** project.

## 1. Project Context & Overview

**Conflux** is a "Unified Notification Inbox" for developers that merges streams from GitHub, Jira, Slack, and Sentry into a single flow.
It is designed as a SaaS platform with a Desktop Client.

-   **Goal**: Reduce information noise and context switching for developers.
-   **Core Value**: "Where all streams merge."
-   **Role**: You are the **Lead Architect & Full Stack Developer** for Conflux. Prioritize "Executability" — code that runs immediately.

## 2. Architecture & Tech Stack

### Tech Stack

-   **Backend (Brain)**: Spring Boot 3.4.x (Java 17/21)
    -   Build Tool: Gradle
    -   Dependencies: Spring Web, Lombok, DevTools, **Spring Scheduler**
-   **Frontend (Face)**: React 18
    -   Boilerplate: Create React App
-   **Desktop (Body)**: Electron.js (Wrapping React)
-   **Database**: In-Memory (MVP) -> MySQL (Planned)
-   **Networking**: ngrok (Local webhook tunneling)

### Project Structure

The project follows a mono-repo style with separated backend and client directories.

```text
conflux/
├── conflux-backend/              # Spring Boot API Server
│   ├── src/main/java/com/devzip/conflux/
│   │   ├── controller/           # Webhook & API Controllers
│   │   ├── dto/                  # Data Transfer Objects
│   │   ├── service/              # Filtering & Scheduler Logic
│   │   └── scheduler/            # Health Check Polling Tasks
│   └── build.gradle              # Backend dependencies
│
├── conflux-client/               # React + Electron Application
│   ├── src/                      # React Source
│   │   ├── components/           # UI Components (NotificationCard, Sidebar)
│   │   ├── pages/                # Main Views (Inbox, Focus, Project)
│   │   └── services/             # API Fetching & Polling logic
│   ├── public/                   # Electron Main Process (main.js)
│   └── package.json              # Frontend dependencies
````

## 3\. Implementation Roadmap (Step-by-Step)

Follow these phases in order. Do not skip steps.

### 🟢 PHASE 1: Backend Construction (The Brain)

**Goal**: Receive external webhooks, store in memory, serve JSON to React.

1.  **DTO Creation**:
      - File: `conflux-backend/src/main/java/com/devzip/conflux/dto/NotificationDto.java`
      - Fields: `source`, `title`, `message`, `repository`, `sender`, `timestamp`, `status` (success/fail).
      - Use Lombok `@Data`, `@Builder`.
2.  **Controller Implementation**:
      - File: `conflux-backend/src/main/java/com/devzip/conflux/controller/WebhookController.java`
      - **POST** `/api/webhook/github`: Parse `Map<String, Object>`, convert to DTO, save to List.
      - **GET** `/api/notifications`: Return saved List.
      - **CORS**: Add `@CrossOrigin(origins = "http://localhost:3000")`.

### 🟢 PHASE 1.5: Custom Integration (Active & Passive) [NEW]

**Goal**: Support User-defined Health Checks (Polling) and Custom Webhooks.

1.  **Custom Webhook (Passive)**:
      - Create `CustomWebhookController`.
      - Endpoint: `POST /api/webhook/custom`.
      - Accepts generic JSON `{ "title": "...", "message": "...", "status": "..." }`.
2.  **Health Check Scheduler (Active)**:
      - Enable `@EnableScheduling` in Spring Boot.
      - Create `HealthCheckService`.
      - Logic: Periodically `GET` user-defined URLs. If status \!= 200, generate a `NotificationDto` with `source="HealthCheck"` and `tag="Critical"`.

### 🟡 PHASE 2: Frontend Construction (The Face)

**Goal**: Render notification cards by polling the backend API.

1.  **API Integration**:
      - Use `fetch` inside `useEffect` with `setInterval` (2000ms polling).
2.  **UI Design (Dark Mode)**:
      - Background: `#111` (Matte Black).
      - Cards: Rounded corners, neon accent borders (Purple=GitHub, Red=Sentry, **Green=HealthCheck**).
      - Layout: 2-Column (Sidebar + Main Timeline).

### 🟠 PHASE 3: Desktop Transformation (The Body)

**Goal**: Wrap React with Electron.

1.  **Electron Setup**:
      - Install `electron`, `electron-builder`, `concurrently`, `wait-on`.
2.  **Main Process**:
      - File: `conflux-client/public/main.js`
      - Logic: Create `BrowserWindow`, load `http://localhost:3000` (dev) or `index.html` (prod).

### 🔴 PHASE 4: Integration Test

1.  Start Backend (`./gradlew bootRun`).
2.  Expose via ngrok (`ngrok http 8080`).
3.  Start Client (`npm run electron`).
4.  **Test Custom**: Run `curl -X POST http://localhost:8080/api/webhook/custom -d '{"title":"Test", "message":"Hello"}'`.

## 4\. Development Commands

### Backend Development (conflux-backend)

**Port**: 8080

```bash
# Navigate to backend
cd conflux-backend

# Run Spring Boot application
./gradlew bootRun

# Clean & Build
./gradlew clean build
```

### Frontend & Desktop Development (conflux-client)

**Port**: 3000 (React), Electron Window

```bash
# Navigate to client
cd conflux-client

# Install dependencies
npm install

# Run React Web (Browser mode)
npm start

# Run Electron App (Desktop mode)
npm run electron  # (Requires electron configuration)
```

### Network Tunneling (Essential for Webhooks)

```bash
# Expose Backend Port 8080
ngrok http 8080
```

## 5\. Development Guidelines

### UI/UX Design Principles

  - **Aesthetic**: "Linear-style" Dark Mode.
  - **Layout**: 2-Column (Sidebar + Main Stream).
  - **Colors**: Matte Black background, Neon accents (Purple for GitHub, Red for Sentry, Green for Custom).
  - **Typography**: Inter font, high readability.

### Code Patterns

  - **Backend**:
      - Use **Lombok** (`@Data`, `@Builder`) for DTOs.
      - Keep Controllers lean; move logic to Services.
      - ALWAYS use `NotificationDto` for frontend communication, never raw Map/JSON.
      - System.out.println -\> Use Slf4j logging.
  - **Frontend**:
      - Functional Components with Hooks (`useState`, `useEffect`).
      - Use `fetch` or `axios` for API calls.

### Communication & Git

  - **Language**: Default to **Korean** when chatting with the user.
  - **Git**: Do not include commit messages about Agents/Claude.

## 6\. Execution Rules (Triggers)

### Rule: Run & Manage Backend Application

**When the user requests to run, test, or check logs for the backend server:**

  - **Triggers**: "Run backend", "Start the server", "Check backend logs", "Restart Spring Boot"
  - **Action**: Automatically navigate to `conflux-backend/` and use the Gradle wrapper.

### Rule: Run & Manage Frontend/Electron

**When the user requests to run the UI, web app, or desktop app:**

  - **Triggers**: "Run frontend", "Start React", "Launch Electron", "Test the UI"
  - **Action**: Automatically navigate to `conflux-client/` and use npm commands.
    EOF