export type PostBlock =
  | { type: 'p'; text: string }
  | { type: 'h3'; text: string }
  | { type: 'quote'; text: string }
  | { type: 'list'; items: string[] }
  | { type: 'table'; headers: string[]; rows: string[][] }

export interface PostSection {
  heading: string
  blocks: PostBlock[]
}

export interface Post {
  slug: string
  title: string
  description: string
  publishedAt: string
  updatedAt: string
  tags: string[]
  sections: PostSection[]
}

export const POSTS: Post[] = [
  {
    slug: 'what-is-hireability',
    title: 'What is hireability and how do you improve it?',
    description:
      'Hireability measures how ready your skills and your code are for the job market. Learn what it really means, the 6 dimensions that define it, and how to improve yours before your next technical interview.',
    publishedAt: '2026-08-12',
    updatedAt: '2026-08-12',
    tags: ['hireability', 'career', 'technical interview'],
    sections: [
      {
        heading: 'What is hireability?',
        blocks: [
          {
            type: 'p',
            text: 'Hireability is how ready your skills, experience and — most importantly — your code are for the job market. It is not about how many years you have worked. It is about how clearly your projects prove you can solve the problems a company needs solved.',
          },
          {
            type: 'quote',
            text: 'A developer with two strong public projects is often more hireable than one with eight years of experience and no code you can see.',
          },
          {
            type: 'p',
            text: 'Recruiters and hiring managers cannot watch you work. They can, however, open your GitHub, read your README, and skim your architecture. That code is your real resume, and hireability is a measure of how strong that resume is.',
          },
        ],
      },
      {
        heading: 'What does hireable mean for a developer?',
        blocks: [
          {
            type: 'p',
            text: 'A hireable developer is not the one who knows every framework. It is the one who demonstrates, through their work, the skills a specific role requires. For a Frontend role that might be component design and state management. For a Backend role, API design and database modeling.',
          },
          {
            type: 'list',
            items: [
              'You follow the conventions of your stack instead of fighting them',
              'Your project tells a story: README, architecture decisions and setup instructions',
              'Tests exist and actually cover the behavior that matters',
              'Your code reads like it was written for other humans, not just for a computer',
            ],
          },
        ],
      },
      {
        heading: 'The 6 dimensions of a hireable project',
        blocks: [
          {
            type: 'p',
            text: 'When companies evaluate a candidate project, they consistently analyze the same six areas. If you know them, you can audit yourself against them before anyone else does.',
          },
          {
            type: 'list',
            items: [
              'Architecture — structure, separation of concerns and scalability',
              'Code Quality — readability, naming and consistency',
              'Testing — coverage, test types and case quality',
              'Documentation — README clarity, API docs and decisions',
              'Deploy — CI/CD, environment configuration and production readiness',
              'Best Practices — security, performance and accessibility',
            ],
          },
          {
            type: 'p',
            text: 'This is exactly the model RateYourProject uses to evaluate projects automatically when you upload a .ZIP file.',
          },
        ],
      },
      {
        heading: 'How to measure your own hireability',
        blocks: [
          {
            type: 'p',
            text: 'You can get a rough score in an afternoon. Open one of your best projects and ask yourself a question per dimension. Does the folder structure make the purpose of each module obvious? Is there a README that a stranger could follow? Have you written a single test? Could another engineer deploy this without asking you questions?',
          },
          {
            type: 'p',
            text: 'Each honest "no" is one improvement point. If you want a complete, structured evaluation across all six dimensions at once, you can also upload your project to RateYourProject and receive a hexagonal score chart automatically.',
          },
        ],
      },
      {
        heading: 'How to improve your hireability',
        blocks: [
          {
            type: 'list',
            items: [
              'Write the README first: title, description, setup steps, and one architecture note',
              'Pick a real problem and solve it end to end, instead of a generic todo app',
              'Add at least one test per meaningful behavior in your main module',
              'Configure CI/CD so the "deploy" dimension stops being a weak signal',
              'Document the decisions you made and why — that is what seniority looks like',
            ],
          },
          {
            type: 'p',
            text: 'Improving one of the six dimensions changes your overall profile, but improving all of them is what turns a "shows effort" project into a "clearly hireable" one.',
          },
        ],
      },
    ],
  },
  {
    slug: 'how-to-evaluate-your-project',
    title: 'How to evaluate your project before a technical interview',
    description:
      'A step-by-step guide to audit your code the way hiring teams do: architecture, code quality, testing, documentation, deploy and best practices. Run this checklist in an afternoon.',
    publishedAt: '2026-08-12',
    updatedAt: '2026-08-12',
    tags: ['code review', 'technical interview', 'portfolio'],
    sections: [
      {
        heading: 'Why evaluate your project before the interview',
        blocks: [
          {
            type: 'p',
            text: 'In a technical interview, your project is your strongest asset and your weakest point at the same time. It is the only piece of your work the interviewer can examine critically before you even speak. Evaluating it beforehand turns a weakness you know nothing about into a list of concrete fixes.',
          },
          {
            type: 'quote',
            text: 'The goal is never perfect code. The goal is knowing exactly where your project stands so you can explain it, improve it, or honestly discuss its trade-offs.',
          },
        ],
      },
      {
        heading: 'How the evaluation works',
        blocks: [
          {
            type: 'p',
            text: 'A complete evaluation has three steps. First, define the profile against which you are being measured: your role (Frontend, Backend, Fullstack or Infrastructure) and your seniority (Junior to Staff). Second, gather the code that represents you. Third, audit it across the six dimensions.',
          },
          {
            type: 'list',
            items: [
              'Step 1 — choose your role and seniority so the evaluation is fair',
              'Step 2 — upload or prepare your project, including the README and architecture notes',
              'Step 3 — score each dimension and collect concrete recommendations',
            ],
          },
        ],
      },
      {
        heading: 'What each dimension actually checks',
        blocks: [
          {
            type: 'h3',
            text: 'Architecture',
          },
          {
            type: 'list',
            items: [
              'Is the folder structure obvious without a guide?',
              'Are concerns separated (UI, business logic, data access)?',
              'Would the structure survive a doubling in size?',
            ],
          },
          {
            type: 'h3',
            text: 'Code quality',
          },
          {
            type: 'list',
            items: [
              'Are names descriptive and consistent?',
              'Do functions do one thing?',
              'Would a teammate understand it in a 15-minute read?',
            ],
          },
          {
            type: 'h3',
            text: 'Testing',
          },
          {
            type: 'list',
            items: [
              'Does the critical behavior have tests?',
              'Do tests assert behavior, not implementation trivia?',
              'Is the coverage realistic and not purely vanity metrics?',
            ],
          },
          {
            type: 'h3',
            text: 'Documentation, deploy and best practices',
          },
          {
            type: 'list',
            items: [
              'Documentation: does the README explain setup, usage and decisions?',
              'Deploy: is there CI/CD, environment config and a production story?',
              'Best practices: security, performance and accessibility basics covered?',
            ],
          },
        ],
      },
      {
        heading: 'Common mistakes that lower your score',
        blocks: [
          {
            type: 'list',
            items: [
              'No README, forcing the interviewer to reverse-engineer everything',
              'One giant folder with every file at the same level',
              'Commits that mix features, fixes and "misc changes"',
              'Secrets committed to the repository',
              'A .gitignore that includes node_modules or build artifacts',
            ],
          },
          {
            type: 'p',
            text: 'Most of these are easy to fix once you know they exist, which is precisely why an automated evaluation is useful: it does not judge you, it lists what to improve.',
          },
        ],
      },
      {
        heading: 'Start with an automated evaluation',
        blocks: [
          {
            type: 'p',
            text: 'If you want a structured start, upload your project to RateYourProject. You choose role and seniority, the analysis runs across the six dimensions, and you get a hexagonal chart plus recommendations you can act on before the interview.',
          },
        ],
      },
    ],
  },
  {
    slug: 'what-companies-look-for-in-your-code',
    title: 'Code review: what companies really look for in your GitHub',
    description:
      'Hiring teams review your public repositories before they ever interview you. Learn the signals they scan for in the first minutes and how to make your portfolio pass the review.',
    publishedAt: '2026-08-12',
    updatedAt: '2026-08-12',
    tags: ['code review', 'github', 'recruiting'],
    sections: [
      {
        heading: 'The 30-second first impression',
        blocks: [
          {
            type: 'p',
            text: 'The first thing anyone reviews in your GitHub is the repository landing page: your README, your folder structure and your commit history. In roughly 30 seconds a reviewer decides whether your project feels serious. If the README is missing or generic, the review rarely recovers.',
          },
          {
            type: 'quote',
            text: 'A README that explains what the project does, how to run it, and the decisions behind it is the single highest-leverage file in a portfolio.',
          },
        ],
      },
      {
        heading: 'What hiring teams scan for',
        blocks: [
          {
            type: 'list',
            items: [
              'A clear, specific README that a stranger could follow',
              'A logical folder structure that matches the stack\'s conventions',
              'Meaningful commit messages that tell a story',
              'Tests that run and cover real behavior',
              'A deploy story: CI config, environment handling, documentation of release',
              'No obvious security red flags like committed secrets',
            ],
          },
        ],
      },
      {
        heading: 'The signals that separate you from other candidates',
        blocks: [
          {
            type: 'p',
            text: 'Most portfolios are fine. The ones that stand out show deliberate decisions: a documented trade-off, a typed interface used consistently, a test that catches a subtle bug. These are signals of seniority because they prove judgment, not just syntax.',
          },
          {
            type: 'list',
            items: [
              'Architecture decisions written down (why did you choose this pattern?)',
              'A growing test suite that protects the main flow',
              'Automated checks configured so the project can be deployed by anyone',
              'Accessibility and performance work that comes from care, not from a checklist',
            ],
          },
        ],
      },
      {
        heading: 'Red flags that hurt you',
        blocks: [
          {
            type: 'list',
            items: [
              'No tests anywhere, especially for a full project',
              'A single commit containing the entire application',
              'Hardcoded credentials in source files',
              'Deprecated dependencies with no upgrade path',
              'Code that ignores the stack\'s conventions (the classic "JavaScript in a Go project style")',
            ],
          },
          {
            type: 'p',
            text: 'None of these are fatal on their own. Together, they suggest a project built under pressure and never revisited — which is exactly what you do not want to communicate before an interview.',
          },
        ],
      },
      {
        heading: 'How RateYourProject mirrors hiring-team review',
        blocks: [
          {
            type: 'p',
            text: 'RateYourProject automates this exact review. Upload your project, choose your role and seniority, and the analysis evaluates architecture, code quality, testing, documentation, deploy and best practices — the same dimensions a senior engineer mentally checks when they open your repository.',
          },
        ],
      },
    ],
  },
  {
    slug: 'six-dimensions-hireable-project',
    title: 'The 6 dimensions of a hireable project, explained',
    description:
      'Architecture, code quality, testing, documentation, deploy and best practices. What each dimension evaluates, why it matters to hiring teams, and how to score well in all six.',
    publishedAt: '2026-08-12',
    updatedAt: '2026-08-12',
    tags: ['hireability', 'code quality', 'architecture'],
    sections: [
      {
        heading: 'A hireable project, dimension by dimension',
        blocks: [
          {
            type: 'table',
            headers: ['Dimension', 'What it evaluates', 'How to score well'],
            rows: [
              ['Architecture', 'Structure, separation of concerns, patterns, scalability', 'Organize by domain or feature, not by file type'],
              ['Code Quality', 'Readability, naming, complexity, consistency', 'Small functions, descriptive names, consistent style'],
              ['Testing', 'Coverage, test types, case quality', 'Test behavior that matters, not implementation detail'],
              ['Documentation', 'README, API docs, decisions, guides', 'Explain what, how, and why in plain language'],
              ['Deploy', 'CI/CD, configuration, monitoring, strategy', 'Automate the pipeline and document the release flow'],
              ['Best Practices', 'Security, performance, accessibility, errors', 'Apply the basics deliberately and consistently'],
            ],
          },
          {
            type: 'p',
            text: 'A project can be technically advanced and still score low, because scoring is about how the code communicates readiness. Each dimension is a different professional signal.',
          },
        ],
      },
      {
        heading: 'Architecture: structure reveals thinking',
        blocks: [
          {
            type: 'p',
            text: 'Architecture is the first thing a reviewer notices because it appears before any code is read. A clear structure says you think in systems; everything dumped in one folder says the opposite. Good architecture also survives the next feature being added.',
          },
          {
            type: 'list',
            items: [
              'Separate responsibilities between UI, logic and data access',
              'Use patterns the stack already recommends',
              'Keep the dependency direction pointing inward, not randomly',
            ],
          },
        ],
      },
      {
        heading: 'Code quality: the code reads like prose',
        blocks: [
          {
            type: 'p',
            text: 'Code quality is readability under a microscope. Hiring teams assume you can write working code; they want proof you can write code other people can maintain. Names, function size, and consistency matter far more than cleverness.',
          },
        ],
      },
      {
        heading: 'Testing: proof of understanding',
        blocks: [
          {
            type: 'p',
            text: 'Tests are the closest thing to a proof that you understand your own system. A project with no tests tells a reviewer the author never had to protect their own work. A project with good tests shows they thought about failure modes.',
          },
        ],
      },
      {
        heading: 'Documentation: you work with other humans',
        blocks: [
          {
            type: 'p',
            text: 'Documentation demonstrates empathy for whoever inherits your code — the same way you would like a codebase handed to you. A README with setup steps, and a note or two on decisions, instantly raises how senior your work looks.',
          },
        ],
      },
      {
        heading: 'Deploy: make the project real',
        blocks: [
          {
            type: 'p',
            text: 'A project that runs only on your machine is half a project. A deploy story — CI/CD, environment variables, a release process — tells a reviewer you understand production, not just local development.',
          },
        ],
      },
      {
        heading: 'Best practices: the quality bar',
        blocks: [
          {
            type: 'p',
            text: 'Security, performance and accessibility signals separate a hobby project from a professional one. Small, consistent application of these basics is usually enough to pass; large violations in any one area can sink the whole profile.',
          },
        ],
      },
      {
        heading: 'Turning weak scores into strengths',
        blocks: [
          {
            type: 'p',
            text: 'You do not need to be excellent in all six dimensions immediately. Improve the worst ones first, because the final hireability score is the shape of the whole, not the highest single number. Get your project measured, find the two weakest dimensions, and fix those.',
          },
        ],
      },
    ],
  },
]

export function getAllPosts(): Post[] {
  return [...POSTS].sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  )
}

export function getPostBySlug(slug: string): Post | undefined {
  return POSTS.find((post) => post.slug === slug)
}

export function getReadingTime(post: Post): string {
  const words = post.sections.reduce((count, section) => {
    return (
      count +
      section.blocks.reduce((blockCount, block) => {
        if (block.type === 'list') {
          return blockCount + block.items.join(' ').split(/\s+/).length
        }
        if (block.type === 'table') {
          return blockCount + block.rows.flat().join(' ').split(/\s+/).length
        }
        return blockCount + block.text.split(/\s+/).length
      }, 0)
    )
  }, 0)
  return `${Math.max(1, Math.round(words / 200))} min read`
}