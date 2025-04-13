"use client"

import { useState, useEffect, useCallback } from "react"
import { Container, Row, Col, Card, Table, Button, Spinner } from "react-bootstrap"
import { Link } from "react-router-dom"
import axios from "axios"
import styled from "styled-components"
import { adminTheme as theme } from "../../styles/theme"
import { FaUsers, FaShoppingBag, FaClipboardList, FaUserTag, FaChartLine, FaEye, FaRobot, FaSync } from "react-icons/fa"

const StyledDashboard = styled.div`
  padding: 2rem 0;

  h2 {
    font-family: ${theme.fonts.primary};
    color: ${theme.colors.text};
  }

  p.text-muted {
    font-family: ${theme.fonts.secondary};
  }

  .card {
    border: none;
    border-radius: ${theme.borderRadius.medium};
    box-shadow: ${theme.shadows.medium};
    transition: ${theme.transitions.default};

    &:hover {
      transform: translateY(-2px);
      box-shadow: ${theme.shadows.large};
    }
  }

  .stats-icon {
    width: 48px;
    height: 48px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
  }

  .table {
    font-family: ${theme.fonts.secondary};
    
    th {
      font-weight: 600;
      color: ${theme.colors.text};
      border-bottom-width: 1px;
    }

    td {
      vertical-align: middle;
      color: ${theme.colors.lightText};
    }
  }

  .btn-outline-primary {
    border-color: ${theme.colors.primary};
    color: ${theme.colors.primary};
    
    &:hover {
      background-color: ${theme.colors.primary};
      color: white;
    }
  }

  .badge {
    font-family: ${theme.fonts.secondary};
    font-weight: 500;
    padding: 0.5em 0.8em;
  }

  .refresh-button {
    font-family: ${theme.fonts.secondary};
    
    .spinner-border {
      width: 1rem;
      height: 1rem;
      border-width: 0.15em;
    }
  }
`

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalProducts: 0,
    totalOrders: 0,
    totalMerchants: 0,
    pendingApprovals: 0,
  })
  const [recentOrders, setRecentOrders] = useState([])
  const [aiSuggestions, setAiSuggestions] = useState([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  const fetchDashboardData = useCallback(async (isManualRefresh = false) => {
    try {
      if (isManualRefresh) {
        setRefreshing(true)
      }

      // Fetch dashboard stats
      const statsRes = await axios.get("/api/admin/dashboard/stats")
      setStats(statsRes.data)

      // Fetch recent orders
      const ordersRes = await axios.get("/api/admin/orders?limit=5")
      setRecentOrders(ordersRes.data)

      // Fetch AI suggestions not in catalog
      const suggestionsRes = await axios.get("/api/admin/suggestions/pending")
      setAiSuggestions(suggestionsRes.data)

      setLoading(false)
      if (isManualRefresh) {
        setRefreshing(false)
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error)
      setLoading(false)
      if (isManualRefresh) {
        setRefreshing(false)
      }
    }
  }, [])

  useEffect(() => {
    fetchDashboardData()

    // Set up auto-refresh interval (every 30 seconds)
    const intervalId = setInterval(() => {
      fetchDashboardData()
    }, 30000)

    // Cleanup interval on component unmount
    return () => clearInterval(intervalId)
  }, [fetchDashboardData])

  // Get status badge color
  const getStatusBadgeColor = (status) => {
    switch (status) {
      case "Processing":
        return "primary"
      case "Shipped":
        return "info"
      case "Delivered":
        return "success"
      case "Cancelled":
        return "danger"
      default:
        return "secondary"
    }
  }

  const handleManualRefresh = () => {
    fetchDashboardData(true)
  }

  if (loading) {
    return (
      <Container className="text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-3">Loading dashboard data...</p>
      </Container>
    )
  }

  return (
    <StyledDashboard>
      <Container>
        <Row className="mb-4">
          <Col className="d-flex justify-content-between align-items-center">
            <div>
              <h2>
                <FaChartLine className="me-2" />
                Admin Dashboard
              </h2>
              <p className="text-muted">Overview of your platform</p>
            </div>
            <Button 
              variant="outline-primary" 
              onClick={handleManualRefresh}
              disabled={refreshing}
              className="refresh-button"
            >
              {refreshing ? (
                <>
                  <Spinner
                    as="span"
                    animation="border"
                    size="sm"
                    role="status"
                    aria-hidden="true"
                    className="me-2"
                  />
                  Refreshing...
                </>
              ) : (
                <>
                  <FaSync className="me-2" />
                  Refresh Data
                </>
              )}
            </Button>
          </Col>
        </Row>

        {/* Stats Cards */}
        <Row className="mb-5">
          <Col md={3} className="mb-3 mb-md-0">
            <Card className="h-100">
              <Card.Body className="d-flex align-items-center">
                <div className="stats-icon bg-primary text-white me-3">
                  <FaUsers size={24} />
                </div>
                <div>
                  <h6 className="text-muted mb-1">Total Users</h6>
                  <h3>{stats.totalUsers}</h3>
                </div>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3} className="mb-3 mb-md-0">
            <Card className="h-100">
              <Card.Body className="d-flex align-items-center">
                <div className="stats-icon bg-success text-white me-3">
                  <FaShoppingBag size={24} />
                </div>
                <div>
                  <h6 className="text-muted mb-1">Total Products</h6>
                  <h3>{stats.totalProducts}</h3>
                </div>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3} className="mb-3 mb-md-0">
            <Card className="h-100">
              <Card.Body className="d-flex align-items-center">
                <div className="stats-icon bg-info text-white me-3">
                  <FaClipboardList size={24} />
                </div>
                <div>
                  <h6 className="text-muted mb-1">Total Orders</h6>
                  <h3>{stats.totalOrders}</h3>
                </div>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="h-100">
              <Card.Body className="d-flex align-items-center">
                <div className="stats-icon bg-warning text-white me-3">
                  <FaUserTag size={24} />
                </div>
                <div>
                  <h6 className="text-muted mb-1">Merchants</h6>
                  <h3>{stats.totalMerchants}</h3>
                  {stats.pendingApprovals > 0 && (
                    <small className="text-danger d-block">
                      {stats.pendingApprovals} pending
                    </small>
                  )}
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Recent Orders */}
        <Row className="mb-5">
          <Col>
            <Card>
              <Card.Header className="bg-white d-flex justify-content-between align-items-center py-3">
                <h5 className="mb-0">Recent Orders</h5>
                <Link to="/admin/orders">
                  <Button variant="outline-primary" size="sm">
                    View All
                  </Button>
                </Link>
              </Card.Header>
              <Card.Body>
                {recentOrders.length > 0 ? (
                  <Table responsive hover className="align-middle mb-0">
                    <thead>
                      <tr>
                        <th>Order ID</th>
                        <th>Customer</th>
                        <th>Date</th>
                        <th>Amount</th>
                        <th>Status</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentOrders.map((order) => (
                        <tr key={order._id}>
                          <td>
                            <small className="text-muted">
                              #{order._id.substring(order._id.length - 8)}
                            </small>
                          </td>
                          <td>{order.user.fullName}</td>
                          <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                          <td>₹{order.totalAmount.toFixed(2)}</td>
                          <td>
                            <span className={`badge bg-${getStatusBadgeColor(order.deliveryStatus)}`}>
                              {order.deliveryStatus}
                            </span>
                          </td>
                          <td>
                            <Link to={`/admin/orders/${order._id}`}>
                              <Button variant="outline-primary" size="sm">
                                <FaEye />
                              </Button>
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                ) : (
                  <p className="text-center py-3 text-muted">No recent orders</p>
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* AI Suggestions */}
        <Row>
          <Col>
            <Card>
              <Card.Header className="bg-white d-flex justify-content-between align-items-center py-3">
                <h5 className="mb-0">
                  <FaRobot className="me-2" />
                  AI Suggestions Not in Catalog
                </h5>
                <Link to="/admin/products">
                  <Button variant="outline-primary" size="sm">
                    Manage Products
                  </Button>
                </Link>
              </Card.Header>
              <Card.Body>
                {aiSuggestions.length > 0 ? (
                  <Table responsive hover className="align-middle mb-0">
                    <thead>
                      <tr>
                        <th>Product Name</th>
                        <th>Category</th>
                        <th>Price (₹)</th>
                        <th>Suggested For</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {aiSuggestions.map((suggestion) => (
                        <tr key={suggestion._id}>
                          <td>{suggestion.productName}</td>
                          <td>{suggestion.category}</td>
                          <td>₹{suggestion.price}</td>
                          <td>
                            {suggestion.occasion} ({suggestion.gender}, {suggestion.age} years)
                          </td>
                          <td>
                            <Button variant="success" size="sm" className="me-2">
                              Approve
                            </Button>
                            <Button variant="outline-danger" size="sm">
                              Reject
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                ) : (
                  <p className="text-center py-3 text-muted">No pending AI suggestions</p>
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </StyledDashboard>
  )
}

export default AdminDashboard
