const generateSKU = () => `SKU-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

// Helper function to create variant structure
const createDefaultVariant = (price, stock, attribute = "color", value = "standard") => ({
  name: "Standard",
  price,
  stock,
  attributes: new Map([[attribute, value]]),
  sku: generateSKU(),
  weight: 0.5, // in kg
  dimensions: {
    length: 20, // in cm
    width: 15,  // in cm
    height: 10  // in cm
  }
});

const createDefaultVariantAttribute = (name = "color", values = ["standard"]) => ({
  name,
  values
});

// Helper function to create tags based on product attributes
const createTags = (name, category, ageGroup, gender) => {
  const tags = [
    category.toLowerCase(),
    ageGroup.toLowerCase(),
    gender.toLowerCase(),
    ...name.toLowerCase().split(" ")
  ];
  return [...new Set(tags)]; // Remove duplicates
};

// Helper function to create occasions based on product type
const createOccasions = (category, ageGroup) => {
  const occasions = ["birthday", "holiday"];
  
  if (category.includes("Fashion")) occasions.push("party", "casual");
  if (category.includes("Electronics")) occasions.push("graduation");
  if (category.includes("Home")) occasions.push("housewarming");
  if (ageGroup === "children") occasions.push("christmas", "back to school");
  if (ageGroup === "teen") occasions.push("graduation");
  
  return occasions;
};

// Merge and enhance product data
const mergedProducts = [
  // Original Electronics Products (Enhanced)
  {
    name: "Smart Watch Pro X",
    description: "Advanced smartwatch with health tracking, notifications, and customizable watch faces. Features heart rate monitoring, sleep tracking, and 5-day battery life.",
    basePrice: 4999,
    category: "Electronics",
    stock: 50,
    status: "active",
    image: "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=500",
    ageGroup: "adult",
    gender: "unisex",
    variants: [createDefaultVariant(4999, 50, "color", "black")],
    variantAttributes: [createDefaultVariantAttribute("color", ["black", "silver"])],
    rating: 4.5,
    reviews: [],
    tags: createTags("Smart Watch Pro X", "Electronics", "adult", "unisex"),
    occasions: createOccasions("Electronics", "adult"),
    features: ["Heart Rate Monitor", "Sleep Tracking", "5-day Battery", "Notifications"],
    brand: "TechPro",
    warranty: "1 year",
    returnable: true,
    personalizable: true,
    personalizationOptions: ["Engraving", "Watch Face Customization"],
    giftWrappable: true,
    trending: true,
    discountable: true,
    shippingTime: "2-3 business days",
    recommendedAge: {
      min: 18,
      max: 65
    }
  },
  {
    name: "Wireless Noise-Cancelling Headphones",
    description: "Premium wireless headphones with active noise cancellation, 30-hour battery life, and crystal-clear sound quality.",
    basePrice: 3999,
    category: "Electronics",
    stock: 40,
    status: "active",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500",
    ageGroup: "adult",
    gender: "unisex",
    variants: [createDefaultVariant(3999, 40, "color", "black")],
    variantAttributes: [createDefaultVariantAttribute("color", ["black", "white"])]
  },
  {
    name: "Portable Bluetooth Speaker",
    description: "Waterproof portable speaker with 360-degree sound, 20-hour battery life, and built-in microphone for calls.",
    basePrice: 2499,
    category: "Electronics",
    stock: 60,
    status: "active",
    image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=500",
    ageGroup: "adult",
    gender: "unisex",
    variants: [createDefaultVariant(2499, 60, "color", "black")],
    variantAttributes: [createDefaultVariantAttribute("color", ["black", "blue", "red"])]
  },
  {
    name: "Digital Camera Kit",
    description: "Professional-grade digital camera with 24MP sensor, 4K video, and multiple lenses included.",
    basePrice: 29999,
    category: "Electronics",
    stock: 25,
    status: "active",
    image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=500",
    ageGroup: "adult",
    gender: "unisex",
    variants: [createDefaultVariant(29999, 25, "type", "standard")],
    variantAttributes: [createDefaultVariantAttribute("type", ["standard", "pro"])]
  },

  // Original Fashion Products (Enhanced)
  {
    name: "Classic Leather Wallet",
    description: "Handcrafted genuine leather wallet with multiple card slots and RFID protection. Perfect for everyday use.",
    basePrice: 1299,
    category: "Fashion",
    stock: 100,
    status: "active",
    image: "https://images.unsplash.com/photo-1627123424574-724758594e93?w=500",
    ageGroup: "adult",
    gender: "unisex",
    variants: [createDefaultVariant(1299, 100, "color", "brown")],
    variantAttributes: [createDefaultVariantAttribute("color", ["brown", "black"])]
  },
  {
    name: "Designer Sunglasses",
    description: "UV-protected polarized sunglasses with premium metal frame and scratch-resistant lenses.",
    basePrice: 2999,
    category: "Fashion",
    stock: 45,
    status: "active",
    image: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=500",
    ageGroup: "adult",
    gender: "unisex",
    variants: [createDefaultVariant(2999, 45, "color", "black")],
    variantAttributes: [createDefaultVariantAttribute("color", ["black", "gold"])]
  },

  // Original Home & Living Products (Enhanced)
  {
    name: "Aromatherapy Diffuser Set",
    description: "Modern essential oil diffuser with LED lights and 6 premium essential oils. Perfect for creating a relaxing atmosphere.",
    basePrice: 1899,
    category: "Home & Living",
    stock: 55,
    status: "active",
    image: "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=500",
    ageGroup: "adult",
    gender: "unisex",
    variants: [createDefaultVariant(1899, 55, "type", "standard")],
    variantAttributes: [createDefaultVariantAttribute("type", ["standard", "premium"])]
  },
  {
    name: "Premium Coffee Maker",
    description: "Programmable coffee maker with built-in grinder, multiple brew strengths, and thermal carafe.",
    basePrice: 4499,
    category: "Home & Living",
    stock: 30,
    status: "active",
    image: "https://images.unsplash.com/photo-1517914309068-900c5bef66b3?w=500",
    ageGroup: "adult",
    gender: "unisex",
    variants: [createDefaultVariant(4499, 30, "type", "standard")],
    variantAttributes: [createDefaultVariantAttribute("type", ["standard", "premium"])]
  },

  // Kids Products
  {
    name: "Kids Smart Watch",
    description: "Child-friendly smartwatch with GPS tracking and parental controls.",
    basePrice: 2499,
    category: "Kids Electronics",
    stock: 50,
    status: "active",
    image: "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=500",
    ageGroup: "children",
    gender: "unisex",
    variants: [createDefaultVariant(2499, 50, "color", "blue")],
    variantAttributes: [createDefaultVariantAttribute("color", ["blue", "pink"])]
  },
  {
    name: "Princess Dress Collection",
    description: "Beautiful princess dresses with matching accessories.",
    basePrice: 2999,
    category: "Kids Fashion",
    stock: 35,
    status: "active",
    image: "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=500",
    ageGroup: "children",
    gender: "female",
    variants: [createDefaultVariant(2999, 35, "size", "small")],
    variantAttributes: [createDefaultVariantAttribute("size", ["small", "medium", "large"])]
  },

  // Teen Products
  {
    name: "Teen Gaming Bundle",
    description: "Gaming console with popular teen-friendly games.",
    basePrice: 29999,
    category: "Teen Electronics",
    stock: 25,
    status: "active",
    image: "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=500",
    ageGroup: "teen",
    gender: "unisex",
    variants: [createDefaultVariant(29999, 25, "bundle", "standard")],
    variantAttributes: [createDefaultVariantAttribute("bundle", ["standard", "premium"])]
  },

  // Gender-Specific Products
  {
    name: "Men's Grooming Kit Pro",
    description: "Complete grooming set with electric trimmer and accessories.",
    basePrice: 4999,
    category: "Men's Care",
    stock: 45,
    status: "active",
    image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=500",
    ageGroup: "adult",
    gender: "male",
    variants: [createDefaultVariant(4999, 45, "type", "standard")],
    variantAttributes: [createDefaultVariantAttribute("type", ["standard", "premium"])]
  },
  {
    name: "Women's Luxury Skincare Bundle",
    description: "Premium skincare collection with anti-aging products.",
    basePrice: 5999,
    category: "Women's Care",
    stock: 40,
    status: "active",
    image: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=500",
    ageGroup: "adult",
    gender: "female",
    variants: [createDefaultVariant(5999, 40, "type", "normal")],
    variantAttributes: [createDefaultVariantAttribute("type", ["normal", "sensitive"])]
  },

  // Additional Products from Original Data (Enhanced)
  {
    name: "Wireless Gaming Mouse",
    description: "High-precision gaming mouse with customizable RGB lighting and programmable buttons.",
    basePrice: 2499,
    category: "Electronics",
    stock: 35,
    status: "active",
    image: "https://images.unsplash.com/photo-1527814050087-3793815479db?w=500",
    ageGroup: "teen",
    gender: "unisex",
    variants: [createDefaultVariant(2499, 35, "color", "black")],
    variantAttributes: [createDefaultVariantAttribute("color", ["black", "white"])]
  },
  {
    name: "Mechanical Keyboard",
    description: "RGB mechanical keyboard with customizable switches and anti-ghosting technology.",
    basePrice: 3499,
    category: "Electronics",
    stock: 45,
    status: "active",
    image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=500",
    ageGroup: "teen",
    gender: "unisex",
    variants: [createDefaultVariant(3499, 45, "switch", "blue")],
    variantAttributes: [createDefaultVariantAttribute("switch", ["blue", "red", "brown"])]
  },
  {
    name: "Designer Handbag",
    description: "Luxury handbag made with premium materials and elegant design.",
    basePrice: 12999,
    category: "Fashion",
    stock: 15,
    status: "active",
    image: "https://images.unsplash.com/photo-1556306535-0f09a537f0a3?w=500",
    ageGroup: "adult",
    gender: "female",
    variants: [createDefaultVariant(12999, 15, "color", "black")],
    variantAttributes: [createDefaultVariantAttribute("color", ["black", "brown", "red"])]
  }
];

// Function to create a complete product with all attributes
const createCompleteProduct = ({
  name,
  description,
  basePrice,
  category,
  stock,
  image,
  ageGroup,
  gender,
  variantType = "color",
  variantValue = "standard",
  variantOptions = ["standard"],
  brand = "Generic",
  features = [],
  warranty = "1 year",
  trending = false
}) => ({
  name,
  description,
  basePrice,
  category,
  stock,
  status: "active",
  image,
  ageGroup,
  gender,
  variants: [createDefaultVariant(basePrice, stock, variantType, variantValue)],
  variantAttributes: [createDefaultVariantAttribute(variantType, variantOptions)],
  rating: 4.0,
  reviews: [],
  tags: createTags(name, category, ageGroup, gender),
  occasions: createOccasions(category, ageGroup),
  features,
  brand,
  warranty,
  returnable: true,
  personalizable: true,
  personalizationOptions: ["Gift Message", "Custom Packaging"],
  giftWrappable: true,
  trending,
  discountable: true,
  shippingTime: "2-3 business days",
  recommendedAge: {
    min: ageGroup === "children" ? 3 : ageGroup === "teen" ? 13 : 18,
    max: ageGroup === "children" ? 12 : ageGroup === "teen" ? 19 : 65
  }
});

// Add all other products using the createCompleteProduct function
const additionalProducts = [
  {
    name: "Wireless Noise-Cancelling Headphones",
    description: "Premium wireless headphones with active noise cancellation, 30-hour battery life, and crystal-clear sound quality.",
    basePrice: 3999,
    category: "Electronics",
    stock: 40,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500",
    ageGroup: "adult",
    gender: "unisex",
    variantType: "color",
    variantValue: "black",
    variantOptions: ["black", "white"],
    brand: "SoundMax",
    features: ["Active Noise Cancellation", "30-hour Battery", "Bluetooth 5.0"],
    warranty: "2 years",
    trending: true
  },
  {
    name: "Portable Bluetooth Speaker",
    description: "Waterproof portable speaker with 360-degree sound, 20-hour battery life, and built-in microphone for calls.",
    basePrice: 2499,
    category: "Electronics",
    stock: 60,
    image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=500",
    ageGroup: "adult",
    gender: "unisex",
    variantType: "color",
    variantValue: "black",
    variantOptions: ["black", "blue", "red"],
    brand: "SoundMax",
    features: ["Waterproof", "360° Sound", "20-hour Battery", "Built-in Mic"],
    warranty: "1 year"
  },
  {
    name: "Digital Camera Kit",
    description: "Professional-grade digital camera with 24MP sensor, 4K video, and multiple lenses included.",
    basePrice: 29999,
    category: "Electronics",
    stock: 25,
    image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=500",
    ageGroup: "adult",
    gender: "unisex",
    variantType: "type",
    variantValue: "standard",
    variantOptions: ["standard", "pro"],
    brand: "PhotoPro",
    features: ["24MP Sensor", "4K Video", "Multiple Lenses", "Professional Grade"],
    warranty: "2 years",
    trending: true
  },
  {
    name: "Classic Leather Wallet",
    description: "Handcrafted genuine leather wallet with multiple card slots and RFID protection. Perfect for everyday use.",
    basePrice: 1299,
    category: "Fashion",
    stock: 100,
    image: "https://images.unsplash.com/photo-1627123424574-724758594e93?w=500",
    ageGroup: "adult",
    gender: "unisex",
    variantType: "color",
    variantValue: "brown",
    variantOptions: ["brown", "black"],
    brand: "LeatherCraft",
    features: ["Genuine Leather", "RFID Protection", "Multiple Card Slots"],
    warranty: "1 year"
  },
  {
    name: "Designer Sunglasses",
    description: "UV-protected polarized sunglasses with premium metal frame and scratch-resistant lenses.",
    basePrice: 2999,
    category: "Fashion",
    stock: 45,
    image: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=500",
    ageGroup: "adult",
    gender: "unisex",
    variantType: "color",
    variantValue: "black",
    variantOptions: ["black", "gold"],
    brand: "VisionStyle",
    features: ["UV Protection", "Polarized", "Scratch-resistant"],
    warranty: "1 year"
  },
  {
    name: "Aromatherapy Diffuser Set",
    description: "Modern essential oil diffuser with LED lights and 6 premium essential oils. Perfect for creating a relaxing atmosphere.",
    basePrice: 1899,
    category: "Home & Living",
    stock: 55,
    image: "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=500",
    ageGroup: "adult",
    gender: "unisex",
    variantType: "type",
    variantValue: "standard",
    variantOptions: ["standard", "premium"],
    brand: "AromaLife",
    features: ["LED Lights", "6 Essential Oils", "Timer Function", "Auto Shutoff"],
    warranty: "1 year"
  },
  {
    name: "Premium Coffee Maker",
    description: "Programmable coffee maker with built-in grinder, multiple brew strengths, and thermal carafe.",
    basePrice: 4499,
    category: "Home & Living",
    stock: 30,
    image: "https://images.unsplash.com/photo-1517914309068-900c5bef66b3?w=500",
    ageGroup: "adult",
    gender: "unisex",
    variantType: "type",
    variantValue: "standard",
    variantOptions: ["standard", "premium"],
    brand: "BrewMaster",
    features: ["Built-in Grinder", "Multiple Brew Strengths", "Thermal Carafe"],
    warranty: "2 years"
  },
  {
    name: "Kids Smart Watch",
    description: "Child-friendly smartwatch with GPS tracking and parental controls.",
    basePrice: 2499,
    category: "Kids Electronics",
    stock: 50,
    image: "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=500",
    ageGroup: "children",
    gender: "unisex",
    variantType: "color",
    variantValue: "blue",
    variantOptions: ["blue", "pink"],
    brand: "KidTech",
    features: ["GPS Tracking", "Parental Controls", "SOS Button", "Games"],
    warranty: "1 year"
  },
  {
    name: "Princess Dress Collection",
    description: "Beautiful princess dresses with matching accessories.",
    basePrice: 2999,
    category: "Kids Fashion",
    stock: 35,
    image: "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=500",
    ageGroup: "children",
    gender: "female",
    variantType: "size",
    variantValue: "small",
    variantOptions: ["small", "medium", "large"],
    brand: "LittlePrincess",
    features: ["Premium Fabric", "Matching Accessories", "Machine Washable"],
    warranty: "30 days"
  },
  {
    name: "Teen Gaming Bundle",
    description: "Gaming console with popular teen-friendly games.",
    basePrice: 29999,
    category: "Teen Electronics",
    stock: 25,
    image: "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=500",
    ageGroup: "teen",
    gender: "unisex",
    variantType: "bundle",
    variantValue: "standard",
    variantOptions: ["standard", "premium"],
    brand: "GameTech",
    features: ["Latest Console", "Multiple Games", "Online Gaming"],
    warranty: "1 year",
    trending: true
  },
  {
    name: "Men's Grooming Kit Pro",
    description: "Complete grooming set with electric trimmer and accessories.",
    basePrice: 4999,
    category: "Men's Care",
    stock: 45,
    image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=500",
    ageGroup: "adult",
    gender: "male",
    variantType: "type",
    variantValue: "standard",
    variantOptions: ["standard", "premium"],
    brand: "GroomPro",
    features: ["Electric Trimmer", "Multiple Attachments", "Travel Case"],
    warranty: "2 years"
  },
  {
    name: "Women's Luxury Skincare Bundle",
    description: "Premium skincare collection with anti-aging products.",
    basePrice: 5999,
    category: "Women's Care",
    stock: 40,
    image: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=500",
    ageGroup: "adult",
    gender: "female",
    variantType: "type",
    variantValue: "normal",
    variantOptions: ["normal", "sensitive"],
    brand: "GlowBeauty",
    features: ["Anti-aging Formula", "Natural Ingredients", "Complete Routine"],
    warranty: "1 year"
  },
  {
    name: "Wireless Gaming Mouse",
    description: "High-precision gaming mouse with customizable RGB lighting and programmable buttons.",
    basePrice: 2499,
    category: "Electronics",
    stock: 35,
    image: "https://images.unsplash.com/photo-1527814050087-3793815479db?w=500",
    ageGroup: "teen",
    gender: "unisex",
    variantType: "color",
    variantValue: "black",
    variantOptions: ["black", "white"],
    brand: "GameTech",
    features: ["RGB Lighting", "Programmable Buttons", "High Precision"],
    warranty: "2 years"
  },
  {
    name: "Mechanical Keyboard",
    description: "RGB mechanical keyboard with customizable switches and anti-ghosting technology.",
    basePrice: 3499,
    category: "Electronics",
    stock: 45,
    image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=500",
    ageGroup: "teen",
    gender: "unisex",
    variantType: "switch",
    variantValue: "blue",
    variantOptions: ["blue", "red", "brown"],
    brand: "GameTech",
    features: ["Mechanical Switches", "RGB Backlight", "Anti-ghosting"],
    warranty: "2 years"
  },
  {
    name: "Designer Handbag",
    description: "Luxury handbag made with premium materials and elegant design.",
    basePrice: 12999,
    category: "Fashion",
    stock: 15,
    image: "https://images.unsplash.com/photo-1556306535-0f09a537f0a3?w=500",
    ageGroup: "adult",
    gender: "female",
    variantType: "color",
    variantValue: "black",
    variantOptions: ["black", "brown", "red"],
    brand: "LuxStyle",
    features: ["Premium Materials", "Multiple Compartments", "Detachable Strap"],
    warranty: "1 year",
    trending: true
  }
];

// Combine the first product with all additional products
mergedProducts.push(...additionalProducts.map(product => createCompleteProduct(product)));

module.exports = mergedProducts; 