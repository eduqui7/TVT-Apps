import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const GEMINI_API_KEY = 'AIzaSyAMnqdpaSN04S4C-xxb-PEm6TWH4UY_Ifs'
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY)

export async function POST(request: Request) {
  try {
    const { originalTitle } = await request.json();

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `Crie um título jornalístico, mantendo as informações principais do: "${originalTitle}"`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text().replace(/[#*]/g, '');

    return NextResponse.json({ newTitle: text });
  } catch (error) {
    console.error("Error in title generation:", error);
    return NextResponse.json(
      { error: "Falha ao gerar novo título" },
      { status: 500 }
    );
  }
}