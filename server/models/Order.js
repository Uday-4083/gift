const mongoose = require("mongoose")

const orderSchema = new mongoose.Schema({
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  products: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
      },
      merchant: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
        min: [1, "Quantity must be at least 1"],
      },
      price: {
        type: Number,
        required: true,
      },
      customization: {
        type: Map,
        of: String,
        default: {},
      },
    },
  ],
  status: {
    type: String,
    enum: ["pending", "processing", "completed", "cancelled"],
    default: "pending",
  },
  shippingAddress: {
    street: String,
    city: String,
    state: String,
    postalCode: String,
    country: String,
  },
  paymentMethod: {
    type: String,
    required: true,
  },
  paymentStatus: {
    type: String,
    enum: ["pending", "completed", "failed"],
    default: "pending",
  },
  paymentDetails: {
    lastFourDigits: {
      type: String,
      maxLength: 4,
      minLength: 4,
      validate: {
        validator: function(v) {
          return !v || /^\d{4}$/.test(v);
        },
        message: "Last four digits must be exactly 4 digits"
      }
    },
    cardType: String
  },
  totalAmount: {
    type: Number,
    required: true,
  },
  shippingCost: {
    type: Number,
    default: 0,
  },
  tax: {
    type: Number,
    default: 0,
  },
  notes: String,
  trackingNumber: String,
}, {
  timestamps: true,
})

// Calculate total amount before saving
orderSchema.pre("save", function (next) {
  if (this.isModified("products") || this.isNew) {
    const productsTotal = this.products.reduce((sum, item) => sum + (item.price * item.quantity), 0)
    this.totalAmount = productsTotal + this.shippingCost + this.tax
  }
  next()
})

module.exports = mongoose.model("Order", orderSchema)
