"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { productTypes, designTypes, teams, players } from "@/lib/product-config"

interface ProductCreationProps {
  onGenerate: (data: any) => void
}

export default function ProductCreation({ onGenerate }: ProductCreationProps) {
  const [productType, setProductType] = useState("hoodie")
  const [designType, setDesignType] = useState("player")
  const [subject, setSubject] = useState("")
  const [userPrompt, setUserPrompt] = useState("")
  const [searchTerm, setSearchTerm] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!productType || !designType || !subject || !userPrompt) {
      alert("Please fill in all fields")
      return
    }

    onGenerate({
      productType,
      designType,
      subject,
      userPrompt,
    })
  }

  const subjectOptions = designType === "player" ? players : designType === "team" ? teams : []

  const filteredOptions = subjectOptions.filter((option) =>
    option.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle className="text-center text-3xl font-bold">
            FanMerch AI
          </CardTitle>
          <p className="text-center text-muted-foreground mt-2">
            What do you want to create?
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Product Type */}
            <div className="space-y-2">
              <Label htmlFor="product-type">Product Type</Label>
              <Select value={productType} onValueChange={setProductType}>
                <SelectTrigger id="product-type">
                  <SelectValue placeholder="Select product type" />
                </SelectTrigger>
                <SelectContent>
                  {productTypes.map((product) => (
                    <SelectItem key={product.id} value={product.id}>
                      {product.name} - ${(product.retailPrice / 100).toFixed(0)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Design Type */}
            <div className="space-y-2">
              <Label>Design Type</Label>
              <div className="grid grid-cols-3 gap-3">
                {designTypes.map((design) => (
                  <button
                    key={design.id}
                    type="button"
                    onClick={() => {
                      setDesignType(design.id)
                      setSubject("")
                      setSearchTerm("")
                    }}
                    className={`p-4 rounded-lg border-2 transition-all hover:border-primary ${
                      designType === design.id
                        ? "border-primary bg-primary/10"
                        : "border-border"
                    }`}
                  >
                    <div className="text-3xl mb-2">{design.icon}</div>
                    <div className="text-sm font-medium">{design.label}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Subject */}
            {designType !== "text" && (
              <div className="space-y-2">
                <Label htmlFor="subject">
                  {designType === "player" ? "Player" : "Team"}
                </Label>
                <Input
                  id="subject-search"
                  type="text"
                  placeholder={`Search ${designType === "player" ? "players" : "teams"}...`}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="mb-2"
                />
                <Select value={subject} onValueChange={setSubject}>
                  <SelectTrigger id="subject">
                    <SelectValue placeholder={`Select ${designType}`} />
                  </SelectTrigger>
                  <SelectContent>
                    {filteredOptions.length > 0 ? (
                      filteredOptions.map((option) => (
                        <SelectItem key={option.id} value={option.name}>
                          {option.name}
                          {designType === "player" && " - " + (option as any).team}
                        </SelectItem>
                      ))
                    ) : (
                      <div className="p-2 text-sm text-muted-foreground">
                        No results found
                      </div>
                    )}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Text-only subject */}
            {designType === "text" && (
              <div className="space-y-2">
                <Label htmlFor="text-subject">Text Content</Label>
                <Input
                  id="text-subject"
                  type="text"
                  placeholder="e.g., GOAT, Champions, etc."
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                />
              </div>
            )}

            {/* User Prompt */}
            <div className="space-y-2">
              <Label htmlFor="user-prompt">Your Creative Prompt</Label>
              <textarea
                id="user-prompt"
                placeholder="e.g., retro 90s style, neon colors, cyberpunk aesthetic..."
                value={userPrompt}
                onChange={(e) => setUserPrompt(e.target.value)}
                className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              />
              <p className="text-xs text-muted-foreground">
                Describe the style, mood, or aesthetic you want for your design
              </p>
            </div>

            {/* Submit Button */}
            <Button type="submit" size="lg" className="w-full">
              Generate Design
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
