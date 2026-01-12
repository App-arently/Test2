"use client"

import { useState } from "react"
import ProductCreation from "@/components/ProductCreation"
import LoadingState from "@/components/LoadingState"
import Preview from "@/components/Preview"
import Confirmation from "@/components/Confirmation"

type Screen = "creation" | "loading" | "preview" | "confirmation"

export default function Home() {
  const [currentScreen, setCurrentScreen] = useState<Screen>("creation")
  const [designData, setDesignData] = useState<any>(null)

  const handleGenerate = async (formData: any) => {
    setCurrentScreen("loading")
    setDesignData(formData)

    try {
      // Call AI generation API
      const response = await fetch("/api/generate-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      const result = await response.json()

      if (result.success) {
        setDesignData({ ...formData, imageUrl: result.imageUrl })
        setCurrentScreen("preview")
      } else {
        alert("Generation failed. Please try again.")
        setCurrentScreen("creation")
      }
    } catch (error) {
      console.error("Error generating image:", error)
      alert("An error occurred. Please try again.")
      setCurrentScreen("creation")
    }
  }

  const handleBuyNow = async (purchaseData: any) => {
    try {
      const response = await fetch("/api/create-checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...designData,
          ...purchaseData,
        }),
      })

      const result = await response.json()

      if (result.success) {
        // Redirect to Stripe Checkout
        window.location.href = result.checkoutUrl
      } else {
        alert("Failed to create checkout session. Please try again.")
      }
    } catch (error) {
      console.error("Error creating checkout:", error)
      alert("An error occurred. Please try again.")
    }
  }

  const handleRegenerate = () => {
    setCurrentScreen("creation")
  }

  const handleBack = () => {
    setCurrentScreen("creation")
  }

  return (
    <main className="min-h-screen bg-background">
      {currentScreen === "creation" && (
        <ProductCreation onGenerate={handleGenerate} />
      )}
      {currentScreen === "loading" && <LoadingState />}
      {currentScreen === "preview" && (
        <Preview
          designData={designData}
          onBuyNow={handleBuyNow}
          onRegenerate={handleRegenerate}
          onBack={handleBack}
        />
      )}
      {currentScreen === "confirmation" && <Confirmation />}
    </main>
  )
}
