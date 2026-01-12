"use client"

import { useEffect, useState } from "react"
import { Loader2 } from "lucide-react"

export default function LoadingState() {
  const [progress, setProgress] = useState(0)
  const [message, setMessage] = useState("Creating your design...")

  useEffect(() => {
    // Simulate progress
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          return 100
        }
        return prev + 10
      })
    }, 800)

    // Change message after 8 seconds
    const messageTimeout = setTimeout(() => {
      setMessage("Almost there...")
    }, 8000)

    return () => {
      clearInterval(interval)
      clearTimeout(messageTimeout)
    }
  }, [])

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="text-center">
        <div className="relative inline-block mb-8">
          <Loader2 className="h-16 w-16 animate-spin text-primary" />
        </div>
        <h2 className="text-2xl font-bold mb-4">{message}</h2>
        <div className="w-64 mx-auto bg-secondary rounded-full h-2 overflow-hidden">
          <div
            className="h-full bg-primary transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="text-sm text-muted-foreground mt-4">
          This usually takes 8-12 seconds
        </p>
      </div>
    </div>
  )
}
