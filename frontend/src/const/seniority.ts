export type SeniorityLevel = {
  level: string
  value: string
  range: string
  description: string
  expectations: string[]
}

export const SENIORITY_LEVELS: SeniorityLevel[] = [
  {
    level: 'Junior',
    value: 'junior',
    range: '0-2 years',
    description: 'We evaluate fundamentals, learning ability, and application of basic best practices.',
    expectations: ['Clear project structure', 'Readable code', 'Basic tool usage'],
  },
  {
    level: 'Mid-Level',
    value: 'mid-level',
    range: '2-5 years',
    description: 'We analyze autonomy, design patterns, technical decision-making, and implementation quality.',
    expectations: ['Design patterns', 'Consistent testing', 'Active optimization'],
  },
  {
    level: 'Senior',
    value: 'senior',
    range: '5-8 years',
    description: 'We evaluate architecture, mentorship, systemic vision, and ability to design robust solutions.',
    expectations: ['Scalable architecture', 'Informed decisions', 'Technical mentorship'],
  },
  {
    level: 'Staff',
    value: 'staff',
    range: '8+ years',
    description: 'We analyze technical leadership, strategic vision, team impact, and quality at the organizational level.',
    expectations: ['Strategic vision', 'Technical leadership', 'Organizational impact'],
  },
]