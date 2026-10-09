import { lazy, Suspense, useMemo, useState } from 'react'
import {
  ArrowDownToLine,
  ArrowRight,
  BriefcaseBusiness,
  Check,
  CircleHelp,
  Database,
  FileText,
  Filter,
  Layers3,
  Search,
  Sparkles,
  Target,
} from 'lucide-react'
import { demoJobs, getSkillFrequency, roadmapSteps } from '../data/demoData'
import type { DemoJob, PageId } from '../types'

const DashboardCharts = lazy(() => import('./DashboardCharts.tsx'))

type DashboardPagesProps = {
  page: PageId
  selectedJobId: string
  checkedSteps: string[]
  onNavigate: (page: PageId) => void
  onSelectJob: (jobId: string) => void
  onToggleStep: (stepId: string) => void
}

const pageHeadings: Record<PageId, { eyebrow: string; title: string; description: string }> = {
  overview: {
    eyebrow: 'OVERVIEW',
    title: 'Role signals, with context.',
    description: 'A focused view of the skills represented in your sample workspace.',
  },
  jobs: {
    eyebrow: 'JOB EXPLORER',
    title: 'Explore role requirements.',
    description: 'Search the synthetic sample briefs and choose a role to inspect.',
  },
  analyzer: {
    eyebrow: 'RESUME ANALYZER',
    title: 'Bring your experience into focus.',
    description: 'Prepare résumé text for a role comparison. Text stays in this browser tab.',
  },
  gaps: {
    eyebrow: 'SKILL GAP RESULTS',
    title: 'See what to build on next.',
    description: 'An illustrative example of how a role comparison will be presented.',
  },
  roadmap: {
    eyebrow: 'LEARNING ROADMAP',
    title: 'Turn a gap into a next step.',
    description: 'A practical sequence for building and communicating relevant skills.',
  },
  insights: {
    eyebrow: 'RECRUITER INSIGHTS',
    title: 'Read the sample carefully.',
    description: 'Skill counts below are derived from the six synthetic role briefs only.',
  },
  data: {
    eyebrow: 'DATA MANAGEMENT',
    title: 'Keep the sample transparent.',
    description: 'Review what is included and export the demo dataset for exploration.',
  },
}

const chartColors = ['#287967', '#e78b72', '#899c4a', '#5e7eaa', '#c39a45', '#78948d']
const exampleProfileSkills = ['Python', 'SQL', 'Docker', 'React', 'Testing']

function PageHeading({ page }: { page: PageId }) {
  const heading = pageHeadings[page]

  return (
    <div className="page-heading">
      <div>
        <p className="eyebrow">{heading.eyebrow}</p>
        <h1>{heading.title}</h1>
        <p className="page-heading__description">{heading.description}</p>
      </div>
      <span className="sample-badge"><span aria-hidden="true" /> Synthetic sample</span>
    </div>
  )
}

function Panel({
  title,
  caption,
  children,
  className = '',
}: {
  title: string
  caption?: string
  children: React.ReactNode
  className?: string
}) {
  return (
    <section className={`panel ${className}`}>
      <div className="panel__heading">
        <div>
          <h2>{title}</h2>
          {caption && <p>{caption}</p>}
        </div>
      </div>
      {children}
    </section>
  )
}

function MetricCard({
  label,
  value,
  note,
  icon: Icon,
}: {
  label: string
  value: string | number
  note: string
  icon: typeof BriefcaseBusiness
}) {
  return (
    <article className="metric-card">
      <div className="metric-card__top">
        <span>{label}</span>
        <span className="metric-card__icon"><Icon size={17} aria-hidden="true" /></span>
      </div>
      <strong>{value}</strong>
      <p>{note}</p>
    </article>
  )
}

function SkillTags({ skills, limit }: { skills: string[]; limit?: number }) {
  const visibleSkills = limit ? skills.slice(0, limit) : skills

  return (
    <div className="skill-tags">
      {visibleSkills.map((skill) => <span className="skill-tag" key={skill}>{skill}</span>)}
      {limit && skills.length > limit && <span className="skill-tag skill-tag--more">+{skills.length - limit}</span>}
    </div>
  )
}

