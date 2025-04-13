"use client"

import { useState, useContext } from "react"
import { Container, Row, Col, Form, Button, Card, Alert, Nav } from "react-bootstrap"
import { Link, useNavigate } from "react-router-dom"
import { AuthContext } from "../../context/AuthContext"
import { FaUser, FaUserTie, FaUserShield } from "react-icons/fa"

const SignIn = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [activeRole, setActiveRole] = useState("user") // Default to user login

  const { login } = useContext(AuthContext)
  const navigate = useNavigate()

  const { email, password } = formData

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    setError("")

    try {
      setIsLoading(true)
      const userData = await login(email, password)

      // Verify user role matches selected role
      if (userData.role !== activeRole) {
        throw new Error(`Invalid credentials for ${activeRole} login`)
      }

      // Redirect based on verified user role
      switch (userData.role) {
        case "admin":
          navigate("/admin/dashboard")
          break
        case "merchant":
          navigate("/merchant/dashboard")
          break
        case "user":
          navigate("/dashboard")
          break
        default:
          throw new Error("Invalid user role")
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Login failed. Please try again.")
      setIsLoading(false)
    }
  }

  const getRoleIcon = () => {
    switch (activeRole) {
      case "admin":
        return <FaUserShield className="text-primary mb-2" size={40} />
      case "merchant":
        return <FaUserTie className="text-primary mb-2" size={40} />
      default:
        return <FaUser className="text-primary mb-2" size={40} />
    }
  }

  const getRoleTitle = () => {
    switch (activeRole) {
      case "admin":
        return "Admin Sign In"
      case "merchant":
        return "Merchant Sign In"
      default:
        return "User Sign In"
    }
  }

  return (
    <Container>
      <Row className="justify-content-center">
        <Col md={6}>
          <Card className="shadow">
            <Card.Body className="p-4">
              <div className="text-center mb-4">
                {getRoleIcon()}
                <h2>{getRoleTitle()}</h2>
                <p className="text-muted">Access your account</p>
              </div>

              <Nav variant="pills" className="justify-content-center mb-4">
                <Nav.Item>
                  <Nav.Link
                    active={activeRole === "user"}
                    onClick={() => setActiveRole("user")}
                    className="d-flex align-items-center"
                  >
                    <FaUser className="me-2" /> User
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link
                    active={activeRole === "merchant"}
                    onClick={() => setActiveRole("merchant")}
                    className="d-flex align-items-center"
                  >
                    <FaUserTie className="me-2" /> Merchant
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link
                    active={activeRole === "admin"}
                    onClick={() => setActiveRole("admin")}
                    className="d-flex align-items-center"
                  >
                    <FaUserShield className="me-2" /> Admin
                  </Nav.Link>
                </Nav.Item>
              </Nav>

              {error && <Alert variant="danger">{error}</Alert>}

              <Form onSubmit={onSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>Email Address</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    value={email}
                    onChange={onChange}
                    placeholder="Enter your email"
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-4">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type="password"
                    name="password"
                    value={password}
                    onChange={onChange}
                    placeholder="Enter your password"
                    required
                  />
                  <Form.Text className="text-end d-block">
                    <Link to="/forgot-password" className="text-decoration-none">Forgot Password?</Link>
                  </Form.Text>
                </Form.Group>

                <Button variant="primary" type="submit" className="w-100 mb-3" disabled={isLoading}>
                  {isLoading ? "Signing In..." : "Sign In"}
                </Button>

                {activeRole === "user" && (
                  <div className="text-center">
                    <p className="mb-0">
                      Don't have an account? <Link to="/signup">Sign Up</Link>
                    </p>
                  </div>
                )}
                {activeRole === "merchant" && (
                  <div className="text-center">
                    <p className="mb-0">
                      Want to become a merchant? <Link to="/signup?role=merchant">Register as Merchant</Link>
                    </p>
                  </div>
                )}
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  )
}

export default SignIn
