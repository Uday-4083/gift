"use client"

import { useEffect, useState } from "react"
import { Container, Row, Col, Card, Alert } from "react-bootstrap"
import { useLocation, Link } from "react-router-dom"
import { FaCheckCircle, FaBox, FaTruck } from "react-icons/fa"

const OrderConfirmation = () => {
  const [order, setOrder] = useState(null)
  const location = useLocation()

  useEffect(() => {
    if (location.state?.orderDetails) {
      setOrder(location.state.orderDetails)
    }
  }, [location])

  if (!order) {
    return (
      <Container>
        <Row className="justify-content-center mt-5">
          <Col md={8}>
            <Alert variant="danger">
              Order details not found. Please check your orders page.
              <div className="mt-3">
                <Link to="/orders" className="btn btn-primary">
                  View Orders
                </Link>
              </div>
            </Alert>
          </Col>
        </Row>
      </Container>
    )
  }

  return (
    <Container>
      <Row className="justify-content-center mt-4">
        <Col md={8}>
          <Card className="shadow-sm">
            <Card.Body className="text-center p-5">
              <FaCheckCircle className="text-success mb-4" size={60} />
              <h2>Thank You for Your Order!</h2>
              <p className="text-muted mb-4">
                Your order has been successfully placed and will be processed soon.
              </p>
              
              <div className="border rounded p-3 mb-4">
                <h5>Order Details</h5>
                <p className="mb-1">Order ID: {order._id}</p>
                <p className="mb-1">Total Amount: ₹{order.totalAmount.toFixed(2)}</p>
                <p className="mb-1">Payment Method: {order.paymentMethod === 'demo_cod' ? 'Cash on Delivery' : 'Credit Card'}</p>
                <p className="mb-0">Shipping Address: {
                  order.shippingAddress ? 
                  `${order.shippingAddress.street}, ${order.shippingAddress.city}, ${order.shippingAddress.state}, ${order.shippingAddress.postalCode}, ${order.shippingAddress.country}` :
                  'Address not available'
                }</p>
              </div>

              <div className="border rounded p-3 mb-4">
                <h5>Order Status</h5>
                <div className="d-flex justify-content-between align-items-center mt-3">
                  <div className="text-center">
                    <FaCheckCircle className="text-success mb-2" size={24} />
                    <p className="mb-0 small">Order Placed</p>
                  </div>
                  <div className="flex-grow-1 mx-3">
                    <div className="progress" style={{ height: "2px" }}>
                      <div className="progress-bar bg-success" style={{ width: "100%" }}></div>
                    </div>
                  </div>
                  <div className="text-center">
                    <FaBox className={`mb-2 ${order.status === "processing" ? "text-success" : "text-muted"}`} size={24} />
                    <p className="mb-0 small">Processing</p>
                  </div>
                  <div className="flex-grow-1 mx-3">
                    <div className="progress" style={{ height: "2px" }}>
                      <div 
                        className="progress-bar bg-success" 
                        style={{ width: order.status === "shipped" ? "100%" : "0%" }}
                      ></div>
                    </div>
                  </div>
                  <div className="text-center">
                    <FaTruck className={`mb-2 ${order.status === "shipped" ? "text-success" : "text-muted"}`} size={24} />
                    <p className="mb-0 small">Shipped</p>
                  </div>
                </div>
              </div>

              <div className="d-flex justify-content-center gap-3">
                <Link to="/orders" className="btn btn-primary">
                  View Orders
                </Link>
                <Link to="/catalog" className="btn btn-outline-primary">
                  Continue Shopping
                </Link>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  )
}

export default OrderConfirmation
