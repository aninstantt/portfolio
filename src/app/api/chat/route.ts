import { createOpenAI } from '@ai-sdk/openai'
import { jsonSchema, streamText } from 'ai'

export const runtime = 'edge'
export const maxDuration = 30

export async function POST(req: Request) {
  try {
    const apiKey = req.headers.get('X-API-KEY')
    const model = req.headers.get('X-MODEL')
    if (!apiKey) {
      throw new Error('请设置 API Key')
    }

    const { messages, system, tools } = await req.json()

    const openai = createOpenAI({
      baseURL: 'https://api.deepseek.com/v1',
      apiKey: apiKey
    })

    const result = streamText({
      model: openai.languageModel(model || 'deepseek-chat'),
      messages,
      system,
      tools: Object.fromEntries(
        Object.entries<{ parameters: unknown }>(tools).map(([name, tool]) => [
          name,
          {
            parameters: jsonSchema(tool.parameters!)
          }
        ])
      )
    })

    return result.toDataStreamResponse({
      /* eslint-disable */
      getErrorMessage: (error: any) => {
        const errorMessage = error instanceof Error ? error.message : '未知错误'
        const responseBody = error?.responseBody
        if (responseBody) {
          try {
            const parsed = JSON.parse(responseBody)
            return parsed.error?.message || errorMessage
          } catch {
            return errorMessage
          }
        }
        return errorMessage
      }
    })
  } catch (error) {
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : '请求失败，请检查 API Key 设置'
      }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    )
  }
}
