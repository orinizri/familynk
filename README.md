<div align="center">

# Plusgrade Playground

A full-stack dashboard application that reads static JSON data files, processes product assignments and charges into paginated reservations, and presents them in an infinite-scroll, expandable React + MUI frontend. Production-ready with CI/CD, clustering, zero-downtime reloads, structured logging, retry/backoff resilience and performance optimizations.

</div>

---

## 📑 Table of Contents

1. [🚀 Features](#-features)  
2. [📦 Tech Stack](#-tech-stack)  
3. [🔧 Getting Started](#-getting-started)  
4. [📋 Scripts](#-scripts)  
   - [Root](#root-scripts)  
   - [Server](#server-serverpackagejson)  
   - [Client](#client-clientpackagejson)  
5. [🔄 CI/CD](#-cicd)  
6. [📊 Performance & Reliability](#-performance--reliability)  
7. [🧪 Testing](#-testing)  
8. [🛠️ Future Improvements](#️-future-improvements)  

---

<div align="left">

## 🚀 Features

- **Server (Node.js / Express)**  
  • In-memory JSON loader with retry/backoff logic to withstand transient I/O failures  
  • Pure-JSON parse followed by optional Zod schema validation for shape enforcement  
  • Cursor-based pagination endpoint (`GET /reservations?cursor=&limit=`)  
  • Health-check endpoint (`GET /healthz`)  
  • Graceful shutdown and zero-downtime reloads via PM2 clustering  
  • Structured JSON logging with Pino (minimal fields, pretty in development)  
  • CORS restricted to configured front-end origin  
  • Gzip compression for all JSON responses  

- **Client (React + MUI)**  
  • Infinite-scroll container with throttling, deduplication and “load more” guard  
  • Accordion rows for each reservation, with integrated product table  
  • Responsive layout that stacks cards on mobile, sticky header and ellipsis handling  
  • Axios client configured for gzip support  

- **Quality & Deployment**  
  • CI with lint, unit tests & coverage gates (GitHub Actions)  
  • Automatic deployments: API on Render (pm2-runtime) and UI on Vercel  

</div>

---

<div align="left">

## 📦 Tech Stack

- **Backend**: Node.js · Express · PM2 · Pino · compression  
- **Frontend**: React · MUI · Axios  
- **Validation**: Zod  
- **Testing**: Jest  
- **CI/CD**: GitHub Actions · Render · Vercel  
- **Linting**: ESLint  

</div>

---

<div align="left">

## 🔧 Getting Started

1. Clone the repository.  
2. Install dependencies from the root (installs both server and client):  
   – `npm ci`  
   Or install per-folder:  
   – Server: `cd server && npm ci`  
   – Client: `cd client && npm ci`  
3. Configure environment variables:  
   – `server/.env` (PORT, CLIENT_URL, NODE_ENV)  
   – `client/.env` (REACT_APP_API_BASE_URL)  
4. Run in development mode from the root:  
   – `npm run dev`  
5. Run production-mode locally:  
   – `npm run start:prod`  

</div>

---

<div align="left">

## 📋 Scripts

### Root

- **dev** — start server in PM2 dev-cluster mode and React app concurrently  
- **start:dev** — alias for `dev`  
- **start:prod** — build and launch server cluster and client together  
- **stop** — stop the PM2-managed plusgrade-server process  

### Server (`server/package.json`)

- **start** — launch a single server instance  
- **start:dev** — PM2 clustering in development  
- **start:prod** — PM2 clustering in production with pm2-runtime  
- **stop** — stop the PM2 app  
- **reload** — zero-downtime reload via PM2  
- **test** — run Jest unit tests  
- **lint** — run ESLint  
- **seed** — load JSON data into in-memory cache  

### Client (`client/package.json`)

- **start** — React development server  
- **build** — production bundle  
- **test** — React test suite  
- **lint** — run ESLint  

</div>

---

<div align="left">

## 🔄 CI/CD

- GitHub Actions on `main` branch:  
  – Server job: lint → tests with coverage threshold  
  – Client job: lint → tests → build  
- Render for API:  
  – Build command: `cd server && npm ci`  
  – Start command: `cd server && npm run start:prod`  
- Vercel for UI: auto-deploy from `client/` on push to `main`  

</div>

---

<div align="left">

## 📊 Performance & Reliability

- Gzip compression for all endpoint responses  
- In-memory JSON indexing for fast cursor queries  
- Retry with exponential backoff on file reads to handle transient I/O issues  
- Modular `retryAsync` helper configurable for retries, initial delay, factor and max delay  
- Pure-JSON parsing separated from Zod validation to distinguish syntax vs schema errors  

</div>

---

<div align="left">

## 🧪 Testing

- Unit tests for services and utilities using Jest  
- Coverage thresholds enforced in CI  

</div>

---

<div align="left">

## 🛠️ Future Improvements

- Request-ID header propagation for end-to-end tracing  
- `/metrics` endpoint for Prometheus integration  
- Error-tracking integration (Sentry)  
- Advanced input validation and TypeScript migration  
- Docker-Compose for local development parity  

</div>