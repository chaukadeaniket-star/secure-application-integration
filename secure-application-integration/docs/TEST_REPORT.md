# Test Report

Run `npm test` from the project root to execute backend unit and integration tests with Vitest and Supertest.

## Covered scenarios

- Application and authentication field validation, email normalization, URL protocol restrictions, unexpected fields, and input sanitization.
- Configurable rate limiting and the `429` response.
- Internship listing, filtering, request IDs, secure response headers, and not-found behavior.
- Application creation, rejection of invalid or unknown records, personal-data minimization, and CORS origin restrictions.
- Duplicate application prevention and immutable reviewer decisions.
- Account registration, duplicate-account rejection, password verification, session lookup/revocation, and authenticated GitHub task submissions.
- Authenticated file uploads, allowlisted file types, owner-only file downloads, and GitHub-link-or-file submission validation.

Latest verification: 24 tests passed across 6 files, including the pending-to-review decision flow, duplicate application prevention, malformed JSON handling, and authenticated task submissions with uploaded files.
