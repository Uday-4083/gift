import { Container, Row, Col, Button, Card } from "react-bootstrap"
import { Link } from "react-router-dom"
import { FaRobot, FaShoppingCart, FaUserFriends } from "react-icons/fa"

const LandingPage = () => {
  return (
    <div className="landing-page">
      {/* Hero Section */}
      <div className="hero-section bg-primary text-white py-5 mb-5">
        <Container>
          <Row className="align-items-center">
            <Col md={6} className="mb-4 mb-md-0">
              <h1 className="display-4 fw-bold">AI-Powered Gifts for Every Occasion 🎁</h1>
              <p className="lead">
                Finding the perfect gift has never been easier. Our AI-powered platform recommends personalized gifts
                based on your preferences.
              </p>
              <Link to="/signup">
                <Button variant="light" size="lg" className="mt-3">
                  Get Started
                </Button>
              </Link>
            </Col>
            <Col md={6}>
              <img
                src="https://images.unsplash.com/photo-1549465220-1a8b9238cd48?q=80&w=1000"
                alt="Gift Recommendations"
                className="img-fluid rounded shadow"
                style={{ maxHeight: "400px", width: "100%", objectFit: "cover" }}
                loading="eager"
              />
            </Col>
          </Row>
        </Container>
      </div>

      {/* Features Section */}
      <Container className="mb-5">
        <h2 className="text-center mb-5">Our Features</h2>
        <Row>
          <Col md={4} className="mb-4">
            <Card className="h-100 shadow-sm hover-card">
              <Card.Body className="text-center p-4">
                <FaRobot className="text-primary mb-3" size={50} />
                <Card.Title>AI-Powered Recommendations</Card.Title>
                <Card.Text>
                  Our advanced AI analyzes your preferences to suggest the perfect gifts for any occasion.
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4} className="mb-4">
            <Card className="h-100 shadow-sm hover-card">
              <Card.Body className="text-center p-4">
                <FaShoppingCart className="text-primary mb-3" size={50} />
                <Card.Title>Curated Gift Catalog</Card.Title>
                <Card.Text>
                  Browse through our extensive collection of high-quality gifts for all ages and preferences.
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4} className="mb-4">
            <Card className="h-100 shadow-sm hover-card">
              <Card.Body className="text-center p-4">
                <FaUserFriends className="text-primary mb-3" size={50} />
                <Card.Title>Personalized Experience</Card.Title>
                <Card.Text>
                  Get recommendations tailored to the recipient's age, interests, and your relationship with them.
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>

      {/* How It Works Section */}
      <div className="bg-light py-5 mb-5">
        <Container>
          <h2 className="text-center mb-5">How It Works</h2>
          <Row className="justify-content-center">
            <Col md={10}>
              <div className="d-flex flex-column flex-md-row justify-content-between">
                <div className="text-center mb-4 mb-md-0">
                  <div
                    className="bg-primary text-white rounded-circle d-inline-flex justify-content-center align-items-center mb-3"
                    style={{ width: "60px", height: "60px" }}
                  >
                    <h3 className="m-0">1</h3>
                  </div>
                  <h5>Fill Questionnaire</h5>
                  <p className="text-muted">Tell us about the recipient and occasion</p>
                </div>
                <div className="text-center mb-4 mb-md-0">
                  <div
                    className="bg-primary text-white rounded-circle d-inline-flex justify-content-center align-items-center mb-3"
                    style={{ width: "60px", height: "60px" }}
                  >
                    <h3 className="m-0">2</h3>
                  </div>
                  <h5>Get AI Suggestions</h5>
                  <p className="text-muted">Our AI generates personalized gift ideas</p>
                </div>
                <div className="text-center mb-4 mb-md-0">
                  <div
                    className="bg-primary text-white rounded-circle d-inline-flex justify-content-center align-items-center mb-3"
                    style={{ width: "60px", height: "60px" }}
                  >
                    <h3 className="m-0">3</h3>
                  </div>
                  <h5>Choose & Purchase</h5>
                  <p className="text-muted">Select the perfect gift and check out</p>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </div>

      {/* Testimonials Section */}
      <Container className="mb-5">
        <h2 className="text-center mb-5">What Our Customers Say</h2>
        <Row>
          <Col md={4} className="mb-4">
            <Card className="h-100 shadow-sm testimonial-card">
              <Card.Body>
                <div className="d-flex mb-3">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="text-warning me-1">★</span>
                  ))}
                </div>
                <Card.Text>
                  "The AI recommendations were spot on! Found the perfect gift for my dad's birthday in minutes."
                </Card.Text>
                <div className="d-flex align-items-center mt-3">
                  <img
                    src="https://randomuser.me/api/portraits/women/1.jpg"
                    alt="Sarah Johnson"
                    className="rounded-circle me-2"
                    style={{ width: "40px", height: "40px", objectFit: "cover" }}
                    loading="lazy"
                  />
                  <div>
                    <h6 className="mb-0">Sarah Johnson</h6>
                    <small className="text-muted">Delhi</small>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4} className="mb-4">
            <Card className="h-100 shadow-sm testimonial-card">
              <Card.Body>
                <div className="d-flex mb-3">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="text-warning me-1">★</span>
                  ))}
                </div>
                <Card.Text>
                  "I was struggling to find a gift for my wife's anniversary. This platform saved me!"
                </Card.Text>
                <div className="d-flex align-items-center mt-3">
                  <img
                    src="https://randomuser.me/api/portraits/men/1.jpg"
                    alt="Rahul Sharma"
                    className="rounded-circle me-2"
                    style={{ width: "40px", height: "40px", objectFit: "cover" }}
                    loading="lazy"
                  />
                  <div>
                    <h6 className="mb-0">Rahul Sharma</h6>
                    <small className="text-muted">Mumbai</small>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4} className="mb-4">
            <Card className="h-100 shadow-sm testimonial-card">
              <Card.Body>
                <div className="d-flex mb-3">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="text-warning me-1">★</span>
                  ))}
                </div>
                <Card.Text>
                  "The variety of gift options is amazing. I've found unique gifts for everyone in my family."
                </Card.Text>
                <div className="d-flex align-items-center mt-3">
                  <img
                    src="https://randomuser.me/api/portraits/women/2.jpg"
                    alt="Priya Patel"
                    className="rounded-circle me-2"
                    style={{ width: "40px", height: "40px", objectFit: "cover" }}
                    loading="lazy"
                  />
                  <div>
                    <h6 className="mb-0">Priya Patel</h6>
                    <small className="text-muted">Bangalore</small>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>

      {/* FAQ Section */}
      <div className="bg-light py-5 mb-5">
        <Container>
          <h2 className="text-center mb-5">Frequently Asked Questions</h2>
          <Row className="justify-content-center">
            <Col md={8}>
              <div className="mb-4">
                <h5>How does the AI recommendation work?</h5>
                <p className="text-muted">
                  Our AI analyzes your inputs about the recipient's age, gender, your relationship with them, the
                  occasion, and your budget to suggest personalized gift ideas.
                </p>
              </div>
              <div className="mb-4">
                <h5>Can I return a gift if it's not suitable?</h5>
                <p className="text-muted">
                  Yes, we offer a 30-day return policy for most items. Please check the product details for specific
                  return information.
                </p>
              </div>
              <div className="mb-4">
                <h5>How long does delivery take?</h5>
                <p className="text-muted">
                  Standard delivery takes 3-5 business days. We also offer express delivery options at checkout.
                </p>
              </div>
              <div>
                <h5>Are the recommendations based on my previous purchases?</h5>
                <p className="text-muted">
                  Yes, our AI learns from your previous purchases and feedback to improve future recommendations.
                </p>
              </div>
            </Col>
          </Row>
        </Container>
      </div>

      {/* CTA Section */}
      <Container className="text-center mb-5">
        <h2>Ready to Find the Perfect Gift?</h2>
        <p className="lead mb-4">
          Join thousands of satisfied customers who found the perfect gifts with our AI recommendations.
        </p>
        <Link to="/signup">
          <Button variant="primary" size="lg" className="me-3">
            Sign Up Now
          </Button>
        </Link>
        <Link to="/questionnaire">
          <Button variant="outline-primary" size="lg">
            Try Recommendations
          </Button>
        </Link>
      </Container>
    </div>
  )
}

export default LandingPage
