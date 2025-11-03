# AI Website Builder — MVP (Generated)

This is a minimal MVP scaffold for an **AI-powered website builder**.
It includes:
- `backend/` — Express server with a `/generate` endpoint that calls the OpenAI API to generate HTML from a prompt.
- `frontend/` — Vite + React app where you enter prompts and preview the generated site.

## Quick start (you'll need Node.js >=18 and an OpenAI API key)

1. Backend
   ```bash
   cd backend
   npm install
   # create a .env file with OPENAI_API_KEY=your_api_key
   node index.js
   ```

2. Frontend
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

3. Use the web UI (http://localhost:5173 by default) to send prompts.

## What this MVP does
- Sends your prompt to the backend.
- Backend calls OpenAI to generate a single HTML string (a complete page).
- Frontend shows the generated site in a live preview iframe and allows downloading the HTML.

## Notes & next steps
- This is a scaffold: expand the agent logic to produce multi-file projects, CSS, components, and deployment automation.
- For production, sandbox generated code before rendering; do not render untrusted HTML on public sites.
