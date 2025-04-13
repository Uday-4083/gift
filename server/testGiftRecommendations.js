require("dotenv").config()
const mongoose = require("mongoose")
const { getGiftSuggestions } = require("./utils/geminiClient")
const connectDB = require("./config/db")

const testScenarios = [
  {
    name: "Birthday gift for teenage boy",
    preferences: {
      age: 15,
      gender: "male",
      occasion: "birthday",
      budget: 5000,
      relation: "nephew"
    }
  },
  {
    name: "Anniversary gift for wife",
    preferences: {
      age: 35,
      gender: "female",
      occasion: "anniversary",
      budget: 15000,
      relation: "wife"
    }
  },
  {
    name: "Retirement gift for colleague",
    preferences: {
      age: 60,
      gender: "male",
      occasion: "retirement",
      budget: 10000,
      relation: "colleague"
    }
  }
]

const testGiftRecommendations = async () => {
  try {
    // Connect to MongoDB
    await connectDB()
    console.log("Connected to MongoDB...")

    for (const scenario of testScenarios) {
      console.log("\n-----------------------------------")
      console.log(`Testing Scenario: ${scenario.name}`)
      console.log("-----------------------------------")
      console.log("User Preferences:", scenario.preferences)
      
      const suggestions = await getGiftSuggestions(scenario.preferences)
      
      console.log("\nRecommended Gifts:")
      suggestions.forEach((gift, index) => {
        console.log(`\n${index + 1}. ${gift.productName}`)
        console.log(`   Category: ${gift.category}`)
        console.log(`   Price: ₹${gift.price}`)
        console.log(`   Description: ${gift.description}`)
      })

      // Validate suggestions
      const validSuggestions = suggestions.every(gift => 
        gift.price <= scenario.preferences.budget &&
        gift.productName &&
        gift.description &&
        gift.category
      )

      console.log("\nValidation:")
      console.log(`✓ All suggestions within budget: ${validSuggestions}`)
      console.log(`✓ Number of suggestions: ${suggestions.length}`)
    }

    process.exit(0)
  } catch (error) {
    console.error("Error testing gift recommendations:", error)
    process.exit(1)
  }
}

// Run the tests
testGiftRecommendations() 