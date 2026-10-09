export type PageId =
  | 'overview'
  | 'jobs'
  | 'analyzer'
  | 'gaps'
  | 'roadmap'
  | 'insights'
  | 'data'

export type DemoJob = {
  id: string
  role: string
  company: string
  location: string
  level: 'Early career' | 'Mid-level' | 'Senior'
  skills: string[]
}