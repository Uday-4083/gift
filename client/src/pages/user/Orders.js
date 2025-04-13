"use client"

import { useState, useEffect } from "react"
import { Container, Row, Col, Card, Table, Badge, Button, Alert } from "react-bootstrap"
import { Link } from "react-router-dom"
import axios from "axios"
import { FaClipboardList, FaEye, FaSpinner } from "react-icons/fa"

const Orders = () => {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true)
        setError("")
        const res = await axios.get("/api/user/orders")
        setOrders(res.data)
      } catch (error) {
        console.error("Error fetching orders:", error)
        setError(error.response?.data?.message || "Failed to fetch orders. Please try again.")
      } finally {
        setLoading(false)
      }
    }

    fetchOrders()
  }, [])

  // Get status badge color
  const getStatusBadgeColor = (status) => {
    switch (status?.toLowerCase()) {
      case "processing":
        return "primary"
      case "shipped":
        return "info"
      case "delivered":
        return "success"
      case "cancelled":
        return "danger"
      default:
        return "secondary"
    }
  }

  if (loading) {
    return (
      <Container>
        <div className="text-center py-5">
          <FaSpinner className="spinner mb-3" size={40} />
          <p>Loading your orders...</p>
        </div>
      </Container>
    )
  }

  if (error) {
    return (
      <Container>
        <Alert variant="danger" className="mt-4">
          {error}
          <Button variant="outline-danger" className="ms-3" onClick={() => window.location.reload()}>
            Try Again
          </Button>
        </Alert>
      </Container>
    )
  }

  return (
    <Container>
      <Row className="mb-4">
        <Col>
          <h2>
            <FaClipboardList className="me-2" />
            My Orders
          </h2>
          <p className="text-muted">View and track your orders</p>
        </Col>
      </Row>

      <Row>
        <Col>
          <Card className="shadow-sm">
            <Card.Body>
              {orders.length > 0 ? (
                <Table responsive className="align-middle">
                  <thead>
                    <tr>
                      <th>Order ID</th>
                      <th>Date</th>
                      <th>Items</th>
                      <th>Total</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((order) => (
                      <tr key={order._id}>
                        <td>
                          <small className="text-muted">#{order._id.substring(order._id.length - 8)}</small>
                        </td>
                        <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                        <td>{order.products.length} items</td>
                        <td>₹{order.totalAmount.toFixed(2)}</td>
                        <td>
                          <Badge bg={getStatusBadgeColor(order.status)}>{order.status || "Processing"}</Badge>
                        </td>
                        <td>
                          <Link to={`/order-confirmation/${order._id}`} state={{ orderDetails: order }}>
                            <Button variant="outline-primary" size="sm">
                              <FaEye className="me-1" /> View
                            </Button>
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              ) : (
                <div className="text-center py-5">
                  <FaClipboardList className="text-muted mb-3" size={40} />
                  <h4>No orders yet</h4>
                  <p className="text-muted">You haven't placed any orders yet</p>
                  <Link to="/catalog">
                    <Button variant="primary">Browse Products</Button>
                  </Link>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  )
}

export default Orders
