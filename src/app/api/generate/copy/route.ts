import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

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

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: 'You are an expert marketing copywriter. Return only valid JSON.',
        },
        { role: 'user', content: userPrompt },
      ],
      temperature: 0.85,
      response_format: { type: 'json_object' },
    })

    const raw = completion.choices[0]?.message?.content || '{}'
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
