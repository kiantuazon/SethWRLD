Render deployment guide for webtech (backend)

Overview
- Deploy the `server.js` Node/Express backend to Render (recommended).
- Use MongoDB Atlas for a hosted `MONGO_URI`.
- Set `API_BASE_URL` in Netlify to point at the deployed backend's `/api` endpoint.

Prerequisites
- Git repo pushed to GitHub (or Git provider connected to Render).
- MongoDB Atlas cluster and connection string.
- Render account (free tier available).
- Netlify site for the frontend (already configured to publish `public`).

Required environment variables (Render / Netlify)
- MONGO_URI: mongodb+srv://<user>:<pass>@cluster0.xxx.mongodb.net/<db>?retryWrites=true&w=majority
- NODE_ENV: production
- (optional email settings) EMAIL_USER, EMAIL_PASSWORD, EMAIL_SERVICE (gmail|smtp), SMTP_HOST, SMTP_PORT, SMTP_SECURE (true/false)
- (optional) PORT: Render will set this automatically; no need to set on Render.

Steps: Create MongoDB Atlas
1. Go to https://cloud.mongodb.com and create a free-tier cluster.
2. Create a database user and password, allow your app's IP (or 0.0.0.0/0 for testing).
3. Get the connection string and replace `<password>` and `<dbname>` with real values.

Steps: Deploy backend on Render (quick)
1. Sign in to Render and click "New" → "Web Service".
2. Connect your GitHub repo and select the repo branch (e.g., `main`).
3. Fill in:
   - Name: webtech-backend (or your choice)
   - Environment: Node
   - Build Command: (leave empty)
   - Start Command: `npm start`
4. In the "Environment" section, add `MONGO_URI` and any email env vars.
5. Create the service. Render will build and expose a public URL (e.g., `https://webtech-backend.onrender.com`).

Steps: Configure Netlify frontend
1. In Netlify site settings → Build & deploy → Environment, set `API_BASE_URL` to your backend URL + `/api` (example: `https://webtech-backend.onrender.com/api`).
2. Trigger a redeploy (Deploys → Trigger deploy → Deploy site).

Verify
- Visit your Netlify site and try to register/login — the frontend will call `window.__API_BASE_URL` which now points to your deployed backend.
- On Render, check logs to confirm `connectDB` prints `MongoDB connected successfully!`.

Optional: Add `render.yaml` (in repo) to declare the service
- Example `render.yaml` (optional, Render CLI):

```yaml
services:
  - type: web
    name: webtech-backend
    env: node
    plan: free
    buildCommand: ''
    startCommand: 'npm start'
    repo: <your-repo>
```

Troubleshooting
- If the server fails to connect to MongoDB: verify `MONGO_URI` and IP access rules in Atlas.
- If email shows inactive: ensure `EMAIL_USER` and `EMAIL_PASSWORD` are set and `NODE_ENV=production` only if you have real credentials.
- If CORS errors occur: your `server.js` already uses `cors({ origin: true })` — this allows calls from the browser.

Need me to:
- Prepare a ready-to-deploy `render.yaml` and commit it.
- Walk through creating Atlas URI and adding env vars in Render.
- Generate example Netlify env var settings and redeploy the site.

