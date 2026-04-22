export type Step = {
  number: string
  title: string
  description: string
}

export const STEPS: Step[] = [
  {
    number: '01',
    title: 'Choose your profile',
    description:
      'Select your role — Frontend, Backend or DevOps — and your seniority level. The analysis adapts to your specific context.',
  },
  {
    number: '02',
    title: 'Upload your project',
    description:
      'Upload your project as a .ZIP file (under 100MB), including your complete project with architecture and technical decisions (README) — everything counts.',
  
  },
  {
    number: '03',
    title: 'Get your evaluation',
    description:
      'Receive a hexagonal chart with your score across 6 key dimensions, along with concrete recommendations to improve.',
  },
]