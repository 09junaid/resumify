# Resumify — Backend API

Express 5 + MongoDB (Mongoose) REST API for the Resumify resume builder.
JWT auth, resume CRUD, and file uploads (Multer). Fully dockerized.

## Architecture

A layered structure — each layer has one responsibility and depends only
on the layer beneath it:

```
routes → controllers → services → models
                 └── middlewares · validators · utils · config
```

```
server/
├── src/
│   ├── config/          # env loading/validation + DB connection
│   │   ├── env.js
│   │   └── db.js
│   ├── models/          # Mongoose schemas
│   │   ├── user.model.js
│   │   └── resume.model.js
│   ├── validators/      # request payload validation
│   │   └── auth.validator.js
│   ├── services/        # business logic (no req/res here)
│   │   ├── auth.service.js
│   │   └── resume.service.js
│   ├── controllers/     # HTTP glue: parse req → call service → send res
│   │   ├── auth.controller.js
│   │   └── resume.controller.js
│   ├── routes/          # endpoint → controller wiring
│   │   ├── index.js
│   │   ├── auth.routes.js
│   │   └── resume.routes.js
│   ├── middlewares/      # auth, uploads, 404, central error handler
│   ├── utils/            # ApiError, ApiResponse, asyncHandler, jwt, logger
│   ├── app.js            # builds & configures the Express app
│   └── server.js         # entrypoint: connect DB, listen, graceful shutdown
├── uploads/              # user-uploaded files (gitignored)
├── Dockerfile            # multi-stage, non-root, healthcheck
├── docker-compose.yml    # api + mongo services
├── .dockerignore
└── .env.example
```

**Why this shape**
- **Thin controllers, fat services** — business logic is testable without HTTP.
- **Central error handling** — `asyncHandler` funnels every async rejection into
  one `errorHandler` that normalises Mongoose/JWT errors into a consistent JSON envelope.
- **Consistent responses** — `{ success, message, data }` everywhere.
- **Config isolated & validated** — the app fails fast on boot if a required
  env var is missing.
- **Versioned API** — everything is served under `/api/v1`.

## API

Base URL: `http://localhost:5000/api/v1`

| Method | Path             | Auth | Description             |
|--------|------------------|------|-------------------------|
| POST   | `/auth/register` | —    | Create account          |
| POST   | `/auth/login`    | —    | Log in, receive a token |
| GET    | `/auth/me`       | ✅   | Current user            |
| GET    | `/resumes`       | ✅   | List my resumes         |
| POST   | `/resumes`       | ✅   | Create resume (`file` optional, multipart) |
| GET    | `/resumes/:id`   | ✅   | Get one resume          |
| PATCH  | `/resumes/:id`   | ✅   | Update resume           |
| DELETE | `/resumes/:id`   | ✅   | Delete resume           |

Auth header: `Authorization: Bearer <token>`.
Health probe: `GET /health`.

## Running

### With Docker (recommended)
```bash
cd server
cp .env.example .env        # then set a strong JWT_SECRET
docker compose up --build
```
API → http://localhost:5000 · MongoDB → localhost:27017

### Locally (Node 20+, Mongo running)
```bash
cd server
cp .env.example .env        # set MONGO_URI=mongodb://127.0.0.1:27017/resumify
npm install
npm run dev
```
