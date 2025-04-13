"use client"

import { useState, useEffect, useContext } from "react"
import { Container, Row, Col, Card, Button, Form, Alert } from "react-bootstrap"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import { AuthContext } from "../../context/AuthContext"
import { FaCreditCard, FaLock, FaSpinner } from "react-icons/fa"

const Checkout = () => {
  const [cartItems, setCartItems] = useState([])
  const [totalAmount, setTotalAmount] = useState(0)
  const [formData, setFormData] = useState({
    fullName: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    paymentMethod: "demo_card",
    cardNumber: "",
    cardName: "",
    expiryDate: "",
    cvv: ""
  })
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const { user } = useContext(AuthContext)
  const navigate = useNavigate()

  useEffect(() => {
    // Load cart from localStorage
    const savedCart = localStorage.getItem("cart")
    if (savedCart) {
      const cart = JSON.parse(savedCart)
      setCartItems(cart)

      // Calculate total amount
      const total = cart.reduce((sum, item) => {
        const price = calculateDiscountedPrice(item.product.price, item.product.discount)
        return sum + price * item.quantity
      }, 0)

      // Add tax
      const totalWithTax = total + total * 0.18
      setTotalAmount(totalWithTax)
    } else {
      // Redirect to cart if empty
      navigate("/cart")
    }

    // Pre-fill user name if available
    if (user) {
      setFormData((prevState) => ({
        ...prevState,
        fullName: user.fullName,
      }))
    }
  }, [navigate, user])

  // Calculate discounted price
  const calculateDiscountedPrice = (price, discount) => {
    return price - price * (discount / 100)
  }

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    setError("")

    // Validate card details if demo card payment is selected
    if (formData.paymentMethod === "demo_card") {
      if (!/^\d{16}$/.test(formData.cardNumber.replace(/\s/g, ''))) {
        setError("Please enter a valid 16-digit card number")
        return
      }
      if (!/^(0[1-9]|1[0-2])\/([0-9]{2})$/.test(formData.expiryDate)) {
        setError("Please enter a valid expiry date (MM/YY)")
        return
      }
      if (!/^\d{3}$/.test(formData.cvv)) {
        setError("Please enter a valid 3-digit CVV")
        return
      }
      if (!formData.cardName.trim()) {
        setError("Please enter the cardholder's name")
        return
      }
    }

    try {
      setIsLoading(true)

      // Format products for the order
      const products = cartItems.map((item) => ({
        product: item.product._id,
        quantity: item.quantity,
        price: calculateDiscountedPrice(item.product.price, item.product.discount),
        merchant: item.product.merchant
      }))

      // Create shipping address string
      const shippingAddress = {
        street: formData.address,
        city: formData.city,
        state: formData.state,
        postalCode: formData.pincode,
        country: 'India'
      }

      // Create order with demo payment
      const res = await axios.post("/api/user/checkout", {
        products,
        totalAmount,
        shippingAddress,
        paymentDetails: {
          method: formData.paymentMethod,
          status: "completed",
          // Only send last 4 digits for demo purposes
          lastFourDigits: formData.paymentMethod === "demo_card" ? formData.cardNumber.slice(-4) : null
        }
      })

      // Clear cart
      localStorage.removeItem("cart")

      // Navigate to order confirmation
      navigate("/order-confirmation", { 
        state: { 
          orderId: res.data._id,
          orderDetails: res.data
        }
      })
    } catch (err) {
      setError(err.response?.data?.message || "Checkout failed. Please try again.")
      setIsLoading(false)
    }
  }

  // Format card number with spaces
  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '')
    const matches = v.match(/\d{4,16}/g)
    const match = (matches && matches[0]) || ''
    const parts = []

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4))
    }

    if (parts.length) {
      return parts.join(' ')
    } else {
      return value
    }
  }

  // Format expiry date
  const formatExpiryDate = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '')
    if (v.length >= 2) {
      return `${v.substring(0, 2)}/${v.substring(2, 4)}`
    }
    return v
  }

  // Handle card number input
  const handleCardNumberChange = (e) => {
    const formattedValue = formatCardNumber(e.target.value)
    setFormData({ ...formData, cardNumber: formattedValue })
  }

  // Handle expiry date input
  const handleExpiryDateChange = (e) => {
    const formattedValue = formatExpiryDate(e.target.value)
    setFormData({ ...formData, expiryDate: formattedValue })
  }

  return (
    <Container>
      <Row className="mb-4">
        <Col>
          <h2>Checkout</h2>
          <p className="text-muted">Complete your order</p>
        </Col>
      </Row>

      {error && (
        <Row className="mb-4">
          <Col>
            <Alert variant="danger">{error}</Alert>
          </Col>
        </Row>
      )}

      <Row>
        <Col lg={8} className="mb-4">
          <Form onSubmit={onSubmit}>
            <Card className="shadow-sm mb-4">
              <Card.Header className="bg-white">
                <h5 className="mb-0">Shipping Information</h5>
              </Card.Header>
              <Card.Body>
                <Row>
                  <Col md={12} className="mb-3">
                    <Form.Group>
                      <Form.Label>Full Name</Form.Label>
                      <Form.Control
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={onChange}
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col md={12} className="mb-3">
                    <Form.Group>
                      <Form.Label>Address</Form.Label>
                      <Form.Control 
                        type="text" 
                        name="address" 
                        value={formData.address} 
                        onChange={onChange} 
                        required 
                      />
                    </Form.Group>
                  </Col>
                  <Col md={4} className="mb-3">
                    <Form.Group>
                      <Form.Label>City</Form.Label>
                      <Form.Control 
                        type="text" 
                        name="city" 
                        value={formData.city} 
                        onChange={onChange} 
                        required 
                      />
                    </Form.Group>
                  </Col>
                  <Col md={4} className="mb-3">
                    <Form.Group>
                      <Form.Label>State</Form.Label>
                      <Form.Control 
                        type="text" 
                        name="state" 
                        value={formData.state} 
                        onChange={onChange} 
                        required 
                      />
                    </Form.Group>
                  </Col>
                  <Col md={4} className="mb-3">
                    <Form.Group>
                      <Form.Label>Pincode</Form.Label>
                      <Form.Control 
                        type="text" 
                        name="pincode" 
                        value={formData.pincode} 
                        onChange={onChange} 
                        required 
                      />
                    </Form.Group>
                  </Col>
                </Row>
              </Card.Body>
            </Card>

            <Card className="shadow-sm mb-4">
              <Card.Header className="bg-white">
                <h5 className="mb-0">
                  <FaCreditCard className="me-2" />
                  Payment Method (Demo)
                </h5>
              </Card.Header>
              <Card.Body>
                <div className="mb-3 d-flex align-items-center">
                  <FaLock className="text-success me-2" />
                  <small className="text-muted">This is a demo payment - no real payment will be processed</small>
                </div>

                <Form.Group className="mb-4">
                  <Form.Check
                    type="radio"
                    id="demo_card"
                    name="paymentMethod"
                    value="demo_card"
                    label="Credit/Debit Card"
                    checked={formData.paymentMethod === "demo_card"}
                    onChange={onChange}
                    className="mb-2"
                  />
                  <Form.Check
                    type="radio"
                    id="demo_cod"
                    name="paymentMethod"
                    value="demo_cod"
                    label="Cash on Delivery"
                    checked={formData.paymentMethod === "demo_cod"}
                    onChange={onChange}
                  />
                </Form.Group>

                {formData.paymentMethod === "demo_card" && (
                  <div className="card-payment-form">
                    <Row>
                      <Col md={12} className="mb-3">
                        <Form.Group>
                          <Form.Label>Card Number</Form.Label>
                          <Form.Control
                            type="text"
                            name="cardNumber"
                            value={formData.cardNumber}
                            onChange={handleCardNumberChange}
                            placeholder="1234 5678 9012 3456"
                            maxLength="19"
                            required
                          />
                        </Form.Group>
                      </Col>
                      <Col md={12} className="mb-3">
                        <Form.Group>
                          <Form.Label>Cardholder Name</Form.Label>
                          <Form.Control
                            type="text"
                            name="cardName"
                            value={formData.cardName}
                            onChange={onChange}
                            placeholder="John Doe"
                            required
                          />
                        </Form.Group>
                      </Col>
                      <Col md={6} className="mb-3">
                        <Form.Group>
                          <Form.Label>Expiry Date</Form.Label>
                          <Form.Control
                            type="text"
                            name="expiryDate"
                            value={formData.expiryDate}
                            onChange={handleExpiryDateChange}
                            placeholder="MM/YY"
                            maxLength="5"
                            required
                          />
                        </Form.Group>
                      </Col>
                      <Col md={6} className="mb-3">
                        <Form.Group>
                          <Form.Label>CVV</Form.Label>
                          <Form.Control
                            type="text"
                            name="cvv"
                            value={formData.cvv}
                            onChange={onChange}
                            placeholder="123"
                            maxLength="3"
                            required
                          />
                        </Form.Group>
                      </Col>
                    </Row>
                  </div>
                )}
              </Card.Body>
            </Card>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-100"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <FaSpinner className="me-2 spinner" /> Processing...
                </>
              ) : (
                `Complete Order (₹${totalAmount.toFixed(2)})`
              )}
            </Button>
          </Form>
        </Col>

        <Col lg={4}>
          <Card className="shadow-sm">
            <Card.Header className="bg-white">
              <h5 className="mb-0">Order Summary</h5>
            </Card.Header>
            <Card.Body>
              {cartItems.map((item) => (
                <div key={item.product._id} className="d-flex justify-content-between mb-2">
                  <div>
                    <h6 className="mb-0">{item.product.name}</h6>
                    <small className="text-muted">Quantity: {item.quantity}</small>
                  </div>
                  <div>
                    ₹{(calculateDiscountedPrice(item.product.price, item.product.discount) * item.quantity).toFixed(2)}
                  </div>
                </div>
              ))}
              <hr />
              <div className="d-flex justify-content-between">
                <strong>Total (including 18% tax):</strong>
                <strong>₹{totalAmount.toFixed(2)}</strong>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  )
}

export default Checkout
