const task = (title, description, steps, deliverable, duration = '2–3 hours') => ({
  title, description, steps, deliverable, duration
});

export const internships = [
  {
    id: 'internship-1',
    title: 'Full Stack Development Intern',
    company: 'Edvyro',
    location: 'Remote',
    stipend: 15000,
    duration: '3 months',
    category: 'Web Development',
    level: 'Beginner friendly',
    description: 'Build responsive web experiences, connect APIs, and deliver a complete feature from UI to backend.',
    skills: ['HTML', 'CSS', 'JavaScript', 'React', 'Node.js', 'REST APIs'],
    tasks: [
      task('Build an accessible web page', 'Create a responsive profile and opportunity listing page.', ['Set up semantic page sections and reusable cards.', 'Style desktop and mobile layouts with a consistent type scale.', 'Add keyboard focus states and accessible labels.'], 'Responsive page source and screenshots.'),
      task('Connect a REST API', 'Fetch, filter, and display live opportunity records.', ['Load records from the API and show loading, empty, and error states.', 'Add search and location filters.', 'Provide a retry action and test an unavailable API.'], 'Working API-driven list with a short test report.'),
      task('Create a validated application form', 'Build a safe application form and integrate server validation.', ['Validate required fields in the browser.', 'Submit to the API and show field-level server errors.', 'Handle success, duplicate submissions, and request failures.'], 'Integrated form and API validation tests.'),
      task('Ship a full-stack feature', 'Package the feature with documentation and a secure handoff.', ['Review input handling and security headers.', 'Run the full test suite and fix failures.', 'Document setup, API usage, and one security decision.'], 'Public repository, test report, and security checklist.')
    ]
  },
  {
    id: 'internship-2',
    title: 'Frontend Engineering Intern',
    company: 'Northstar Labs',
    location: 'Hybrid · Bengaluru',
    stipend: 18000,
    duration: '4 months',
    category: 'Frontend',
    level: 'Beginner friendly',
    description: 'Create polished, accessible interfaces and improve the performance of a modern web product.',
    skills: ['React', 'JavaScript', 'CSS', 'Accessibility', 'Testing', 'Web performance'],
    tasks: [
      task('Responsive component library', 'Create reusable interface components from a small design brief.', ['Build buttons, cards, form fields, and navigation.', 'Add variants and interactive states.', 'Check responsive layouts at mobile and desktop widths.'], 'Component gallery with screenshots.'),
      task('Accessible search experience', 'Build a fast, keyboard-friendly search and filtering flow.', ['Create labeled search and filter controls.', 'Filter results without losing keyboard focus.', 'Add empty and clear-filter states.'], 'Searchable interface and accessibility checklist.'),
      task('Frontend testing and performance', 'Test key flows and improve client-side performance.', ['Write component and interaction tests.', 'Measure the production build and inspect large assets.', 'Fix one performance or accessibility issue.'], 'Test report and before/after performance note.'),
      task('Product-ready frontend', 'Deliver a cohesive feature with documentation.', ['Integrate components with the API.', 'Verify loading, success, and failure cases.', 'Document decisions and setup.'], 'Working demo, repository link, and test report.')
    ]
  },
  {
    id: 'internship-3',
    title: 'Product Design Intern',
    company: 'Brightpath',
    location: 'Remote',
    stipend: 12000,
    duration: '3 months',
    category: 'UI/UX Design',
    level: 'Beginner friendly',
    description: 'Research user needs and turn product workflows into thoughtful, accessible interface designs.',
    skills: ['Figma', 'User research', 'Prototyping', 'Design systems', 'Accessibility'],
    tasks: [
      task('Map a user journey', 'Understand a learner workflow and identify its friction points.', ['Define a target user and their goal.', 'Map the current journey and pain points.', 'Prioritize improvements using user impact.'], 'Journey map and short research summary.'),
      task('Create a design system starter', 'Define consistent interface foundations and reusable patterns.', ['Choose color, type, and spacing tokens.', 'Design core form and navigation components.', 'Check contrast and component states.'], 'Design tokens and component sheet.'),
      task('Prototype an application flow', 'Design and prototype an internship application experience.', ['Sketch the main screens and user decisions.', 'Link a clickable happy path and an error path.', 'Run a brief usability review and revise.'], 'Clickable prototype and usability notes.'),
      task('Present the product solution', 'Communicate the design outcome and implementation details.', ['Prepare a concise case study.', 'Show key iterations and accessibility checks.', 'List open questions for engineering.'], 'Portfolio-ready case study and prototype link.')
    ]
  },
  {
    id: 'internship-4',
    title: 'Backend Development Intern',
    company: 'Cloudline',
    location: 'Pune',
    stipend: 20000,
    duration: '6 months',
    category: 'Backend',
    level: 'Intermediate',
    description: 'Build reliable REST services, validate data, and improve observability for cloud applications.',
    skills: ['Node.js', 'Express', 'REST APIs', 'SQL', 'Testing', 'Security'],
    tasks: [
      task('Design a REST API', 'Define clear resources and predictable response shapes.', ['Model a small domain and its relationships.', 'Implement list and detail endpoints.', 'Add filtering, pagination, and request IDs.'], 'API contract and endpoint tests.'),
      task('Validate and persist data', 'Accept user input safely and store it consistently.', ['Define request validation rules.', 'Use parameterized queries or a repository layer.', 'Return useful field errors without leaking internals.'], 'Validated endpoint and data-layer tests.'),
      task('Add security and observability', 'Protect the service and make failures diagnosable.', ['Configure secure headers, CORS, and rate limits.', 'Add structured errors and request correlation.', 'Test malformed, oversized, and unauthorized requests.'], 'Security checklist and test report.'),
      task('Deploy a service', 'Prepare a backend service for a repeatable release.', ['Add environment-based configuration.', 'Document health checks and startup.', 'Create a deployment and rollback checklist.'], 'Deployable API repository and runbook.')
    ]
  },
  {
    id: 'internship-5',
    title: 'Mobile App Development Intern',
    company: 'PocketWorks',
    location: 'Remote',
    stipend: 17000,
    duration: '4 months',
    category: 'App Development',
    level: 'Beginner friendly',
    description: 'Build a useful mobile experience for Android and iOS with resilient API and offline states.',
    skills: ['Flutter', 'Dart', 'React Native', 'Mobile UI', 'REST APIs', 'Testing'],
    tasks: [
      task('Build a mobile screen set', 'Create an accessible onboarding and home flow.', ['Set up navigation and reusable mobile widgets.', 'Handle different screen sizes and text scaling.', 'Add form labels and touch-friendly controls.'], 'Runnable mobile screens and screenshots.'),
      task('Connect mobile data', 'Load and display API data with robust network states.', ['Fetch records from a REST endpoint.', 'Show loading, empty, offline, and retry states.', 'Add safe local caching for a recent response.'], 'API-connected flow and network test notes.'),
      task('Build an application flow', 'Submit a validated application from the mobile client.', ['Validate fields before submission.', 'Prevent duplicate taps while sending.', 'Show success and recoverable errors.'], 'Working application flow and test report.'),
      task('Prepare a mobile release', 'Package the app for a clear handoff.', ['Check navigation, accessibility, and API configuration.', 'Capture screenshots and document build steps.', 'List known issues and release checks.'], 'Project repository, demo build instructions, and checklist.')
    ]
  },
  {
    id: 'internship-6',
    title: 'IoT & Embedded Systems Intern',
    company: 'Circuit Grove',
    location: 'Hybrid · Hyderabad',
    stipend: 19000,
    duration: '5 months',
    category: 'IoT',
    level: 'Intermediate',
    description: 'Prototype connected-device experiences, model sensor data, and build a reliable device-to-dashboard flow.',
    skills: ['Arduino', 'ESP32', 'Sensors', 'MQTT', 'Python', 'Embedded C'],
    tasks: [
      task('Read and document sensor data', 'Build a small sensor prototype or simulator and record readings.', ['Choose a temperature, light, or motion sensor.', 'Read values at a fixed interval.', 'Document wiring, units, and expected ranges.'], 'Device sketch or simulator with sample readings.'),
      task('Send telemetry safely', 'Send device readings to a local or test MQTT broker.', ['Define a compact telemetry message.', 'Publish readings with timestamps and device IDs.', 'Handle reconnects and invalid sensor values.'], 'Message schema and connectivity demo.'),
      task('Build an IoT dashboard', 'Visualize recent device readings and connection status.', ['Load sample or live sensor records.', 'Show a chart, latest value, and offline state.', 'Filter by device or time range.'], 'Dashboard with sample dataset and screenshots.'),
      task('Test and secure the prototype', 'Prepare a safe and reproducible device demonstration.', ['Validate message payloads at the receiver.', 'Keep credentials out of source code.', 'Test disconnects and document limitations.'], 'Repository, test notes, and setup/security checklist.')
    ]
  },
  {
    id: 'internship-7',
    title: 'Finance & FinTech Analyst Intern',
    company: 'LedgerSpring',
    location: 'Remote',
    stipend: 16000,
    duration: '3 months',
    category: 'Finance & FinTech',
    level: 'Beginner friendly',
    description: 'Explore financial data, build clear reporting tools, and prototype a responsible fintech user journey.',
    skills: ['Excel', 'Financial modeling', 'Python', 'Data visualization', 'FinTech'],
    tasks: [
      task('Clean a sample transaction dataset', 'Prepare a fictional dataset for analysis.', ['Inspect columns and identify missing or duplicated records.', 'Normalize dates, categories, and currency fields.', 'Record assumptions and data-quality issues.'], 'Cleaned sample data and data dictionary.'),
      task('Build a finance dashboard', 'Summarize sample cash flow and spending trends.', ['Calculate totals and category breakdowns.', 'Visualize monthly income and expense trends.', 'Label units, date ranges, and caveats clearly.'], 'Dashboard or notebook with charts and formulas.'),
      task('Model a fictional product scenario', 'Compare simple budget or savings scenarios without financial advice.', ['State assumptions and inputs.', 'Calculate scenario outcomes transparently.', 'Test edge cases and explain limitations.'], 'Spreadsheet or script with an assumptions note.'),
      task('Present a responsible fintech concept', 'Design a clear prototype for a fictional finance feature.', ['Map a user journey and explain user consent.', 'Use synthetic data only and avoid collecting real account details.', 'Present results, risks, and next steps.'], 'Short case study, prototype, and data-safety checklist.')
    ]
  },
  {
    id: 'internship-8',
    title: 'Data Analytics Intern',
    company: 'Signal Peak',
    location: 'Remote',
    stipend: 18000,
    duration: '4 months',
    category: 'Data & Analytics',
    level: 'Beginner friendly',
    description: 'Transform raw datasets into reliable metrics, visual reports, and useful product recommendations.',
    skills: ['Python', 'SQL', 'Pandas', 'Data visualization', 'Statistics'],
    tasks: [
      task('Explore and clean data', 'Assess a sample dataset and create a reproducible cleanup.', ['Profile columns and distributions.', 'Handle missing values and duplicates.', 'Write down data-quality assumptions.'], 'Clean notebook and data-quality summary.'),
      task('Write analytical queries', 'Answer product questions with clear and safe queries.', ['Define metrics and their time windows.', 'Write grouped and filtered queries.', 'Check totals against a second calculation.'], 'SQL file and results with metric definitions.'),
      task('Build a visual report', 'Present trends without misleading chart choices.', ['Choose a chart that fits each question.', 'Label units, dates, and sample sizes.', 'Explain one limitation or uncertainty.'], 'Dashboard or report with a findings summary.'),
      task('Recommend a next experiment', 'Turn a finding into a testable product question.', ['Separate observation from interpretation.', 'Propose a measurable hypothesis.', 'Define a metric and a guardrail.'], 'One-page recommendation and analysis artifacts.')
    ]
  },
  {
    id: 'internship-9',
    title: 'AI & Machine Learning Intern',
    company: 'Model Foundry',
    location: 'Hybrid · Chennai',
    stipend: 22000,
    duration: '6 months',
    category: 'AI & Machine Learning',
    level: 'Intermediate',
    description: 'Build reproducible ML experiments and evaluate model behavior with clear limitations.',
    skills: ['Python', 'Machine learning', 'Pandas', 'Model evaluation', 'Jupyter'],
    tasks: [
      task('Prepare a sample dataset', 'Create a reproducible dataset split and baseline.', ['Inspect missing values and potential leakage.', 'Separate training and evaluation data.', 'Record the random seed and preprocessing steps.'], 'Notebook with reproducible preprocessing.'),
      task('Train a baseline model', 'Compare a simple model against a transparent baseline.', ['Choose an appropriate baseline.', 'Train a small model using the training split.', 'Record metrics on held-out data.'], 'Notebook with baseline and model metrics.'),
      task('Evaluate errors and limitations', 'Understand where the model performs poorly.', ['Review false positives and false negatives.', 'Compare performance across relevant groups where appropriate.', 'Document limits and intended use.'], 'Evaluation report with error examples.'),
      task('Package a safe demo', 'Create a small demo that explains model output responsibly.', ['Validate inputs and handle unsupported data.', 'Show confidence and limitations clearly.', 'Document setup and prevent sensitive data from being committed.'], 'Demo, repository, and model card summary.')
    ]
  },
  {
    id: 'internship-10',
    title: 'Cloud & DevOps Intern',
    company: 'Skyward Systems',
    location: 'Pune',
    stipend: 21000,
    duration: '5 months',
    category: 'Cloud & DevOps',
    level: 'Intermediate',
    description: 'Improve developer workflows with repeatable builds, reliable deployments, and useful service monitoring.',
    skills: ['Docker', 'Linux', 'CI/CD', 'Cloud fundamentals', 'Monitoring'],
    tasks: [
      task('Containerize a sample service', 'Create a repeatable local build and run workflow.', ['Write a minimal container definition.', 'Configure a non-root runtime where practical.', 'Document ports, environment variables, and health checks.'], 'Container configuration and local run guide.'),
      task('Create a CI workflow', 'Automate a build and test check for each change.', ['Install dependencies reproducibly.', 'Run tests and a production build.', 'Publish clear failure logs.'], 'CI configuration and passing run evidence.'),
      task('Add service health signals', 'Make service status and common failures visible.', ['Expose a health check.', 'Add structured request logs.', 'Create a simple alert/runbook scenario.'], 'Health checks, sample logs, and runbook.'),
      task('Plan a safe release', 'Document a small deployment and rollback process.', ['Separate development and production configuration.', 'List secret-handling and access-control requirements.', 'Define rollback and post-release checks.'], 'Deployment plan and security checklist.')
    ]
  },
  {
    id: 'internship-11',
    title: 'Cybersecurity Intern',
    company: 'Blue Lantern Security',
    location: 'Remote',
    stipend: 20000,
    duration: '4 months',
    category: 'Cybersecurity',
    level: 'Beginner friendly',
    description: 'Practice defensive security reviews, secure configuration, and clear responsible vulnerability reporting.',
    skills: ['Web security', 'Threat modeling', 'OWASP', 'Security testing', 'Documentation'],
    tasks: [
      task('Map application trust boundaries', 'Review a sample application and document its data flows.', ['Identify user-controlled inputs and sensitive data.', 'Draw the main trust boundaries.', 'Prioritize realistic defensive risks.'], 'Threat model and risk-priority notes.'),
      task('Harden an API configuration', 'Apply secure defaults to a local learning API.', ['Review CORS, headers, and request limits.', 'Validate input and use safe query patterns.', 'Test that errors do not reveal internal details.'], 'Configuration changes and defensive test report.'),
      task('Review authentication and access', 'Check that sensitive actions require the right identity and permissions.', ['Map authentication and authorization checks.', 'Test unauthenticated and unauthorized behavior locally.', 'Document remediation and retest results.'], 'Access-control checklist and evidence.'),
      task('Write a responsible security report', 'Communicate a defensive finding safely and clearly.', ['Describe impact and affected component.', 'Provide safe reproduction steps in an authorized local test environment.', 'Recommend and verify a fix.'], 'Concise security report and remediation summary.')
    ]
  },
  {
    id: 'internship-12',
    title: 'Web Application Development Intern',
    company: 'Open Canvas',
    location: 'Remote',
    stipend: 17000,
    duration: '4 months',
    category: 'Web Development',
    level: 'Beginner friendly',
    description: 'Plan, build, test, and document a complete web application from accessible UI to API-backed workflows.',
    skills: ['HTML', 'CSS', 'JavaScript', 'React', 'APIs', 'Git'],
    tasks: [
      task('Plan the web app', 'Turn a simple product brief into screens and an implementation plan.', ['Define a user and their core goal.', 'Sketch the primary pages and navigation.', 'List the data needed from the API.'], 'Screen sketches and a small task breakdown.'),
      task('Build responsive pages', 'Implement the main workflow with accessible components.', ['Create semantic page structure.', 'Build responsive navigation and forms.', 'Check keyboard access and contrast.'], 'Working web app pages with screenshots.'),
      task('Connect data and forms', 'Integrate API loading, filters, and validated submission.', ['Load records and handle empty/error states.', 'Add search or filtering.', 'Submit a form with server validation.'], 'Integrated app flow and test evidence.'),
      task('Polish and deliver', 'Prepare the app for review and future contribution.', ['Run tests and fix visible issues.', 'Document setup and known limitations.', 'Add a demo walkthrough or screenshots.'], 'Repository, README, test report, and demo.')
    ]
  }
];
