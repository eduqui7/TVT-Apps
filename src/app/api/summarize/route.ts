import { GoogleGenerativeAI } from '@google/generative-ai'

const GEMINI_API_KEY = 'AIzaSyAMnqdpaSN04S4C-xxb-PEm6TWH4UY_Ifs'
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY)

export async function POST(request: Request) {
  try {
    const { url } = await request.json()

    const articleResponse = await fetch(url)
    const articleContent = await articleResponse.text()

    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })
    const prompt = `Escreva um resumo conciso e em português do Brasil desta notícia. Extraia apenas o conteúdo relevante: ${articleContent}`
    
    const result = await model.generateContent(prompt)
    const response = await result.response
    const summary = response.text().replace(/#/g, '')

    return Response.json({ summary })

  } catch (error) {
    console.error('Error:', error)
    return Response.json(
      { error: 'Falha ao processar solicitação. Verifique se o URL é válido.' }, 
      { status: 500 }
    )
  }
}