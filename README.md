# Itinerary API

REST API for the **Itinerary** trip planner, built with Express and MongoDB. Users register, log in with JWT, and create, browse, search, update and delete their own itineraries.

**Frontend:** `master` branch of this repo · **Live app:** https://pritams1.netlify.app

---

## Features

- **Auth:**
  - register and login with bcrypt-hashed passwords and a JWT session (HS256, configurable expiry)
  - emails match regardless of upper/lower case
  - a "current user" endpoint
- **Private itineraries:** every itinerary belongs to its creator. Other users can't list, read, edit or delete it; they get `404`.
- **CRUD:** create, list, get one, partial update and delete.
- **Listing:** pagination, search across name, location, from, to and hotel (special characters are escaped), sorting by date, name, cost, created or updated time in either direction, and a `total` count.
- **Validation:**
  - every field is checked for type, length and format
  - dates must be real calendar dates; cost can't be negative and has at most 2 decimals
  - start and destination must differ
  - unknown fields are ignored, and `userId` always comes from the session, never from the request body
- **Security:**
  - Helmet headers and a CORS allow-list
  - 10 kB body limit; MongoDB `$` operators are stripped from input
  - rate limits on login, registration and writes
  - login gives the same error message and response time whether or not the email exists
  - password hashes are never returned
  - JWT secret comes from the environment
- **Reliability:**
  - The server starts even if MongoDB is unreachable and keeps retrying the connection; until then the API returns `503`.
  - Health endpoint, graceful shutdown, and JSON errors everywhere with no stack traces leaked.
- **Backward compatible:** the old `PUT /api/itinerary` (itinerary id sent in `userId`) still works, but can no longer overwrite the owner.

---

## API

Base URL: `/api`. Routes marked 🔒 require `Authorization: Bearer <token>`.

### Auth
| Method | Path | Body | Response |
| ------ | ---- | ---- | -------- |
| POST | `/auth/register` | `name`, `email`, `phone`, `password` | `201` · `409` if the email exists · `400` on validation failure |
| POST | `/auth/login` | `email`, `password` | `200 { data: { userId, name, token } }` · `401` |
| GET 🔒 | `/auth/me` | – | Current user profile |

Validation rules:
- `name`: 2–20 letters and spaces
- `phone`: 10 digits starting with 6–9
- `password`: 8–15 characters, with an uppercase letter, a lowercase letter, a number and one of `@ # $ % &`

### Itineraries 🔒
| Method | Path | Notes |
| ------ | ---- | ----- |
| GET | `/itinerary?page&limit&search&sortBy&order` | `limit` ≤ 100; `sortBy` is one of `date, name, totalcost, createdAt, updatedAt`; `order` is `asc` or `desc`. Returns `{ data, currentPage, totalPages, total, limit }` |
| GET | `/itinerary/:id` | One itinerary |
| POST | `/itinerary` | All fields required (see below) |
| PUT / PATCH | `/itinerary/:id` | Partial update |
| DELETE | `/itinerary/:id` | Delete |

Itinerary fields:

| Field | Rule |
| ----- | ---- |
| `name` | 2–60 characters |
| `from`, `to` | 2–60 characters, must be different |
| `date` | `YYYY-MM-DD`, a real date between 2000 and 2100 |
| `duration` | Number of days (1–365, stored as `"3 days"`) or a short text |
| `location`, `hotelName` | 2–80 characters |
| `totalcost` | Number ≥ 0, at most 2 decimal places |

### Health
`GET /api/health` returns `200` when MongoDB is connected and `503` otherwise.

---

## Getting started

```bash
git checkout backend
npm install
cp .env.example .env    # then fill in MONGO_STRING and JWT_SECRET
npm run dev             # http://localhost:5000
```

### Environment variables

| Variable | Required | Description |
| -------- | -------- | ----------- |
| `MONGO_STRING` | ✅ | MongoDB connection string |
| `JWT_SECRET` | ✅ in production | Long random string. If missing, a random one is generated at startup, so everyone is logged out on each restart |
| `JWT_EXPIRES_IN` | | Session length, default `2d` |
| `CORS_ORIGINS` | production | Comma-separated frontend URLs, e.g. `https://pritams1.netlify.app` |
| `PORT` | | Default `5000` |
| `TRUST_PROXY` | | Default `1` (Render/Heroku); `false` when not behind a proxy |
| `ALLOW_REGISTRATION` | | Default `true` |

### Scripts
| Command | Description |
| ------- | ----------- |
| `npm start` | Start the server |
| `npm run dev` | Start with nodemon |

---

## Project structure

```
index.js                     # App setup, security middleware, DB connection, shutdown
src/
├── config.js                # Environment parsing
├── auth/auth.js             # JWT authentication middleware
├── controller/              # userController, itineraryController
├── middleware/index.js      # Rate limits, input sanitising, DB guard, 404/error handlers
├── model/                   # User and Itinerary Mongoose schemas
├── routes/                  # auth.route, itinerary.route
└── valid/valid.js           # Input validation
```

---

## Deploying (Render)

1. Start command `npm start`.
2. Set `MONGO_STRING`, `JWT_SECRET` and `CORS_ORIGINS=https://pritams1.netlify.app`.
3. Keep `.env` out of git. It's in `.gitignore`.

---

## Author

**Pritam Samaddar** · [GitHub @prisam1](https://github.com/prisam1)
