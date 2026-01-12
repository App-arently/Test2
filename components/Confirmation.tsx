"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle2 } from "lucide-react"

export default function Confirmation() {
  const handleCreateAnother = () => {
    window.location.href = "/"
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="flex justify-center mb-4">
            <CheckCircle2 className="h-16 w-16 text-green-500" />
          </div>
          <CardTitle className="text-center text-2xl">
            Order Confirmed!
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <div className="space-y-2">
            <p className="text-lg font-medium">
              Order #<span className="font-mono">PENDING</span>
            </p>
            <p className="text-sm text-muted-foreground">
              Estimated Delivery: 7-10 business days
            </p>
          </div>

          <div className="bg-secondary rounded-lg p-4">
            <p className="text-sm">
              Check your email for order details and tracking information
            </p>
          </div>

          <Button size="lg" onClick={handleCreateAnother} className="w-full">
            Create Another Design
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
