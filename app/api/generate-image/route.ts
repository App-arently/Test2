import { NextRequest, NextResponse } from "next/server"
import { VertexAI } from "@google-cloud/vertexai"

// Basic content filtering
const bannedWords = [
  "nude", "naked", "porn", "sex", "explicit", "violence", "blood", "gore",
  "hate", "racist", "nazi", "weapon", "drug", "illegal"
]

function filterContent(text: string): boolean {
  const lowerText = text.toLowerCase()
  return bannedWords.some(word => lowerText.includes(word))
}

function buildPrompt(input: any): string {
  const { productType, designType, subject, userPrompt } = input

  let basePrompt = ""

  if (designType === "player") {
    basePrompt = `Create a bold, stylized design featuring ${subject} as a football/soccer player.`
  } else if (designType === "team") {
    basePrompt = `Create a bold team-themed design inspired by ${subject}.`
  } else {
    basePrompt = `Create a bold typographic design with the text: "${subject}".`
  }

  return `${basePrompt} Style: ${userPrompt}

Requirements:
- Centered composition perfect for ${productType}
- High contrast that works on both light and dark fabrics
- Bold and eye-catching
- Minimal or no background
- Square aspect ratio (1:1)
- Professional merchandise quality
- No official logos or trademarks`
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { productType, designType, subject, userPrompt } = body

    // Validate input
    if (!productType || !designType || !subject || !userPrompt) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      )
    }

    // Content filtering
    if (filterContent(subject) || filterContent(userPrompt)) {
      return NextResponse.json(
        { success: false, error: "Content not allowed" },
        { status: 400 }
      )
    }

    // Initialize Vertex AI
    const projectId = process.env.GOOGLE_CLOUD_PROJECT_ID
    const location = process.env.GOOGLE_CLOUD_LOCATION || "us-central1"

    if (!projectId) {
      console.error("GOOGLE_CLOUD_PROJECT_ID not configured")
      return NextResponse.json(
        { success: false, error: "Image generation service not configured" },
        { status: 500 }
      )
    }

    const vertexAI = new VertexAI({ project: projectId, location })
    const model = "imagen-3.0-generate-001"

    const generativeModel = vertexAI.preview.getGenerativeModel({
      model: model,
    })

    const prompt = buildPrompt(body)
    const startTime = Date.now()

    // Generate image
    const result = await generativeModel.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: {
        maxOutputTokens: 2048,
        temperature: 0.4,
      },
    })

    const generationTime = (Date.now() - startTime) / 1000

    // Extract image from response
    const response = result.response
    const imageData = response.candidates?.[0]?.content?.parts?.[0]

    if (!imageData || !imageData.inlineData) {
      return NextResponse.json(
        { success: false, error: "No image generated", retryable: true },
        { status: 500 }
      )
    }

    // Convert base64 image to data URL
    const base64Image = imageData.inlineData.data
    const mimeType = imageData.inlineData.mimeType || "image/png"
    const imageUrl = `data:${mimeType};base64,${base64Image}`

    return NextResponse.json({
      success: true,
      imageUrl,
      metadata: {
        generationTime,
        model: "imagen-3",
      },
    })
  } catch (error: any) {
    console.error("Error generating image:", error)

    return NextResponse.json(
      {
        success: false,
        error: error.message || "Generation failed",
        retryable: true,
      },
      { status: 500 }
    )
  }
}
