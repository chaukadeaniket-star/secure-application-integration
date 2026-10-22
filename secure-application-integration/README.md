# Secure Application Integration

A full-stack internship portal with account registration and login, internship search and applications, a step-by-step task guide, GitHub task submissions, and a dynamic weekly activity chart.

## Requirements

- Node.js 20 or newer
- npm 10 or newer

## Quick start

```sh
npm install
```

Copy `client/.env.example` to `client/.env` and `server/.env.example` to `server/.env` if you need to change the defaults. Then run both applications:

```sh
npm run dev
```

- Frontend: http://localhost:5173
- API: http://localhost:4000/api
- Health check: http://localhost:4000/api/health

To build the frontend, run `npm run build`. To run backend unit and integration tests, run `npm test`.

Register an account in the portal, then log in with those credentials. Explore internship tracks across frontend, web, app/mobile, backend, IoT, finance/FinTech, data analytics, AI/ML, cloud/DevOps, cybersecurity, and product design. Search by role, company, skill, and location; filter by track category; open any track for guided tasks, step-by-step instructions, skills, and deliverables. Task 04 also includes a beginner guide and downloadable checklist, product brief, and integration test records. Submit a public GitHub repository URL or upload up to five PDF, ZIP, TXT, JSON, PNG, or JPEG files (10 MB each) from the task page after completing its checklist.

Internship applications follow **Apply → Review → Decision → Intern dashboard**. Applicants can track each application's status and next step under **My applications**. Reviewers sign in, open **Review**, and enter `APPLICATION_REVIEW_KEY` to approve or decline applications; pending applications appear first in the review queue. A candidate cannot submit another application for the same track while one is pending or approved, and a reviewed decision cannot be changed. Rejected candidates may apply again. In local development, the default review key is `local-review-only`; set a unique secret in `server/.env` and always configure a strong key outside local development. Only approved applications unlock the intern dashboard.

## Project structure

See the `client/`, `server/`, and `docs/` directories. The Task 04 learning materials are in `client/public/`. The API uses in-memory accounts, sessions, internships, applications, and task submission records; this data is cleared when the server restarts. Uploaded files are kept privately in the ignored `server/uploads/` directory and are available only to the account that submitted them.

## Security notes

The server validates and normalizes submitted data, hashes account passwords with scrypt, limits request rates, applies Helmet security headers, restricts CORS to the configured frontend origin, and returns request IDs with structured errors. Authentication is a learning-demo implementation with in-memory sessions, not production account storage. Use durable storage, secure session management, HTTPS, and production monitoring before handling real applicant data.
