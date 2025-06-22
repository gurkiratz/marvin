import { Github } from 'lucide-react'
import Link from 'next/link'

export function Footer() {
  return (
    <footer className="border-t border-border/40 bg-background/95">
      <div className="container max-w-screen-2xl mx-auto px-6 py-8">
        <div className="flex flex-col sm:flex-row items-center justify-center gap-8">
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <span>Created in</span>
            <span className="font-serif font-medium text-foreground pr-1">
              Waterloo
            </span>
            <span>|</span>
            <span>MarvinQA &copy; 2025 </span>
          </div>
          <div className="flex items-center space-x-4">
            <Link
              href="https://github.com/gurkiratz/marvin"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <Github className="h-4 w-4" />
              <span>GitHub</span>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
