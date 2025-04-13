"use client"

import { useContext, useEffect, useState } from "react"
import { Container, Row, Col, Card, Button } from "react-bootstrap"
import { Link } from "react-router-dom"
import { AuthContext } from "../../context/AuthContext"
import axios from "axios"
import { FaGift, FaShoppingCart, FaClipboardList, FaUser } from "react-icons/fa"

const Dashboard = () => {
  const { user } = useContext(AuthContext)
  const [stats, setStats] = useState({
    suggestions: 0,
    orders: 0,
  })
  const [recentSuggestions, setRecentSuggestions] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch user's suggestions
        const suggestionsRes = await axios.get("/api/user/suggestions")

        // Fetch user's orders
        const ordersRes = await axios.get("/api/user/orders")

        setStats({
          suggestions: suggestionsRes.data.length,
          orders: ordersRes.data.length,
        })

        // Get recent suggestions
        setRecentSuggestions(suggestionsRes.data.slice(0, 3))

        setLoading(false)
      } catch (error) {
        console.error("Error fetching dashboard data:", error)
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  return (
    <Container>
      <Row className="mb-4">
        <Col>
          <h2>Welcome, {user.fullName}!</h2>
          <p className="text-muted">Here's an overview of your activity</p>
        </Col>
      </Row>

      {/* Stats Cards */}
      <Row className="mb-5">
        <Col md={4} className="mb-3 mb-md-0">
          <Card className="h-100 shadow-sm">
            <Card.Body className="d-flex align-items-center">
              <div className="bg-primary text-white rounded-circle p-3 me-3">
                <FaGift size={24} />
              </div>
              <div>
                <h6 className="text-muted mb-1">Gift Recommendations</h6>
                <h3>{stats.suggestions}</h3>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4} className="mb-3 mb-md-0">
          <Card className="h-100 shadow-sm">
            <Card.Body className="d-flex align-items-center">
              <div className="bg-success text-white rounded-circle p-3 me-3">
                <FaShoppingCart size={24} />
              </div>
              <div>
                <h6 className="text-muted mb-1">Orders Placed</h6>
                <h3>{stats.orders}</h3>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="h-100 shadow-sm">
            <Card.Body className="d-flex align-items-center">
              <div className="bg-info text-white rounded-circle p-3 me-3">
                <FaUser size={24} />
              </div>
              <div>
                <h6 className="text-muted mb-1">Account Status</h6>
                <h3>Active</h3>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Quick Actions */}
      <Row className="mb-5">
        <Col>
          <h4 className="mb-3">Quick Actions</h4>
          <Row>
            <Col md={3} className="mb-3 mb-md-0">
              <Link to="/questionnaire" className="text-decoration-none">
                <Card className="h-100 shadow-sm text-center">
                  <Card.Body>
                    <FaGift className="text-primary mb-2" size={30} />
                    <h5>Get Gift Ideas</h5>
                    <p className="text-muted small">Find the perfect gift</p>
                  </Card.Body>
                </Card>
              </Link>
            </Col>
            <Col md={3} className="mb-3 mb-md-0">
              <Link to="/catalog" className="text-decoration-none">
                <Card className="h-100 shadow-sm text-center">
                  <Card.Body>
                    <FaShoppingCart className="text-primary mb-2" size={30} />
                    <h5>Browse Catalog</h5>
                    <p className="text-muted small">Explore our products</p>
                  </Card.Body>
                </Card>
              </Link>
            </Col>
            <Col md={3} className="mb-3 mb-md-0">
              <Link to="/orders" className="text-decoration-none">
                <Card className="h-100 shadow-sm text-center">
                  <Card.Body>
                    <FaClipboardList className="text-primary mb-2" size={30} />
                    <h5>View Orders</h5>
                    <p className="text-muted small">Track your purchases</p>
                  </Card.Body>
                </Card>
              </Link>
            </Col>
            <Col md={3}>
              <Link to="/profile" className="text-decoration-none">
                <Card className="h-100 shadow-sm text-center">
                  <Card.Body>
                    <FaUser className="text-primary mb-2" size={30} />
                    <h5>My Profile</h5>
                    <p className="text-muted small">Manage your account</p>
                  </Card.Body>
                </Card>
              </Link>
            </Col>
          </Row>
        </Col>
      </Row>

      {/* Recent Recommendations */}
      <Row>
        <Col>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h4>Recent Gift Recommendations</h4>
            <Link to="/questionnaire">
              <Button variant="outline-primary" size="sm">
                Get New Recommendations
              </Button>
            </Link>
          </div>

          {loading ? (
            <p>Loading recommendations...</p>
          ) : recentSuggestions.length > 0 ? (
            <Row>
              {recentSuggestions.map((suggestion) => (
                <Col md={4} key={suggestion._id} className="mb-3">
                  <Card className="h-100 shadow-sm">
                    <Card.Body>
                      <h5>For: {suggestion.relation}</h5>
                      <p className="text-muted">
                        Occasion: {suggestion.occasion}
                        <br />
                        Budget: ₹{suggestion.budget}
                        <br />
                        Date: {new Date(suggestion.createdAt).toLocaleDateString()}
                      </p>
                      <div>
                        <h6>Suggested Products:</h6>
                        <ul className="ps-3">
                          {suggestion.suggestedProducts.map((product) => (
                            <li key={product._id}>{product.productName}</li>
                          ))}
                        </ul>
                      </div>
                    </Card.Body>
                    <Card.Footer className="bg-white">
                      <Link to="/catalog">
                        <Button variant="primary" size="sm" className="w-100">
                          View Products
                        </Button>
                      </Link>
                    </Card.Footer>
                  </Card>
                </Col>
              ))}
            </Row>
          ) : (
            <Card className="shadow-sm">
              <Card.Body className="text-center p-5">
                <FaGift className="text-muted mb-3" size={40} />
                <h5>No recommendations yet</h5>
                <p className="text-muted">Get personalized gift suggestions by filling out our questionnaire</p>
                <Link to="/questionnaire">
                  <Button variant="primary">Get Started</Button>
                </Link>
              </Card.Body>
            </Card>
          )}
        </Col>
      </Row>
    </Container>
  )
}

export default Dashboard
