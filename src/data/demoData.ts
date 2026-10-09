import type { DemoJob } from '../types'

export const demoJobs: DemoJob[] = [
  {
    id: 'ai-engineer',
    role: 'AI Engineer',
    company: 'Northstar Labs',
    location: 'Remote',
    level: 'Senior',
    skills: ['Python', 'LLM APIs', 'RAG', 'Evaluation', 'Docker'],
  },
  {
    id: 'data-analyst',
    role: 'Data Analyst',
    company: 'Fieldnote',
    location: 'Chicago, IL',
    level: 'Early career',
    skills: ['SQL', 'Python', 'Power BI', 'Data modeling'],
  },
  {
    id: 'data-scientist',
    role: 'Data Scientist',
    company: 'Juniper Works',
    location: 'Austin, TX',
    level: 'Mid-level',
    skills: ['Python', 'Machine learning', 'Statistics', 'SQL', 'Experiment design'],
  },
  {
    id: 'software-developer',
    role: 'Software Developer',
    company: 'Common Thread',
    location: 'New York, NY',
    level: 'Mid-level',
    skills: ['TypeScript', 'React', 'APIs', 'Testing', 'Cloud basics'],
  },
  {
    id: 'ml-engineer',
    role: 'Machine Learning Engineer',
    company: 'Cedar Systems',
    location: 'Remote',
    level: 'Senior',
    skills: ['Python', 'Model deployment', 'Feature engineering', 'Docker', 'Evaluation'],
  },
  {
    id: 'analytics-engineer',
    role: 'Analytics Engineer',
    company: 'Brightpath Studio',
    location: 'Denver, CO',
    level: 'Early career',
    skills: ['SQL', 'Data modeling', 'dbt', 'Data quality', 'Power BI'],
  },
]

export const roadmapSteps = [
  {
    id: 'foundations',
    title: 'Refresh the foundations',
    detail: 'Review core concepts behind the role skills you want to strengthen.',
    category: 'FOUNDATIONS',
  },
  {
    id: 'practice',
    title: 'Build a small applied project',
    detail: 'Choose one skill and create a focused project that demonstrates it.',
    category: 'PRACTICE',
  },
  {
    id: 'evidence',
    title: 'Capture evidence of your work',
    detail: 'Write down the decisions, tools, and outcomes you can explain clearly.',
    category: 'PORTFOLIO',
  },
]

export function getSkillFrequency() {
  const frequencies = new Map<string, number>()

  for (const job of demoJobs) {
    for (const skill of job.skills) {
      frequencies.set(skill, (frequencies.get(skill) ?? 0) + 1)
    }
  }

  return [...frequencies.entries()]
    .map(([skill, mentions]) => ({ skill, mentions }))
    .sort((first, second) => second.mentions - first.mentions || first.skill.localeCompare(second.skill))
}