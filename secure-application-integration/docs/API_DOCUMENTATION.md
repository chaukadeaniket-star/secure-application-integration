# API Documentation

Base URL in development: `http://localhost:4000/api`

All responses are JSON and include a `requestId`. The same value is returned in the `X-Request-Id` response header.

## `GET /health`

Returns `{ "status": "ok", "requestId": "..." }`.

## `GET /internships`

Returns `{ "data": [...], "meta": { "count": 12, "categories": [...] }, "requestId": "..." }`. Each internship includes skills and a step-by-step set of track tasks with durations and deliverables.

Optional query parameters:

- `search`: literal, case-insensitive search over title, company, category, and description.
- `location`: literal, case-insensitive location filter.
- `category`: exact, case-insensitive internship track filter. Search also matches listed skills.

## `GET /internships/:id`

Returns one internship as `{ "data": {...}, "requestId": "..." }`, or a `404` JSON error.

## `POST /auth/register`

Accepts a JSON body with `name`, `email`, and a password between 8 and 128 characters. Successful registrations return `201` with the new account's public fields. Passwords are stored as scrypt hashes. Duplicate email addresses return `409`.

## `POST /auth/login`

Accepts `email` and `password`. Successful logins return a bearer session token and public user fields. Invalid credentials return `401`.

## `GET /auth/session` and `POST /auth/logout`

Send `Authorization: Bearer <token>` to retrieve the current session or revoke it. Sessions are held in memory and expire when the server restarts.

## `POST /applications`

Requires `Authorization: Bearer <token>`.

Accepts a JSON body:

```json
{
  "name": "Aniket Chaudake",
  "email": "aniket@example.com",
  "portfolioUrl": "https://example.com",
  "message": "I am excited to apply for this internship opportunity.",
  "internshipId": "internship-1"
}
```

`portfolioUrl` is optional. Successful applications return `201` with an application ID, internship ID, `pending` status, and timestamp; applicant personal data is not echoed. Validation failures return `400` with a `details` array. An account cannot have more than one pending or approved application for the same internship; duplicates return `409`. Application submissions are limited to 10 per hour per client IP by default.

## `GET /applications/mine`

Requires a bearer session token and returns only that account's applications, including pending, approved, or rejected status. Approved applications include the corresponding internship and its guided tasks.

## `GET /applications/review` and `POST /applications/:id/review`

Require a bearer session token and the `X-Review-Key` header matching the server's `APPLICATION_REVIEW_KEY`. Review requests accept `{ "status": "approved" }` or `{ "status": "rejected" }` for pending applications; an already-reviewed application returns `409` and its decision cannot be changed. A learner can open the internship dashboard only after an application is approved. The development-only default review key is `local-review-only`; configure a strong secret in non-development environments.

## `GET /submissions/task-04`, `POST /submissions`, and `GET /submissions/files/:fileId`

All submission routes require a bearer session token. POST accepts JSON with `taskId` and `githubUrl`, or multipart form data with `taskId`, optional `githubUrl`, and up to five `files` fields. Provide either a GitHub repository URL or at least one file. Accepted uploads are PDF, ZIP, TXT, JSON, PNG, and JPEG, with a 10 MB per-file limit. Uploaded files are stored outside the public web root; the response includes file IDs and metadata. Downloading a file requires its owner's bearer session. Submission records are in memory; files are stored in `server/uploads/`.

## Errors

Errors use `{ "error": { "code": "...", "message": "...", "details": [] }, "requestId": "..." }`; `details` is present for field validation errors. The general API rate limit defaults to 60 requests per minute per client IP. Configure values in `server/.env`.
