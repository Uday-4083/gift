import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Badge, Alert } from 'react-bootstrap';
import { FaShoppingCart, FaExclamationTriangle, FaDollarSign, FaStore } from 'react-icons/fa';
import axios from 'axios';

const MerchantDashboard = () => {
  const [stats, setStats] = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);
  const [lowStockProducts, setLowStockProducts] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [statsRes, ordersRes, productsRes] = await Promise.all([
        axios.get('/api/merchant/dashboard'),
        axios.get('/api/merchant/orders?limit=5'),
        axios.get('/api/merchant/products')
      ]);

      setStats(statsRes.data.stats);
      setRecentOrders(ordersRes.data.orders || []);
      const products = productsRes.data.products || [];
      setLowStockProducts(products.filter(p => p.stock < 10));
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError('Failed to load dashboard data');
    }
  };

  const getStatusBadge = (status) => {
    const variants = {
      pending: 'warning',
      processing: 'info',
      completed: 'success',
      cancelled: 'danger'
    };
    return <Badge bg={variants[status] || 'secondary'}>{status}</Badge>;
  };

  return (
    <Container fluid className="py-4">
      <h2 className="mb-4">Merchant Dashboard</h2>
      
      {error && <Alert variant="danger">{error}</Alert>}

      {/* Stats Cards */}
      <Row className="mb-4 g-3">
        <Col md={3}>
          <Card className="h-100 border-0 shadow-sm">
            <Card.Body>
              <div className="d-flex align-items-center">
                <div className="rounded-circle p-3 bg-primary bg-opacity-10">
                  <FaStore className="text-primary" size={24} />
                </div>
                <div className="ms-3">
                  <h6 className="mb-1">Total Products</h6>
                  <h4 className="mb-0">{stats?.totalProducts || 0}</h4>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="h-100 border-0 shadow-sm">
            <Card.Body>
              <div className="d-flex align-items-center">
                <div className="rounded-circle p-3 bg-success bg-opacity-10">
                  <FaDollarSign className="text-success" size={24} />
                </div>
                <div className="ms-3">
                  <h6 className="mb-1">Total Revenue</h6>
                  <h4 className="mb-0">${stats?.revenue?.toFixed(2) || '0.00'}</h4>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="h-100 border-0 shadow-sm">
            <Card.Body>
              <div className="d-flex align-items-center">
                <div className="rounded-circle p-3 bg-warning bg-opacity-10">
                  <FaShoppingCart className="text-warning" size={24} />
                </div>
                <div className="ms-3">
                  <h6 className="mb-1">Pending Orders</h6>
                  <h4 className="mb-0">{stats?.pendingOrders || 0}</h4>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="h-100 border-0 shadow-sm">
            <Card.Body>
              <div className="d-flex align-items-center">
                <div className="rounded-circle p-3 bg-danger bg-opacity-10">
                  <FaExclamationTriangle className="text-danger" size={24} />
                </div>
                <div className="ms-3">
                  <h6 className="mb-1">Low Stock Items</h6>
                  <h4 className="mb-0">{lowStockProducts.length}</h4>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Low Stock Products */}
      <Card className="mb-4">
        <Card.Header className="bg-white">
          <h5 className="mb-0">Low Stock Products</h5>
        </Card.Header>
        <Card.Body>
          <Table responsive hover>
            <thead>
              <tr>
                <th>SKU</th>
                <th>Product Name</th>
                <th>Current Stock</th>
                <th>Price</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {lowStockProducts.map(product => (
                <tr key={product._id}>
                  <td>{product.sku}</td>
                  <td>{product.name}</td>
                  <td>
                    <span className="text-danger fw-bold">{product.stock}</span>
                  </td>
                  <td>${product.price}</td>
                  <td>{product.isActive ? 
                    <Badge bg="success">Active</Badge> : 
                    <Badge bg="danger">Inactive</Badge>}
                  </td>
                </tr>
              ))}
              {lowStockProducts.length === 0 && (
                <tr>
                  <td colSpan="5" className="text-center">No low stock products</td>
                </tr>
              )}
            </tbody>
          </Table>
        </Card.Body>
      </Card>

      {/* Recent Orders */}
      <Card>
        <Card.Header className="bg-white">
          <h5 className="mb-0">Recent Orders</h5>
        </Card.Header>
        <Card.Body>
          <Table responsive hover>
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Items</th>
                <th>Total Amount</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map(order => (
                <tr key={order._id}>
                  <td>{order.orderNumber}</td>
                  <td>
                    {order.items?.map(item => (
                      <div key={item.product._id}>
                        {item.product.name} x {item.quantity}
                      </div>
                    ))}
                  </td>
                  <td>${order.totalAmount}</td>
                  <td>{getStatusBadge(order.status)}</td>
                  <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
              {recentOrders.length === 0 && (
                <tr>
                  <td colSpan="5" className="text-center">No recent orders</td>
                </tr>
              )}
            </tbody>
          </Table>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default MerchantDashboard; 