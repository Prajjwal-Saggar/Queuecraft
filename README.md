# QueueCraft

**An observable, self-healing async job processing pipeline** — built with Fastify, MongoDB, BullMQ, and Redis, designed to demonstrate production-grade DevOps practices (containerization, orchestration, observability, and CI/CD) on top of a MERN-style backend.

<p>
  <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" alt="Node.js" />
  <img src="https://img.shields.io/badge/Fastify-000000?style=for-the-badge&logo=fastify&logoColor=white" alt="Fastify" />
  <img src="https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React" />
  <img src="https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB" />
  <img src="https://img.shields.io/badge/Redis-DC382D?style=for-the-badge&logo=redis&logoColor=white" alt="Redis" />
  <img src="https://img.shields.io/badge/BullMQ-FF3F1A?style=for-the-badge&logo=redis&logoColor=white" alt="BullMQ" />
  <img src="https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white" alt="Docker" />
  <img src="https://img.shields.io/badge/Kubernetes-326CE5?style=for-the-badge&logo=kubernetes&logoColor=white" alt="Kubernetes" />
</p>

<p>
  <img src="https://img.shields.io/badge/status-in%20development-yellow?style=flat-square" alt="Status" />
  <img src="https://img.shields.io/github/last-commit/Prajjwal-Saggar/Queuecraft?style=flat-square" alt="Last Commit" />
  <img src="https://img.shields.io/github/languages/top/Prajjwal-Saggar/Queuecraft?style=flat-square" alt="Top Language" />
  <img src="https://img.shields.io/github/license/Prajjwal-Saggar/Queuecraft?style=flat-square" alt="License" />
</p>

QueueCraft is intentionally *not* a feature-heavy app. The core functionality — accepting an image and resizing it — is deliberately simple. The real point of this project is everything happening *around* that simple task: how work is queued, retried, monitored, and recovered from failure, and how the whole system is packaged, deployed, and scaled like a real production service.

---

## Why this project exists

Most upload-and-process apps do the work synchronously — the user waits while the server does the job. That doesn't scale, and it hides all the interesting engineering problems.

QueueCraft instead treats image processing as a **background job**: the API accepts the upload and immediately hands off the real work to a separate worker process via a queue. This single architectural choice opens the door to everything this project is actually about — retries, backoff, concurrency, observability, and resilience under failure.

---

## Architecture

```
 ┌────────────┐        ┌────────────────┐        ┌──────────────────┐
 │   Client    │ ─────▶ │   Fastify API   │ ─────▶ │  MongoDB (Atlas)  │
 │  (React)    │        │                 │        │  job metadata     │
 └────────────┘        └───────┬────────┘        └──────────────────┘
                                 │
                                 ▼
                         ┌───────────────┐
                         │ Redis / BullMQ │
                         │     queue      │
                         └───────┬───────┘
                                 ▼
                         ┌───────────────┐        ┌──────────────────┐
                         │  Worker pool   │ ─────▶ │  MongoDB (Atlas)  │
                         │ (image resize) │        │  status updates   │
                         └───────────────┘        └──────────────────┘
```

**Flow:**
1. Client uploads an image to the Fastify API
2. API streams the file to disk, creates a job record in MongoDB (`status: UPLOADED`), and pushes a job onto a BullMQ queue backed by Redis
3. Status updates to `QUEUED`
4. A separate worker process picks up the job, updates status to `PROCESSING`, and resizes the image with `sharp`
5. On success, status updates to `DONE` and the result location is stored
6. On failure, the job retries automatically with exponential backoff; if all attempts are exhausted, status updates to `FAILED` with the error recorded

The API and worker are **fully decoupled** — they never call each other directly. They only communicate through Redis, which is what allows them to be scaled, deployed, and restarted independently.

---

## Tech stack

| Layer | Technology |
|---|---|
| API | Fastify |
| Frontend | React |
| Database | MongoDB (Atlas) via Mongoose |
| Queue | BullMQ |
| Queue backend | Redis |
| Image processing | Sharp |
| Containerization | Docker, Docker Compose |
| Orchestration | Kubernetes *(planned)* |
| Observability | Prometheus, Grafana, Loki, OpenTelemetry *(planned)* |
| CI/CD | GitHub Actions *(planned)* |

---

## Features

- Multipart file upload with stream-based disk writes (no buffering entire files in memory)
- Collision-proof file storage using UUID-based filenames
- Job lifecycle tracked through explicit states: `UPLOADED → QUEUED → PROCESSING → DONE / FAILED`
- Asynchronous, decoupled processing via a dedicated worker service
- Automatic retries with exponential backoff for transient failures
- Configurable worker concurrency
- Clean, consistent REST API with proper HTTP status codes and structured error responses

---

## API Reference

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/v0/job` | Upload an image and create a processing job |
| `GET` | `/api/v0/job` | List all jobs |
| `GET` | `/api/v0/job/:id` | Get the status/details of a single job |
| `GET` | `/api/v0/health` | Service health check |

---

## Project status

QueueCraft is being built in phases, each one adding a real production concern on top of a working core:

| Phase | Focus | Status |
|---|---|---|
| 1 | Core upload pipeline — Fastify API, MongoDB metadata storage, file handling | ![done](https://img.shields.io/badge/done-brightgreen?style=flat-square) |
| 2 | Async processing — BullMQ/Redis queue, worker service, retries with exponential backoff | ![done](https://img.shields.io/badge/done-brightgreen?style=flat-square) |
| 3 | Containerization — Dockerfiles per service, Docker Compose orchestration | ![done](https://img.shields.io/badge/done-brightgreen?style=flat-square) |
| 4 | Observability — Prometheus, Grafana, Loki, OpenTelemetry | ![planned](https://img.shields.io/badge/planned-lightgrey?style=flat-square) |
| 5 | Kubernetes — deployments, autoscaling, self-healing under failure | ![planned](https://img.shields.io/badge/planned-lightgrey?style=flat-square) |
| 6 | CI/CD — automated lint/test/build/deploy via GitHub Actions | ![planned](https://img.shields.io/badge/planned-lightgrey?style=flat-square) |

---

## Running locally

### Docker Compose

Create local environment files from the committed templates:

```bash
cp app/server/.env.example app/server/.env
cp app/worker/.env.example app/worker/.env
cp app/client/.env.example app/client/.env
```

Replace the MongoDB placeholders in the server and worker files with your MongoDB Atlas connection string. Keep the real `.env` files private. Then run from the repository root:

```bash
docker compose up --build
```

The frontend is available at `http://localhost:5173` and the API at `http://localhost:3000`.

To stop the stack:

```bash
docker compose down
```

### Manual setup

**Prerequisites:** Node.js, a running Redis instance, a MongoDB Atlas connection string

```bash
# API
cd app/server
npm install
npm run dev

# Worker
cd app/worker
npm install
npm run dev

# Client
cd app/client
npm install
npm run dev
```

Each service requires its own `.env` file. Use the matching `.env.example` as a starting point. The server and worker require `MONGO_URI`, `REDIS_HOST`, and `REDIS_PORT`; the server also requires `PORT`. The client requires `VITE_API_URL`.

---

## Author

**Prajjwal Saggar**
[LinkedIn](https://www.linkedin.com/in/prajjwal-saggar) · [GitHub](https://github.com/Prajjwal-Saggar)