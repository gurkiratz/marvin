'use client'

import { useState } from 'react'
import { ChartAreaInteractive } from '@/components/graph/chart-area-interactive'
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@/components/ui/resizable'
import { BugsList } from './(bugs-list)/bugs-list'
import { BugDiagnosis } from './(bugs-list)/bug-diagnosis'

interface Bug {
  id: number
  name: string
  occurredAt: string
  severity: string
  bad: string[]
  good: string[]
  diagnosis: string
  diagnosis_steps: Array<{
    name: string
    description: string
  }>
}

export function HomeResizable() {
  const [selectedBug, setSelectedBug] = useState<Bug | null>(null)

  const handleBugSelect = (bug: Bug) => {
    setSelectedBug(bug)
  }

  return (
    <div className="h-full w-full">
      <ResizablePanelGroup
        direction="horizontal"
        className="h-full w-full rounded-lg border"
      >
        <ResizablePanel defaultSize={70} minSize={30}>
          <ResizablePanelGroup direction="vertical" className="h-full">
            <ResizablePanel defaultSize={40} minSize={20}>
              <div className="h-full w-full">
                <ChartAreaInteractive />
              </div>
            </ResizablePanel>
            <ResizableHandle withHandle />
            <ResizablePanel defaultSize={60} minSize={30}>
              <div className="h-full w-full overflow-hidden">
                <BugDiagnosis selectedBug={selectedBug} />
              </div>
            </ResizablePanel>
          </ResizablePanelGroup>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={30} minSize={20}>
          <div className="h-full w-full overflow-hidden">
            <BugsList
              onBugSelect={handleBugSelect}
              selectedBugId={selectedBug?.id}
            />
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  )
}
