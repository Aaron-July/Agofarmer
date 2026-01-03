# Deployment Guide for AgroFarmer Connect

This guide outlines how to deploy the application to **Google Cloud Run** and **Vercel** (GitHub Integration).

## Prerequisites

1.  **Codebase**: Ensure you have `package.json`, `vite.config.ts`, `Dockerfile`, and `nginx.conf` in your root directory (these have been created for you).
2.  **Accounts**:
    *   Google Cloud Platform Account.
    *   Vercel Account.
    *   GitHub Account.
3.  **CLI Tools**:
    *   `gcloud` CLI installed and authenticated.
    *   `git` installed.

---

## 1. Deploying to Google Cloud Run

Cloud Run is a serverless platform that runs stateless containers. We will use Docker to containerize the app and Nginx to serve it.

### Step 1: Prepare the Project
Ensure you are in the project root.
```bash
# Login to Google Cloud
gcloud auth login
gcloud config set project [YOUR_PROJECT_ID]
```

### Step 2: Build and Submit the Container
Since this is a client-side React app, environment variables (like `API_KEY`) are baked into the build. You need to pass the API Key during the build process.

```bash
gcloud builds submit --tag gcr.io/[YOUR_PROJECT_ID]/agrofarmer-app --substitutions=_API_KEY="[YOUR_REAL_GEMINI_API_KEY]" .
```
*Replace `[YOUR_PROJECT_ID]` with your GCP Project ID and `[YOUR_REAL_GEMINI_API_KEY]` with your actual key.*

### Step 3: Deploy to Cloud Run
```bash
gcloud run deploy agrofarmer-service \
  --image gcr.io/[YOUR_PROJECT_ID]/agrofarmer-app \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --port 8080
```

Once complete, Google Cloud will provide a `Service URL` (e.g., `https://agrofarmer-service-xyz-uc.a.run.app`).

---

## 2. Deploying to Vercel (via GitHub)

Vercel is the easiest way to deploy React/Vite applications.

### Step 1: Push Code to GitHub
1.  Initialize git if you haven't: `git init`
2.  Add files: `git add .`
3.  Commit: `git commit -m "Initial commit"`
4.  Create a new repository on GitHub.
5.  Push your code:
    ```bash
    git remote add origin https://github.com/[YOUR_USERNAME]/[REPO_NAME].git
    git push -u origin main
    ```

### Step 2: Import into Vercel
1.  Log in to [Vercel](https://vercel.com).
2.  Click **"Add New..."** > **"Project"**.
3.  Select **"Continue with GitHub"**.
4.  Find your `agrofarmer-connect` repository and click **"Import"**.

### Step 3: Configure Project
Vercel will automatically detect that this is a **Vite** project.

1.  **Framework Preset**: Vite (should be auto-selected).
2.  **Root Directory**: `./`
3.  **Environment Variables**:
    *   Expand the "Environment Variables" section.
    *   Key: `API_KEY`
    *   Value: `[Your Actual Gemini API Key]`
    *   Click **Add**.

### Step 4: Deploy
Click **"Deploy"**. Vercel will build your application, inject the API key, and provide a live URL (e.g., `https://agrofarmer-connect.vercel.app`).

---

## Important Note on Environment Variables

This application uses `process.env.API_KEY`.
*   **Vercel**: The `API_KEY` environment variable set in the Vercel dashboard is automatically available during the build.
*   **Cloud Run**: The API Key is passed as a build argument (`--substitutions`) during the container build process because Nginx serves static HTML/JS files; it cannot read environment variables at runtime like a Node.js server would.
