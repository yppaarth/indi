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

    const systemPrompt = `You are an expert social media marketing copywriter specializing in Indian market campaigns. 
    Generate platform-specific social media content in JSON format only. No markdown, no explanation.`

    const userPrompt = `Create social media content for a ${campaignType} campaign.
Campaign description: ${campaignDescription}

Return a JSON array with exactly 4 objects (one per platform): instagram, linkedin, facebook, twitter.
Each object must have:
- platform: (instagram | linkedin | facebook | twitter)
- caption: engaging platform-appropriate caption (2-4 sentences)
- cta: clear call-to-action text
- hashtags: array of 5-8 relevant hashtags (without #)

Respond with ONLY the JSON array, no other text.`

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      temperature: 0.8,
      response_format: { type: 'json_object' },
    })

    const raw = completion.choices[0]?.message?.content || '{}'
    let parsed

    try {
      const obj = JSON.parse(raw)
      // Handle both array and object with "content" key
      parsed = Array.isArray(obj) ? obj : (obj.content || obj.platforms || Object.values(obj)[0])
    } catch {
      return NextResponse.json({ error: 'Failed to parse AI response' }, { status: 500 })
    }

    if (!Array.isArray(parsed)) {
      // Build fallback
      parsed = ['instagram', 'linkedin', 'facebook', 'twitter'].map((platform) => ({
        platform,
        caption: `Exciting ${campaignType} campaign! ${campaignDescription.slice(0, 100)}`,
        cta: 'Learn More',
        hashtags: ['campaign', 'marketing', campaignType.replace('-', '')],
      }))
    }

    return NextResponse.json({ content: parsed })
  } catch (error) {
    console.error('Social generation error:', error)
    return NextResponse.json({ error: 'Generation failed' }, { status: 500 })
  }
}
