"use client"

import { useState, useContext } from "react"
import { Container, Row, Col, Form, Button, Card, Alert } from "react-bootstrap"
import { useLocation, useNavigate } from "react-router-dom"
import { AuthContext } from "../../context/AuthContext"
import { FaLock } from "react-icons/fa"

const OTPVerification = () => {
  const [otp, setOtp] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [resendLoading, setResendLoading] = useState(false)

  const { verifyOTP, resendOTP } = useContext(AuthContext)
  const location = useLocation()
  const navigate = useNavigate()

  // Get email from location state
  const email = location.state?.email

  // Redirect if no email is provided
  if (!email) {
    navigate("/signup")
  }

  const onChange = (e) => {
    setOtp(e.target.value)
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    setError("")

    try {
      setIsLoading(true)
      const userData = await verifyOTP(email, otp)

      // Redirect based on user role
      if (userData.role === "admin") {
        navigate("/admin/dashboard")
      } else if (userData.role === "merchant") {
        navigate("/merchant/dashboard")
      } else {
        navigate("/dashboard")
      }
    } catch (err) {
      setError(err.response?.data?.message || "OTP verification failed. Please try again.")
      setIsLoading(false)
    }
  }

  const handleResendOTP = async () => {
    setError("")

    try {
      setResendLoading(true)
      await resendOTP(email)
      setResendLoading(false)
      alert("OTP has been resent to your email")
    } catch (err) {
      setError(err.response?.data?.message || "Failed to resend OTP. Please try again.")
      setResendLoading(false)
    }
  }

  return (
    <Container>
      <Row className="justify-content-center">
        <Col md={6}>
          <Card className="shadow-sm">
            <Card.Body className="p-4">
              <div className="text-center mb-4">
                <FaLock className="text-primary mb-2" size={40} />
                <h2>Verify Your Email</h2>
                <p className="text-muted">Enter the OTP sent to {email}</p>
              </div>

              {error && <Alert variant="danger">{error}</Alert>}

              <Form onSubmit={onSubmit}>
                <Form.Group className="mb-4">
                  <Form.Label>One-Time Password (OTP)</Form.Label>
                  <Form.Control
                    type="text"
                    value={otp}
                    onChange={onChange}
                    placeholder="Enter 6-digit OTP"
                    required
                    maxLength="6"
                    className="text-center"
                    style={{ letterSpacing: "0.5em", fontSize: "1.2em" }}
                  />
                </Form.Group>

                <Button variant="primary" type="submit" className="w-100 mb-3" disabled={isLoading}>
                  {isLoading ? "Verifying..." : "Verify OTP"}
                </Button>

                <div className="text-center">
                  <p className="mb-0">
                    Didn't receive the OTP?{" "}
                    <Button variant="link" className="p-0" onClick={handleResendOTP} disabled={resendLoading}>
                      {resendLoading ? "Resending..." : "Resend OTP"}
                    </Button>
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

export default OTPVerification
