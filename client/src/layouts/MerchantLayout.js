import React from 'react';
import { Container, Nav, Navbar } from 'react-bootstrap';
import { Link, useLocation, Navigate } from 'react-router-dom';
import { FaStore, FaBox, FaShoppingCart, FaHeadset, FaTachometerAlt } from 'react-icons/fa';
import { useAuth } from '../contexts/AuthContext';

const MerchantLayout = ({ children }) => {
  const location = useLocation();
  const { user } = useAuth(); // Assuming you have an auth context

  // Protect merchant routes
  if (!user || user.role !== 'merchant') {
    return <Navigate to="/auth/signin" />;
  }

  const navItems = [
    {
      path: '/merchant/dashboard',
      name: 'Dashboard',
      icon: <FaTachometerAlt />
    },
    {
      path: '/merchant/products',
      name: 'Products',
      icon: <FaBox />
    },
    {
      path: '/merchant/orders',
      name: 'Orders',
      icon: <FaShoppingCart />
    },
    {
      path: '/merchant/support',
      name: 'Contact Admin',
      icon: <FaHeadset />
    }
  ];

  return (
    <div className="merchant-layout">
      <Navbar bg="dark" variant="dark" expand="lg" className="mb-4">
        <Container fluid>
          <Navbar.Brand as={Link} to="/merchant/dashboard">
            <FaStore className="me-2" />
            Merchant Portal
          </Navbar.Brand>
          <Navbar.Toggle />
          <Navbar.Collapse>
            <Nav className="me-auto">
              {navItems.map(item => (
                <Nav.Link
                  key={item.path}
                  as={Link}
                  to={item.path}
                  active={location.pathname === item.path}
                >
                  {item.icon}
                  <span className="ms-2">{item.name}</span>
                </Nav.Link>
              ))}
            </Nav>
            <Nav>
              <Nav.Link onClick={handleLogout}>Logout</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <Container fluid>
        {children}
      </Container>
    </div>
  );
};

export default MerchantLayout; 