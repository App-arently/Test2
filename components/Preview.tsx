"use client"

import { useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft } from "lucide-react"
import { getProductById } from "@/lib/product-config"

interface PreviewProps {
  designData: any
  onBuyNow: (purchaseData: any) => void
  onRegenerate: () => void
  onBack: () => void
}

export default function Preview({
  designData,
  onBuyNow,
  onRegenerate,
  onBack,
}: PreviewProps) {
  const product = getProductById(designData.productType)
  const [selectedSize, setSelectedSize] = useState(product?.sizes[0] || "M")
  const [selectedColor, setSelectedColor] = useState(product?.colors[0] || "Black")

  const handleBuyNow = () => {
    onBuyNow({
      size: selectedSize,
      color: selectedColor,
    })
  }

  if (!product) {
    return <div>Product not found</div>
  }

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={onBack}
          className="mb-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>

        <Card>
          <CardContent className="p-6">
            {/* Product Image */}
            <div className="mb-6">
              <div className="relative w-full aspect-square max-w-md mx-auto bg-secondary rounded-lg overflow-hidden">
                {designData.imageUrl ? (
                  <Image
                    src={designData.imageUrl}
                    alt="Generated design"
                    fill
                    className="object-cover"
                    priority
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <p className="text-muted-foreground">Preview not available</p>
                  </div>
                )}
              </div>
            </div>

            {/* Size Selection */}
            {product.sizes.length > 1 && (
              <div className="mb-6">
                <h3 className="text-sm font-medium mb-3">Size</h3>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`px-4 py-2 rounded-md border-2 transition-all ${
                        selectedSize === size
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-border hover:border-primary/50"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Color Selection */}
            {product.colors.length > 1 && (
              <div className="mb-6">
                <h3 className="text-sm font-medium mb-3">Color</h3>
                <div className="flex flex-wrap gap-2">
                  {product.colors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`px-4 py-2 rounded-md border-2 transition-all ${
                        selectedColor === color
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-border hover:border-primary/50"
                      }`}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Pricing Info */}
            <Card className="bg-secondary border-none mb-6">
              <CardContent className="p-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-muted-foreground">Price:</span>
                  <span className="text-2xl font-bold">
                    ${(product.retailPrice / 100).toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">Delivery:</span>
                  <span>7-10 business days</span>
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-4">
              <Button
                variant="outline"
                size="lg"
                onClick={onRegenerate}
              >
                Regenerate
              </Button>
              <Button
                size="lg"
                onClick={handleBuyNow}
              >
                Buy Now
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
