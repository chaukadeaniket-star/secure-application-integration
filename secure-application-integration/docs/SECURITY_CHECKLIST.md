# Security Checklist

## Implemented

- [x] Helmet applies standard browser security headers; Express `X-Powered-By` is disabled.
- [x] CORS permits the configured frontend origin only.
- [x] JSON request bodies are limited to 16 KB.
- [x] API requests and application submissions have configurable rate limits.
- [x] Required application fields (name, normalized email, phone, college, course, skills, resume URL, message, and internship ID) are checked on both client and server; the server rejects unexpected fields.
- [x] Application text and URL fields have length limits; phone numbers are normalized and checked for 7 to 15 digits; resume and portfolio links accept only HTTP or HTTPS.
- [x] Text input is normalized, stripped of control characters and angle-bracket markup, and trimmed.
- [x] Portfolio links are limited to HTTP and HTTPS protocols.
- [x] Errors include a request ID; unexpected server failures do not expose internal error details.
- [x] Application responses omit the applicant's personal information.
- [x] Registration validates credentials and stores password hashes rather than plaintext passwords.
- [x] Applications are associated with the signed-in account; only a signed-in user with the reviewer key can access applicant details or change application approval status.
- [x] Task submissions require a valid in-memory bearer session and a GitHub repository URL or an uploaded file.
- [x] Submission uploads use generated server filenames, a file-type allowlist, a 10 MB per-file limit, and owner-checked downloads; files are not served from a public static directory.
- [x] Internship records are selected by exact ID and filters use literal string matching.
- [x] The repository has no configured database and executes no SQL; no user input is interpolated into queries. Application records are in-memory and are lost when the server restarts.

## Before production

- [ ] Replace learning-demo authentication and application review keys with durable account storage, expiring/rotating sessions, account recovery, and abuse monitoring.
- [ ] Add CSRF protection if cookie authentication is introduced.
- [ ] Add durable application persistence with parameterized database operations and appropriate access controls; no database is configured in this repository.
- [ ] Add retention, deletion, and privacy policies before collecting real applicant data.
- [ ] Use HTTPS, managed secrets, production logging/alerting, and a shared rate-limit store across instances.
- [ ] Replace the in-memory demo data and test endpoints with production integrations.
