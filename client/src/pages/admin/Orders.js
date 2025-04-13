"use client"

import { useState, useEffect, useCallback } from "react"
import { Container, Row, Col, Card, Table, Button, Form, Modal, Badge, Pagination, InputGroup, Spinner } from "react-bootstrap"
import axios from "axios"
import { FaClipboardList, FaSearch, FaEye, FaFilter } from "react-icons/fa"

const AdminOrders = () => {
  const [orders, setOrders] = useState([])
  const [filteredOrders, setFilteredOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [showViewModal, setShowViewModal] = useState(false)
  const [showUpdateModal, setShowUpdateModal] = useState(false)
  const [currentOrder, setCurrentOrder] = useState(null)
  const [status, setStatus] = useState("")
  const [filters, setFilters] = useState({
    search: "",
    status: "",
    dateFrom: "",
    dateTo: "",
  })

  const ordersPerPage = 10

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const res = await axios.get(`/api/admin/orders?page=${currentPage}&limit=${ordersPerPage}`)
      setOrders(res.data.orders)
      setFilteredOrders(res.data.orders)
      setTotalPages(res.data.pagination.pages)
    } catch (error) {
      console.error("Error fetching orders:", error)
      setError("Failed to fetch orders. Please try again later.")
    } finally {
      setLoading(false)
    }
  }, [currentPage])

  useEffect(() => {
    fetchOrders()
  }, [fetchOrders])

  // Apply filters
  useEffect(() => {
    if (!orders || !Array.isArray(orders)) {
      setFilteredOrders([])
      return
    }

    let result = [...orders]

    if (filters.search) {
      const searchTerm = filters.search.toLowerCase()
      result = result.filter(
        (order) =>
          (order._id || "").toLowerCase().includes(searchTerm) ||
          (order.user?.fullName || "").toLowerCase().includes(searchTerm) ||
          (order.user?.email || "").toLowerCase().includes(searchTerm),
      )
    }

    if (filters.status) {
      result = result.filter((order) => order.status === filters.status)
    }

    if (filters.dateFrom) {
      const fromDate = new Date(filters.dateFrom)
      result = result.filter((order) => new Date(order.createdAt || "") >= fromDate)
    }

    if (filters.dateTo) {
      const toDate = new Date(filters.dateTo)
      toDate.setHours(23, 59, 59, 999) // End of the day
      result = result.filter((order) => new Date(order.createdAt || "") <= toDate)
    }

    setFilteredOrders(result)
  }, [filters, orders])

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value,
    })
  }

  const resetFilters = () => {
    setFilters({
      search: "",
      status: "",
      dateFrom: "",
      dateTo: "",
    })
  }

  const viewOrder = (order) => {
    setCurrentOrder(order)
    setShowViewModal(true)
  }

  const openUpdateModal = (order) => {
    setCurrentOrder(order)
    setStatus(order.status)
    setShowUpdateModal(true)
  }

  const updateOrderStatus = async () => {
    try {
      await axios.put(`/api/admin/orders/${currentOrder._id}`, {
        status: status
      })
      setShowUpdateModal(false)
      fetchOrders()
    } catch (error) {
      console.error("Error updating order status:", error)
      alert("Failed to update order status. Please try again.")
    }
  }

  // Get status badge color
  const getStatusBadgeColor = (status) => {
    switch (status?.toLowerCase()) {
      case "processing":
        return "primary"
      case "completed":
        return "success"
      case "cancelled":
        return "danger"
      case "pending":
        return "warning"
      default:
        return "secondary"
    }
  }

  const renderPagination = () => {
    if (totalPages <= 1) return null

    const items = []
    for (let number = 1; number <= totalPages; number++) {
      items.push(
        <Pagination.Item key={number} active={number === currentPage} onClick={() => setCurrentPage(number)}>
          {number}
        </Pagination.Item>,
      )
    }

    return (
      <Pagination className="justify-content-center mt-4">
        <Pagination.Prev onClick={() => setCurrentPage(Math.max(1, currentPage - 1))} disabled={currentPage === 1} />
        {items}
        <Pagination.Next
          onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
        />
      </Pagination>
    )
  }

  if (loading) {
    return (
      <Container className="mt-5">
        <Row className="justify-content-center">
          <Col md={6} className="text-center">
            <Spinner animation="border" role="status">
              <span className="visually-hidden">Loading...</span>
            </Spinner>
            <p className="mt-2">Loading orders...</p>
          </Col>
        </Row>
      </Container>
    )
  }

  if (error) {
    return (
      <Container className="mt-5">
        <Row className="justify-content-center">
          <Col md={6} className="text-center">
            <div className="alert alert-danger">{error}</div>
            <Button variant="primary" onClick={fetchOrders}>
              Retry
            </Button>
          </Col>
        </Row>
      </Container>
    )
  }

  return (
    <Container>
      <Row className="mb-4">
        <Col>
          <h2>
            <FaClipboardList className="me-2" />
            Order Management
          </h2>
          <p className="text-muted">View and manage customer orders</p>
        </Col>
      </Row>

      {/* Filters */}
      <Row className="mb-4">
        <Col>
          <Card className="shadow-sm">
            <Card.Body>
              <h5 className="mb-3">
                <FaFilter className="me-2" />
                Filter Orders
              </h5>
              <Row>
                <Col md={3} className="mb-3">
                  <Form.Group>
                    <Form.Label>Search</Form.Label>
                    <InputGroup>
                      <Form.Control
                        type="text"
                        name="search"
                        value={filters.search}
                        onChange={handleFilterChange}
                        placeholder="Order ID or Customer"
                      />
                      <InputGroup.Text>
                        <FaSearch />
                      </InputGroup.Text>
                    </InputGroup>
                  </Form.Group>
                </Col>
                <Col md={3} className="mb-3">
                  <Form.Group>
                    <Form.Label>Status</Form.Label>
                    <Form.Select name="status" value={filters.status} onChange={handleFilterChange}>
                      <option value="">All Status</option>
                      <option value="pending">Pending</option>
                      <option value="processing">Processing</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={3} className="mb-3">
                  <Form.Group>
                    <Form.Label>From Date</Form.Label>
                    <Form.Control type="date" name="dateFrom" value={filters.dateFrom} onChange={handleFilterChange} />
                  </Form.Group>
                </Col>
                <Col md={3} className="mb-3">
                  <Form.Group>
                    <Form.Label>To Date</Form.Label>
                    <Form.Control type="date" name="dateTo" value={filters.dateTo} onChange={handleFilterChange} />
                  </Form.Group>
                </Col>
              </Row>
              <div className="text-end">
                <Button variant="outline-secondary" onClick={resetFilters}>
                  Reset Filters
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Orders Table */}
      <Row>
        <Col>
          <Card className="shadow-sm">
            <Card.Body>
              <Table striped bordered hover responsive>
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Customer</th>
                    <th>Date</th>
                    <th>Total</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders && filteredOrders.length > 0 ? (
                    filteredOrders.map((order) => (
                      <tr key={order._id}>
                        <td>{order._id}</td>
                        <td>
                          {order.user?.fullName || "N/A"}
                          <br />
                          <small className="text-muted">{order.user?.email || "N/A"}</small>
                        </td>
                        <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                        <td>₹{order.totalAmount?.toFixed(2) || "0.00"}</td>
                        <td>
                          <Badge bg={getStatusBadgeColor(order.status)}>
                            {order.status || "N/A"}
                          </Badge>
                        </td>
                        <td>
                          <Button
                            variant="outline-primary"
                            size="sm"
                            className="me-2"
                            onClick={() => viewOrder(order)}
                          >
                            <FaEye />
                          </Button>
                          <Button
                            variant="outline-success"
                            size="sm"
                            onClick={() => openUpdateModal(order)}
                          >
                            Update Status
                          </Button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="text-center">
                        No orders found
                      </td>
                    </tr>
                  )}
                </tbody>
              </Table>

              {renderPagination()}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* View Order Modal */}
      <Modal show={showViewModal} onHide={() => setShowViewModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Order Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {currentOrder && (
            <>
              <Row className="mb-4">
                <Col md={6}>
                  <h6>Order Information</h6>
                  <p className="mb-1">
                    <strong>Order ID:</strong> {currentOrder._id}
                  </p>
                  <p className="mb-1">
                    <strong>Date:</strong> {new Date(currentOrder.createdAt).toLocaleString()}
                  </p>
                  <p className="mb-1">
                    <strong>Status:</strong>{" "}
                    <Badge bg={getStatusBadgeColor(currentOrder.status)}>{currentOrder.status}</Badge>
                  </p>
                  <p className="mb-1">
                    <strong>Total Amount:</strong> ₹{currentOrder.totalAmount.toFixed(2)}
                  </p>
                </Col>
                <Col md={6}>
                  <h6>Customer Information</h6>
                  <p className="mb-1">
                    <strong>Name:</strong> {currentOrder.user?.fullName || "N/A"}
                  </p>
                  <p className="mb-1">
                    <strong>Email:</strong> {currentOrder.user?.email || "N/A"}
                  </p>
                  <p className="mb-1">
                    <strong>Shipping Address:</strong> {currentOrder.shippingAddress}
                  </p>
                </Col>
              </Row>

              <h6>Order Items</h6>
              <Table responsive className="align-middle">
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Price</th>
                    <th>Quantity</th>
                    <th>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {currentOrder.products?.map((item) => (
                    <tr key={item._id}>
                      <td>
                        <div className="d-flex align-items-center">
                          <img
                            src={item.product?.imageUrl || "/placeholder.svg"}
                            alt={item.product?.name || "Product"}
                            style={{ width: "40px", height: "40px", objectFit: "cover" }}
                            className="me-2 rounded"
                          />
                          <div>
                            <div className="fw-bold">{item.product?.name || "N/A"}</div>
                            <small className="text-muted">{item.product?.category || "N/A"}</small>
                          </div>
                        </div>
                      </td>
                      <td>₹{(item.price || 0).toFixed(2)}</td>
                      <td>{item.quantity || 0}</td>
                      <td>₹{((item.price || 0) * (item.quantity || 0)).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr>
                    <td colSpan="3" className="text-end fw-bold">
                      Total:
                    </td>
                    <td className="fw-bold">₹{currentOrder.totalAmount.toFixed(2)}</td>
                  </tr>
                </tfoot>
              </Table>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowViewModal(false)}>
            Close
          </Button>
          <Button
            variant="primary"
            onClick={() => {
              setShowViewModal(false)
              openUpdateModal(currentOrder)
            }}
          >
            Update Status
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Update Status Modal */}
      <Modal show={showUpdateModal} onHide={() => setShowUpdateModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Update Order Status</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {currentOrder && (
            <Form>
              <Form.Group>
                <Form.Label>Order ID</Form.Label>
                <Form.Control type="text" value={currentOrder._id} readOnly />
              </Form.Group>
              <Form.Group className="mt-3">
                <Form.Label>Current Status</Form.Label>
                <div>
                  <Badge bg={getStatusBadgeColor(currentOrder.status)}>{currentOrder.status}</Badge>
                </div>
              </Form.Group>
              <Form.Group className="mt-3">
                <Form.Label>New Status</Form.Label>
                <Form.Select value={status} onChange={(e) => setStatus(e.target.value)}>
                  <option value="pending">Pending</option>
                  <option value="processing">Processing</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </Form.Select>
              </Form.Group>
            </Form>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowUpdateModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={updateOrderStatus}>
            Update Status
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  )
}

export default AdminOrders
