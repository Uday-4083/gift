"use client"

import { useState, useEffect, useCallback } from "react"
import { Container, Row, Col, Card, Button, Form, Badge } from "react-bootstrap"
import { useLocation } from "react-router-dom"
import axios from "axios"
import { FaShoppingCart, FaFilter, FaSearch, FaGift } from "react-icons/fa"
import { toast } from 'react-hot-toast'
import styles from "./Catalog.module.css"

const Catalog = () => {
  const [products, setProducts] = useState([])
  const [filteredProducts, setFilteredProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [cart, setCart] = useState([])
  const [filters, setFilters] = useState({
    category: "",
    minPrice: "",
    maxPrice: "",
    search: "",
  })

  const location = useLocation()
  const suggestion = location.state?.suggestion

  // Fetch products function
  const fetchProducts = useCallback(async () => {
    try {
      const res = await axios.get("/api/gifts")
      setProducts(res.data)
      
      if (suggestion?.suggestedProducts) {
        const suggestedIds = suggestion.suggestedProducts.map(p => p._id)
        const suggestedProducts = res.data.filter(p => suggestedIds.includes(p._id))
        const otherProducts = res.data.filter(p => !suggestedIds.includes(p._id))
        
        // Sort other products by rating and different categories
        const sortedOtherProducts = otherProducts.sort((a, b) => {
          if (a.averageRating !== b.averageRating) {
            return b.averageRating - a.averageRating
          }
          // If ratings are equal, prioritize products from different categories
          return a.category === b.category ? 0 : -1
        })

        setFilteredProducts([...suggestedProducts, ...sortedOtherProducts])
      } else {
        // If no suggestions, sort by rating and ensure category diversity
        const sortedProducts = res.data.sort((a, b) => {
          if (a.averageRating !== b.averageRating) {
            return b.averageRating - a.averageRating
          }
          return a.category === b.category ? 0 : -1
        })
        setFilteredProducts(sortedProducts)
      }

      const uniqueCategories = [...new Set(res.data.map((product) => product.category))]
      setCategories(uniqueCategories)

      const savedCart = localStorage.getItem("cart")
      if (savedCart) {
        setCart(JSON.parse(savedCart))
      }

      setLoading(false)
    } catch (error) {
      console.error("Error fetching products:", error)
      setLoading(false)
    }
  }, [suggestion])

  // Apply filters function
  const applyFilters = useCallback(() => {
    let result = [...products]

    if (filters.category) {
      result = result.filter((product) => product.category === filters.category)
    }

    if (filters.minPrice) {
      result = result.filter((product) => product.basePrice >= Number(filters.minPrice))
    }

    if (filters.maxPrice) {
      result = result.filter((product) => product.basePrice <= Number(filters.maxPrice))
    }

    if (filters.search) {
      const searchTerm = filters.search.toLowerCase()
      result = result.filter(
        (product) =>
          product.name.toLowerCase().includes(searchTerm) ||
          product.description.toLowerCase().includes(searchTerm)
      )
    }

    setFilteredProducts(result)
  }, [filters, products])

  // Fetch products on mount and when suggestion changes
  useEffect(() => {
    fetchProducts()
  }, [fetchProducts])

  // Apply filters when filters or products change
  useEffect(() => {
    applyFilters()
  }, [applyFilters])

  // Handle filter changes
  const handleFilterChange = (e) => {
    setFilters(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  // Reset filters
  const resetFilters = () => {
    setFilters({
      category: "",
      minPrice: "",
      maxPrice: "",
      search: "",
    })
  }

  // Add to cart with toast notification
  const addToCart = (product) => {
    // Check stock availability
    if (product.stock <= 0) {
      toast.error(`${product.name} is out of stock!`)
      return
    }

    // Check if adding more would exceed stock
    const existingItem = cart.find((item) => item.product._id === product._id)
    if (existingItem && existingItem.quantity >= product.stock) {
      toast.error(`Cannot add more ${product.name}. Maximum stock reached!`)
      return
    }

    const updatedCart = existingItem
      ? cart.map((item) =>
          item.product._id === product._id 
            ? { 
                ...item, 
                quantity: Math.min(item.quantity + 1, product.stock),
                product: {
                  ...item.product,
                  price: product.basePrice,
                  discount: product.discount || 0
                }
              } 
            : item
        )
      : [...cart, { 
          product: {
            ...product,
            price: product.basePrice,
            discount: product.discount || 0
          }, 
          quantity: 1 
        }]

    setCart(updatedCart)
    localStorage.setItem("cart", JSON.stringify(updatedCart))
    toast.success(`${product.name} added to cart!`)
  }

  return (
    <div className={styles.catalogPage}>
      <Container>
        {/* Header Section */}
        <Row className="mb-4">
          <Col>
            <div className={styles.pageHeader}>
              <div className={styles.headerContent}>
                <FaGift className={styles.headerIcon} />
                <div>
                  <h2 className={styles.headerTitle}>Gift Catalog</h2>
                  {suggestion && (
                    <div className={styles.recommendationInfo}>
                      <p className={styles.headerSubtitle}>
                        Personalized recommendations for{" "}
                        <span className={styles.highlight}>{suggestion.occasion}</span>
                      </p>
                      <p className={styles.recommendationDetails}>
                        Budget: <span className={styles.highlight}>₹{suggestion.budget}</span> |
                        For: <span className={styles.highlight}>{suggestion.relation}</span> |
                        Age: <span className={styles.highlight}>{suggestion.recipientAge}</span>
                      </p>
                      <p className={styles.recommendationNote}>
                        These suggestions are tailored based on your preferences and our AI analysis
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </Col>
        </Row>

        {/* Filters Section */}
        <Row className="mb-4">
          <Col>
            <Card className={styles.filterCard}>
              <Card.Body>
                <div className={styles.filterHeader}>
                  <FaFilter className={styles.filterIcon} />
                  <h5 className="mb-0">Filter Products</h5>
                </div>
                <Row className="mt-3">
                  <Col md={3}>
                    <Form.Group className={styles.filterGroup}>
                      <Form.Label>Category</Form.Label>
                      <Form.Select 
                        name="category" 
                        value={filters.category} 
                        onChange={handleFilterChange}
                        className={styles.filterSelect}
                      >
                        <option value="">All Categories</option>
                        {categories.map((category, index) => (
                          <option key={index} value={category}>
                            {category}
                          </option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  <Col md={3}>
                    <Form.Group className={styles.filterGroup}>
                      <Form.Label>Min Price (₹)</Form.Label>
                      <Form.Control
                        type="number"
                        name="minPrice"
                        value={filters.minPrice}
                        onChange={handleFilterChange}
                        placeholder="Min Price"
                        className={styles.filterInput}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={3}>
                    <Form.Group className={styles.filterGroup}>
                      <Form.Label>Max Price (₹)</Form.Label>
                      <Form.Control
                        type="number"
                        name="maxPrice"
                        value={filters.maxPrice}
                        onChange={handleFilterChange}
                        placeholder="Max Price"
                        className={styles.filterInput}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={3}>
                    <Form.Group className={styles.filterGroup}>
                      <Form.Label>Search</Form.Label>
                      <div className={styles.searchInputGroup}>
                        <Form.Control
                          type="text"
                          name="search"
                          value={filters.search}
                          onChange={handleFilterChange}
                          placeholder="Search products"
                          className={styles.filterInput}
                        />
                        <span className={styles.searchIcon}>
                          <FaSearch />
                        </span>
                      </div>
                    </Form.Group>
                  </Col>
                </Row>
                <div className={styles.filterActions}>
                  <Button 
                    variant="outline-secondary" 
                    onClick={resetFilters} 
                    className={styles.resetButton}
                  >
                    Reset Filters
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Products Grid */}
        <Row className={styles.productsGrid}>
          {loading ? (
            <Col className="text-center py-5">
              <div className={styles.loadingSpinner}>
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
                <p className="mt-3">Loading products...</p>
              </div>
            </Col>
          ) : filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              <Col md={4} lg={3} key={product._id} className="mb-4">
                <Card className={styles.productCard}>
                  <div className={styles.productImageWrapper}>
                    <Card.Img 
                      variant="top" 
                      src={product.image || '/placeholder-image.jpg'} 
                      alt={product.name}
                      className={styles.productImage}
                    />
                  </div>
                  <Card.Body className={styles.productDetails}>
                    <div className={styles.productCategory}>
                      <Badge bg="secondary" className={styles.categoryBadge}>
                        {product.category}
                      </Badge>
                    </div>
                    <h3 className={styles.productTitle}>{product.name}</h3>
                    <p className={styles.productDescription}>
                      {product.description.substring(0, 80)}...
                    </p>
                    <div className={styles.productPrice}>
                      <span className={styles.priceLabel}>Price:</span>
                      <span className={styles.priceAmount}>₹{product.basePrice}</span>
                    </div>
                  </Card.Body>
                  <Card.Footer className={styles.productFooter}>
                    <Button
                      variant="primary"
                      className={styles.addToCartBtn}
                      disabled={product.stock <= 0}
                      onClick={() => addToCart(product)}
                    >
                      <FaShoppingCart className={styles.cartIcon} />
                      Add to Cart
                    </Button>
                  </Card.Footer>
                </Card>
              </Col>
            ))
          ) : (
            <Col className="text-center py-5">
              <div className={styles.noProducts}>
                <FaGift className={styles.noProductsIcon} />
                <h4>No products found</h4>
                <p className="text-muted">Try adjusting your filters or search criteria</p>
                <Button 
                  variant="primary" 
                  onClick={resetFilters} 
                  className={styles.resetSearchBtn}
                >
                  Reset Filters
                </Button>
              </div>
            </Col>
          )}
        </Row>
      </Container>
    </div>
  )
}

export default Catalog
