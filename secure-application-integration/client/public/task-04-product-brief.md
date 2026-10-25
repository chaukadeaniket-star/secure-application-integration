# Internship Board Product Brief

## Requirements

- Browse internship opportunities from the API.
- Search by role, company, skill, and location.
- Apply to a selected opportunity with a validated application form.
- Show loading, empty, success, and recoverable failure states.
- Submit one GitHub repository URL with the completed task evidence.

## API contract

- `GET /api/internships?search=&location=` returns matching opportunities.
- `GET /api/internships/:id` returns one opportunity.
- `POST /api/applications` accepts `name`, `email`, `phone`, `college`, `course`, `skills`, `resumeUrl`, optional `portfolioUrl`, `message`, and `internshipId`.
- `POST /api/auth/register` creates an account; `POST /api/auth/login` issues a learning-demo session.
- `POST /api/submissions` records the authenticated learner's Task 04 GitHub URL.

All API responses are JSON. The server returns request IDs and field-level validation details for invalid requests.

## Acceptance criteria

- Search results match the submitted filters and refresh after retry.
- Invalid applications are rejected by both browser and server validation.
- A task submission requires a signed-in user and a valid GitHub repository URL.
- Automated tests cover normal and invalid request flows.
