# Vacancy Scoring Rubric - Cayke

Use this rubric to evaluate job opportunities from email marketing, job alerts, newsletters, LinkedIn emails, startup newsletters, or recruiter messages.

The goal is to select the 5 best opportunities for Cayke to apply to during the day.

## Output Requirements

For each selected opportunity, generate:

- Match score from 0 to 10
- Short reasoning
- Main strengths
- Main risks
- Recommendation level
- Suggested application approach

## Daily Output Format

```md
# Top 5 Opportunities

## 1. Company / Position

Link:
Match Score: X/10

### Why It Matches
- Point 1
- Point 2
- Point 3

### Risks
- Point 1
- Point 2

### Recommendation
Apply immediately / Apply if time allows / Low priority

### Suggested Approach
Short personalized strategy for applying.
```

## Recommendation Levels

- Apply immediately: strong fit, backend or backend-heavy full-stack, realistic seniority, strong growth potential, good work model.
- Apply if time allows: reasonable fit with some tradeoffs, such as hybrid work, less backend depth, or some stack mismatch.
- Low priority: weak fit, frontend-heavy, legacy-heavy, unclear growth, excessive requirements, or on-site requirement.

## Highest Priority Signals

Give the highest scores to opportunities with:

- Remote backend opportunities
- Node.js backend roles
- Backend/full-stack startup roles
- Modern backend stacks
- Junior-friendly expectations
- Product engineering exposure
- Strong engineering culture
- API/system design exposure
- SaaS/product development
- TypeScript, PostgreSQL, Express, React, or Next.js

## Medium Priority Signals

These can still be worthwhile:

- Full-stack roles with balanced backend work
- Laravel/PHP positions with modern practices
- Hybrid opportunities with strong growth potential
- Roles where product ownership matters
- Roles where portfolio projects can compensate for limited formal experience

## Low Priority Signals

Penalize opportunities with:

- Frontend-heavy responsibilities
- Legacy-only environments
- Excessive requirements for entry-level roles
- Weak technical growth potential
- Mandatory on-site work
- WordPress-only work
- Pure maintenance work
- Non-technical support responsibilities
- Senior-only expectations
- 5+ years of required experience

## Suggested Scoring Breakdown

Use this as a guide, but keep final judgment flexible.

- Backend fit: 0-2 points
- Stack fit: 0-2 points
- Seniority realism: 0-2 points
- Work model and geography: 0-1.5 points
- Growth potential and engineering culture: 0-1.5 points
- Product/startup relevance: 0-1 point

## Interpretation

- 9-10: Excellent fit. Prioritize today.
- 7-8: Good fit. Apply if the role is real and current.
- 5-6: Mixed fit. Apply only if there is spare time or a strong hidden upside.
- 0-4: Usually skip.

## Evaluation Notes

When evaluating fit, heavily consider practical experience demonstrated through shipped projects and SaaS/product development work.

Cayke may have less formal market experience than other applicants, but compensates with:

- Real-world project execution
- Strong backend capability
- Product thinking
- Practical development experience
- Full-stack capability
- Fast adaptability
- Entrepreneurial mindset

Value practical capability and project complexity more than years-of-experience requirements whenever possible.

## Application Message Guidance

When generating application messages:

- Be concise
- Sound confident but not arrogant
- Avoid excessive corporate buzzwords
- Highlight backend experience first
- Highlight practical projects
- Mention API integrations and scalable systems
- Mention full-stack ownership when relevant
- Mention entrepreneurial/product mindset when relevant
- Mention Computer Science degree only when useful

Prefer a direct, technical, builder-oriented tone.
