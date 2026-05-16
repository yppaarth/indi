type AzureResponseContent = {
  type?: string
  text?: string
}

type AzureResponseOutput = {
  type?: string
  content?: AzureResponseContent[]
}

type AzureResponsesResult = {
  output_text?: string
  output?: AzureResponseOutput[]
  error?: {
    message?: string
  }
}

const endpoint = process.env.AZURE_OPENAI_RESPONSES_ENDPOINT
const apiKey = process.env.AZURE_OPENAI_API_KEY
const deployment = process.env.AZURE_OPENAI_DEPLOYMENT || 'gpt-5-mini6'

function getAzureConfig() {
  if (!endpoint || !apiKey) {
    throw new Error('Missing Azure OpenAI configuration. Set AZURE_OPENAI_RESPONSES_ENDPOINT and AZURE_OPENAI_API_KEY.')
  }

  return { endpoint, apiKey, deployment }
}

function extractOutputText(result: AzureResponsesResult) {
  if (result.output_text) {
    return result.output_text
  }

  const text = result.output
    ?.flatMap((item) => item.content || [])
    .map((content) => content.text)
    .filter((value): value is string => Boolean(value))
    .join('\n')

  return text || ''
}

export async function generateJsonText(systemPrompt: string, userPrompt: string) {
  const config = getAzureConfig()

  const response = await fetch(config.endpoint, {
    method: 'POST',
    headers: {
      'api-key': config.apiKey,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: config.deployment,
      input: [
        {
          role: 'system',
          content: [{ type: 'input_text', text: systemPrompt }],
        },
        {
          role: 'user',
          content: [{ type: 'input_text', text: userPrompt }],
        },
      ],
      text: {
        format: { type: 'json_object' },
      },
    }),
  })

  const result = (await response.json()) as AzureResponsesResult

  if (!response.ok) {
    throw new Error(result.error?.message || `Azure OpenAI request failed with status ${response.status}`)
  }

  const text = extractOutputText(result)

  if (!text) {
    throw new Error('Azure OpenAI response did not include output text')
  }

  return text
}
