export type Role = {
  title: string
  value: string
  description: string
  skills: string
}

export const ROLES: Role[] = [
  {
    title: 'Frontend',
    value: 'frontend',
    description: 'We evaluate your mastery of frameworks, components, state management, visual performance, and user experience.',
    skills: 'React, Vue, Angular, CSS, Accessibility, Performance',
  },
  {
    title: 'Backend',
    value: 'backend',
    description: 'We analyze your API architecture, databases, security, patterns, and server-side scalability.',
    skills: 'Go, Node.js, Python, SQL, APIs, Architecture',
  },
  {
    title: 'Fullstack',
    value: 'fullstack',
    description: 'We evaluate your ability to build complete solutions, from UI to server infrastructure.',
    skills: 'React, Node.js, APIs, Databases, Deploy, Architecture',
  },
  {
    title: 'Infrastructure',
    value: 'infrastructure',
    description: 'We review your infrastructure, CI/CD, containers, monitoring, and deployment practices.',
    skills: 'Docker, K8s, CI/CD, Cloud, IaC, Monitoring',
  },
]