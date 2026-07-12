import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { CHART_COLORS } from '@/features/analytics/lib/analytics-chart-config'
import type { AnalyticsChartKind } from '@/features/analytics/types/analytics.types'
import { cn } from '@/lib/utils'

export interface AnalyticsChartDatum {
  name: string
  value: number
  [key: string]: string | number
}

interface AnalyticsChartProps {
  title: string
  kind: AnalyticsChartKind
  data: AnalyticsChartDatum[]
  className?: string
  /** Chart plot height utility, e.g. `h-48` or `h-full min-h-48`. */
  chartClassName?: string
}

function ChartTooltipContent({
  active,
  payload,
  label,
}: {
  active?: boolean
  payload?: { value?: number; name?: string }[]
  label?: string
}) {
  if (!active || !payload?.length) return null

  return (
    <div className="bg-popover text-popover-foreground rounded-md border px-3 py-2 text-xs shadow-md">
      <p className="font-medium">{label ?? payload[0]?.name}</p>
      <p className="text-muted-foreground tabular-nums">{payload[0]?.value}</p>
    </div>
  )
}

function AccessibleDataTable({ title, data }: { title: string; data: AnalyticsChartDatum[] }) {
  return (
    <details className="mt-3">
      <summary className="text-muted-foreground cursor-pointer text-xs font-medium">
        View data table
      </summary>
      <table className="mt-2 w-full text-left text-xs">
        <caption className="sr-only">{title} data table</caption>
        <thead>
          <tr className="border-b">
            <th scope="col" className="py-1 pr-3 font-medium">
              Label
            </th>
            <th scope="col" className="py-1 font-medium">
              Value
            </th>
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr
              key={`${row.name}-${String(row.value)}`}
              className="border-b border-dashed last:border-0"
            >
              <td className="py-1 pr-3">{row.name}</td>
              <td className="py-1 tabular-nums">{row.value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </details>
  )
}

function renderChart(kind: AnalyticsChartKind, data: AnalyticsChartDatum[], innerRadius: number) {
  if (kind === 'line') {
    return (
      <LineChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" className="stroke-border/60" />
        <XAxis dataKey="name" tick={{ fontSize: 12 }} />
        <YAxis tick={{ fontSize: 12 }} />
        <Tooltip content={<ChartTooltipContent />} />
        <Line type="monotone" dataKey="value" stroke="var(--primary)" strokeWidth={2} dot={false} />
      </LineChart>
    )
  }

  if (kind === 'area') {
    return (
      <AreaChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" className="stroke-border/60" />
        <XAxis dataKey="name" tick={{ fontSize: 12 }} />
        <YAxis tick={{ fontSize: 12 }} />
        <Tooltip content={<ChartTooltipContent />} />
        <Area
          type="monotone"
          dataKey="value"
          stroke="var(--primary)"
          fill="var(--primary)"
          fillOpacity={0.15}
        />
      </AreaChart>
    )
  }

  if (kind === 'bar') {
    return (
      <BarChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" className="stroke-border/60" />
        <XAxis dataKey="name" tick={{ fontSize: 12 }} />
        <YAxis tick={{ fontSize: 12 }} />
        <Tooltip content={<ChartTooltipContent />} />
        <Bar dataKey="value" radius={[4, 4, 0, 0]}>
          {data.map((entry, index) => (
            <Cell
              key={`${entry.name}-${String(index)}`}
              fill={CHART_COLORS[index % CHART_COLORS.length]}
            />
          ))}
        </Bar>
      </BarChart>
    )
  }

  return (
    <PieChart>
      <Tooltip content={<ChartTooltipContent />} />
      <Legend />
      <Pie
        data={data}
        dataKey="value"
        nameKey="name"
        cx="50%"
        cy="50%"
        innerRadius={innerRadius}
        outerRadius={88}
        paddingAngle={2}
      >
        {data.map((entry, index) => (
          <Cell
            key={`${entry.name}-${String(index)}`}
            fill={CHART_COLORS[index % CHART_COLORS.length]}
          />
        ))}
      </Pie>
    </PieChart>
  )
}

export function AnalyticsChart({
  title,
  kind,
  data,
  className,
  chartClassName = 'h-64',
}: AnalyticsChartProps) {
  if (data.length === 0) return null

  const innerRadius = kind === 'donut' ? 56 : 0

  return (
    <Card className={cn('flex h-full flex-col', className)}>
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold">{title}</CardTitle>
      </CardHeader>
      <CardContent className="flex min-h-0 flex-1 flex-col">
        <div className={cn('w-full', chartClassName)} role="img" aria-label={title}>
          <ResponsiveContainer width="100%" height="100%">
            {renderChart(kind, data, innerRadius)}
          </ResponsiveContainer>
        </div>
        <AccessibleDataTable title={title} data={data} />
      </CardContent>
    </Card>
  )
}
