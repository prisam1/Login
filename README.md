# Itinerary: Trip Planner

A responsive React app for planning trips. Create an account, then record each itinerary's route, travel date, duration, stay and total cost, and browse them in a searchable, sortable dashboard.

**Live:** https://pritams1.netlify.app

---

## Features

### Accounts
- **Register:**
  - live validation that matches the server's rules
  - a password checklist with a strength meter
  - Indian mobile number normalisation (`+91 98765 43210` becomes `9876543210`)
  - a clear message when the email is already in use
- **Log in:** show/hide password, Caps Lock warning, and the server's actual error message ("Incorrect password", "User not Exist").
- **Session safety:**
  - The JWT expiry is checked on load and on a timer, and a `401` from the API logs you out with a notice.
  - Logging out in one tab logs out the others.
- **Smart redirects:**
  - Protected pages send you to login, then back where you were. Only same-site paths are used for this redirect.
  - A logged-in user who opens `/login` or `/register` goes straight to the dashboard.

### Itineraries
- **Dashboard:**
  - grid and table views
  - search across trip name, places and hotel
  - sort soonest or latest, newest added, name, or highest or lowest cost
  - delete with a confirmation step
  - 6, 12, 24 or 48 items per page, with numbered pagination
  - every filter is kept in the URL, so it survives a refresh and can be shared
- **Trip status badges:** Today, Tomorrow, In N days, Upcoming, Completed, or No date for older free-text entries.
- **Details dialog:** full trip info, copy-to-clipboard, duplicate as a new trip, and edit (owner only).
- **Create and edit form:**
  - grouped sections, with a live preview card next to the form
  - from/to swap button and character counters
  - duration in days
  - cost in ₹ with at most 2 decimals
  - start and destination must be different
  - past dates are allowed but flagged
- **Unsaved-changes guard:** a confirmation dialog when you navigate away inside the app, plus the browser prompt when you close or reload the tab.
- **The edit page works from a link or after a refresh:** the itinerary is loaded from the API.
- **Private:** you only see your own itineraries, and the user ID comes from your session.

### UX and accessibility
- Light and dark themes. The app follows the system setting until you choose, and loads without a flash of the wrong theme.
- Fully responsive. The mobile menu closes on outside click or `Esc`, dialogs become bottom sheets on phones, and safe-area insets are respected.
- Loading skeletons, empty states, retryable error states, an offline banner, and an error page for unexpected crashes.
- Keyboard-friendly:
  - a skip-to-content link
  - focus-trapped dialogs
  - visible focus rings
  - ARIA labels and live regions
  - support for reduced motion
- Toast notifications for every action.

---

## Tech stack

| Concern  | Choice |
| -------- | ------ |
| UI       | React 18, plain CSS with design tokens (light/dark), Lucide icons |
| Routing  | React Router 6 (data router: unsaved-changes blocker, scroll restoration) |
| State    | Redux Toolkit + redux-persist (auth session) |
| Forms    | React Hook Form |
| HTTP     | Axios (token injection, auto-logout on `401`, friendly error mapping) |
| Feedback | React-Toastify |
| Hosting  | Netlify |

---

## Getting started

```bash
git clone https://github.com/prisam1/Login.git
cd Login
npm install
npm start            # http://localhost:3000
```

### Environment variables (`.env`)

| Variable | Description | Default |
| -------- | ----------- | ------- |
| `REACT_APP_API_URL` | Backend base URL, including `/api` | `https://cust-rks8.onrender.com/api` |
| `INLINE_RUNTIME_CHUNK` | Keep it `false` so the Content Security Policy can block inline scripts | `false` |
| `GENERATE_SOURCEMAP` | Don't publish source maps | `false` |

> `REACT_APP_*` values are bundled into the public JavaScript. Never put secrets in them.

### Scripts

| Command | Description |
| ------- | ----------- |
| `npm start` | Development server |
| `npm run build` | Production build in `build/` |
| `npm test` | Run tests |

---

## Project structure

```
src/
├── components/
│   ├── Layout/        # Header, Footer, AuthLayout
│   ├── common/        # Modal, ConfirmDialog, Field, PasswordInput, EmptyState, SessionWatcher, …
│   └── itinerary/     # ItineraryCard, ItineraryForm, ItineraryDetails, Pagination
├── hooks/             # useAuth, useItineraries, useSaveItinerary, useUnsavedChanges, useTheme, …
├── Pages/             # HomePage, Auth/Login, Auth/Register, Dashboard, CreateIt, UpdateIt, PageNotFound
├── redux/             # auth slice + persisted store
├── routes/            # ProtectedRoute, GuestRoute
├── Services/          # Axios instance, auth & itinerary API calls, error mapping
├── style/             # Per-feature stylesheets
├── utils/             # Formatting, validation, session/JWT, cache & ownership helpers
├── index.css          # Design tokens, base styles and shared components
└── router.js          # Route table
```

### Routes

| Path | Access | Page |
| ---- | ------ | ---- |
| `/` | public | Landing page |
| `/login`, `/register` | guests only | Authentication |
| `/dashboard` | logged in | Itinerary dashboard (`?q=`, `sort=`, `page=`, `limit=`, `view=table`) |
| `/create` | logged in | New itinerary (or duplicate) |
| `/itinerary/:id/edit` | owner | Edit itinerary |

---

## API used

The backend lives on the `backend` branch (Express + MongoDB).

| Method | Endpoint | Used for |
| ------ | -------- | -------- |
| POST | `/auth/register` | Create account (`name`, `email`, `phone`, `password`) |
| POST | `/auth/login` | Log in → `{ data: { userId, name, token } }` |
| GET | `/itinerary?page&limit&search&sortBy&order` | List your itineraries (`{ data, total, totalPages }`) |
| GET | `/itinerary/:id` | Load one itinerary (edit page) |
| POST | `/itinerary` | Create itinerary |
| PUT | `/itinerary/:id` | Update itinerary |
| DELETE | `/itinerary/:id` | Delete itinerary |

See the backend README on the `backend` branch for full details.

---

## Deployment (Netlify)

- Build command `npm run build`, publish directory `build`.
- `public/_redirects` makes deep links such as `/dashboard` work on refresh.
- `public/_headers` adds security headers: CSP, `X-Frame-Options: DENY`, `nosniff`, a referrer policy and a permissions policy. It also enables long-term caching for hashed assets.

---

## Author

**Pritam Samaddar** · [GitHub @prisam1](https://github.com/prisam1)
