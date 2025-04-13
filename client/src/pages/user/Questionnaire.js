"use client"

import { useState, useContext } from "react"
import { Container, Row, Col, Form, Button, Card, Alert } from "react-bootstrap"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import { AuthContext } from "../../context/AuthContext"
import { FaGift, FaSpinner } from "react-icons/fa"

const Questionnaire = () => {
  const [formData, setFormData] = useState({
    age: "",
    gender: "",
    occasion: "",
    budget: "",
    relation: "",
  })
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const { user } = useContext(AuthContext)
  const navigate = useNavigate()

  const { age, gender, occasion, budget, relation } = formData

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    setError("")

    if (!user || !user.token) {
      setError("Please log in to get gift recommendations")
      return
    }

    try {
      setIsLoading(true)

      // Set the authorization header
      const config = {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        }
      }

      // Send questionnaire data to backend
      const res = await axios.post("/api/user/questionnaire", formData, config)

      // Navigate to catalog with suggestion ID
      navigate("/catalog", { state: { suggestion: res.data } })
    } catch (err) {
      setError(err.response?.data?.message || "Failed to get recommendations. Please try again.")
      setIsLoading(false)
    }
  }

  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col md={8} lg={6}>
          <Card className="shadow-sm">
            <Card.Body className="p-4">
              <div className="text-center mb-4">
                <FaGift className="text-primary mb-2" size={40} />
                <h2>Gift Questionnaire</h2>
                <p className="text-muted">Help us find the perfect gift for your loved one</p>
              </div>

              {error && <Alert variant="danger">{error}</Alert>}

              <Form onSubmit={onSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>Recipient's Age</Form.Label>
                  <Form.Control
                    type="number"
                    name="age"
                    value={age}
                    onChange={onChange}
                    placeholder="Enter age"
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Recipient's Gender</Form.Label>
                  <Form.Select name="gender" value={gender} onChange={onChange} required>
                    <option value="">Select gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </Form.Select>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Occasion</Form.Label>
                  <Form.Select name="occasion" value={occasion} onChange={onChange} required>
                    <option value="">Select occasion</option>
                    <option value="birthday">Birthday</option>
                    <option value="anniversary">Anniversary</option>
                    <option value="wedding">Wedding</option>
                    <option value="graduation">Graduation</option>
                    <option value="housewarming">Housewarming</option>
                    <option value="other">Other</option>
                  </Form.Select>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Budget (₹)</Form.Label>
                  <Form.Control
                    type="number"
                    name="budget"
                    value={budget}
                    onChange={onChange}
                    placeholder="Enter budget in INR"
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Relationship with Recipient</Form.Label>
                  <Form.Select name="relation" value={relation} onChange={onChange} required>
                    <option value="">Select relationship</option>
                    <option value="family">Family Member</option>
                    <option value="friend">Friend</option>
                    <option value="colleague">Colleague</option>
                    <option value="partner">Partner/Spouse</option>
                    <option value="other">Other</option>
                  </Form.Select>
                </Form.Group>

                <Button
                  variant="primary"
                  type="submit"
                  className="w-100"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <FaSpinner className="me-2 spinner" /> Getting Recommendations...
                    </>
                  ) : (
                    "Get Gift Recommendations"
                  )}
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  )
}

export default Questionnaire
