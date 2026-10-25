# Secure Application Integration

A full-stack internship portal with account registration and login, API-backed internship search, validated applications, reviewer decisions, a step-by-step task guide, GitHub task submissions, and a dynamic weekly activity chart.

## Requirements

- Node.js 20 or newer
- npm 10 or newer

## Quick start

```sh
npm install
```

Copy `client/.env.example` to `client/.env` and `server/.env.example` to `server/.env` if you need to change the defaults. `VITE_API_URL` is the frontend API base URL; `CLIENT_ORIGIN` is the single browser origin allowed by the API. Then run both applications:

```sh
npm run dev
```

- Frontend: http://localhost:5173
- API: http://localhost:4000/api
- Health check: http://localhost:4000/api/health

To build the frontend, run `npm run build`. To run backend unit and integration tests, run `npm test`.

The repository-root GitHub Pages workflow tests and builds from the `secure-application-integration/` subdirectory and publishes `client/dist`. Pages hosts the frontend only; deploy the Express API separately, set the repository Actions variable `VITE_API_URL` to its public `/api` URL, and configure the API's `CLIENT_ORIGIN` to the deployed Pages origin for the complete application to work online. The workflow stops before building if `VITE_API_URL` is missing.

## Application API

Internships load from `GET /api/internships`; the interface includes loading, empty, error, and retry states. Applying requires a signed-in account and sends full name, email, phone, college, course, skills, resume URL, optional portfolio URL, interest message, and internship ID to `POST /api/applications`. The client validates before sending and the API repeats validation, normalizes email/phone input, rejects invalid requests with field errors, and prevents duplicate pending or approved applications. Only signed-in reviewers with the server-configured review key can see applicant details.

Useful commands from this directory:

```sh
npm run dev
npm run build
npm test
```

The client package has no lint script. The backend tests use Vitest and Supertest. See [API_DOCUMENTATION.md](docs/API_DOCUMENTATION.md), [SECURITY_CHECKLIST.md](docs/SECURITY_CHECKLIST.md), and [TEST_REPORT.md](docs/TEST_REPORT.md) for the endpoint contract and verification status.

Register an account in the portal, then log in with those credentials. Explore internship tracks across frontend, web, app/mobile, backend, IoT, finance/FinTech, data analytics, AI/ML, cloud/DevOps, cybersecurity, and product design. Search by role, company, skill, and location; filter by track category; open any track for guided tasks, step-by-step instructions, skills, and deliverables. Task 04 also includes a beginner guide and downloadable checklist, product brief, and integration test records. Submit a public GitHub repository URL or upload up to five PDF, ZIP, TXT, JSON, PNG, or JPEG files (10 MB each) from the task page after completing its checklist.

Internship applications follow **Apply → Review → Decision → Intern dashboard**. Applicants can track each application's status and next step under **My applications**. Reviewers sign in, open **Review**, and enter `APPLICATION_REVIEW_KEY` to approve or decline applications; pending applications appear first in the review queue. A candidate cannot submit another application for the same track while one is pending or approved, and a reviewed decision cannot be changed. Rejected candidates may apply again. In local development, the default review key is `local-review-only`; set a unique secret in `server/.env` and always configure a strong key outside local development. Only approved applications unlock the intern dashboard.

## Project structure

See the `client/`, `server/`, and `docs/` directories. The Task 04 learning materials are in `client/public/`. No database or ORM is configured: the API uses in-memory accounts, sessions, internships, applications, and task submission records, cleared when the server restarts. Uploaded files are kept privately in the ignored `server/uploads/` directory and are available only to the account that submitted them. Do not use this demo to collect real applicant information until durable storage and production privacy controls are configured.

## Security notes

The server validates and normalizes submitted data, hashes account passwords with scrypt, limits request rates, applies Helmet security headers, restricts CORS to the configured frontend origin, and returns request IDs with structured errors. Authentication is a learning-demo implementation with in-memory sessions, not production account storage. Use durable storage, secure session management, HTTPS, and production monitoring before handling real applicant data.
