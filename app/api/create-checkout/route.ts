import { NextRequest, NextResponse } from "next/server"
import Stripe from "stripe"
import { prisma } from "@/lib/prisma"
import { getProductById } from "@/lib/product-config"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-12-18.acacia",
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      productType,
      size,
      color,
      imageUrl,
      designType,
      subject,
      userPrompt,
    } = body

    // Validate input
    if (!productType || !size || !color || !imageUrl) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      )
    }

    const product = getProductById(productType)

    if (!product) {
      return NextResponse.json(
        { success: false, error: "Invalid product type" },
        { status: 400 }
      )
    }

    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: `Custom ${product.name}`,
              description: `${designType} design: ${subject}`,
              images: imageUrl.startsWith("http") ? [imageUrl] : [],
            },
            unit_amount: product.retailPrice,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}`,
      shipping_address_collection: {
        allowed_countries: ["US", "CA", "GB", "DE", "FR", "ES", "IT", "NL", "BE", "AT"],
      },
      metadata: {
        productType,
        designType,
        subject,
        userPrompt,
        size,
        color,
        imageUrl,
      },
    })

    // Create pending order in database
    try {
      await prisma.order.create({
        data: {
          productType,
          designType,
          subject,
          userPrompt,
          generatedImageUrl: imageUrl,
          size,
          color,
          retailPrice: product.retailPrice,
          printfulCost: product.basePrice,
          customerEmail: "pending@checkout.com", // Will be updated via webhook
          shippingAddress: {},
          stripeSessionId: session.id,
          status: "pending",
        },
      })
    } catch (dbError) {
      console.error("Database error:", dbError)
      // Continue anyway - webhook uses upsert to create order if it doesn't exist
    }

    return NextResponse.json({
      success: true,
      checkoutUrl: session.url,
      sessionId: session.id,
    })
  } catch (error: any) {
    console.error("Error creating checkout session:", error)

    return NextResponse.json(
      { success: false, error: error.message || "Failed to create checkout" },
      { status: 500 }
    )
  }
}
