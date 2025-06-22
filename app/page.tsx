import { ArrowRight, Brain, Search, Zap } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="px-6 pt-20 pb-16">
        <div className="container max-w-6xl mx-auto">
          <div className="text-center space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight">
                <span className="font-mono text-foreground/90">Debug</span>{' '}
                <span className="font-serif text-foreground">
                  your scrapers.
                </span>
                <br />
                <span className="font-serif text-foreground/70">
                  Fix them faster.
                </span>
              </h1>
              <p className="font-serif text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                MarvinQA uses Gemini AI to diagnose web scraper failures,
                analyze patterns, and provide actionable insights—so you can
                focus on building, not debugging.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button size="lg" className="text-lg px-8 py-6" asChild>
                <Link href="/dashboard">
                  Start Diagnosing
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" className="text-lg px-8 py-6">
                View Demo
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-6 py-20 border-t border-border/40">
        <div className="container max-w-6xl mx-auto">
          <div className="text-center space-y-16">
            <div className="space-y-4">
              <h2 className="font-serif text-3xl md:text-4xl text-foreground">
                Stop guessing. Start knowing.
              </h2>
              <p className="font-serif text-lg text-muted-foreground max-w-2xl mx-auto">
                Every scraper failure tells a story. MarvinQA reads between the
                lines.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="space-y-4 text-center">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mx-auto">
                  <Brain className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-serif text-xl font-semibold">
                  AI-Powered Analysis
                </h3>
                <p className="font-serif text-muted-foreground">
                  Gemini AI analyzes failure patterns and suggests precise fixes
                  for your scrapers.
                </p>
              </div>

              <div className="space-y-4 text-center">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mx-auto">
                  <Search className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-serif text-xl font-semibold">
                  Real-time Monitoring
                </h3>
                <p className="font-serif text-muted-foreground">
                  Track scraper performance and catch issues before they impact
                  your data pipeline.
                </p>
              </div>

              <div className="space-y-4 text-center">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mx-auto">
                  <Zap className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-serif text-xl font-semibold">
                  Instant Insights
                </h3>
                <p className="font-serif text-muted-foreground">
                  Get actionable recommendations in seconds, not hours of manual
                  debugging.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-6 py-20 border-t border-border/40">
        <div className="container max-w-4xl mx-auto text-center space-y-8">
          <div className="space-y-4">
            <h2 className="font-serif text-3xl md:text-4xl text-foreground">
              Ready to fix what&apos;s broken?
            </h2>
            <p className="font-serif text-lg text-muted-foreground">
              Join developers who&apos;ve already reduced their debugging time
              by 80%.
            </p>
          </div>
          <Button size="lg" className="text-lg px-8 py-6" asChild>
            <Link href="/dashboard">
              Get Started Today
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  )
}
