const { GoogleGenerativeAI } = require("@google/generative-ai")
const Product = require("../models/Product")

// Initialize the Google Generative AI with your API key
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)

// Function to get gift suggestions from Gemini
const getGiftSuggestions = async (userPreferences) => {
  try {
    // Get all products from the database
    const products = await Product.find({ status: "active" })
    
    // Create a product catalog string for the AI
    const productCatalog = products.map(product => 
      `${product.name} (${product.category}) - ₹${product.basePrice} - ${product.description}`
    ).join("\n")

    // Use the correct model name from the API
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" })

    const { age, gender, occasion, budget, relation } = userPreferences

    const prompt = `
      You are a gift recommendation expert. I need gift suggestions for a ${age} year old ${gender} for ${occasion}. 
      The budget is ₹${budget} and they are my ${relation}.

      Here is our product catalog:
      ${productCatalog}

      Please suggest 5 specific gift ideas from our catalog that best match the following criteria:
      1. Within the budget of ₹${budget}
      2. Appropriate for the age and gender
      3. Suitable for the occasion
      4. Consider the relationship between the gift giver and recipient
      5. Prioritize products with good descriptions and clear value proposition
      6. Ensure diversity across different product categories
      7. Consider seasonal relevance and current trends
      8. Include at least one unique or unexpected suggestion that still fits the criteria

      For each suggestion, provide:
      1. The exact product name from the catalog
      2. A personalized description explaining why this gift would be perfect for this specific recipient, considering their age, gender, the occasion, and your relationship
      3. The exact price from the catalog
      4. The product category

      Format the response EXACTLY as a JSON array with these fields: productName, description, price, category.
      The suggestions MUST be from the provided product catalog only.
      Return ONLY the JSON array without any additional text or explanation.
      Each suggestion MUST be from a different category unless there are no other options available.
      Make the descriptions personal and engaging, explaining why each gift is perfect for this specific situation.
    `

    const result = await model.generateContent(prompt)
    const response = await result.response
    const text = response.text()

    try {
      // Try to parse the entire response as JSON first
      const parsedResponse = JSON.parse(text.trim())
      return parsedResponse.slice(0, 5) // Limit to 5 suggestions
    } catch (e) {
      // If direct parsing fails, try to extract JSON from the response
      const jsonMatch = text.match(/\[[\s\S]*\]/)
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]).slice(0, 5) // Limit to 5 suggestions
      }
      
      // If both attempts fail, return diverse default suggestions from our catalog
      console.error("Failed to parse Gemini response:", text)
      return await getDefaultSuggestions(userPreferences)
    }
  } catch (error) {
    console.error("Error getting gift suggestions:", error)
    // Return diverse default suggestions from our catalog
    return await getDefaultSuggestions(userPreferences)
  }
}

// Helper function to get diverse default suggestions
const getDefaultSuggestions = async (userPreferences) => {
  const { budget, age, gender, occasion, relation } = userPreferences
  
  // Get all available categories
  const categories = await Product.distinct('category', { 
    status: 'active',
    basePrice: { $lte: budget }
  })
  
  // Shuffle categories to get different combinations each time
  const shuffledCategories = categories.sort(() => Math.random() - 0.5)
  
  // Get products from each category up to 5 categories
  const suggestions = []
  for (const category of shuffledCategories.slice(0, 5)) {
    // Get random product from category (within budget)
    const count = await Product.countDocuments({
      status: 'active',
      category,
      basePrice: { $lte: budget }
    })
    
    const random = Math.floor(Math.random() * count)
    
    const product = await Product.findOne({
      status: 'active',
      category,
      basePrice: { $lte: budget }
    }).skip(random)
    
    if (product) {
      // Generate a personalized description
      const personalizedDesc = generatePersonalizedDescription(
        product.description,
        age,
        gender,
        occasion,
        relation,
        category
      )
      
      suggestions.push({
        productName: product.name,
        description: personalizedDesc,
        price: product.basePrice,
        category: product.category
      })
    }
  }
  
  // If we have less than 5 suggestions, add more random products from any category
  if (suggestions.length < 5) {
    const existingCategories = suggestions.map(s => s.category)
    const count = await Product.countDocuments({
      status: 'active',
      basePrice: { $lte: budget },
      category: { $nin: existingCategories }
    })
    
    if (count > 0) {
      const remainingCount = 5 - suggestions.length
      for (let i = 0; i < remainingCount; i++) {
        const random = Math.floor(Math.random() * count)
        const product = await Product.findOne({
          status: 'active',
          basePrice: { $lte: budget },
          category: { $nin: existingCategories }
        }).skip(random)
        
        if (product) {
          const personalizedDesc = generatePersonalizedDescription(
            product.description,
            age,
            gender,
            occasion,
            relation,
            product.category
          )
          
          suggestions.push({
            productName: product.name,
            description: personalizedDesc,
            price: product.basePrice,
            category: product.category
          })
        }
      }
    }
  }
  
  return suggestions
}

// Helper function to generate personalized descriptions
const generatePersonalizedDescription = (baseDescription, age, gender, occasion, relation, category) => {
  const occasionPhrases = {
    birthday: "perfect birthday gift",
    anniversary: "wonderful anniversary celebration",
    wedding: "special wedding day",
    graduation: "academic achievement",
    housewarming: "new home",
    other: "special occasion"
  }
  
  const relationPhrases = {
    family: "family member",
    friend: "friend",
    colleague: "colleague",
    partner: "partner",
    other: "special someone"
  }
  
  const agePhrases = age => {
    if (age < 18) return "young"
    if (age < 30) return "young adult"
    if (age < 50) return "adult"
    return "mature"
  }
  
  return `This ${category.toLowerCase()} would make a ${occasionPhrases[occasion] || "perfect gift"} for your ${relationPhrases[relation] || "special someone"}. ${baseDescription} It's especially suitable for a ${agePhrases(age)} ${gender}, making it a thoughtful choice for this occasion.`
}

module.exports = {
  getGiftSuggestions,
}
