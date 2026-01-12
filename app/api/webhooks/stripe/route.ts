import { NextRequest, NextResponse } from "next/server"
import Stripe from "stripe"
import { prisma } from "@/lib/prisma"
import { createPrintfulOrder } from "@/lib/printful"
import { sendOrderConfirmationEmail } from "@/lib/email"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-12-18.acacia",
})

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

export async function POST(request: NextRequest) {
  try {
    const body = await request.text()
    const signature = request.headers.get("stripe-signature")!

    let event: Stripe.Event

    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
    } catch (err: any) {
      console.error("Webhook signature verification failed:", err.message)
      return NextResponse.json(
        { error: "Invalid signature" },
        { status: 400 }
      )
    }

    // Handle the event
    switch (event.type) {
      case "checkout.session.completed":
        await handleCheckoutComplete(event.data.object as Stripe.Checkout.Session)
        break

      case "payment_intent.payment_failed":
        await handlePaymentFailed(event.data.object as Stripe.PaymentIntent)
        break

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (error: any) {
    console.error("Webhook error:", error)
    return NextResponse.json(
      { error: error.message || "Webhook handler failed" },
      { status: 500 }
    )
  }
}

async function handleCheckoutComplete(session: Stripe.Checkout.Session) {
  try {
    const sessionId = session.id
    const customerEmail = session.customer_details?.email || ""
    const shippingAddress = session.shipping_details?.address || {}

    // Update order in database
    const order = await prisma.order.update({
      where: { stripeSessionId: sessionId },
      data: {
        customerEmail,
        shippingAddress,
        status: "paid",
      },
    })

    // Create Printful order
    try {
      const printfulOrderId = await createPrintfulOrder({
        order,
        shippingAddress: session.shipping_details!,
      })

      // Update order with Printful ID
      await prisma.order.update({
        where: { id: order.id },
        data: {
          printfulOrderId,
          status: "fulfillment",
        },
      })

      // Send confirmation email
      await sendOrderConfirmationEmail({
        email: customerEmail,
        orderId: order.id,
        printfulOrderId,
      })
    } catch (printfulError: any) {
      console.error("Printful order creation failed:", printfulError)

      // Mark order as failed and potentially refund
      await prisma.order.update({
        where: { id: order.id },
        data: { status: "cancelled" },
      })

      // TODO: Implement auto-refund here if needed
    }
  } catch (error) {
    console.error("Error handling checkout complete:", error)
    throw error
  }
}

async function handlePaymentFailed(paymentIntent: Stripe.PaymentIntent) {
  try {
    console.log("Payment failed:", paymentIntent.id)
    // Log for debugging - Stripe handles customer notification
  } catch (error) {
    console.error("Error handling payment failed:", error)
  }
}
