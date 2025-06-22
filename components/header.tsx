'use client'

import { Activity, ChevronRight } from 'lucide-react'
import { usePathname } from 'next/navigation'
import Logo from './logo'
import Link from 'next/link'

export function Header() {
  const pathname = usePathname()
  const isDashboard = pathname === '/dashboard'

  return (
    <header className="px-6 border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-screen-2xl items-center">
        <div className="flex items-center space-x-4">
          <Link className="flex items-center space-x-0 md:space-x-1" href="/">
            <Logo className="md:w-[70px] md:h-[70px] w-[40px] h-[40px]" />
            <span></span>
            <span className="font-serif text-lg md:text-2xl">
              <span className="font-bold -tracking-[0.02em] ">Marvin</span>
              <span className="font-light  tracking-tighter">QA</span>
            </span>
          </Link>
          {isDashboard && (
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <ChevronRight className="h-4 w-4" />
              <span className="font-medium">Dashboard</span>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
