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

Requires a bearer session token. Accepts a JSON body:

```json
{
  "name": "Aniket Chaudake",
  "email": "aniket@example.com",
  "phone": "+14155550134",
  "college": "North Valley University",
  "course": "BSc Computer Science",
  "skills": "React, Node.js, API security",
  "resumeUrl": "https://example.com/resume.pdf",
  "portfolioUrl": "https://example.com",
  "message": "I am excited to apply for this internship opportunity.",
  "internshipId": "internship-1"
}
```

`name`, `email`, `phone`, `college`, `course`, `skills`, `resumeUrl`, `message`, and `internshipId` are required. `portfolioUrl` is optional. Email is trimmed and lowercased. Phone input must contain 7 to 15 digits and is stored without spaces or punctuation. Resume and portfolio URLs must use HTTP or HTTPS. Text fields have explicit maximum lengths and are normalized on the server. Successful applications return `201` with an application ID, internship ID, `pending` status, and timestamp; applicant personal data is not echoed. Validation failures return `400` with field-level `details`. An account cannot have more than one pending or approved application for the same internship; duplicates return `409`. Application submissions are limited to 10 per hour per client IP by default.

Example successful response:

```json
{
  "data": {
    "id": "<application-id>",
    "internshipId": "internship-1",
    "status": "pending",
    "createdAt": "<ISO-8601 timestamp>"
  },
  "requestId": "<request-id>"
}
```

Example rejected response (`400`):

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Please correct the invalid fields.",
    "details": [
      { "field": "email", "message": "A valid email address is required." },
      { "field": "phone", "message": "Enter a valid phone number with 7 to 15 digits." }
    ]
  },
  "requestId": "<request-id>"
}
```

## `GET /applications/mine`

Requires a bearer session token and returns only that account's applications, including pending, approved, or rejected status. Approved applications include the corresponding internship and its guided tasks.

## `GET /applications/review` and `POST /applications/:id/review`

Require a bearer session token and the `X-Review-Key` header matching the server's `APPLICATION_REVIEW_KEY`. The protected review queue includes applicant contact, education, skill, resume, and application details. Review requests accept `{ "status": "approved" }` or `{ "status": "rejected" }` for pending applications; an already-reviewed application returns `409` and its decision cannot be changed. A learner can open the internship dashboard only after an application is approved. The development-only default review key is `local-review-only`; configure a strong secret in non-development environments.

## `GET /submissions/task-04`, `POST /submissions`, and `GET /submissions/files/:fileId`

All submission routes require a bearer session token. POST accepts JSON with `taskId` and `githubUrl`, or multipart form data with `taskId`, optional `githubUrl`, and up to five `files` fields. Provide either a GitHub repository URL or at least one file. Accepted uploads are PDF, ZIP, TXT, JSON, PNG, and JPEG, with a 10 MB per-file limit. Uploaded files are stored outside the public web root; the response includes file IDs and metadata. Downloading a file requires its owner's bearer session. Submission records are in memory; files are stored in `server/uploads/`.

## Errors

Errors use `{ "error": { "code": "...", "message": "...", "details": [] }, "requestId": "..." }`; `details` is present for field validation errors. The general API rate limit defaults to 60 requests per minute per client IP. Configure values in `server/.env`.

## Storage limitation

The repository does not configure a database or ORM. Accounts, sessions, internships, applications, and submission metadata are held in memory and are lost when the API process restarts. Uploaded evidence files are stored under the ignored `server/uploads/` directory. This demo must not be used to collect real applicant information until durable database persistence, retention, and privacy controls are added.
