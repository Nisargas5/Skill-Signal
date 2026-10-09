import {
  BarChart3,
  BookOpen,
  Database,
  FileText,
  LayoutDashboard,
  Search,
  Target,
  X,
  type LucideIcon,
} from 'lucide-react'
import type { PageId } from '../types'

type SidebarProps = {
  activePage: PageId
  isOpen: boolean
  onNavigate: (page: PageId) => void
  onClose: () => void
}

const navigationGroups: {
  title: string
  items: { id: PageId; label: string; icon: LucideIcon }[]
}[] = [
  {
    title: 'Workspace',
    items: [
      { id: 'overview', label: 'Overview', icon: LayoutDashboard },
      { id: 'jobs', label: 'Job Explorer', icon: Search },
      { id: 'analyzer', label: 'Resume Analyzer', icon: FileText },
      { id: 'gaps', label: 'Skill Gap Results', icon: Target },
      { id: 'roadmap', label: 'Learning Roadmap', icon: BookOpen },
    ],
  },
  {
    title: 'Signals',
    items: [
      { id: 'insights', label: 'Recruiter Insights', icon: BarChart3 },
      { id: 'data', label: 'Data Management', icon: Database },
    ],
  },
]

export function Sidebar({ activePage, isOpen, onNavigate, onClose }: SidebarProps) {
  return (
    <aside className={`sidebar${isOpen ? ' sidebar--open' : ''}`} aria-label="Main navigation">
      <div className="sidebar__brand-row">
        <button
          className="brand"
          type="button"
          onClick={() => onNavigate('overview')}
          aria-label="SkillSignal overview"
        >
          <span className="brand__mark" aria-hidden="true">S</span>
          <span>SkillSignal</span>
        </button>
        <button className="icon-button sidebar__close" type="button" onClick={onClose} aria-label="Close navigation">
          <X size={18} />
        </button>
      </div>

      <div className="sidebar__body">
        {navigationGroups.map((group) => (
          <section className="nav-group" key={group.title} aria-label={group.title}>
            <p className="nav-group__title">{group.title}</p>
            <nav className="nav-list">
              {group.items.map(({ id, label, icon: Icon }) => (
                <button
                  className={`nav-item${activePage === id ? ' nav-item--active' : ''}`}
                  key={id}
                  type="button"
                  onClick={() => onNavigate(id)}
                  aria-current={activePage === id ? 'page' : undefined}
                >
                  <Icon size={18} strokeWidth={1.8} aria-hidden="true" />
                  <span>{label}</span>
                </button>
              ))}
            </nav>
          </section>
        ))}
      </div>

      <div className="sidebar__bottom">
        <span className="demo-indicator"><span aria-hidden="true" /> Synthetic demo</span>
        <span className="sidebar__version">SKILLS, IN CONTEXT</span>
      </div>
    </aside>
  )
}