# Full-Stack Authentication System (MERN + JWT Cookies)

A production-ready authentication system:

- **Frontend:** React + Vite, React Router DOM, Axios, React Hot Toast
- **Backend:** Node.js, Express, MongoDB (Mongoose), JWT stored in HTTP-only cookies, bcryptjs

```
auth-app/
├── backend/
│   ├── config/db.js
│   ├── controllers/authController.js
│   ├── middleware/authMiddleware.js
│   ├── models/User.js
│   ├── routes/authRoutes.js
│   ├── utils/generateToken.js
│   ├── .env.example
│   ├── server.js
│   └── package.json
└── frontend/
    ├── src/
    │   ├── api/axios.js
    │   ├── components/Navbar.jsx
    │   ├── components/ProtectedRoute.jsx
    │   ├── context/AuthContext.jsx
    │   ├── pages/Home.jsx
    │   ├── pages/Login.jsx
    │   ├── pages/Register.jsx
    │   ├── pages/Profile.jsx
    │   ├── App.jsx
    │   ├── main.jsx
    │   └── style.css
    ├── index.html
    ├── vite.config.js
    ├── .env.example
    └── package.json
```

---

## 1. MongoDB setup

You need a running MongoDB instance. Pick one:

**Option A – Local MongoDB**
1. Install MongoDB Community Edition: https://www.mongodb.com/try/download/community
2. Start it: `mongod` (or via your OS service manager / `brew services start mongodb-community` on Mac)
3. Use this connection string in `.env`:
   ```
   MONGO_URI=mongodb://127.0.0.1:27017/auth_system
   ```

**Option B – MongoDB Atlas (free cloud cluster)**
1. Create a free cluster at https://www.mongodb.com/cloud/atlas
2. Create a database user (Database Access) and allow your IP (Network Access → "Allow access from anywhere" for testing)
3. Click "Connect" → "Drivers" and copy the connection string, then use it in `.env`:
   ```
   MONGO_URI=mongodb+srv://<username>:<password>@<cluster-url>/auth_system?retryWrites=true&w=majority
   ```

---

## 2. Backend setup

```bash
cd backend
npm install
cp .env.example .env
# edit .env and fill in MONGO_URI and JWT_SECRET
npm run dev
```

The API will run at `http://localhost:5000`.

### backend/.env example
```
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://127.0.0.1:27017/auth_system
JWT_SECRET=your_super_secret_jwt_key_change_this
CLIENT_URL=http://localhost:5173
```

> Generate a strong secret with: `openssl rand -base64 32`

---

## 3. Frontend setup

```bash
cd frontend
npm install
cp .env.example .env
# edit .env if your backend runs on a different URL/port
npm run dev
```

The app will run at `http://localhost:5173`.

### frontend/.env example
```
VITE_API_URL=http://localhost:5000/api
```

---

## 4. API routes

| Method | Route                 | Access  | Description                       |
|--------|------------------------|---------|------------------------------------|
| POST   | `/api/auth/register`   | Public  | Create a new user, sets JWT cookie |
| POST   | `/api/auth/login`      | Public  | Verify credentials, sets JWT cookie|
| POST   | `/api/auth/logout`     | Public  | Clears the JWT cookie              |
| GET    | `/api/auth/profile`    | Private | Returns the logged-in user's data  |

---

## 5. How JWT cookies work here

1. On successful register/login, the backend signs a JWT containing the user's ID (`jwt.sign({ userId }, JWT_SECRET, { expiresIn: "30d" })`).
2. That token is sent to the browser as an **HTTP-only cookie** (`res.cookie("jwt", token, { httpOnly: true, ... })`) — never in the JSON response body.
   - `httpOnly: true` means client-side JavaScript (`document.cookie`) cannot read it, which protects against token theft via XSS.
   - `secure: true` (in production) ensures it's only sent over HTTPS.
   - `sameSite` controls cross-site sending behavior; `"none"` is required if your frontend and backend live on different domains in production (and must be paired with `secure: true`).
3. On every subsequent request, the browser automatically attaches the cookie (as long as the request is made `withCredentials: true` from axios and CORS `credentials: true` is set on the server).
4. The `protect` middleware reads `req.cookies.jwt`, verifies it with `jwt.verify`, and — if valid — loads the matching user and attaches it to `req.user` before letting the request continue to protected routes like `/api/auth/profile`.
5. Logging out simply overwrites the cookie with an empty value and an expiry date in the past, so the browser deletes it.

This is more secure than storing the JWT in `localStorage`, since `localStorage` is fully readable by any JavaScript running on the page (a common target for XSS attacks).

---

## 6. How the frontend connects to the backend

- All API calls go through a single shared axios instance (`src/api/axios.js`) configured with:
  - `baseURL` = `VITE_API_URL` (defaults to `http://localhost:5000/api`)
  - `withCredentials: true` — this is what makes the browser send/receive the JWT cookie cross-origin.
- On the backend, `cors({ origin: CLIENT_URL, credentials: true })` allows exactly that origin to make cookie-bearing requests (using `origin: "*"` would **not** work with credentials).
- `AuthContext` (`src/context/AuthContext.jsx`) wraps the whole app. On mount, it calls `GET /api/auth/profile` — if the cookie is valid, the user stays "logged in" across page refreshes; otherwise `user` stays `null`.
- `ProtectedRoute` reads `user` from `AuthContext` and redirects to `/login` if there isn't one, protecting the `/profile` page.
- Login/Register pages POST to the backend, then call `login(data)` from `AuthContext` to update the app's global state — no token handling needed on the frontend, since the cookie is managed entirely by the browser.

---

## 7. Running the whole project

**Terminal 1 — backend**
```bash
cd backend
npm install
npm run dev
```

**Terminal 2 — frontend**
```bash
cd frontend
npm install
npm run dev
```

Then open `http://localhost:5173`, register an account, log in, and visit `/profile`.

---

## 8. Notes on going to production

- Set `NODE_ENV=production` so cookies are marked `secure` and `sameSite: "none"`.
- Serve the frontend over HTTPS (required for `secure` cookies to be sent).
- Update `CLIENT_URL` (backend) and `VITE_API_URL` (frontend) to your real deployed URLs.
- Consider adding: rate limiting on `/login` and `/register`, email verification, password reset flow, refresh tokens, and helmet.js for security headers.
