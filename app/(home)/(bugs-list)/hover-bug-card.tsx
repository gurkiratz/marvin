import { Button } from '@/components/ui/button'
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/hover-card'

interface BugHoverCardProps {
  bug: {
    id: number
    name?: string
    analysis: string
  }
}

export function BugHoverCard({ bug }: BugHoverCardProps) {
  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <Button variant="link" className="h-auto p-2 text-left justify-start">
          <span className="font-mono text-sm">#{bug.id}</span>
          {bug.name && <span className="ml-2">{bug.name}</span>}
        </Button>
      </HoverCardTrigger>
      <HoverCardContent className="w-80">
        <div className="space-y-2">
          <h4 className="text-sm font-semibold">Bug Analysis</h4>
          <p className="text-sm text-muted-foreground">{bug.analysis}</p>
        </div>
      </HoverCardContent>
    </HoverCard>
  )
}
