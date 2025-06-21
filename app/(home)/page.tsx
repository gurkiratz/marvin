import { ChartAreaInteractive } from '@/components/graph/chart-area-interactive'
import Image from 'next/image'
import { HomeResizable } from './home-resizable'

export default function Home() {
  return (
    <div className="p-4 h-screen">
      {/* <div className="flex gap-4">
        <div className="w-2/3">
          <ChartAreaInteractive />
        </div>
        <div className="max-w-1/3"></div>
      </div> */}
      <HomeResizable />
    </div>
  )
}
