import { useEffect, useState } from 'react'
import { Menu, Wifi, WifiOff } from 'lucide-react'
import './App.css'
import './skill-signal.css'
import './dashboard.css'
import { getHealth } from './lib/api'
import { DashboardPages } from './components/DashboardPages'
import { Sidebar } from './components/Sidebar'
import type { PageId } from './types'

type HealthState = 'checking' | 'online' | 'offline'

const pageTitles: Record<PageId, string> = {
  overview: 'Overview',
  jobs: 'Job Explorer',
  analyzer: 'Resume Analyzer',
  gaps: 'Skill Gap Results',
  roadmap: 'Learning Roadmap',
  insights: 'Recruiter Insights',
  data: 'Data Management',
}

function App() {
  const [page, setPage] = useState<PageId>('overview')
  const [mobileNavOpen, setMobileNavOpen] = useState(false)
  const [selectedJobId, setSelectedJobId] = useState('ai-engineer')
  const [checkedSteps, setCheckedSteps] = useState<string[]>([])
  const [health, setHealth] = useState<HealthState>('checking')

  useEffect(() => {
    const controller = new AbortController()

    getHealth(controller.signal)
      .then(() => setHealth('online'))
      .catch(() => {
        if (!controller.signal.aborted) setHealth('offline')
      })

    return () => controller.abort()
  }, [])

  function navigateTo(nextPage: PageId) {
    setPage(nextPage)
    setMobileNavOpen(false)
  }

  function selectJob(jobId: string) {
    setSelectedJobId(jobId)
    setPage('gaps')
    setMobileNavOpen(false)
  }

  function toggleStep(stepId: string) {
    setCheckedSteps((steps) => steps.includes(stepId)
      ? steps.filter((step) => step !== stepId)
      : [...steps, stepId])
  }

  return (
    <div className="app-shell">
      <Sidebar activePage={page} isOpen={mobileNavOpen} onNavigate={navigateTo} onClose={() => setMobileNavOpen(false)} />
      <button className={`mobile-backdrop${mobileNavOpen ? ' mobile-backdrop--visible' : ''}`} type="button" aria-label="Close navigation" onClick={() => setMobileNavOpen(false)} tabIndex={mobileNavOpen ? 0 : -1} />
      <main className="app-main">
        <header className="app-topbar">
          <button className="icon-button mobile-menu" type="button" aria-label="Open navigation" aria-expanded={mobileNavOpen} onClick={() => setMobileNavOpen(true)}>
            <Menu size={20} />
          </button>
          <div className="app-topbar__title"><span>SKILLSIGNAL WORKSPACE</span><strong>{pageTitles[page]}</strong></div>
          <div className="app-topbar__status">
            <span className="sample-badge sample-badge--compact"><span aria-hidden="true" /> Synthetic data</span>
            <span className={`api-status api-status--${health}`} role="status" aria-label={`API ${health}`}>
              {health === 'online' ? <Wifi size={16} /> : <WifiOff size={16} />}
              <span>{health === 'checking' ? 'Checking API' : health === 'online' ? 'API connected' : 'API offline'}</span>
            </span>
          </div>
        </header>
        <DashboardPages
          page={page}
          selectedJobId={selectedJobId}
          checkedSteps={checkedSteps}
          onNavigate={navigateTo}
          onSelectJob={selectJob}
          onToggleStep={toggleStep}
        />
      </main>
    </div>
  )
}

export default App
