const generateSKU = () => `SKU-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

const products = [
  // Electronics Category (50+ products)
  {
    name: "Smart Watch Pro X",
    description: "Advanced smartwatch with health tracking, notifications, and customizable watch faces",
    basePrice: 4999,
    category: "Electronics",
    stock: 50,
    image: "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=500",
    status: "active",
    ageGroup: "adult",
    gender: "unisex",
    averageRating: 0,
    variants: [
      {
        name: "Black",
        price: 4999,
        stock: 30,
        attributes: { color: "Black" },
        sku: generateSKU()
      },
      {
        name: "Silver",
        price: 5299,
        stock: 20,
        attributes: { color: "Silver" },
        sku: generateSKU()
      }
    ],
    variantAttributes: [
      {
        name: "color",
        values: ["Black", "Silver"]
      }
    ]
  },
  {
    name: "Wireless Noise-Cancelling Headphones",
    description: "Premium wireless headphones with active noise cancellation and 30-hour battery life",
    basePrice: 3999,
    category: "Electronics",
    stock: 40,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500",
    status: "active",
    ageGroup: "adult",
    gender: "unisex",
    averageRating: 0,
    variants: [
      {
        name: "Black",
        price: 3999,
        stock: 25,
        attributes: { color: "Black" },
        sku: generateSKU()
      },
      {
        name: "White",
        price: 3999,
        stock: 15,
        attributes: { color: "White" },
        sku: generateSKU()
      }
    ],
    variantAttributes: [
      {
        name: "color",
        values: ["Black", "White"]
      }
    ]
  },
  
  // Kids Electronics Category (30+ products)
  {
    name: "Kids Smart Watch",
    description: "Child-friendly smartwatch with GPS tracking, SOS button, and parental controls",
    basePrice: 2499,
    category: "Kids Electronics",
    stock: 50,
    image: "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=500",
    status: "active",
    ageGroup: "children",
    gender: "unisex",
    averageRating: 0,
    variants: [
      {
        name: "Blue",
        price: 2499,
        stock: 25,
        attributes: { color: "Blue" },
        sku: generateSKU()
      },
      {
        name: "Pink",
        price: 2499,
        stock: 25,
        attributes: { color: "Pink" },
        sku: generateSKU()
      }
    ],
    variantAttributes: [
      {
        name: "color",
        values: ["Blue", "Pink"]
      }
    ]
  },

  // Fashion Category (50+ products)
  {
    name: "Premium Leather Wallet",
    description: "Handcrafted genuine leather wallet with RFID protection",
    basePrice: 1499,
    category: "Fashion",
    stock: 100,
    image: "https://images.unsplash.com/photo-1627123424574-724758594e93?w=500",
    status: "active",
    ageGroup: "adult",
    gender: "unisex",
    averageRating: 0,
    variants: [
      {
        name: "Brown",
        price: 1499,
        stock: 50,
        attributes: { color: "Brown" },
        sku: generateSKU()
      },
      {
        name: "Black",
        price: 1499,
        stock: 50,
        attributes: { color: "Black" },
        sku: generateSKU()
      }
    ],
    variantAttributes: [
      {
        name: "color",
        values: ["Brown", "Black"]
      }
    ]
  },

  // Kids Fashion Category (30+ products)
  {
    name: "Princess Dress Collection",
    description: "Beautiful princess dresses with matching accessories",
    basePrice: 2999,
    category: "Kids Fashion",
    stock: 35,
    image: "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=500",
    status: "active",
    ageGroup: "children",
    gender: "female",
    averageRating: 0,
    variants: [
      {
        name: "Small",
        price: 2999,
        stock: 15,
        attributes: { size: "Small" },
        sku: generateSKU()
      },
      {
        name: "Medium",
        price: 2999,
        stock: 20,
        attributes: { size: "Medium" },
        sku: generateSKU()
      }
    ],
    variantAttributes: [
      {
        name: "size",
        values: ["Small", "Medium"]
      }
    ]
  },

  // Home & Living Category (40+ products)
  {
    name: "Smart Home Hub",
    description: "Central control for all your smart home devices with voice control",
    basePrice: 5999,
    category: "Home & Living",
    stock: 25,
    image: "https://images.unsplash.com/photo-1558002038-1055eec2c2e7?w=500",
    status: "active",
    ageGroup: "adult",
    gender: "unisex",
    averageRating: 0,
    variants: [
      {
        name: "Standard",
        price: 5999,
        stock: 15,
        attributes: { version: "Standard" },
        sku: generateSKU()
      },
      {
        name: "Pro",
        price: 7999,
        stock: 10,
        attributes: { version: "Pro" },
        sku: generateSKU()
      }
    ],
    variantAttributes: [
      {
        name: "version",
        values: ["Standard", "Pro"]
      }
    ]
  },

  // Books & Stationery Category (30+ products)
  {
    name: "Premium Journal Set",
    description: "Leather-bound journal with high-quality paper and matching pen",
    basePrice: 899,
    category: "Books & Stationery",
    stock: 80,
    image: "https://images.unsplash.com/photo-1577375729152-4c8b5fcda381?w=500",
    status: "active",
    ageGroup: "adult",
    gender: "unisex",
    averageRating: 0,
    variants: [
      {
        name: "Brown",
        price: 899,
        stock: 40,
        attributes: { color: "Brown" },
        sku: generateSKU()
      },
      {
        name: "Black",
        price: 899,
        stock: 40,
        attributes: { color: "Black" },
        sku: generateSKU()
      }
    ],
    variantAttributes: [
      {
        name: "color",
        values: ["Brown", "Black"]
      }
    ]
  },

  // Beauty & Personal Care Category (40+ products)
  {
    name: "Luxury Skincare Set",
    description: "Complete skincare routine with natural ingredients",
    basePrice: 2999,
    category: "Beauty & Personal Care",
    stock: 40,
    image: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=500",
    status: "active",
    ageGroup: "adult",
    gender: "unisex",
    averageRating: 0,
    variants: [
      {
        name: "Normal",
        price: 2999,
        stock: 20,
        attributes: { type: "Normal" },
        sku: generateSKU()
      },
      {
        name: "Sensitive",
        price: 3299,
        stock: 20,
        attributes: { type: "Sensitive" },
        sku: generateSKU()
      }
    ],
    variantAttributes: [
      {
        name: "type",
        values: ["Normal", "Sensitive"]
      }
    ]
  },

  // Sports & Fitness Category (30+ products)
  {
    name: "Smart Fitness Band",
    description: "Advanced fitness tracker with heart rate monitoring and sleep tracking",
    basePrice: 1999,
    category: "Sports & Fitness",
    stock: 65,
    image: "https://images.unsplash.com/photo-1576243345690-4e4b692b0b04?w=500",
    status: "active",
    ageGroup: "adult",
    gender: "unisex",
    averageRating: 0,
    variants: [
      {
        name: "Black",
        price: 1999,
        stock: 35,
        attributes: { color: "Black" },
        sku: generateSKU()
      },
      {
        name: "Blue",
        price: 1999,
        stock: 30,
        attributes: { color: "Blue" },
        sku: generateSKU()
      }
    ],
    variantAttributes: [
      {
        name: "color",
        values: ["Black", "Blue"]
      }
    ]
  },

  // Teen Electronics Category (30+ products)
  {
    name: "Teen Gaming Bundle",
    description: "Gaming console with popular teen-friendly games and wireless controller",
    basePrice: 29999,
    category: "Teen Electronics",
    stock: 25,
    image: "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=500",
    status: "active",
    ageGroup: "teen",
    gender: "unisex",
    averageRating: 0,
    variants: [
      {
        name: "Standard",
        price: 29999,
        stock: 15,
        attributes: { bundle: "Standard" },
        sku: generateSKU()
      },
      {
        name: "Premium",
        price: 34999,
        stock: 10,
        attributes: { bundle: "Premium" },
        sku: generateSKU()
      }
    ],
    variantAttributes: [
      {
        name: "bundle",
        values: ["Standard", "Premium"]
      }
    ]
  },

  // Men's Care Category (30+ products)
  {
    name: "Men's Grooming Kit Pro",
    description: "Complete grooming set with electric trimmer, beard oils, and accessories",
    basePrice: 4999,
    category: "Men's Care",
    stock: 45,
    image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=500",
    status: "active",
    ageGroup: "adult",
    gender: "male",
    averageRating: 0,
    variants: [
      {
        name: "Standard",
        price: 4999,
        stock: 25,
        attributes: { type: "Standard" },
        sku: generateSKU()
      },
      {
        name: "Premium",
        price: 6999,
        stock: 20,
        attributes: { type: "Premium" },
        sku: generateSKU()
      }
    ],
    variantAttributes: [
      {
        name: "type",
        values: ["Standard", "Premium"]
      }
    ]
  },

  // Women's Care Category (30+ products)
  {
    name: "Women's Luxury Skincare Bundle",
    description: "Premium skincare collection with anti-aging serums and face masks",
    basePrice: 5999,
    category: "Women's Care",
    stock: 40,
    image: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=500",
    status: "active",
    ageGroup: "adult",
    gender: "female",
    averageRating: 0,
    variants: [
      {
        name: "Normal",
        price: 5999,
        stock: 20,
        attributes: { type: "Normal" },
        sku: generateSKU()
      },
      {
        name: "Sensitive",
        price: 6499,
        stock: 20,
        attributes: { type: "Sensitive" },
        sku: generateSKU()
      }
    ],
    variantAttributes: [
      {
        name: "type",
        values: ["Normal", "Sensitive"]
      }
    ]
  },

  // Senior Care Category (20+ products)
  {
    name: "Senior Wellness Package",
    description: "Health monitoring devices including blood pressure monitor and pill organizer",
    basePrice: 6999,
    category: "Senior Care",
    stock: 30,
    image: "https://images.unsplash.com/photo-1576243345690-4e4b692b0b04?w=500",
    status: "active",
    ageGroup: "senior",
    gender: "unisex",
    averageRating: 0,
    variants: [
      {
        name: "Basic",
        price: 6999,
        stock: 15,
        attributes: { package: "Basic" },
        sku: generateSKU()
      },
      {
        name: "Advanced",
        price: 9999,
        stock: 15,
        attributes: { package: "Advanced" },
        sku: generateSKU()
      }
    ],
    variantAttributes: [
      {
        name: "package",
        values: ["Basic", "Advanced"]
      }
    ]
  },

  // Baby Care Category (20+ products)
  {
    name: "Baby Care Essential Kit",
    description: "Complete baby care package with monitor, sterilizer, and grooming items",
    basePrice: 7999,
    category: "Baby Care",
    stock: 40,
    image: "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=500",
    status: "active",
    ageGroup: "infant",
    gender: "unisex",
    averageRating: 0,
    variants: [
      {
        name: "Newborn",
        price: 7999,
        stock: 20,
        attributes: { size: "Newborn" },
        sku: generateSKU()
      },
      {
        name: "Infant",
        price: 8499,
        stock: 20,
        attributes: { size: "Infant" },
        sku: generateSKU()
      }
    ],
    variantAttributes: [
      {
        name: "size",
        values: ["Newborn", "Infant"]
      }
    ]
  },

  // Teen Fashion Category (30+ products)
  {
    name: "Teen Fashion Accessories Set",
    description: "Trendy accessories including scrunchies, hair clips, and jewelry",
    basePrice: 1499,
    category: "Teen Fashion",
    stock: 60,
    image: "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=500",
    status: "active",
    ageGroup: "teen",
    gender: "female",
    averageRating: 0,
    variants: [
      {
        name: "Basic",
        price: 1499,
        stock: 30,
        attributes: { set: "Basic" },
        sku: generateSKU()
      },
      {
        name: "Premium",
        price: 2499,
        stock: 30,
        attributes: { set: "Premium" },
        sku: generateSKU()
      }
    ],
    variantAttributes: [
      {
        name: "set",
        values: ["Basic", "Premium"]
      }
    ]
  },

  // Educational Toys Category (30+ products)
  {
    name: "STEM Learning Kit",
    description: "Educational kit with science experiments and coding projects",
    basePrice: 3999,
    category: "Educational Toys",
    stock: 40,
    image: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=500",
    status: "active",
    ageGroup: "children",
    gender: "unisex",
    averageRating: 0,
    variants: [
      {
        name: "Basic",
        price: 3999,
        stock: 20,
        attributes: { level: "Basic" },
        sku: generateSKU()
      },
      {
        name: "Advanced",
        price: 5999,
        stock: 20,
        attributes: { level: "Advanced" },
        sku: generateSKU()
      }
    ],
    variantAttributes: [
      {
        name: "level",
        values: ["Basic", "Advanced"]
      }
    ]
  },

  // Art & Craft Category (30+ products)
  {
    name: "Professional Art Set",
    description: "Complete art supplies with premium paints, brushes, and canvas",
    basePrice: 4999,
    category: "Art & Craft",
    stock: 35,
    image: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=500",
    status: "active",
    ageGroup: "adult",
    gender: "unisex",
    averageRating: 0,
    variants: [
      {
        name: "Starter",
        price: 4999,
        stock: 20,
        attributes: { type: "Starter" },
        sku: generateSKU()
      },
      {
        name: "Professional",
        price: 7999,
        stock: 15,
        attributes: { type: "Professional" },
        sku: generateSKU()
      }
    ],
    variantAttributes: [
      {
        name: "type",
        values: ["Starter", "Professional"]
      }
    ]
  },

  // Musical Instruments Category (20+ products)
  {
    name: "Digital Piano Bundle",
    description: "88-key digital piano with stand, bench, and learning materials",
    basePrice: 29999,
    category: "Musical Instruments",
    stock: 20,
    image: "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=500",
    status: "active",
    ageGroup: "adult",
    gender: "unisex",
    averageRating: 0,
    variants: [
      {
        name: "Standard",
        price: 29999,
        stock: 10,
        attributes: { model: "Standard" },
        sku: generateSKU()
      },
      {
        name: "Premium",
        price: 39999,
        stock: 10,
        attributes: { model: "Premium" },
        sku: generateSKU()
      }
    ],
    variantAttributes: [
      {
        name: "model",
        values: ["Standard", "Premium"]
      }
    ]
  },

  // Gaming & Entertainment Category (30+ products)
  {
    name: "Virtual Reality Gaming Set",
    description: "Complete VR system with controllers and popular games",
    basePrice: 49999,
    category: "Gaming & Entertainment",
    stock: 25,
    image: "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=500",
    status: "active",
    ageGroup: "teen",
    gender: "unisex",
    averageRating: 0,
    variants: [
      {
        name: "Basic",
        price: 49999,
        stock: 15,
        attributes: { bundle: "Basic" },
        sku: generateSKU()
      },
      {
        name: "Pro",
        price: 59999,
        stock: 10,
        attributes: { bundle: "Pro" },
        sku: generateSKU()
      }
    ],
    variantAttributes: [
      {
        name: "bundle",
        values: ["Basic", "Pro"]
      }
    ]
  },

  // Smart Home Category (30+ products)
  {
    name: "Smart Security System",
    description: "Complete home security with cameras and smart sensors",
    basePrice: 39999,
    category: "Smart Home",
    stock: 30,
    image: "https://images.unsplash.com/photo-1558002038-1055eec2c2e7?w=500",
    status: "active",
    ageGroup: "adult",
    gender: "unisex",
    averageRating: 0,
    variants: [
      {
        name: "Basic",
        price: 39999,
        stock: 20,
        attributes: { package: "Basic" },
        sku: generateSKU()
      },
      {
        name: "Premium",
        price: 59999,
        stock: 10,
        attributes: { package: "Premium" },
        sku: generateSKU()
      }
    ],
    variantAttributes: [
      {
        name: "package",
        values: ["Basic", "Premium"]
      }
    ]
  },

  // Pet Care Category (20+ products)
  {
    name: "Smart Pet Care Bundle",
    description: "Complete pet care set with automatic feeder and monitoring camera",
    basePrice: 8999,
    category: "Pet Care",
    stock: 35,
    image: "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=500",
    status: "active",
    ageGroup: "adult",
    gender: "unisex",
    averageRating: 0,
    variants: [
      {
        name: "Cat Bundle",
        price: 8999,
        stock: 20,
        attributes: { petType: "Cat" },
        sku: generateSKU()
      },
      {
        name: "Dog Bundle",
        price: 9999,
        stock: 15,
        attributes: { petType: "Dog" },
        sku: generateSKU()
      }
    ],
    variantAttributes: [
      {
        name: "petType",
        values: ["Cat", "Dog"]
      }
    ]
  },

  // Outdoor & Adventure Category (30+ products)
  {
    name: "Camping Gear Set",
    description: "Complete camping set with tent, sleeping bags, and accessories",
    basePrice: 19999,
    category: "Outdoor & Adventure",
    stock: 25,
    image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=500",
    status: "active",
    ageGroup: "adult",
    gender: "unisex",
    averageRating: 0,
    variants: [
      {
        name: "2-Person",
        price: 19999,
        stock: 15,
        attributes: { size: "2-Person" },
        sku: generateSKU()
      },
      {
        name: "4-Person",
        price: 29999,
        stock: 10,
        attributes: { size: "4-Person" },
        sku: generateSKU()
      }
    ],
    variantAttributes: [
      {
        name: "size",
        values: ["2-Person", "4-Person"]
      }
    ]
  },

  // Kitchen & Dining Category (30+ products)
  {
    name: "Smart Kitchen Bundle",
    description: "Complete smart kitchen set with connected appliances",
    basePrice: 49999,
    category: "Kitchen & Dining",
    stock: 20,
    image: "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=500",
    status: "active",
    ageGroup: "adult",
    gender: "unisex",
    averageRating: 0,
    variants: [
      {
        name: "Basic",
        price: 49999,
        stock: 10,
        attributes: { package: "Basic" },
        sku: generateSKU()
      },
      {
        name: "Premium",
        price: 69999,
        stock: 10,
        attributes: { package: "Premium" },
        sku: generateSKU()
      }
    ],
    variantAttributes: [
      {
        name: "package",
        values: ["Basic", "Premium"]
      }
    ]
  },

  // Fitness Equipment Category (30+ products)
  {
    name: "Home Gym Package",
    description: "Complete home gym with smart equipment and training programs",
    basePrice: 79999,
    category: "Fitness Equipment",
    stock: 15,
    image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=500",
    status: "active",
    ageGroup: "adult",
    gender: "unisex",
    averageRating: 0,
    variants: [
      {
        name: "Standard",
        price: 79999,
        stock: 10,
        attributes: { type: "Standard" },
        sku: generateSKU()
      },
      {
        name: "Pro",
        price: 99999,
        stock: 5,
        attributes: { type: "Pro" },
        sku: generateSKU()
      }
    ],
    variantAttributes: [
      {
        name: "type",
        values: ["Standard", "Pro"]
      }
    ]
  },

  // Travel Accessories Category (30+ products)
  {
    name: "Smart Travel Bundle",
    description: "Complete travel set with smart luggage and accessories",
    basePrice: 29999,
    category: "Travel Accessories",
    stock: 25,
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500",
    status: "active",
    ageGroup: "adult",
    gender: "unisex",
    averageRating: 0,
    variants: [
      {
        name: "Carry-On",
        price: 29999,
        stock: 15,
        attributes: { size: "Carry-On" },
        sku: generateSKU()
      },
      {
        name: "Full Set",
        price: 49999,
        stock: 10,
        attributes: { size: "Full Set" },
        sku: generateSKU()
      }
    ],
    variantAttributes: [
      {
        name: "size",
        values: ["Carry-On", "Full Set"]
      }
    ]
  },

  // Office Supplies Category (30+ products)
  {
    name: "Smart Office Bundle",
    description: "Complete office setup with ergonomic furniture and accessories",
    basePrice: 89999,
    category: "Office Supplies",
    stock: 20,
    image: "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=500",
    status: "active",
    ageGroup: "adult",
    gender: "unisex",
    averageRating: 0,
    variants: [
      {
        name: "Standard",
        price: 89999,
        stock: 10,
        attributes: { package: "Standard" },
        sku: generateSKU()
      },
      {
        name: "Executive",
        price: 129999,
        stock: 10,
        attributes: { package: "Executive" },
        sku: generateSKU()
      }
    ],
    variantAttributes: [
      {
        name: "package",
        values: ["Standard", "Executive"]
      }
    ]
  },

  // Party Supplies Category (20+ products)
  {
    name: "Party Decoration Set",
    description: "Complete party decoration kit with smart lighting and accessories",
    basePrice: 4999,
    category: "Party Supplies",
    stock: 40,
    image: "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=500",
    status: "active",
    ageGroup: "adult",
    gender: "unisex",
    averageRating: 0,
    variants: [
      {
        name: "Basic",
        price: 4999,
        stock: 25,
        attributes: { theme: "Basic" },
        sku: generateSKU()
      },
      {
        name: "Premium",
        price: 7999,
        stock: 15,
        attributes: { theme: "Premium" },
        sku: generateSKU()
      }
    ],
    variantAttributes: [
      {
        name: "theme",
        values: ["Basic", "Premium"]
      }
    ]
  },

  // Gardening Category (20+ products)
  {
    name: "Smart Garden Kit",
    description: "Complete gardening set with smart monitoring and tools",
    basePrice: 14999,
    category: "Gardening",
    stock: 30,
    image: "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=500",
    status: "active",
    ageGroup: "adult",
    gender: "unisex",
    averageRating: 0,
    variants: [
      {
        name: "Indoor",
        price: 14999,
        stock: 15,
        attributes: { type: "Indoor" },
        sku: generateSKU()
      },
      {
        name: "Outdoor",
        price: 19999,
        stock: 15,
        attributes: { type: "Outdoor" },
        sku: generateSKU()
      }
    ],
    variantAttributes: [
      {
        name: "type",
        values: ["Indoor", "Outdoor"]
      }
    ]
  }
];

// Export the products array
module.exports = products; 