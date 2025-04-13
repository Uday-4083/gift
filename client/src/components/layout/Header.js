"use client"

import { useContext } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Navbar, Container, Nav, NavDropdown } from "react-bootstrap"
import { AuthContext } from "../../context/AuthContext"
import { FaGift, FaUser, FaSignOutAlt, FaShoppingCart } from "react-icons/fa"

const Header = () => {
  const { user, logout } = useContext(AuthContext)
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate("/")
  }

  return (
    <Navbar bg="dark" variant="dark" expand="lg" className="mb-4">
      <Container>
        <Navbar.Brand as={Link} to="/">
          <FaGift className="me-2" />
          Gift Recommender
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            {user ? (
              <>
                {user.role === "user" && (
                  <>
                    <Nav.Link as={Link} to="/dashboard">
                      Dashboard
                    </Nav.Link>
                    <Nav.Link as={Link} to="/questionnaire">
                      Get Recommendations
                    </Nav.Link>
                    <Nav.Link as={Link} to="/catalog">
                      Catalog
                    </Nav.Link>
                    <Nav.Link as={Link} to="/cart">
                      <FaShoppingCart /> Cart
                    </Nav.Link>
                    <NavDropdown
                      title={
                        <>
                          <FaUser /> {user.fullName}
                        </>
                      }
                      id="user-dropdown"
                    >
                      <NavDropdown.Item as={Link} to="/profile">
                        Profile
                      </NavDropdown.Item>
                      <NavDropdown.Item as={Link} to="/orders">
                        My Orders
                      </NavDropdown.Item>
                      <NavDropdown.Divider />
                      <NavDropdown.Item onClick={handleLogout}>
                        <FaSignOutAlt /> Logout
                      </NavDropdown.Item>
                    </NavDropdown>
                  </>
                )}

                {user.role === "admin" && (
                  <>
                    <Nav.Link as={Link} to="/admin/dashboard">
                      Dashboard
                    </Nav.Link>
                    <Nav.Link as={Link} to="/admin/products">
                      Products
                    </Nav.Link>
                    <Nav.Link as={Link} to="/admin/orders">
                      Orders
                    </Nav.Link>
                    <Nav.Link as={Link} to="/admin/merchants">
                      Merchants
                    </Nav.Link>
                    <Nav.Link as={Link} to="/admin/feedback">
                      Feedback
                    </Nav.Link>
                    <NavDropdown
                      title={
                        <>
                          <FaUser /> Admin
                        </>
                      }
                      id="admin-dropdown"
                    >
                      <NavDropdown.Item onClick={handleLogout}>
                        <FaSignOutAlt /> Logout
                      </NavDropdown.Item>
                    </NavDropdown>
                  </>
                )}

                {user.role === "merchant" && (
                  <>
                    <Nav.Link as={Link} to="/merchant/dashboard">
                      Dashboard
                    </Nav.Link>
                    <Nav.Link as={Link} to="/merchant/add-product">
                      Add Product
                    </Nav.Link>
                    <Nav.Link as={Link} to="/merchant/product-status">
                      Product Status
                    </Nav.Link>
                    <NavDropdown
                      title={
                        <>
                          <FaUser /> Merchant
                        </>
                      }
                      id="merchant-dropdown"
                    >
                      <NavDropdown.Item onClick={handleLogout}>
                        <FaSignOutAlt /> Logout
                      </NavDropdown.Item>
                    </NavDropdown>
                  </>
                )}
              </>
            ) : (
              <>
                <Nav.Link as={Link} to="/signin">
                  Sign In
                </Nav.Link>
                <Nav.Link as={Link} to="/signup">
                  Sign Up
                </Nav.Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  )
}

export default Header
