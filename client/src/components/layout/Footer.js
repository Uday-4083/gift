import { Container, Row, Col } from "react-bootstrap"
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from "react-icons/fa"

const Footer = () => {
  return (
    <footer className="bg-dark text-white py-4 mt-5">
      <Container>
        <Row>
          <Col md={4} className="mb-3 mb-md-0">
            <h5>Gift Recommender</h5>
            <p className="text-muted">AI-Powered Gifts for Every Occasion</p>
          </Col>
          <Col md={4} className="mb-3 mb-md-0">
            <h5>Quick Links</h5>
            <ul className="list-unstyled">
              <li>
                <a href="/" className="text-decoration-none text-muted">
                  Home
                </a>
              </li>
              <li>
                <a href="/catalog" className="text-decoration-none text-muted">
                  Catalog
                </a>
              </li>
              <li>
                <a href="/questionnaire" className="text-decoration-none text-muted">
                  Get Recommendations
                </a>
              </li>
            </ul>
          </Col>
          <Col md={4}>
            <h5>Connect With Us</h5>
            <div className="d-flex">
              <a 
                href="https://facebook.com/giftrecommender" 
                className="text-decoration-none text-muted me-3"
                aria-label="Visit our Facebook page"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaFacebook size={24} />
              </a>
              <a 
                href="https://twitter.com/giftrecommender" 
                className="text-decoration-none text-muted me-3"
                aria-label="Visit our Twitter page"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaTwitter size={24} />
              </a>
              <a 
                href="https://instagram.com/giftrecommender" 
                className="text-decoration-none text-muted me-3"
                aria-label="Visit our Instagram page"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaInstagram size={24} />
              </a>
              <a 
                href="https://linkedin.com/company/giftrecommender" 
                className="text-decoration-none text-muted"
                aria-label="Visit our LinkedIn page"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaLinkedin size={24} />
              </a>
            </div>
          </Col>
        </Row>
        <hr className="my-3" />
        <Row>
          <Col className="text-center">
            <p className="mb-0 text-muted">&copy; {new Date().getFullYear()} Gift Recommender. All rights reserved.</p>
          </Col>
        </Row>
      </Container>
    </footer>
  )
}

export default Footer