function OverviewPage({
  onNavigate,
  onSelectJob,
}: {
  onNavigate: (page: PageId) => void
  onSelectJob: (jobId: string) => void
}) {
  const skillFrequency = getSkillFrequency()
  const remoteCount = demoJobs.filter((job) => job.location === 'Remote').length

  return (
    <>
      <div className="metric-grid">
        <MetricCard label="Sample role briefs" value={demoJobs.length} note="Synthetic listings in this workspace" icon={BriefcaseBusiness} />
        <MetricCard label="Distinct skill tags" value={skillFrequency.length} note="Counted across the sample roles" icon={Layers3} />
        <MetricCard label="Remote examples" value={remoteCount} note="Of the sample role briefs" icon={Target} />
      </div>

      <div className="overview-grid">
        <Panel title="Skills across sample roles" caption="Mention count in the six synthetic briefs">
          <div className="chart-wrap">
            <Suspense fallback={<div className="chart-loading" role="status">Loading chart…</div>}>
              <DashboardCharts variant="overview-skills" skillData={skillFrequency.slice(0, 7)} levelData={[]} />
            </Suspense>
          </div>
          <p className="chart-footnote">Counts describe this sample only; they are not live market demand.</p>
        </Panel>

        <Panel title="Role briefs" caption="Open a role's illustrative gap example">
          <div className="role-list">
            {demoJobs.slice(0, 4).map((job) => (
              <button className="role-list__item" type="button" key={job.id} onClick={() => onSelectJob(job.id)}>
                <span className="role-list__mark">{job.role.slice(0, 1)}</span>
                <span className="role-list__copy"><strong>{job.role}</strong><small>{job.company} · {job.level}</small></span>
                <ArrowRight size={16} aria-hidden="true" />
              </button>
            ))}
          </div>
          <button className="text-action" type="button" onClick={() => onNavigate('jobs')}>Browse all sample roles <ArrowRight size={15} /></button>
        </Panel>
      </div>

      <div className="notice-strip">
        <Sparkles size={17} aria-hidden="true" />
        <p><strong>Demo workspace.</strong> All companies, role briefs, and counts shown here are synthetic examples.</p>
      </div>
    </>
  )
}

