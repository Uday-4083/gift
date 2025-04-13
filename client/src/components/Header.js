import React from 'react'
import { Navbar, Nav, Container, Button } from 'react-bootstrap'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import styled from 'styled-components'
import { theme } from '../styles/theme'
import { FaGift } from 'react-icons/fa'

const LogoWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  color: ${theme.colors.primary};
  font-size: 1.8rem;
  font-weight: 600;
  font-family: ${theme.fonts.primary};

  svg {
    font-size: 1.6rem;
    color: ${theme.colors.secondary};
  }
`

const StyledNavbar = styled(Navbar)`
  height: 60px;
  background-color: ${theme.colors.background};
  box-shadow: ${theme.shadows.small};
  
  .navbar-brand {
    display: flex;
    align-items: center;
    padding: 0;
  }

  .nav-link {
    font-family: ${theme.fonts.secondary};
    color: ${theme.colors.text} !important;
    font-size: 0.9rem;
    padding: 0.4rem 1rem;
    transition: ${theme.transitions.default};
    
    &:hover {
      color: ${theme.colors.primary} !important;
    }
  }

  .auth-buttons {
    .btn {
      margin-left: 0.5rem;
      font-family: ${theme.fonts.secondary};
      font-size: 0.9rem;
      padding: 0.3rem 1rem;
      
      &.btn-outline-primary {
        border-color: ${theme.colors.primary};
        color: ${theme.colors.primary};
        
        &:hover {
          background-color: ${theme.colors.primary};
          color: white;
        }
      }
      
      &.btn-primary {
        background-color: ${theme.colors.primary};
        border-color: ${theme.colors.primary};
        color: white;
        
        &:hover {
          background-color: ${theme.colors.primary}ee;
        }
      }
    }
  }
`

const Header = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    try {
      await logout()
      navigate('/signin')
    } catch (error) {
      console.error('Failed to log out:', error)
    }
  }

  const getDashboardLink = () => {
    if (!user) return null
    switch (user.role) {
      case 'admin':
        return '/admin/dashboard'
      case 'merchant':
        return '/merchant/dashboard'
      default:
        return '/dashboard'
    }
  }

  return (
    <StyledNavbar expand="lg" fixed="top">
      <Container className="px-2">
        <Navbar.Brand as={Link} to="/">
          <LogoWrapper>
            <FaGift /> giftoria
          </LogoWrapper>
        </Navbar.Brand>
        
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/">Home</Nav.Link>
            <Nav.Link as={Link} to="/products">Products</Nav.Link>
            <Nav.Link as={Link} to="/categories">Categories</Nav.Link>
            <Nav.Link as={Link} to="/about">About</Nav.Link>
            <Nav.Link as={Link} to="/contact">Contact</Nav.Link>
          </Nav>

          <div className="auth-buttons">
            {user ? (
              <>
                <Button
                  as={Link}
                  to={getDashboardLink()}
                  variant="outline-primary"
                  size="sm"
                >
                  Dashboard
                </Button>
                <Button
                  variant="primary"
                  onClick={handleLogout}
                  size="sm"
                >
                  Sign Out
                </Button>
              </>
            ) : (
              <>
                <Button
                  as={Link}
                  to="/signin"
                  variant="outline-primary"
                  size="sm"
                >
                  Sign In
                </Button>
                <Button
                  as={Link}
                  to="/signup"
                  variant="primary"
                  size="sm"
                >
                  Sign Up
                </Button>
              </>
            )}
          </div>
        </Navbar.Collapse>
      </Container>
    </StyledNavbar>
  )
}

export default Header 