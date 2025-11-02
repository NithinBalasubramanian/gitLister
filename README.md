# gitLister — API Reference

Small Express + TypeScript project that fetches GitHub repos and news, with user registration/login and Redis caching.

## Quick start

- Install dependencies:

```bash
npm install
```

- Development (live, uses ts-node):

```bash
npm run dev
```

- Build and run (production-like):

```bash
npm run build
npm start
```

## Required environment variables

- `MONGO_URL` — MongoDB connection string (Atlas or local)
- `JWT_CONFIG_KEY` — secret key used to sign JWT tokens
- `REDIS_URL` — (optional) Redis connection url, e.g. `redis://127.0.0.1:6379`
- `PORT` — (optional) port server listens on (default: 8080)

Create a `.env` file in the project root with the variables above for local development.

## Base paths

- User APIs: `/api/user`
- Public fetch APIs: `/api/public`

All protected endpoints require an `Authorization` header with a bearer JWT token produced by the login endpoint except for login and signup.

```
Authorization: Bearer <token>
```

## API endpoints

### 1) Register user

- Method: POST
- URL: `/api/user/addUser`
- Body (JSON):

```json
{
  "userName": "Alice",
  "userMail": "alice@example.com",
  "contact": "1234567890",
  "password": "secret"
}
```

- Success response: 200 with created user data (password hashed)

### 2) Login

- Method: POST
- URL: `/api/user/login`
- Body (JSON):

```json
{
  "userMail": "alice@example.com",
  "password": "secret"
}
```

- Success response: 200 JSON containing `data.JWT` and user info. Use this JWT in Authorization header for protected routes.

### 3) Get profile (protected)

- Method: GET
- URL: `/api/user/getProfile`
- Auth: Required (Bearer token)

- Success response: 200 with user profile (password is removed from the response)

### 4) Fetch GitHub repos (protected)

- Method: GET
- URL: `/api/public/fetchGitRepo`
- Auth: Required (Bearer token)

- Returns a list of public GitHub users (uses GitHub API). Responses may be cached in Redis if configured.

### 5) Fetch GitHub repos by user (protected)

- Method: GET
- URL: `/api/public/fetchGitRepoByUser/:userName`
- Auth: Required (Bearer token)

- Path params:
  - `userName` — GitHub username to fetch repos for

- Returns repository list for the requested GitHub user. Responses are cached in Redis when available.

### 6) Fetch news (protected)

- Method: GET
- URL: `/api/public/fetchNews`
- Auth: Required (Bearer token)

- Returns news from the configured external API. Responses are cached in Redis when available.

## Redis caching behavior

- The project uses Redis to cache results. By default the code uses `setEx(key, 3600, value)` (1 hour TTL) in `src/controller/publicFetchController.ts`.
- To change TTL to 10 seconds, update the `setEx` calls to use `10` as the TTL, for example:

```ts
// change this line in src/controller/publicFetchController.ts
await redisClient.setEx(key, 3600, JSON.stringify(listData));

// to
await redisClient.setEx(key, 10, JSON.stringify(listData));
```

If Redis is not available, the app continues without caching (it logs a warning). Make sure `REDIS_URL` is correct and Redis is running.

## Notes & troubleshooting

- If you receive errors about MongoDB connection (MongooseServerSelectionError), verify `MONGO_URL`, Atlas IP whitelist, and DB credentials.
- If you see `require is not defined` or ESM import errors, this project uses ESM (check `package.json` `type` and run `npm run dev` which uses `ts-node`).
- To test the protected endpoints:

1. Register a user at `/api/user/addUser`.
2. Login at `/api/user/login` and copy the returned `JWT`.
3. Call a protected endpoint with the header `Authorization: Bearer <JWT>`.


## Where to look in code

- `src/server.ts` — app startup, middleware, route mounting
- `src/router/userRouter.ts` — user routes
- `src/router/publicFetchRouter.ts` — public fetch routes
- `src/controller/userController.ts` — user registration/login/profile
- `src/controller/publicFetchController.ts` — GitHub & news fetch + Redis caching
- `src/lib/redisClient.ts` — Redis client

*** End of README ***
