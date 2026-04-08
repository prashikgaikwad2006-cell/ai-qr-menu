import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)

const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' })

export async function generateDishDescription(dishName: string): Promise<string> {
  const prompt = `Write a mouth-watering, irresistible 20-word description for a dish called "${dishName}".
Make it sound delicious and appetizing like a professional food critic.
Focus on the flavors, textures, and sensory experience.
Do NOT include the dish name in the description.
Start directly with the description, no quotes.`

  try {
    const result = await model.generateContent(prompt)
    const response = result.response
    const text = response.text()
    return text.trim()
  } catch (error) {
    console.error('Gemini API error:', error)
    throw new Error('Failed to generate description')
  }
}