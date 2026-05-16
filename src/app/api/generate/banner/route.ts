import { NextRequest, NextResponse } from 'next/server'
import { generateJsonText } from '@/lib/azureResponses'

export async function POST(req: NextRequest) {
  try {
    const { campaignType, campaignDescription } = await req.json()

    const userPrompt = `Create banner design concepts for a ${campaignType} campaign.
Campaign: ${campaignDescription}

Return a JSON object with key "content" containing:
- concept: overall banner concept description (2-3 sentences)
- headline: main banner headline text (bold, punchy)
- layout: layout description (e.g., "Split-screen with product left, text right")
- colorPalette: array of 4 hex color codes that work well together for this campaign
- cta: call-to-action button text
- subtext: supporting subtitle text (1 sentence)

Respond with ONLY valid JSON.`

    const raw = await generateJsonText(
      'You are a creative director specializing in digital advertising. Return only valid JSON.',
      userPrompt
    )
    let parsed

    try {
      const obj = JSON.parse(raw)
      parsed = obj.content || obj
    } catch {
      return NextResponse.json({ error: 'Failed to parse AI response' }, { status: 500 })
    }

    return NextResponse.json({ content: parsed })
  } catch (error) {
    console.error('Banner generation error:', error)
    return NextResponse.json({ error: 'Generation failed' }, { status: 500 })
  }
}
