"use client"

import { useState, useEffect } from "react"
import { Container, Row, Col, Card, Button, Table, Form } from "react-bootstrap"
import { Link, useNavigate } from "react-router-dom"
import { FaShoppingCart, FaTrash, FaArrowLeft, FaArrowRight } from "react-icons/fa"
import { toast } from "react-hot-toast"

const Cart = () => {
  const [cartItems, setCartItems] = useState([])
  const [totalAmount, setTotalAmount] = useState(0)
  const navigate = useNavigate()

  useEffect(() => {
    // Load cart from localStorage
    const savedCart = localStorage.getItem("cart")
    if (savedCart) {
      setCartItems(JSON.parse(savedCart))
    }
  }, [])

  // Calculate total amount whenever cart items change
  useEffect(() => {
    const total = cartItems.reduce((sum, item) => {
      const basePrice = item.product.price || item.product.basePrice
      const discount = item.product.discount || 0
      const finalPrice = basePrice - (basePrice * discount / 100)
      return sum + finalPrice * item.quantity
    }, 0)

    setTotalAmount(total)
  }, [cartItems])

  // Calculate final price
  const calculateFinalPrice = (price, discount = 0) => {
    return price - (price * discount / 100)
  }

  // Update quantity
  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity < 1) return

    const updatedCart = cartItems.map((item) => {
      if (item.product._id === productId) {
        // Find the product to check stock
        const product = item.product
        if (newQuantity > product.stock) {
          toast.error(`Cannot add more ${product.name}. Maximum stock (${product.stock}) reached!`)
          return item
        }
        return { ...item, quantity: newQuantity }
      }
      return item
    })

    setCartItems(updatedCart)
    localStorage.setItem("cart", JSON.stringify(updatedCart))
  }

  // Remove item from cart
  const removeItem = (productId) => {
    const updatedCart = cartItems.filter((item) => item.product._id !== productId)
    setCartItems(updatedCart)
  }

  // Proceed to checkout
  const proceedToCheckout = () => {
    if (cartItems.length === 0) {
      alert("Your cart is empty!")
      return
    }

    navigate("/checkout")
  }

  return (
    <Container>
      <Row className="mb-4">
        <Col>
          <h2>
            <FaShoppingCart className="me-2" />
            Shopping Cart
          </h2>
          <p className="text-muted">Review your items before checkout</p>
        </Col>
      </Row>

      <Row>
        <Col lg={8} className="mb-4">
          <Card className="shadow-sm">
            <Card.Body>
              {cartItems.length > 0 ? (
                <Table responsive className="align-middle">
                  <thead>
                    <tr>
                      <th>Product</th>
                      <th>Price</th>
                      <th>Quantity</th>
                      <th>Total</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {cartItems.map((item) => {
                      const basePrice = item.product.price || item.product.basePrice
                      const discount = item.product.discount || 0
                      const finalPrice = calculateFinalPrice(basePrice, discount)

                      return (
                        <tr key={item.product._id}>
                          <td>
                            <div className="d-flex align-items-center">
                              <img
                                src={item.product.image || "/placeholder.svg"}
                                alt={item.product.name}
                                style={{ width: "50px", height: "50px", objectFit: "cover" }}
                                className="me-3"
                              />
                              <div>
                                <h6 className="mb-0">{item.product.name}</h6>
                                <small className="text-muted">{item.product.category}</small>
                                {item.product.stock < 5 && (
                                  <small className="text-danger d-block">
                                    Only {item.product.stock} left in stock!
                                  </small>
                                )}
                              </div>
                            </div>
                          </td>
                          <td>
                            {discount > 0 ? (
                              <>
                                <span className="text-decoration-line-through text-muted me-2">
                                  ₹{basePrice}
                                </span>
                                <span>₹{finalPrice}</span>
                              </>
                            ) : (
                              <span>₹{basePrice}</span>
                            )}
                          </td>
                          <td>
                            <div className="d-flex align-items-center">
                              <Button
                                variant="outline-secondary"
                                size="sm"
                                onClick={() => updateQuantity(item.product._id, item.quantity - 1)}
                              >
                                -
                              </Button>
                              <Form.Control
                                type="number"
                                value={item.quantity}
                                onChange={(e) => updateQuantity(item.product._id, Number.parseInt(e.target.value))}
                                min="1"
                                max={item.product.stock}
                                className="mx-2 text-center"
                                style={{ width: "60px" }}
                              />
                              <Button
                                variant="outline-secondary"
                                size="sm"
                                onClick={() => updateQuantity(item.product._id, item.quantity + 1)}
                              >
                                +
                              </Button>
                            </div>
                          </td>
                          <td>
                            <span className="fw-bold">₹{(finalPrice * item.quantity).toFixed(2)}</span>
                          </td>
                          <td>
                            <Button variant="outline-danger" size="sm" onClick={() => removeItem(item.product._id)}>
                              <FaTrash />
                            </Button>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </Table>
              ) : (
                <div className="text-center py-5">
                  <FaShoppingCart className="text-muted mb-3" size={40} />
                  <h4>Your cart is empty</h4>
                  <p className="text-muted">Add some products to your cart to proceed</p>
                  <Link to="/catalog">
                    <Button variant="primary">Browse Products</Button>
                  </Link>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>

        <Col lg={4}>
          <Card className="shadow-sm">
            <Card.Header className="bg-white">
              <h5 className="mb-0">Order Summary</h5>
            </Card.Header>
            <Card.Body>
              <div className="d-flex justify-content-between mb-2">
                <span>Subtotal:</span>
                <span>₹{totalAmount.toFixed(2)}</span>
              </div>
              <div className="d-flex justify-content-between mb-2">
                <span>Shipping:</span>
                <span>Free</span>
              </div>
              <div className="d-flex justify-content-between mb-2">
                <span>Tax:</span>
                <span>₹{(totalAmount * 0.18).toFixed(2)}</span>
              </div>
              <hr />
              <div className="d-flex justify-content-between mb-3">
                <span className="fw-bold">Total:</span>
                <span className="fw-bold">₹{(totalAmount + totalAmount * 0.18).toFixed(2)}</span>
              </div>
              <Button
                variant="primary"
                className="w-100 mb-3"
                onClick={proceedToCheckout}
                disabled={cartItems.length === 0}
              >
                Proceed to Checkout
                <FaArrowRight className="ms-2" />
              </Button>
              <Link to="/catalog">
                <Button variant="outline-secondary" className="w-100">
                  <FaArrowLeft className="me-2" />
                  Continue Shopping
                </Button>
              </Link>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  )
}

export default Cart
