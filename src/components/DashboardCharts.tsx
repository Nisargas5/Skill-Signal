import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

type SkillCount = { skill: string; mentions: number }
type LevelCount = { level: string; count: number }

type DashboardChartsProps = {
  variant: 'overview-skills' | 'insight-skills' | 'level-distribution'
  skillData: SkillCount[]
  levelData: LevelCount[]
}

const chartColors = ['#287967', '#e78b72', '#899c4a']
const tooltipStyle = { border: '1px solid #dce5df', borderRadius: 6, fontSize: 12 }

export default function DashboardCharts({ variant, skillData, levelData }: DashboardChartsProps) {
  if (variant === 'overview-skills') {
    return (
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={skillData} margin={{ top: 12, right: 12, left: -22, bottom: 0 }}>
          <CartesianGrid vertical={false} stroke="#e8eeea" />
          <XAxis dataKey="skill" axisLine={false} tickLine={false} tick={{ fill: '#71807d', fontSize: 11 }} interval={0} angle={-20} textAnchor="end" height={56} />
          <YAxis allowDecimals={false} axisLine={false} tickLine={false} tick={{ fill: '#87918e', fontSize: 11 }} />
          <Tooltip cursor={{ fill: '#f1f5f1' }} contentStyle={tooltipStyle} />
          <Bar dataKey="mentions" name="Brief mentions" fill="#287967" radius={[4, 4, 0, 0]} maxBarSize={42} />
        </BarChart>
      </ResponsiveContainer>
    )
  }

  if (variant === 'insight-skills') {
    return (
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={skillData} layout="vertical" margin={{ top: 8, right: 18, left: 12, bottom: 4 }}>
          <CartesianGrid horizontal={false} stroke="#e8eeea" />
          <XAxis type="number" allowDecimals={false} axisLine={false} tickLine={false} tick={{ fill: '#87918e', fontSize: 11 }} />
          <YAxis type="category" dataKey="skill" axisLine={false} tickLine={false} width={118} tick={{ fill: '#536762', fontSize: 11 }} />
          <Tooltip cursor={{ fill: '#f1f5f1' }} contentStyle={tooltipStyle} />
          <Bar dataKey="mentions" name="Sample briefs" fill="#287967" radius={[0, 4, 4, 0]} maxBarSize={22} />
        </BarChart>
      </ResponsiveContainer>
    )
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie data={levelData} dataKey="count" nameKey="level" innerRadius={56} outerRadius={86} paddingAngle={3}>
          {levelData.map((item, index) => <Cell key={item.level} fill={chartColors[index % chartColors.length]} />)}
        </Pie>
        <Tooltip contentStyle={tooltipStyle} />
      </PieChart>
    </ResponsiveContainer>
  )
}