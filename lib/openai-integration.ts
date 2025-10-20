import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

export async function analyzeMenuItems(menuItems: any[]) {
  try {
    const prompt = `Analyze these menu items for a Desi Flavors Katy food truck and provide insights:

Menu Items:
${menuItems.map(item => `- ${item.name}: $${item.price} (${item.category})`).join('\n')}

Please provide:
1. Top 3 most popular items based on pricing and category
2. Pricing recommendations for competitive advantage
3. Category performance analysis
4. Suggestions for menu optimization

Format as JSON with keys: topItems, pricingRecommendations, categoryAnalysis, menuOptimization`

    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
      max_tokens: 1000
    })

    return JSON.parse(response.choices[0].message.content || '{}')
  } catch (error) {
    console.error('Error analyzing menu items:', error)
    return {
      topItems: [],
      pricingRecommendations: [],
      categoryAnalysis: {},
      menuOptimization: []
    }
  }
}

export async function generateBusinessInsights(salesData: any, expensesData: any) {
  try {
    const prompt = `Analyze this food truck business data and provide actionable insights:

Sales Data: ${JSON.stringify(salesData)}
Expenses Data: ${JSON.stringify(expensesData)}

Provide:
1. Key performance indicators analysis
2. Profitability insights
3. Operational recommendations
4. Growth opportunities
5. Risk factors to watch

Format as JSON with keys: kpiAnalysis, profitabilityInsights, operationalRecommendations, growthOpportunities, riskFactors`

    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
      max_tokens: 1500
    })

    return JSON.parse(response.choices[0].message.content || '{}')
  } catch (error) {
    console.error('Error generating business insights:', error)
    return {
      kpiAnalysis: {},
      profitabilityInsights: [],
      operationalRecommendations: [],
      growthOpportunities: [],
      riskFactors: []
    }
  }
}

export async function processReceiptImage(imageBase64: string) {
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: 'Extract all relevant information from this receipt image including vendor, date, items, quantities, prices, tax, and total. Format as JSON.'
            },
            {
              type: 'image_url',
              image_url: {
                url: `data:image/jpeg;base64,${imageBase64}`
              }
            }
          ]
        }
      ],
      max_tokens: 1000
    })

    return JSON.parse(response.choices[0].message.content || '{}')
  } catch (error) {
    console.error('Error processing receipt image:', error)
    throw error
  }
}
