'use client'

import * as React from 'react'
import { Area, AreaChart, CartesianGrid, XAxis } from 'recharts'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { getGraphData, getBugsData } from '@/lib/utils'

export const description = 'Scraper Success/Failure Rates'

const chartConfig = {
  rates: {
    label: 'Rates',
  },
  failureRate: {
    label: 'Failure Rate',
    color: 'var(--chart-5)',
  },
  successRate: {
    label: 'Success Rate',
    color: 'var(--chart-2)',
  },
} satisfies ChartConfig

export function ChartAreaInteractive({
  onLoadingComplete,
}: {
  onLoadingComplete?: () => void
}) {
  const [timeRange, setTimeRange] = React.useState('24h')
  const [animatedDataLength, setAnimatedDataLength] = React.useState(0)
  const [registeredBugs, setRegisteredBugs] = React.useState<Set<number>>(
    new Set()
  )
  const rawData = getGraphData()
  const bugsData = getBugsData()

  const filteredData = rawData
    .filter((item) => {
      const date = new Date(item.timestamp)
      const referenceDate = new Date('2025-06-22T05:00:00Z') // Latest timestamp in data
      let hoursToSubtract = 24 * 2 // All data (about 2 days)

      if (timeRange === '24h') {
        hoursToSubtract = 24
      } else if (timeRange === '12h') {
        hoursToSubtract = 12
      } else if (timeRange === '6h') {
        hoursToSubtract = 6
      }

      const startDate = new Date(referenceDate)
      startDate.setHours(startDate.getHours() - hoursToSubtract)
      return date >= startDate
    })
    .map((item) => ({
      ...item,
      // Convert to percentage for display
      successRate: Math.round(item.successRate * 100),
      failureRate: Math.round(item.failureRate * 100),
    }))

  // Time-lapse animation effect with bug detection
  React.useEffect(() => {
    const timer = setInterval(() => {
      setAnimatedDataLength((prev) => {
        if (prev >= filteredData.length) {
          clearInterval(timer)
          // Notify parent that loading is complete (async to avoid render cycle issues)
          setTimeout(() => {
            onLoadingComplete?.()
          }, 0)
          return filteredData.length
        }

        // Check for new bugs at current data point
        const currentDataPoint = filteredData[prev]
        if (currentDataPoint?.relatedBugs) {
          currentDataPoint.relatedBugs.forEach((bugId) => {
            if (!registeredBugs.has(bugId)) {
              const bug = bugsData.find((b) => b.id === bugId)
              if (bug) {
                // Show toast notification for new bug
                toast.error(`Bug Detected: ${bug.name}`, {
                  description: `Severity: ${bug.severity.toUpperCase()}`,
                  duration: 4000,
                })
                setRegisteredBugs((prev) => new Set([...prev, bugId]))
                250
              }
            }
          })
        }

        return prev + 1
      })
    }, 250) // Show new data point every 500ms for time-lapse effect

    return () => clearInterval(timer)
  }, [
    filteredData.length,
    timeRange,
    registeredBugs,
    bugsData,
    onLoadingComplete,
  ])

  // Reset animation when time range changes
  React.useEffect(() => {
    setAnimatedDataLength(0)
    setRegisteredBugs(new Set())
  }, [timeRange])

  // Get animated data slice
  const displayData = filteredData.slice(0, animatedDataLength)
  const isLoading = animatedDataLength < filteredData.length

  return (
    <Card className="pt-0 h-full relative">
      <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
        <div className="grid flex-1 gap-1">
          <CardTitle>Scraper Success/Failure Rates</CardTitle>
          <CardDescription>
            Showing scraper performance metrics over time
          </CardDescription>
        </div>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="hidden w-[160px] rounded-lg sm:ml-auto sm:flex">
            <SelectValue placeholder="Last 24 hours" />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            <SelectItem value="all" className="rounded-lg">
              All time
            </SelectItem>
            <SelectItem value="24h" className="rounded-lg">
              Last 24 hours
            </SelectItem>
            <SelectItem value="12h" className="rounded-lg">
              Last 12 hours
            </SelectItem>
            <SelectItem value="6h" className="rounded-lg">
              Last 6 hours
            </SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>

      {/* Status Bar */}
      {isLoading && (
        <div className="absolute top-20 left-4 right-4 z-10">
          <div className="bg-background/95 backdrop-blur-sm border rounded-lg px-4 py-2 shadow-sm">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Scraping system data...</span>
              <span className="text-xs">
                ({animatedDataLength}/{filteredData.length} points)
              </span>
            </div>
          </div>
        </div>
      )}

      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <AreaChart data={displayData}>
            <defs>
              <linearGradient id="fillFailureRate" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-failureRate)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-failureRate)"
                  stopOpacity={0.1}
                />
              </linearGradient>
              <linearGradient id="fillSuccessRate" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-successRate)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-successRate)"
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="timestamp"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value)
                return date.toLocaleTimeString('en-US', {
                  hour: '2-digit',
                  minute: '2-digit',
                  hour12: false,
                })
              }}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                      hour12: false,
                    })
                  }}
                  formatter={(value, name) => [
                    `${value}%`,
                    name === 'successRate' ? 'Success Rate' : 'Failure Rate',
                  ]}
                  indicator="dot"
                />
              }
            />
            <Area
              dataKey="successRate"
              type="natural"
              fill="url(#fillSuccessRate)"
              stroke="var(--color-successRate)"
              fillOpacity={0.6}
              strokeWidth={2}
              animationDuration={300}
            />
            <Area
              dataKey="failureRate"
              type="natural"
              fill="url(#fillFailureRate)"
              stroke="var(--color-failureRate)"
              fillOpacity={0.6}
              strokeWidth={2}
              animationDuration={300}
            />
            <ChartLegend content={<ChartLegendContent />} />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
