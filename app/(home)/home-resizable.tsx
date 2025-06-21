import { ChartAreaInteractive } from '@/components/graph/chart-area-interactive'
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@/components/ui/resizable'
import { BugsList } from './(bugs-list)/bugs-list'

export function HomeResizable() {
  return (
    <ResizablePanelGroup
      direction="horizontal"
      className="max-w-full rounded-lg border md:min-w-[450px]"
    >
      <ResizablePanel defaultSize={50}>
        <ResizablePanelGroup direction="vertical">
          <ResizablePanel defaultSize={40}>
            {/* <div className="flex h-full items-center justify-center p-6">
              <span className="font-semibold">Two</span>
            </div> */}
            <ChartAreaInteractive />
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel defaultSize={60}>
            <div className="flex h-full items-center justify-center p-6">
              <span className="font-semibold">Three</span>
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel defaultSize={20}>
        <BugsList />
      </ResizablePanel>
    </ResizablePanelGroup>
  )
}
