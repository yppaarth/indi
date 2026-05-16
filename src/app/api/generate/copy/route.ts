import { NextRequest, NextResponse } from 'next/server'
import { generateJsonText } from '@/lib/azureResponses'

export async function POST(req: NextRequest) {
  try {
    const { campaignType, campaignDescription } = await req.json()

    if (!campaignType || !campaignDescription) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const userPrompt = `Generate marketing copywriting for a ${campaignType} campaign.
Campaign: ${campaignDescription}

Return a JSON object with key "content" containing an array of copy items.
Each item must have:
- type: (headline | ad-copy | slogan | tagline | email-snippet)
- title: short label for this piece
- content: the actual copy text

Include exactly one of each type (5 total items).
Respond with ONLY valid JSON, no markdown or explanation.`

    const raw = await generateJsonText('You are an expert marketing copywriter. Return only valid JSON.', userPrompt)
    let parsed

    try {
      const obj = JSON.parse(raw)
      parsed = obj.content || Object.values(obj)[0]
    } catch {
      return NextResponse.json({ error: 'Failed to parse AI response' }, { status: 500 })
    }

    if (!Array.isArray(parsed)) {
      parsed = [
        { type: 'headline', title: 'Main Headline', content: `Discover the Power of ${campaignType}` },
        { type: 'ad-copy', title: 'Ad Copy', content: campaignDescription.slice(0, 150) },
        { type: 'slogan', title: 'Campaign Slogan', content: 'Experience the Difference' },
        { type: 'tagline', title: 'Brand Tagline', content: 'Where Innovation Meets Excellence' },
        { type: 'email-snippet', title: 'Email Subject', content: `Don't Miss Our ${campaignType} Event!` },
      ]
    }

    return NextResponse.json({ content: parsed })
  } catch (error) {
    console.error('Copy generation error:', error)
    return NextResponse.json({ error: 'Generation failed' }, { status: 500 })
  }
}
