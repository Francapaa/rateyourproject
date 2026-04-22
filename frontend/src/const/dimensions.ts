export type Dimension = {
  name: string
  description: string
}

export const DIMENSIONS: Dimension[] = [
  {
    name: 'Architecture',
    description: 'Project structure, separation of concerns, design patterns, and scalability.',
  },
  {
    name: 'Code Quality',
    description: 'Code quality, readability, naming conventions, cyclomatic complexity, and consistency.',
  },
  {
    name: 'Testing',
    description: 'Test coverage, types of tests, test case quality, and validation strategy.',
  },
  {
    name: 'Documentation',
    description: 'README clarity, API documentation, technical decisions, and contribution guides.',
  },
  {
    name: 'Deploy',
    description: 'CI/CD, production configuration, environment variables, monitoring, and deployment strategy.',
  },
  {
    name: 'Best Practices',
    description: 'Security, performance, accessibility, error handling, and industry standards.',
  },
]