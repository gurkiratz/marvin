'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'

interface Bug {
  id: number
  name: string
  bad: string[]
  good: string[]
  diagnosis: string
  diagnosis_steps: Array<{
    name: string
    description: string
  }>
}

interface BugDiagnosisProps {
  selectedBug: Bug | null
}

export function BugDiagnosis({ selectedBug }: BugDiagnosisProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [isThinking, setIsThinking] = useState(false)
  const [showLogs, setShowLogs] = useState(false)
  const [streamedBadLogs, setStreamedBadLogs] = useState<string[]>([])
  const [streamedGoodLogs, setStreamedGoodLogs] = useState<string[]>([])

  useEffect(() => {
    if (selectedBug) {
      setCurrentStep(0)
      setIsThinking(true)
      setShowLogs(false)
      setStreamedBadLogs([])
      setStreamedGoodLogs([])
      startDiagnosis()
    }
  }, [selectedBug])

  const startDiagnosis = async () => {
    if (!selectedBug) return

    // Step through diagnosis steps
    for (let i = 0; i < selectedBug.diagnosis_steps.length; i++) {
      setCurrentStep(i)
      await new Promise((resolve) => setTimeout(resolve, 2000))
    }

    // Finish thinking
    setIsThinking(false)
    setShowLogs(true)

    // Stream logs
    await streamLogs()
  }

  const streamLogs = async () => {
    if (!selectedBug) return

    const maxLength = Math.max(selectedBug.bad.length, selectedBug.good.length)

    for (let i = 0; i < maxLength; i++) {
      if (i < selectedBug.bad.length) {
        setStreamedBadLogs((prev) => [...prev, selectedBug.bad[i]])
      }
      if (i < selectedBug.good.length) {
        setStreamedGoodLogs((prev) => [...prev, selectedBug.good[i]])
      }
      await new Promise((resolve) => setTimeout(resolve, 800))
    }
  }

  if (!selectedBug) {
    return (
      <div className="p-6 h-full flex items-center justify-center">
        <div className="text-center text-muted-foreground">
          <div className="text-lg mb-2">🔍</div>
          <p>Select a bug to start diagnosis</p>
        </div>
      </div>
    )
  }

  if (isThinking) {
    return (
      <div className="p-6 space-y-4">
        <div className="flex items-center gap-2 mb-6">
          <div className="animate-spin rounded-full h-4 w-4 border-2 border-primary border-t-transparent"></div>
          <span className="text-sm font-medium">
            AI Diagnosing Bug #{selectedBug.id}
          </span>
        </div>

        <div className="space-y-3">
          {selectedBug.diagnosis_steps.map((step, index) => (
            <div
              key={index}
              className={`p-3 rounded-lg border transition-all duration-500 ${
                index === currentStep
                  ? 'bg-primary/10 border-primary'
                  : index < currentStep
                  ? 'bg-muted border-muted-foreground/20'
                  : 'border-muted-foreground/10'
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                {index < currentStep ? (
                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                ) : index === currentStep ? (
                  <div className="w-2 h-2 rounded-full bg-primary animate-pulse"></div>
                ) : (
                  <div className="w-2 h-2 rounded-full bg-muted-foreground/30"></div>
                )}
                <span className="text-sm font-medium">{step.name}</span>
              </div>
              <p className="text-xs text-muted-foreground ml-4">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (showLogs) {
    return (
      <div className="flex flex-col h-full p-4">
        <div className="flex-shrink-0 mb-4">
          <h3 className="text-lg font-semibold">
            Bug #{selectedBug.id}: {selectedBug.name}
          </h3>
        </div>

        <div className="flex-1 grid grid-cols-2 gap-4 min-h-0">
          <Card className="flex flex-col h-full">
            <CardHeader className="flex-shrink-0 pb-2">
              <CardTitle className="text-sm text-red-600">
                Bad Scenario
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 p-3 overflow-auto">
              <div className="space-y-1 font-mono text-xs">
                {streamedBadLogs.map((log, index) => (
                  <div
                    key={index}
                    className="animate-in slide-in-from-left-2 duration-300 text-red-700 bg-red-50 px-2 py-1 rounded border-l-2 border-red-300"
                  >
                    {log}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="flex flex-col h-full">
            <CardHeader className="flex-shrink-0 pb-2">
              <CardTitle className="text-sm text-primary">
                Good Scenario
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 p-3 overflow-auto">
              <div className="space-y-1 font-mono text-xs">
                {streamedGoodLogs.map((log, index) => (
                  <div
                    key={index}
                    className="animate-in slide-in-from-right-2 duration-300 text-primary bg-green-50 px-2 py-1 rounded border-l-2 border-green-300"
                  >
                    {log}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex-shrink-0 mt-4">
          <Separator className="mb-3" />
          <div>
            <h4 className="text-sm font-medium mb-2">Diagnosis</h4>
            <p className="text-xs text-muted-foreground">
              {selectedBug.diagnosis}
            </p>
          </div>
        </div>
      </div>
    )
  }

  return null
}
