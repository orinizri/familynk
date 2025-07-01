<div align="center">

# Plusgrade Playground

A full-stack dashboard application that reads static JSON data files, processes product assignments and charges into paginated reservations, and presents them in an infinite-scroll, expandable React + MUI frontend. Production-ready with CI/CD, clustering, zero-downtime reloads, basic structured logging, and performance optimizations.

</div>

---

## 📑 Table of Contents

1. [🚀 Features](#-features)  
2. [📦 Tech Stack](#-tech-stack)  
3. [🔧 Getting Started](#-getting-started)  
4. [📋 Scripts](#-scripts)  
   - [Server](#server-serverpackagejson)  
   - [Client](#client-clientpackagejson)  
5. [🔄 CI/CD](#-cicd)  
6. [📊 Performance & Caching](#-performance--caching)  
7. [🧪 Testing](#-testing)  
8. [🤝 Contributing](#-contributing)  
9. [⚖️ License](#️-license)  
10. [🛠️ Future Improvements](#️-future-improvements)  

---

<div align="left">

## 🚀 Features

- **Server (Node.js / Express)**  
  • In-memory JSON loader with streaming fallback  
  • Cursor-based pagination endpoint (`GET /reservations?cursor=&limit=`)  
  • Health-check endpoint (`GET /healthz`)  
  • Graceful shutdown & zero-downtime reloads via PM2 clustering  
  • Basic structured JSON logging with Pino  
  • CORS restricted to configured front-end origin  
  • Gzip compression for all JSON responses  

- **Client (React + MUI)**  
  • Infinite-scroll container with throttling & deduplication  
  • Accordion rows for reservations with product tables  
  • Responsive layout that stacks cards on mobile  
  • Sticky header, ellipsis & overflow handling  
  • Axios client with gzip support  

- **Quality & Deployment**  
  • CI with lint, unit tests & coverage gates (GitHub Actions)  
  • Deploy via `pm2-runtime` on Render (API) and Vercel (UI)  

</div>

---

<div align="left">

## 📦 Tech Stack

- **Backend**: Node.js · Express · PM2 · Pino · compression  
- **Frontend**: React · MUI · Axios  
- **Testing**: Jest  
- **CI/CD**: GitHub Actions · Render · Vercel  
- **Linting**: ESLint  

</div>

---

<div align="left">

## 🔧 Getting Started

1. **Clone the repository**  
2. **Install dependencies**  
   - Server: `cd server && npm ci`  
   - Client: `cd client && npm ci`  
3. **Configure environment variables**  
   - `server/.env`: set `PORT`, `CLIENT_URL`, `NODE_ENV`  
   - `client/.env`: set `REACT_APP_API_BASE_URL`  
4. **Run locally**  
   - Server: `npm start` or `npm run start:dev`  
   - Client: `npm start`

</div>

---

<div align="left">

## 📋 Scripts

### Server (`server/package.json`)
- `start` — single-instance server  
- `start:dev` — PM2 cluster in development  
- `start:prod` — PM2 cluster in production via `pm2-runtime`  
- `stop` — stop PM2 app  
- `reload` — zero-downtime reload  
- `test` — run Jest unit tests  
- `lint` — run ESLint  
- `seed` — seed JSON data into cache  

### Client (`client/package.json`)
- `start` — React dev server  
- `build` — production bundle  
- `test` — React test suite  
- `lint` — run ESLint  

</div>

---

<div align="left">

## 🔄 CI/CD

- **GitHub Actions** on `main`:  
  - **Server**: lint → unit tests (coverage)  
  - **Client**: lint → tests → build  
- **Render** (API):  
  - Build: `cd server && npm ci`  
  - Start: `cd server && npm run start:prod`  
- **Vercel** (UI): auto-deploys `client/` on `main`

</div>

---

<div align="left">

## 📊 Performance & Caching

- Gzip compression via Express `compression`  
- In-memory JSON indexing for fast cursor queries  

</div>

---

<div align="left">

## 🧪 Testing

- **Unit tests** for services & utilities (Jest)  
- Coverage thresholds enforced in CI  

</div>

---

<div align="left">

## 🤝 Contributing

1. Fork & create a feature branch  
2. Write tests & follow lint rules  
3. Submit a pull request (CI validates)  
4. Merge to `main` → auto-deploy  

</div>

---

<div align="left">

## ⚖️ License

MIT © Your Name / YourOrg  

</div>

---

<div align="left">

## 🛠️ Future Improvements

- Request-ID middleware & enhanced log context  
- Integration tests for API routes (Supertest)  
- HTTP caching headers (ETag + 304)  
- CDN front-layer or reverse proxy  
- Input validation (Zod/Joi) and TypeScript migration  
- End-to-end tests (Cypress or Playwright)  

</div>