# Test Report

## Commands and results

Executed from the `secure-application-integration/` directory on 2026-10-25:

- `npm test --workspace server` — passed: 6 test files, 25 tests.
- `npm run build` — passed: Vite production build completed and wrote `client/dist/`.
- `npm run lint` — not available; no lint script is defined in the root or client package.
- Live local smoke check — `GET /api/health` returned `status: ok`; `GET /api/internships` returned internship data in the browser; the frontend rendered at `http://localhost:5173/`.

## Covered scenarios

- Application and authentication field validation, email normalization, URL protocol restrictions, unexpected fields, and input sanitization.
- Configurable rate limiting and the `429` response.
- Internship listing, filtering, request IDs, secure response headers, and not-found behavior.
- Application creation with the required personal, education, skills, and resume fields; rejection of missing/invalid fields and unknown internships; personal-data minimization; and CORS origin restrictions.
- Duplicate application prevention and immutable reviewer decisions.
- Account registration, duplicate-account rejection, password verification, session lookup/revocation, and authenticated GitHub task submissions.
- Authenticated file uploads, allowlisted file types, owner-only file downloads, and GitHub-link-or-file submission validation.

The successful application flow also verifies that the protected review queue can retrieve the submitted phone, college, and resume URL while the submit response does not echo applicant details. The suite covers the pending-to-review flow, duplicate prevention, malformed JSON, rate limiting, authentication, and authenticated task submissions with uploads.

## Limitations

- There is no configured database or repository layer, so application persistence is in memory and is lost when the server restarts. Database durability and parameterized-query behavior cannot be tested until a database is selected and configured.
- There is no frontend test runner configured. Frontend behavior is compile-checked by the production build; the backend request integration is covered by Supertest.
- A deployment build requires the repository Actions variable `VITE_API_URL`; the API deployment must also set `CLIENT_ORIGIN` to the actual deployed frontend origin. Those external deployment values are not present in this checkout.
- No hosted API credentials or deployment service were available, so production-origin CORS and hosted end-to-end behavior were not verified.
