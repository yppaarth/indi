import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

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

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: 'You are a creative director specializing in digital advertising. Return only valid JSON.',
        },
        { role: 'user', content: userPrompt },
      ],
      temperature: 0.8,
      response_format: { type: 'json_object' },
    })

    const raw = completion.choices[0]?.message?.content || '{}'
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
