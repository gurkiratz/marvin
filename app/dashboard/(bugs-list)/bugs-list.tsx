import { getBugsData } from '@/lib/utils'
import { BugHoverCard } from './hover-bug-card'

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

interface BugsListProps {
  onBugSelect: (bug: Bug) => void
  selectedBugId?: number
}

export function BugsList({ onBugSelect, selectedBugId }: BugsListProps) {
  const bugs = getBugsData()

  return (
    <div className="space-y-2 p-4">
      <h3 className="text-lg font-semibold mb-4">Bugs List</h3>
      <div className="flex flex-col gap-1">
        {bugs.map((bug) => (
          <div
            key={bug.id}
            className={`cursor-pointer rounded-lg transition-colors ${
              selectedBugId === bug.id ? 'bg-primary/10' : 'hover:bg-muted/50'
            }`}
            onClick={() => onBugSelect(bug)}
          >
            <BugHoverCard bug={bug} />
          </div>
        ))}
      </div>
    </div>
  )
}