function JobExplorerPage({
  selectedJobId,
  onSelectJob,
}: {
  selectedJobId: string
  onSelectJob: (jobId: string) => void
}) {
  const [query, setQuery] = useState('')
  const [level, setLevel] = useState('All levels')
  const filteredJobs = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()

    return demoJobs.filter((job) => {
      const matchesQuery = !normalizedQuery || [job.role, job.company, job.location, ...job.skills]
        .some((value) => value.toLowerCase().includes(normalizedQuery))
      const matchesLevel = level === 'All levels' || job.level === level
      return matchesQuery && matchesLevel
    })
  }, [query, level])

  return (
    <>
      <div className="filter-row">
        <label className="search-field">
          <Search size={17} aria-hidden="true" />
          <span className="sr-only">Search sample roles</span>
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search roles, skills, or companies" />
        </label>
        <label className="select-field">
          <Filter size={16} aria-hidden="true" />
          <span className="sr-only">Filter by level</span>
          <select value={level} onChange={(event) => setLevel(event.target.value)}>
            <option>All levels</option>
            <option>Early career</option>
            <option>Mid-level</option>
            <option>Senior</option>
          </select>
        </label>
        <span className="result-count">{filteredJobs.length} of {demoJobs.length} sample roles</span>
      </div>

      {filteredJobs.length ? (
        <div className="job-list">
          {filteredJobs.map((job) => (
            <JobRow key={job.id} job={job} selected={selectedJobId === job.id} onSelect={() => onSelectJob(job.id)} />
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <Search size={22} aria-hidden="true" />
          <h2>No matching sample roles</h2>
          <p>Try another keyword or reset the level filter.</p>
          <button className="button button--secondary" type="button" onClick={() => { setQuery(''); setLevel('All levels') }}>Clear filters</button>
        </div>
      )}
    </>
  )
}

function JobRow({ job, selected, onSelect }: { job: DemoJob; selected: boolean; onSelect: () => void }) {
  return (
    <article className={`job-row${selected ? ' job-row--selected' : ''}`}>
      <div className="job-row__identity">
        <span className="job-row__mark">{job.role.slice(0, 1)}</span>
        <div><h2>{job.role}</h2><p>{job.company}</p></div>
      </div>
      <div className="job-row__meta"><span>{job.location}</span><span>{job.level}</span></div>
      <SkillTags skills={job.skills} limit={4} />
      <button className="button button--secondary job-row__action" type="button" onClick={onSelect}>
        Review gap example <ArrowRight size={15} aria-hidden="true" />
      </button>
    </article>
  )
}

function AnalyzerPage() {
  const [resumeText, setResumeText] = useState('')
  const [message, setMessage] = useState('')
  const [hasError, setHasError] = useState(false)

  function validateInput(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!resumeText.trim()) {
      setHasError(true)
      setMessage('Paste résumé text to validate this form.')
      return
    }
    setHasError(false)
    setMessage('Input received in this tab only. Skill matching is not connected yet; no analysis has been performed.')
  }

  return (
    <div className="analyzer-layout">
      <Panel title="Résumé input" caption="This preview does not upload or save your text." className="analyzer-panel">
        <form className="analyzer-form" onSubmit={validateInput}>
          <label className="form-label" htmlFor="resume-text">Paste résumé text</label>
          <textarea id="resume-text" value={resumeText} onChange={(event) => { setResumeText(event.target.value); setMessage(''); setHasError(false) }} placeholder="Add a short excerpt to preview the input state…" rows={10} />
          <div className="form-footnote"><span>{resumeText.length} characters</span><span>Held in memory only</span></div>
          <button className="button button--primary" type="submit"><Check size={16} aria-hidden="true" /> Validate input</button>
          {message && <p className={`form-message${hasError ? ' form-message--error' : ''}`} role="status">{message}</p>}
        </form>
      </Panel>
      <aside className="privacy-note">
        <div className="privacy-note__icon"><FileText size={19} aria-hidden="true" /></div>
        <p className="eyebrow">MILESTONE PREVIEW</p>
        <h2>Analysis is not connected yet.</h2>
        <p>The matching service comes in a later milestone. This page does not send text to the API, store it, or generate candidate results.</p>
      </aside>
    </div>
  )
}

function SkillGapsPage({ selectedJob }: { selectedJob: DemoJob }) {
  const matched = selectedJob.skills.filter((skill) => exampleProfileSkills.includes(skill))
  const explore = selectedJob.skills.filter((skill) => !exampleProfileSkills.includes(skill))

  return (
    <>
      <div className="sample-result-banner"><CircleHelp size={18} /><span><strong>Illustrative sample only.</strong> This example is not based on a real candidate or résumé.</span></div>
      <div className="gap-summary">
        <div><p className="eyebrow">SELECTED SAMPLE ROLE</p><h2>{selectedJob.role}</h2><p>{selectedJob.company} · {selectedJob.location}</p></div>
        <span className="level-tag">{selectedJob.level}</span>
      </div>
      <div className="gap-grid">
        <Panel title="Skills shown in example profile" caption="Sample skills used for this illustration">
          <SkillTags skills={exampleProfileSkills} />
          <p className="panel-note">A future analysis will use evidence from the résumé you provide.</p>
        </Panel>
        <Panel title="Present in both examples" caption="Overlap between the sample role and sample profile">
          <div className="gap-skill-list">{(matched.length ? matched : ['No overlap in this illustration']).map((skill) => <span className="gap-skill gap-skill--match" key={skill}><Check size={15} />{skill}</span>)}</div>
        </Panel>
        <Panel title="Role skills to explore" caption="Role tags not included in the example profile">
          <div className="gap-skill-list">{explore.map((skill) => <span className="gap-skill" key={skill}><Target size={15} />{skill}</span>)}</div>
          <p className="panel-note">These are prompts for exploration, not a judgment about a person.</p>
        </Panel>
      </div>
    </>
  )
}

function RoadmapPage({ checkedSteps, onToggleStep }: { checkedSteps: string[]; onToggleStep: (stepId: string) => void }) {
  return (
    <div className="roadmap-layout">
      <div className="roadmap-list">
        {roadmapSteps.map((step, index) => (
          <article className={`roadmap-step${checkedSteps.includes(step.id) ? ' roadmap-step--done' : ''}`} key={step.id}>
            <label className="roadmap-step__check">
              <input type="checkbox" checked={checkedSteps.includes(step.id)} onChange={() => onToggleStep(step.id)} />
              <span className="checkmark" aria-hidden="true"><Check size={14} /></span>
              <span className="sr-only">Mark {step.title} complete</span>
            </label>
            <span className="roadmap-step__number">0{index + 1}</span>
            <div className="roadmap-step__content"><span className="eyebrow">{step.category}</span><h2>{step.title}</h2><p>{step.detail}</p></div>
            <ArrowRight className="roadmap-step__arrow" size={18} aria-hidden="true" />
          </article>
        ))}
      </div>
      <aside className="roadmap-aside">
        <p className="eyebrow">YOUR PROGRESS</p>
        <strong>{checkedSteps.length}<span> / {roadmapSteps.length}</span></strong>
        <p>steps checked in this session</p>
        <div className="progress-track"><span style={{ width: `${(checkedSteps.length / roadmapSteps.length) * 100}%` }} /></div>
        <p className="roadmap-aside__note">Progress is temporary and resets when the page reloads.</p>
      </aside>
    </div>
  )
}

function InsightsPage() {
  const skillFrequency = getSkillFrequency().slice(0, 8)
  const levelDistribution = ['Early career', 'Mid-level', 'Senior'].map((level) => ({
    level,
    count: demoJobs.filter((job) => job.level === level).length,
  }))

  return (
    <>
      <div className="insight-callout"><Database size={17} /><span>All values are computed from <strong>{demoJobs.length} synthetic briefs</strong>. This is not live labor-market data.</span></div>
      <div className="insights-grid">
        <Panel title="Most-mentioned skills" caption="Number of sample briefs containing each skill" className="insight-chart-panel">
          <div className="chart-wrap chart-wrap--large">
            <Suspense fallback={<div className="chart-loading" role="status">Loading chart…</div>}>
              <DashboardCharts variant="insight-skills" skillData={skillFrequency} levelData={[]} />
            </Suspense>
          </div>
        </Panel>
        <Panel title="Seniority in sample" caption="Brief count by stated level">
          <div className="chart-wrap chart-wrap--pie">
            <Suspense fallback={<div className="chart-loading" role="status">Loading chart…</div>}>
              <DashboardCharts variant="level-distribution" skillData={[]} levelData={levelDistribution} />
            </Suspense>
          </div>
          <div className="legend-list">{levelDistribution.map((item, index) => <div className="legend-list__item" key={item.level}><span style={{ background: chartColors[index] }} />{item.level}<strong>{item.count}</strong></div>)}</div>
        </Panel>
      </div>
    </>
  )
}

function exportSampleCsv() {
  const escapeCsv = (value: string) => `"${value.replaceAll('"', '""')}"`
  const rows = [
    ['Role', 'Company', 'Location', 'Level', 'Skills'],
    ...demoJobs.map((job) => [job.role, job.company, job.location, job.level, job.skills.join('; ')])
  ]
  const csv = rows.map((row) => row.map(escapeCsv).join(',')).join('\r\n')
  const objectUrl = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }))
  const link = document.createElement('a')
  link.href = objectUrl
  link.download = 'skillsignal-synthetic-sample.csv'
  document.body.appendChild(link)
  link.click()
  link.remove()
  window.setTimeout(() => URL.revokeObjectURL(objectUrl), 1000)
}

