const mongoose = require("mongoose")

const SuggestionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  occasion: {
    type: String,
    required: true,
  },
  budget: {
    type: Number,
    required: true,
  },
  relation: {
    type: String,
    required: true,
  },
  recipientAge: {
    type: Number,
    required: true,
  },
  recipientGender: {
    type: String,
    required: true,
  },
  suggestedProducts: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
    },
  ],
  aiResponse: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
})

module.exports = mongoose.model("Suggestion", SuggestionSchema)
