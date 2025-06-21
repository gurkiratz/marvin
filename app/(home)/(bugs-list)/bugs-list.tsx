import { getBugsData } from '@/lib/utils'
import { BugHoverCard } from './hover-bug-card'

export function BugsList() {
  const bugs = getBugsData()

  return (
    <div className="space-y-2 p-4">
      <h3 className="text-lg font-semibold mb-4">Bugs List</h3>
      <div className="flex flex-col gap-1">
        {bugs.map((bug) => (
          <BugHoverCard key={bug.id} bug={bug} />
        ))}
      </div>
    </div>
  )
}
