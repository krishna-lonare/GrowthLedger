Growthledger — MERN Daily Growth Tracker

Overview
- Growthledger helps users track daily to-do lists and computes daily "growth" as percentage of completed subtasks.

Quick start
1. Install server deps:

```bash
cd server
npm install
```

2. Start server (needs MongoDB URI in environment):

```bash
set MONGO_URI=mongodb://localhost:27017/growthledger
npm run start
```

3. Install client and run:

```bash
cd ../client
npm install
npm run dev
```

Server: http://localhost:5000 (default)
Client: http://localhost:5173 (Vite default)

Files created
- `server/` — Express + Mongoose API
- `client/` — React frontend (Vite)