function DataManagementPage() {
  const [exported, setExported] = useState(false)

  return (
    <div className="data-layout">
      <Panel title="Synthetic role dataset" caption="The included data is authored for interface demonstration, not collected from employers.">
        <div className="dataset-summary">
          <div><span>Role briefs</span><strong>{demoJobs.length}</strong></div>
          <div><span>Distinct skills</span><strong>{getSkillFrequency().length}</strong></div>
          <div><span>Source</span><strong>Demo data</strong></div>
        </div>
        <div className="dataset-table" role="table" aria-label="Sample dataset contents">
          <div className="dataset-table__head" role="row"><span role="columnheader">Included field</span><span role="columnheader">Description</span></div>
          <div role="row"><span role="cell">Role and company</span><span role="cell">Synthetic names and titles</span></div>
          <div role="row"><span role="cell">Location and level</span><span role="cell">Example attributes for filters</span></div>
          <div role="row"><span role="cell">Skill tags</span><span role="cell">Curated sample terms per role</span></div>
        </div>
      </Panel>
      <aside className="export-panel">
        <div className="export-panel__icon"><ArrowDownToLine size={19} /></div>
        <h2>Export the sample</h2>
        <p>Download the six synthetic role briefs as CSV for local exploration.</p>
        <button className="button button--primary" type="button" onClick={() => { exportSampleCsv(); setExported(true) }}>
          <ArrowDownToLine size={16} aria-hidden="true" /> Export CSV
        </button>
        {exported && <p className="export-success" role="status">Synthetic sample CSV prepared.</p>}
      </aside>
      <div className="notice-strip data-notice"><Sparkles size={17} /><p><strong>Import is not connected.</strong> CSV import and API-backed data management are planned for Milestone 3.</p></div>
    </div>
  )
}

export function DashboardPages({
  page,
  selectedJobId,
  checkedSteps,
  onNavigate,
  onSelectJob,
  onToggleStep,
}: DashboardPagesProps) {
  const selectedJob = demoJobs.find((job) => job.id === selectedJobId) ?? demoJobs[0]

  return (
    <div className="page-content">
      <PageHeading page={page} />
      {page === 'overview' && <OverviewPage onNavigate={onNavigate} onSelectJob={onSelectJob} />}
      {page === 'jobs' && <JobExplorerPage selectedJobId={selectedJob.id} onSelectJob={onSelectJob} />}
      {page === 'analyzer' && <AnalyzerPage />}
      {page === 'gaps' && <SkillGapsPage selectedJob={selectedJob} />}
      {page === 'roadmap' && <RoadmapPage checkedSteps={checkedSteps} onToggleStep={onToggleStep} />}
      {page === 'insights' && <InsightsPage />}
      {page === 'data' && <DataManagementPage />}
    </div>
  )
}