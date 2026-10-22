# Security Checklist

## Implemented

- [x] Helmet applies standard browser security headers; Express `X-Powered-By` is disabled.
- [x] CORS permits the configured frontend origin only.
- [x] JSON request bodies are limited to 16 KB.
- [x] API requests and application submissions have configurable rate limits.
- [x] Application input is checked on both client and server; the server rejects unexpected fields.
- [x] Text input is normalized, stripped of control characters and angle-bracket markup, and trimmed.
- [x] Portfolio links are limited to HTTP and HTTPS protocols.
- [x] Errors include a request ID; unexpected server failures do not expose internal error details.
- [x] Application responses omit the applicant's personal information.
- [x] Registration validates credentials and stores password hashes rather than plaintext passwords.
- [x] Applications are associated with the signed-in account; only a reviewer key can change application approval status.
- [x] Task submissions require a valid in-memory bearer session and a GitHub repository URL or an uploaded file.
- [x] Submission uploads use generated server filenames, a file-type allowlist, a 10 MB per-file limit, and owner-checked downloads; files are not served from a public static directory.
- [x] Internship records are selected by exact ID and filters use literal string matching.
- [x] The demo uses in-memory data and executes no SQL; no user input is interpolated into queries.

## Before production

- [ ] Replace learning-demo authentication and application review keys with durable account storage, expiring/rotating sessions, account recovery, and abuse monitoring.
- [ ] Add CSRF protection if cookie authentication is introduced.
- [ ] Persist applications in a database with parameterized queries and appropriate access controls.
- [ ] Add retention, deletion, and privacy policies before collecting real applicant data.
- [ ] Use HTTPS, managed secrets, production logging/alerting, and a shared rate-limit store across instances.
- [ ] Replace the in-memory demo data and test endpoints with production integrations.
