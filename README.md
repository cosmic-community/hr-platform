# 🏢 HR Recruitment Platform

A comprehensive HR recruitment platform built with Next.js 16, TypeScript, Tailwind CSS, and Cosmic CMS. Manage your entire hiring pipeline from requisition to onboarding.

## Features

- 📋 **Workforce & Requisition Planning** — Create and approve job requisitions with multi-role workflows
- 🏢 **Sourcing & Attraction** — Post to job boards, generate career site widgets, manage talent pools
- 👤 **Application Management** — AI resume parsing, candidate ranking, full-text search
- 🔀 **Recruitment Workflow** — Customizable pipelines with visual Kanban boards
- 💬 **Candidate Collaboration** — Comments, ratings, status history, interview scheduling
- 📨 **Offer Management** — Generate offer letters, e-signature capture, CSV export
- 📊 **Analytics & Reporting** — Interactive dashboards with time-to-hire, source effectiveness, pipeline metrics
- 📝 **Compliance & Security** — Role-based access, audit logging, GDPR data deletion
- 🔗 **Integrations** — Webhook receiver for external assessments

## Clone this Project

Want to create your own version of this project with all the content and structure? Clone this Cosmic bucket and code repository to get started instantly:

[![Clone this Project](https://img.shields.io/badge/Clone%20this%20Project-29abe2?style=for-the-badge&logo=cosmic&logoColor=white)](https://app.cosmicjs.com/projects/new?clone_bucket=69d5ed5ce286d037e5036e24&clone_repository=69d5efa5e286d037e5036e5e)

## Prompts

This application was built using the following prompts to generate the content structure and code:

### Content Model Prompt

> "Create content models for: You are acting as a senior full-stack developer and DevOps engineer. I need you to generate a complete, production-ready HR recruitment platform with all the modules described below. The final deliverable must include:
ensure u test all functinolity working with mock data with user frinedly UI /UX and navigation with tool tips and provide me the zip file to download and install

1. Full source code (backend, frontend, database schema)
2. A Dockerfile for each service
3. A docker-compose.yml file that orchestrates all services
4. Environment variable templates (.env.example)
5. A README with build and run instructions

Tech stack requirements:
- Backend: Python + FastAPI (or Node.js + Express if easier)
- Frontend: React with TypeScript + Tailwind CSS
- Database: PostgreSQL (primary) + Redis (caching & queues)
- Authentication: JWT with refresh tokens
- File storage: Local (or S3-compatible via config)
- AI features: Use OpenAI API or Anthropic API for resume parsing and candidate ranking (include API key placeholders)

Module specifications (build each as a separate feature with API endpoints and UI pages):

1. Workforce & Requisition Planning
   - Create/approve job requisitions (fields: title, dept, headcount, budget, hiring manager)
   - Approval workflow with roles (HR, Finance, Dept Head)
   - API: POST /requisitions, PUT /requisitions/{id}/approve

2. Sourcing & Attraction
   - Job board posting (simulate posting to external boards – just store which boards selected)
   - Career site integration (generate embeddable widget code)
   - Talent pool CRM (save candidate profiles from sourced leads)

3. Application Management
   - Resume parsing using AI (accept PDF/DOCX, extract text, then call LLM to output structured JSON: name, email, skills, experience)
   - AI candidate ranking (score 0-100 based on job description)
   - Candidate database with full-text search

4. Recruitment Workflow & Collaboration
   - Customizable pipelines (e.g., Applied -> Screened -> Interview -> Offer -> Hired)
   - Candidate profile page with comments, ratings, and status history
   - Interview scheduling (integration with Google Calendar API – show steps, mock the OAuth)

5. Candidate Communication & Engagement
   - Automated email notifications (use SMTP settings – mock or use Resend API)
   - Candidate portal (login to check status, upload documents)

6. Offer Management & Onboarding
   - Generate offer letter from template (PDF)
   - E-signature (simple: accept/reject with digital signature capture)
   - Export new hire data as CSV for onboarding system

7. Analytics & Reporting
   - Dashboard with charts: time-to-hire, source effectiveness, cost-per-hire, pipeline drop-off
   - Export reports as PDF/CSV

8. Compliance & Security
   - Role-based access control (Admin, Recruiter, Hiring Manager, Candidate)
   - Audit log for all candidate actions
   - GDPR data deletion endpoint

9. Integrations (simulated)
   - Webhook receiver for external assessments

Additionally, I need:
- A Dockerfile for the backend (Python/Node)
- A Dockerfile for the frontend (nginx serving React build)
- A docker-compose.yml that spins up:
    - backend
    - frontend
    - postgres:15
    - redis:7
    - pgadmin (optional)
- A script or CI/CD example that builds the Docker image and pushes to a registry (Docker Hub or GHCR)

Please output the entire project as a structured directory tree with file contents. For each file, show its path and the complete code. Ensure that all code is runnable after copying. Use environment variables for secrets (DB password, JWT secret, API keys). Include a .env.example file.

Make sure the AI resume parsing works by showing an example call to the LLM with a prompt. The ranking feature should accept a job description and a candidate's parsed resume and return a score with reasoning.

The platform does not need to be fully scalable to millions of users, but must be robust, secure, and follow best practices (input validation, SQL injection protection, hashed passwords).

Finally, include a Docker build command and run instructions in the README so that after I save all files, I can run `docker-compose up --build` and access the platform at http://localhost:3000."

### Code Generation Prompt

> "Build a Next.js application for a website called 'HR Platform'. The content is managed in Cosmic CMS with the following object types: team-members, pipeline-stages, job-requisitions, job-postings, candidates, candidate-activities, offer-letters, report-snapshots, audit-logs. Create a beautiful, modern, responsive design with a homepage and pages for each content type. You are acting as a senior full-stack developer and DevOps engineer. I need you to generate a complete, production-ready HR recruitment platform with all the modules described below. ensure u test all functionality working with mock data with user friendly UI/UX and navigation with tooltips."

The app has been tailored to work with your existing Cosmic content structure and includes all the features requested above.

## Technologies

- [Next.js 16](https://nextjs.org/) — React framework with App Router
- [TypeScript](https://www.typescriptlang.org/) — Type-safe JavaScript
- [Tailwind CSS](https://tailwindcss.com/) — Utility-first CSS framework
- [Cosmic](https://www.cosmicjs.com/docs) — Headless CMS for content management
- [Recharts](https://recharts.org/) — Composable charting library for React

## Getting Started

### Prerequisites

- Node.js 18+ or Bun
- A [Cosmic](https://www.cosmicjs.com) account with the HR Platform bucket

### Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd hr-platform

# Install dependencies
bun install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your Cosmic credentials

# Run development server
bun dev
```

Open [http://localhost:3000](http://localhost:3000) to see the platform.

## Cosmic SDK Examples

```typescript
import { createBucketClient } from '@cosmicjs/sdk'

const cosmic = createBucketClient({
  bucketSlug: process.env.COSMIC_BUCKET_SLUG as string,
  readKey: process.env.COSMIC_READ_KEY as string,
  writeKey: process.env.COSMIC_WRITE_KEY as string,
})

// Fetch all candidates with position data
const { objects: candidates } = await cosmic.objects
  .find({ type: 'candidates' })
  .props(['id', 'title', 'slug', 'metadata'])
  .depth(1)

// Fetch a single job requisition
const { object: requisition } = await cosmic.objects
  .findOne({ type: 'job-requisitions', slug: 'senior-developer' })
  .props(['id', 'title', 'slug', 'metadata'])
  .depth(1)
```

## Cosmic CMS Integration

This application integrates with 9 Cosmic object types:

| Object Type | Description |
|---|---|
| `team-members` | HR team, recruiters, hiring managers |
| `pipeline-stages` | Recruitment pipeline stages |
| `job-requisitions` | Job requisition requests and approvals |
| `job-postings` | Published job listings |
| `candidates` | Candidate profiles and applications |
| `candidate-activities` | Comments, ratings, interviews |
| `offer-letters` | Offer letter templates and signatures |
| `report-snapshots` | Analytics data snapshots |
| `audit-logs` | Compliance and security logs |

## Deployment

### Vercel (Recommended)

1. Push your repository to GitHub
2. Import your project in [Vercel](https://vercel.com)
3. Add environment variables in Vercel dashboard
4. Deploy

### Environment Variables

Set these in your deployment platform:

- `COSMIC_BUCKET_SLUG` — Your Cosmic bucket slug
- `COSMIC_READ_KEY` — Your Cosmic read key
- `COSMIC_WRITE_KEY` — Your Cosmic write key

<!-- README_END -->