"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'

interface SimpleChartData {
  name: string
  value: number
  color?: string
}

interface SimpleBarChartProps {
  data: SimpleChartData[]
  title: string
  description?: string
}

export function SimpleBarChart({ data, title, description }: SimpleBarChartProps) {
  const maxValue = Math.max(...data.map(d => d.value))
  
  return (
    <Card className="planet-card">
      <CardHeader>
        <CardTitle className="text-lg">{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent className="space-y-4">
        {data.map((item, index) => (
          <div key={index} className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="font-medium">{item.name}</span>
              <span className="text-muted-foreground">{item.value.toLocaleString()}</span>
            </div>
            <div className="relative">
              <Progress 
                value={(item.value / maxValue) * 100} 
                className="h-2"
              />
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

interface DonutChartProps {
  data: SimpleChartData[]
  title: string
  description?: string
  centerValue?: string
  centerLabel?: string
}

export function SimpleDonutChart({ data, title, description, centerValue, centerLabel }: DonutChartProps) {
  const total = data.reduce((acc, item) => acc + item.value, 0)
  let cumulativePercentage = 0
  
  return (
    <Card className="planet-card">
      <CardHeader>
        <CardTitle className="text-lg">{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-center mb-6">
          <div className="relative w-40 h-40">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="40"
                fill="none"
                stroke="oklch(0.25 0.03 264)"
                strokeWidth="8"
              />
              {data.map((item, index) => {
                const percentage = (item.value / total) * 100
                const strokeDasharray = `${percentage * 2.51} 251.2`
                const strokeDashoffset = -cumulativePercentage * 2.51
                cumulativePercentage += percentage
                
                return (
                  <circle
                    key={index}
                    cx="50"
                    cy="50"
                    r="40"
                    fill="none"
                    stroke={item.color}
                    strokeWidth="8"
                    strokeDasharray={strokeDasharray}
                    strokeDashoffset={strokeDashoffset}
                    className="transition-all duration-300"
                  />
                )
              })}
            </svg>
            {centerValue && (
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <div className="text-2xl font-bold text-foreground">{centerValue}</div>
                {centerLabel && (
                  <div className="text-xs text-muted-foreground">{centerLabel}</div>
                )}
              </div>
            )}
          </div>
        </div>
        
        <div className="space-y-2">
          {data.map((item, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-sm font-medium">{item.name}</span>
              </div>
              <div className="text-sm text-muted-foreground">
                {item.value.toLocaleString()} ({((item.value / total) * 100).toFixed(1)}%)
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

interface StatCardProps {
  title: string
  value: string | number
  change?: {
    value: number
    label: string
    positive?: boolean
  }
  icon?: React.ReactNode
  description?: string
}

export function StatCard({ title, value, change, icon, description }: StatCardProps) {
  return (
    <Card className="planet-card glow-effect">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold text-foreground">
              {typeof value === 'number' ? value.toLocaleString() : value}
            </p>
            {description && (
              <p className="text-xs text-muted-foreground">{description}</p>
            )}
            {change && (
              <div className={`flex items-center text-xs ${
                change.positive !== false ? 'text-green-400' : 'text-red-400'
              }`}>
                <span>{change.positive !== false ? '+' : ''}{change.value}%</span>
                <span className="ml-1 text-muted-foreground">{change.label}</span>
              </div>
            )}
          </div>
          {icon && (
            <div className="text-primary opacity-60">
              {icon}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

// Pie Chart Component
interface SimplePieChartProps {
  data: SimpleChartData[]
  width?: number
  height?: number
}

export function SimplePieChart({ data, width = 300, height = 300 }: SimplePieChartProps) {
  const total = data.reduce((sum, item) => sum + item.value, 0)
  let currentAngle = 0

  const radius = Math.min(width, height) / 2 - 20
  const centerX = width / 2
  const centerY = height / 2

  const slices = data.map((item, index) => {
    const percentage = item.value / total
    const angle = percentage * 2 * Math.PI
    const startAngle = currentAngle
    const endAngle = currentAngle + angle
    
    const x1 = centerX + radius * Math.cos(startAngle)
    const y1 = centerY + radius * Math.sin(startAngle)
    const x2 = centerX + radius * Math.cos(endAngle)
    const y2 = centerY + radius * Math.sin(endAngle)
    
    const largeArcFlag = angle > Math.PI ? 1 : 0
    
    const pathData = [
      `M ${centerX} ${centerY}`,
      `L ${x1} ${y1}`,
      `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
      'Z'
    ].join(' ')
    
    currentAngle += angle
    
    return {
      ...item,
      pathData,
      percentage: percentage * 100,
      startAngle,
      endAngle
    }
  })

  return (
    <div className="flex flex-col items-center space-y-4">
      <svg width={width} height={height} className="overflow-visible">
        {slices.map((slice, index) => (
          <path
            key={index}
            d={slice.pathData}
            fill={slice.color || `hsl(${index * 360 / data.length}, 70%, 60%)`}
            stroke="white"
            strokeWidth="2"
            className="hover:opacity-80 transition-opacity"
          />
        ))}
      </svg>
      
      <div className="grid grid-cols-2 gap-2 text-sm">
        {slices.map((slice, index) => (
          <div key={index} className="flex items-center space-x-2">
            <div
              className="w-3 h-3 rounded"
              style={{ backgroundColor: slice.color || `hsl(${index * 360 / data.length}, 70%, 60%)` }}
            />
            <span className="text-muted-foreground">
              {slice.name}: {slice.percentage.toFixed(1)}%
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

// Line Chart Component
interface SimpleLineChartProps {
  data: Array<Record<string, unknown>>
  xKey: string
  lines: Array<{ key: string; color: string; name: string }>
  width?: number
  height?: number
}

export function SimpleLineChart({ data, xKey, lines, width = 400, height = 300 }: SimpleLineChartProps) {
  if (!data.length) return null

  const chartWidth = width - 80
  const chartHeight = height - 80
  const stepX = chartWidth / (data.length - 1)

  // Find min/max values for all lines
  const allValues = lines.flatMap(line => data.map(d => d[line.key]).filter(v => typeof v === 'number'))
  const minValue = Math.min(...allValues)
  const maxValue = Math.max(...allValues)
  const valueRange = maxValue - minValue

  const getY = (value: number) => {
    return chartHeight - ((value - minValue) / valueRange) * chartHeight + 40
  }

  return (
    <div className="flex flex-col space-y-4">
      <svg width={width} height={height} className="overflow-visible">
        {/* Grid lines */}
        {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => {
          const y = 40 + ratio * chartHeight
          return (
            <line
              key={i}
              x1="40"
              y1={y}
              x2={width - 20}
              y2={y}
              stroke="currentColor"
              strokeWidth="1"
              opacity="0.1"
            />
          )
        })}
        
        {/* Axes */}
        <line x1="40" y1="40" x2="40" y2={height - 40} stroke="currentColor" strokeWidth="1" opacity="0.3" />
        <line x1="40" y1={height - 40} x2={width - 20} y2={height - 40} stroke="currentColor" strokeWidth="1" opacity="0.3" />
        
        {/* Lines */}
        {lines.map((line, lineIndex) => {
          const points = data.map((item, index) => {
            const x = 40 + index * stepX
            const y = getY(item[line.key] as number)
            return `${x},${y}`
          }).join(' ')
          
          return (
            <g key={lineIndex}>
              <polyline
                points={points}
                fill="none"
                stroke={line.color}
                strokeWidth="2"
                className="hover:opacity-80 transition-opacity"
              />
              {/* Data points */}
              {data.map((item, index) => {
                const x = 40 + index * stepX
                const y = getY(item[line.key] as number)
                return (
                  <circle
                    key={index}
                    cx={x}
                    cy={y}
                    r="3"
                    fill={line.color}
                    className="hover:r-4 transition-all"
                  />
                )
              })}
            </g>
          )
        })}
        
        {/* X-axis labels */}
        {data.map((item, index) => {
          const x = 40 + index * stepX
          return (
            <text
              key={index}
              x={x}
              y={height - 20}
              textAnchor="middle"
              className="text-xs fill-current"
            >
              {item[xKey] as string}
            </text>
          )
        })}
      </svg>
      
      {/* Legend */}
      <div className="flex justify-center space-x-4">
        {lines.map((line, index) => (
          <div key={index} className="flex items-center space-x-2">
            <div className="w-3 h-0.5" style={{ backgroundColor: line.color }} />
            <span className="text-sm text-muted-foreground">{line.name}</span>
          </div>
        ))}
      </div>
    </div>
  )
}