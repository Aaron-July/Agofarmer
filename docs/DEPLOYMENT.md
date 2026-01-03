# Deployment Guide for AgroFarmer Connect

This guide outlines how to deploy the application to **Google Cloud Run** and **Vercel** (via GitHub).

## Prerequisites

1.  **Codebase**: Ensure `package.json`, `vite.config.ts`, `Dockerfile`, and `nginx.conf` exist in your project root.
2.  **Accounts**:
    *   Google Cloud Platform (GCP) Account.
    *   GitHub Account.
    *   Vercel Account.
3.  **CLI Tools** (Optional but recommended):
    *   `gcloud` CLI installed and authenticated.
    *   `git` installed.

---

## 1. Deploying to Google Cloud Run

Cloud Run is a serverless platform that runs stateless containers. We use Docker to build the app and Nginx to serve it.

### Step 1: Initialize Google Cloud
Open your terminal in the project root.

```bash
# Login to Google Cloud
gcloud auth login

# Set your project ID (replace [YOUR_PROJECT_ID] with your actual ID)
gcloud config set project [YOUR_PROJECT_ID]
```

### Step 2: Build and Submit the Container
Because this is a React app using `vite`, environment variables like your Gemini `API_KEY` are **baked into the build**. You must provide the key during the build step.

```bash
gcloud builds submit \
  --tag gcr.io/[YOUR_PROJECT_ID]/agrofarmer-app \
  --substitutions=_API_KEY="[YOUR_ACTUAL_GEMINI_API_KEY]" \
  .
```
*Note: The `_API_KEY` substitution maps to the `ARG API_KEY` in the Dockerfile.*

### Step 3: Deploy to Cloud Run
Once the build is successful, deploy the container image.

```bash
gcloud run deploy agrofarmer-service \
  --image gcr.io/[YOUR_PROJECT_ID]/agrofarmer-app \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --port 8080
```

*   **Service Name**: `agrofarmer-service`
*   **Region**: `us-central1` (or your preferred region)
*   **Allow Unauthenticated**: Makes the website publicly accessible.

**Result**: Google Cloud will output a `Service URL` (e.g., `https://agrofarmer-service-xyz-uc.a.run.app`).

---

## 2. Deploying to Vercel (via GitHub)

Vercel is the recommended platform for deploying Vite/React apps connected to GitHub.

### Step 1: Push Code to GitHub
If you haven't already pushed your code:

1.  Initialize git: `git init`
2.  Add files: `git add .`
3.  Commit: `git commit -m "Initial commit"`
4.  Create a new repository on GitHub.
5.  Link and push:
    ```bash
    git remote add origin https://github.com/[YOUR_USERNAME]/[REPO_NAME].git
    git push -u origin main
    ```

### Step 2: Import Project in Vercel
1.  Log in to [Vercel](https://vercel.com).
2.  Click **"Add New..."** -> **"Project"**.
3.  Select **"Continue with GitHub"**.
4.  Find your `agrofarmer-connect` repository and click **"Import"**.

### Step 3: Configure Build Settings
Vercel usually auto-detects Vite, but ensure these settings:

*   **Framework Preset**: Vite
*   **Root Directory**: `./`
*   **Build Command**: `vite build` (or `npm run build`)
*   **Output Directory**: `dist`

### Step 4: Add Environment Variables
**Crucial Step**: You must add your API key here so it's available during the build.

1.  Expand the **"Environment Variables"** section.
2.  **Key**: `API_KEY`
3.  **Value**: `[Your Actual Gemini API Key]`
4.  Click **Add**.

### Step 5: Deploy
Click **"Deploy"**. Vercel will:
1.  Clone your repo.
2.  Run `npm install`.
3.  Run `vite build` (injecting the API_KEY).
4.  Serve the `dist` folder on a global CDN.

**Result**: You will get a live URL (e.g., `https://agrofarmer-connect.vercel.app`).

---

## Troubleshooting

### "Missing API Key" / App Crashes
*   **Cause**: The API key was not present *during the build process*.
*   **Fix**:
    *   **Cloud Run**: Ensure you passed `--substitutions=_API_KEY=...` in the build command.
    *   **Vercel**: Ensure `API_KEY` is added in the Project Settings > Environment Variables, and then **Redeploy** (a restart isn't enough; a rebuild is required).

### White Screen on Load
*   **Cause**: Missing entry script in `index.html`.
*   **Fix**: Ensure `index.html` contains `<script type="module" src="/index.tsx"></script>` inside the `<body>` tag.
