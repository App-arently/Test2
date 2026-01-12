import Stripe from "stripe"

const PRINTFUL_API_KEY = process.env.PRINTFUL_API_KEY!
const PRINTFUL_API_URL = "https://api.printful.com"

interface CreateOrderParams {
  order: any
  shippingAddress: Stripe.Checkout.Session.ShippingDetails
}

export async function createPrintfulOrder({
  order,
  shippingAddress,
}: CreateOrderParams): Promise<string> {
  try {
    // Prepare Printful order data
    const printfulOrder = {
      recipient: {
        name: shippingAddress.name || "Customer",
        address1: shippingAddress.address?.line1 || "",
        address2: shippingAddress.address?.line2 || "",
        city: shippingAddress.address?.city || "",
        state_code: shippingAddress.address?.state || "",
        country_code: shippingAddress.address?.country || "US",
        zip: shippingAddress.address?.postal_code || "",
      },
      items: [
        {
          variant_id: getVariantId(order.productType, order.size, order.color),
          quantity: 1,
          files: [
            {
              url: order.generatedImageUrl,
              type: "default", // front print
            },
          ],
        },
      ],
      retail_costs: {
        currency: "USD",
        subtotal: (order.retailPrice / 100).toFixed(2),
        discount: "0.00",
        shipping: "0.00",
        tax: "0.00",
      },
    }

    // Make API request to Printful
    const response = await fetch(`${PRINTFUL_API_URL}/orders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${PRINTFUL_API_KEY}`,
      },
      body: JSON.stringify(printfulOrder),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(`Printful API error: ${JSON.stringify(errorData)}`)
    }

    const data = await response.json()
    return data.result.id.toString()
  } catch (error: any) {
    console.error("Printful order creation failed:", error)
    throw new Error(`Failed to create Printful order: ${error.message}`)
  }
}

// Map product type, size, and color to Printful variant IDs
// These are example IDs - you'll need to get real ones from Printful API
function getVariantId(productType: string, size: string, color: string): number {
  // This is a simplified mapping - in production, you'd have a complete database
  const variantMap: Record<string, Record<string, Record<string, number>>> = {
    tshirt: {
      S: { Black: 4012, White: 4013, Gray: 4014 },
      M: { Black: 4015, White: 4016, Gray: 4017 },
      L: { Black: 4018, White: 4019, Gray: 4020 },
      XL: { Black: 4021, White: 4022, Gray: 4023 },
      "2XL": { Black: 4024, White: 4025, Gray: 4026 },
    },
    hoodie: {
      S: { Black: 4100, White: 4101, Gray: 4102 },
      M: { Black: 4103, White: 4104, Gray: 4105 },
      L: { Black: 4106, White: 4107, Gray: 4108 },
      XL: { Black: 4109, White: 4110, Gray: 4111 },
      "2XL": { Black: 4112, White: 4113, Gray: 4114 },
    },
    cap: {
      "One Size": { Black: 4200, White: 4201, Navy: 4202 },
    },
    poster: {
      "12x18": { Standard: 4300 },
      "18x24": { Standard: 4301 },
      "24x36": { Standard: 4302 },
    },
  }

  return variantMap[productType]?.[size]?.[color] || 4012 // Default fallback
}

export async function getPrintfulProducts() {
  try {
    const response = await fetch(`${PRINTFUL_API_URL}/products`, {
      headers: {
        Authorization: `Bearer ${PRINTFUL_API_KEY}`,
      },
    })

    if (!response.ok) {
      throw new Error("Failed to fetch Printful products")
    }

    const data = await response.json()
    return data.result
  } catch (error) {
    console.error("Error fetching Printful products:", error)
    throw error
  }
}
