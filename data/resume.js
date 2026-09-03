// Source of truth for the chatbot's answers and the page copy.
// Keep this in sync with your real CV — the chatbot is instructed to only use what's written here.

module.exports = {
  name: 'Kushal Niraula',
  role: 'Senior QA Engineer',
  location: 'Kathmandu, Nepal',
  phone: '+977-9860759186',
  email: 'kushalniraula41@gmail.com',
  links: {
    portfolio: 'https://www.niraulakushal.com.np/',
    linkedin: 'https://www.linkedin.com/in/kushal-niraula-368594287/',
    github: 'https://github.com/kushal410',
  },

  summary: `Senior QA Engineer with three years across four companies, moving from manual and
web QA into mobile automation and now agentic AI. Currently leading QA for AI-powered
chatbots and agentic products — RAG pipelines, NLP behavior, knowledge bases, prompts,
guardrails, and conversational workflows — alongside functional, API, integration,
regression, and end-to-end testing across multiple clients and environments.`,

  experience: [
    {
      title: 'Senior QA Engineer',
      company: 'Palm Mind',
      dates: 'Jul 2026 — Present',
      highlights: [
        'Leading QA for AI-powered chatbots and agentic AI products, covering RAG, NLP, knowledge bases, prompts, guardrails, and conversational workflows.',
        'Designing and executing functional, API, integration, regression, and E2E testing across multiple clients and environments.',
        'Built and maintained automation using Python, Playwright, and Appium, with cross-device testing through BrowserStack.',
        'Managing API validation and CI/CD test automation using Postman/Newman, GitHub Actions, and Jenkins.',
        'Working closely with Product and Engineering to improve test coverage, identify defects, and deliver reliable releases.',
      ],
      stack: ['Python', 'Playwright', 'Appium', 'BrowserStack', 'Postman/Newman', 'GitHub Actions', 'Jenkins'],
    },
    {
      title: 'Lead QA Automation Engineer',
      company: 'Hot Stone Innovation · Bhaktapur',
      dates: 'Aug 2025 — Jun 2026',
      highlights: [
        'Tested iOS and Android loyalty applications end-to-end (Hotstone London Loyalty App, Rai Restaurant Loyalty App, 2Klips Dating App) — onboarding, authentication, offers/rewards, and account flows.',
        'Built and maintained mobile automation using Appium (Python) and Appium Inspector; executed regression suites every release cycle.',
        'Performed API testing with Postman and Newman; validated request/response contracts and improved coverage for critical backend endpoints.',
        'Implemented CI smoke/regression runs using GitHub Actions (and Jenkins where applicable) for repeatable, trackable QA execution.',
        'Logged, tracked, verified, and reported defects with clear reproduction steps and evidence; collaborated closely with developers.',
      ],
      stack: ['Appium', 'Python', 'Postman', 'Newman', 'GitHub Actions', 'Jenkins'],
    },
    {
      title: 'Software QA Automation Engineer',
      company: 'Binary Digits · Sinamangal',
      dates: 'Aug 2024 — Aug 2025',
      highlights: [
        'Designed and executed manual test cases for new features, bug fixes, and regression cycles across web modules.',
        'Developed web automation with Selenium (Python) for key workflows to reduce repetitive manual testing.',
        'Conducted API verification using Postman; ensured REST endpoints met functional expectations and handled negative scenarios.',
        'Coordinated testing activities using Trello; communicated test results and release readiness.',
      ],
      stack: ['Selenium', 'Python', 'Postman', 'Trello'],
    },
    {
      title: 'Software QA Automation Engineer',
      company: 'Deerhold Ltd. · Sifal',
      dates: 'Sep 2023 — Aug 2024',
      highlights: [
        'Performed functional, integration, and regression testing across multiple products and client projects.',
        'Executed cross-browser testing and documented issues with strong attention to detail and clear reporting.',
        'Supported database validation with SQL checks to confirm data integrity across critical workflows.',
        'Assisted in improving QA process consistency — test documentation, bug triage, re-test verification.',
      ],
      stack: ['SQL', 'Cross-browser testing'],
    },
  ],

  skills: {
    'QA & Testing': { level: '92%', tools: ['Manual testing', 'Test case design', 'Regression', 'SDLC/STLC', 'Test strategy'] },
    'Automation': { level: '88%', tools: ['Selenium (Python)', 'Appium (Python)', 'Appium Inspector', 'Cucumber (BDD basics)'] },
    'API & Backend': { level: '85%', tools: ['Postman', 'Newman', 'REST fundamentals', 'SQL validation'] },
    'CI/CD & Execution': { level: '80%', tools: ['GitHub Actions', 'Jenkins'] },
    'Quality & Non-functional': { level: '60%', tools: ['Lighthouse', 'Grafana k6', 'OWASP ZAP'] },
  },

  languagesAndTools: ['JIRA', 'Trello', 'Git', 'GitHub', 'BrowserStack', 'JUnit/TestNG (exposure)'],

  projects: [
    {
      version: 'v7.0.0',
      title: 'Hotstone London Loyalty App',
      company: 'iOS & Android · 2026',
      description: 'End-to-end testing of loyalty features: sign-up/login, customer profile, rewards/points logic, offers, and redemption workflows.',
      metric: 'Automated core journeys with Appium (Python) in CI',
    },
    {
      version: 'v6.0.0',
      title: 'Rai Japanese Restaurant Loyalty App',
      company: 'iOS & Android · 2025',
      description: 'Functional and regression testing across multiple devices; validated user flows, performance, and edge cases.',
      metric: 'API checks on auth and loyalty endpoints',
    },
    {
      version: 'v5.0.0',
      title: '2Klips Dating App',
      company: 'Cross-platform · 2025',
      description: 'Manual and automated testing (Appium & Selenium) for core workflows and authentication.',
      metric: 'Regression and defect tracking for cross-platform reliability',
    },
    {
      version: 'v4.0.0',
      title: 'Government eSifarish System',
      company: 'Public sector platform',
      description: 'End-to-end functional, integration, and basic security testing.',
      metric: 'Defect tracking and verification across releases',
    },
    {
      version: 'v3.0.0',
      title: 'Know Your Body (KYB) Website',
      company: 'Web platform',
      description: 'Functional, cross-browser, and accessibility-focused testing.',
      metric: 'Verified interactive tools and UX issues',
    },
    {
      version: 'v2.0.0',
      title: 'YUWA — Youth Engagement Platform',
      company: 'Web platform',
      description: 'Usability, workflow, and performance-oriented testing.',
      metric: 'Bug documentation, verification, and regression checks',
    },
    {
      version: 'v1.0.0',
      title: 'Online Voting System',
      company: 'Web platform · 2022',
      description: 'Functional, security, and regression testing.',
      metric: 'Verified vote integrity and correct processing logic',
    },
  ],

  education: [
    { degree: 'Bachelor of Software Engineering', school: 'NCIT, Pokhara University · Balkumari', detail: 'Majors: Cloud Computing, Network Security · 2023' },
  ],

  recommendation: { name: 'Bibek Dahal', title: 'Software QA Manager, Deerhold Ltd.', via: 'LinkedIn' },
};
