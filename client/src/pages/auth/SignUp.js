"use client"

import { useState, useContext } from "react"
import { Container, Row, Col, Form, Button, Card, Alert, Nav } from "react-bootstrap"
import { Link, useNavigate, useSearchParams } from "react-router-dom"
import { AuthContext } from "../../context/AuthContext"
import { FaUser, FaUserTie } from "react-icons/fa"

const SignUp = () => {
  const [searchParams] = useSearchParams()
  const initialRole = searchParams.get('role') || 'user'

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    age: "",
    gender: "",
    // Merchant specific fields
    businessName: "",
    businessType: "",
    businessDescription: ""
  })
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [activeRole, setActiveRole] = useState(initialRole)

  const { register } = useContext(AuthContext)
  const navigate = useNavigate()

  const { 
    fullName, 
    email, 
    password, 
    confirmPassword, 
    age, 
    gender,
    businessName,
    businessType,
    businessDescription
  } = formData

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const getRoleIcon = () => {
    return activeRole === "merchant" ? 
      <FaUserTie className="text-primary mb-2" size={40} /> : 
      <FaUser className="text-primary mb-2" size={40} />
  }

  const getRoleTitle = () => {
    return activeRole === "merchant" ? "Merchant Sign Up" : "User Sign Up"
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    setError("")

    // Validate form
    if (password !== confirmPassword) {
      setError("Passwords do not match")
      return
    }

    if (Number.parseInt(age) < 18) {
      setError("You must be at least 18 years old to register")
      return
    }

    // Validate merchant-specific fields
    if (activeRole === "merchant") {
      if (!businessName.trim()) {
        setError("Business name is required")
        return
      }
      if (!businessType.trim()) {
        setError("Business type is required")
        return
      }
    }

    try {
      setIsLoading(true)
      const registrationData = {
        fullName,
        email,
        password,
        age: Number.parseInt(age),
        gender,
        role: activeRole
      }

      if (activeRole === "merchant") {
        registrationData.businessName = businessName
        registrationData.businessType = businessType
        registrationData.businessDescription = businessDescription
      }

      await register(registrationData)

      // Navigate to OTP verification page
      navigate("/verify-otp", { state: { email } })
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed. Please try again.")
      setIsLoading(false)
    }
  }

  return (
    <Container>
      <Row className="justify-content-center">
        <Col md={8}>
          <Card className="shadow-sm">
            <Card.Body className="p-4">
              <div className="text-center mb-4">
                {getRoleIcon()}
                <h2>{getRoleTitle()}</h2>
                <p className="text-muted">Create your account</p>
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
              </Nav>

              {error && <Alert variant="danger">{error}</Alert>}

              <Form onSubmit={onSubmit}>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Full Name</Form.Label>
                      <Form.Control
                        type="text"
                        name="fullName"
                        value={fullName}
                        onChange={onChange}
                        placeholder="Enter your full name"
                        required
                      />
                    </Form.Group>
                  </Col>

                  <Col md={6}>
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
                  </Col>
                </Row>

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Password</Form.Label>
                      <Form.Control
                        type="password"
                        name="password"
                        value={password}
                        onChange={onChange}
                        placeholder="Enter your password"
                        required
                        minLength="6"
                      />
                    </Form.Group>
                  </Col>

                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Confirm Password</Form.Label>
                      <Form.Control
                        type="password"
                        name="confirmPassword"
                        value={confirmPassword}
                        onChange={onChange}
                        placeholder="Confirm your password"
                        required
                        minLength="6"
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Age</Form.Label>
                      <Form.Control
                        type="number"
                        name="age"
                        value={age}
                        onChange={onChange}
                        placeholder="Enter your age"
                        required
                        min="18"
                      />
                    </Form.Group>
                  </Col>

                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Gender</Form.Label>
                      <Form.Select name="gender" value={gender} onChange={onChange} required>
                        <option value="">Select gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                </Row>

                {activeRole === "merchant" && (
                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Business Name</Form.Label>
                        <Form.Control
                          type="text"
                          name="businessName"
                          value={businessName}
                          onChange={onChange}
                          placeholder="Enter your business name"
                          required={activeRole === "merchant"}
                        />
                      </Form.Group>
                    </Col>

                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Business Type</Form.Label>
                        <Form.Select 
                          name="businessType" 
                          value={businessType} 
                          onChange={onChange}
                          required={activeRole === "merchant"}
                        >
                          <option value="">Select business type</option>
                          <option value="retail">Retail</option>
                          <option value="handicraft">Handicraft</option>
                          <option value="art">Art & Design</option>
                          <option value="food">Food & Beverages</option>
                          <option value="other">Other</option>
                        </Form.Select>
                      </Form.Group>
                    </Col>

                    <Col md={12}>
                      <Form.Group className="mb-3">
                        <Form.Label>Business Description</Form.Label>
                        <Form.Control
                          as="textarea"
                          rows={3}
                          name="businessDescription"
                          value={businessDescription}
                          onChange={onChange}
                          placeholder="Describe your business"
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                )}

                <Button variant="primary" type="submit" className="w-100 mb-3" disabled={isLoading}>
                  {isLoading ? "Signing Up..." : `Sign Up as ${activeRole === "merchant" ? "Merchant" : "User"}`}
                </Button>

                <div className="text-center">
                  <p className="mb-0">
                    Already have an account? <Link to="/signin">Sign In</Link>
                  </p>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  )
}

export default SignUp
