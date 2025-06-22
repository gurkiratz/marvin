'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'

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

interface BugDiagnosisProps {
  selectedBug: Bug | null
}

export function BugDiagnosis({ selectedBug }: BugDiagnosisProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [isThinking, setIsThinking] = useState(false)
  const [showLogs, setShowLogs] = useState(false)
  const [streamedBadLogs, setStreamedBadLogs] = useState<string[]>([])
  const [streamedGoodLogs, setStreamedGoodLogs] = useState<string[]>([])
  const [streamedDiagnosis, setStreamedDiagnosis] = useState('')
  const [isDiagnosisStreaming, setIsDiagnosisStreaming] = useState(false)

  useEffect(() => {
    if (selectedBug) {
      setCurrentStep(0)
      setIsThinking(true)
      setShowLogs(false)
      setStreamedBadLogs([])
      setStreamedGoodLogs([])
      setStreamedDiagnosis('')
      setIsDiagnosisStreaming(false)
      startDiagnosis()
    }
  }, [selectedBug])

  const startDiagnosis = async () => {
    if (!selectedBug) return

    // Step through diagnosis steps faster
    for (let i = 0; i < selectedBug.diagnosis_steps.length; i++) {
      setCurrentStep(i)
      await new Promise((resolve) => setTimeout(resolve, 1000)) // Reduced from 2000ms to 500ms
    }

    // Finish thinking
    setIsThinking(false)
    setShowLogs(true)

    // Stream logs instantly
    await streamLogs()

    // Start streaming diagnosis after logs are done
    await streamDiagnosis()
  }

  const streamLogs = async () => {
    if (!selectedBug) return

    // Show all logs instantly without delay
    setStreamedBadLogs(selectedBug.bad)
    setStreamedGoodLogs(selectedBug.good)
  }

  const streamDiagnosis = async () => {
    if (!selectedBug) return

    setIsDiagnosisStreaming(true)
    const diagnosis = selectedBug.diagnosis

    for (let i = 0; i <= diagnosis.length; i++) {
      setStreamedDiagnosis(diagnosis.slice(0, i))
      await new Promise((resolve) => setTimeout(resolve, 20)) // 20ms per character for smooth streaming
    }

    setIsDiagnosisStreaming(false)
  }

  if (!selectedBug) {
    return (
      <div className="p-6 h-full flex items-start justify-center">
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
                  <div className="w-2 h-2 rounded-full bg-primary"></div>
                ) : index === currentStep ? (
                  <div className="w-2 h-2 rounded-full animate-pulse bg-primary"></div>
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
          <h3 className="text-lg font-semibold mb-3">
            Bug #{selectedBug.id}: {selectedBug.name}
          </h3>

          {/* Streaming Diagnosis */}
          <div className="bg-muted/30 rounded-lg p-3 border">
            <div className="flex items-center gap-2 mb-2">
              <div className="text-sm font-medium">Diagnosis Summary</div>
              {isDiagnosisStreaming && (
                <div className="w-1 h-4 bg-primary animate-pulse"></div>
              )}
            </div>
            <p className="text-sm text-gray-200 leading-relaxed">
              {streamedDiagnosis}
              {isDiagnosisStreaming && (
                <span className="inline-block w-2 h-5 bg-primary animate-pulse ml-1"></span>
              )}
            </p>
          </div>
        </div>

        <div className="flex-1 grid grid-cols-2 gap-4 min-h-0">
          <Card className="flex flex-col h-full">
            <CardHeader className="flex-shrink-0 pb-2">
              <CardTitle className="text-sm text-destructive">
                Failed Logs
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 p-3 overflow-auto">
              <div className="space-y-1 font-mono text-xs">
                {streamedBadLogs.map((log, index) => (
                  <div
                    key={index}
                    className="text-foreground px-2 py-1 rounded border-l-2 border-destructive/30"
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
                Ideal Scenario
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 p-3 overflow-auto">
              <div className="space-y-1 font-mono text-xs">
                {streamedGoodLogs.map((log, index) => (
                  <div
                    key={index}
                    className="px-2 py-1 rounded border-l-2 border-primary/30"
                  >
                    {log}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return null
}
