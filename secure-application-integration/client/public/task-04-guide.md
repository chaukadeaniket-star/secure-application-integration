# Task 04: Secure Application Integration

**Level:** Beginner-friendly  
**Estimated time:** 90–120 minutes

## Objective

Integrate an internship frontend and backend safely while handling loading, validation, retry, and failure states.

## Step-by-step guide

1. Start the frontend and API. Load internship records from `GET /api/internships` and show a visible loading state, an empty state, and a retry action when the request fails.
2. Add search by role, company, skill, and location. Keep the results usable on narrow screens.
3. Build an application form. Validate name, email, optional portfolio URL, and message in the browser and on the server. Show field errors and a success or failure state.
4. Protect the API with rate limits and secure headers. Keep user input parameterized if adding a database; never concatenate user input into a query.
5. Run the unit and integration tests. Record the commands and results in the submission.

## Passing checklist

- Internship records load from the API and show loading, empty, failure, and retry states.
- Search filters the opportunities and applying selects the correct internship.
- The application form has client- and server-side validation.
- Rate limiting, security headers, and safe query handling are described in a short security checklist.
- Tests pass and the setup instructions are documented.

## Submission

Submit one public or view-only GitHub repository URL. Keep the integrated source, test report, and security checklist in that repository so one proof link is enough.
