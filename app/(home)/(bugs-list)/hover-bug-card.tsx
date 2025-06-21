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
    occurredAt: string
    severity: string
    diagnosis: string
  }
}

export function BugHoverCard({ bug }: BugHoverCardProps) {
  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    })
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high':
        return 'text-red-600'
      case 'medium':
        return 'text-orange-600'
      case 'low':
        return 'text-yellow-600'
      default:
        return 'text-gray-600'
    }
  }

  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <Button
          variant="link"
          className="h-auto p-2 text-left justify-start flex-col items-start"
        >
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs">
              {formatTime(bug.occurredAt)}
            </span>
            <span
              className={`text-xs font-medium ${getSeverityColor(
                bug.severity
              )}`}
            >
              {bug.severity.toUpperCase()}
            </span>
          </div>
          {bug.name && (
            <span className="text-sm truncate max-w-[200px]">{bug.name}</span>
          )}
        </Button>
      </HoverCardTrigger>
      <HoverCardContent className="w-80">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-semibold">Bug #{bug.id}</h4>
            <span
              className={`text-xs px-2 py-1 rounded ${getSeverityColor(
                bug.severity
              )} bg-opacity-10`}
            >
              {bug.severity}
            </span>
          </div>
          <p className="text-xs text-muted-foreground mb-2">
            Occurred: {formatTime(bug.occurredAt)}
          </p>
          <p className="text-sm text-muted-foreground">{bug.diagnosis}</p>
        </div>
      </HoverCardContent>
    </HoverCard>
  )
}
