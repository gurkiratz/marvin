'use client'

import * as React from 'react'
import { Area, AreaChart, CartesianGrid, XAxis } from 'recharts'

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
import { getGraphData } from '@/lib/utils'

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

export function ChartAreaInteractive() {
  const [timeRange, setTimeRange] = React.useState('all')
  const rawData = getGraphData()

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

  return (
    <Card className="pt-0 h-full">
      <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
        <div className="grid flex-1 gap-1">
          <CardTitle>Scraper Success/Failure Rates</CardTitle>
          <CardDescription>
            Showing scraper performance metrics over time
          </CardDescription>
        </div>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger
            className="hidden w-[160px] rounded-lg sm:ml-auto sm:flex"
            aria-label="Select a time range"
          >
            <SelectValue placeholder="All time" />
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
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <AreaChart data={filteredData}>
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
            />
            <Area
              dataKey="failureRate"
              type="natural"
              fill="url(#fillFailureRate)"
              stroke="var(--color-failureRate)"
              fillOpacity={0.6}
            />
            <ChartLegend content={<ChartLegendContent />} />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
