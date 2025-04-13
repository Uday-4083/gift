import React, { useState, useEffect } from 'react';
import {
  Container,
  Table,
  Badge,
  Button,
  Form,
  Row,
  Col,
  Card,
  Alert,
  Spinner,
  Modal
} from 'react-bootstrap';
import axios from 'axios';
import { FaEdit, FaEye } from 'react-icons/fa';

const OrderManagement = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [statusFilter, setStatusFilter] = useState('');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [trackingNumber, setTrackingNumber] = useState('');

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/merchant/orders', {
        params: {
          page,
          status: statusFilter,
          sortBy,
          sortOrder
        }
      });

      setOrders(response.data.orders);
      setTotalPages(response.data.pagination.pages);
      setError('');
    } catch (err) {
      setError('Failed to load orders. Please try again.');
      console.error('Error fetching orders:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [page, statusFilter, sortBy, sortOrder]);

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      setUpdateLoading(true);
      await axios.put(`/api/merchant/orders/${orderId}/status`, {
        status: newStatus,
        trackingNumber: trackingNumber
      });
      fetchOrders();
      setShowModal(false);
    } catch (err) {
      console.error('Error updating order:', err);
      alert('Failed to update order status');
    } finally {
      setUpdateLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const colors = {
      processing: 'primary',
      shipped: 'info',
      delivered: 'success',
      cancelled: 'danger'
    };
    return <Badge bg={colors[status?.toLowerCase()] || 'secondary'}>{status || 'N/A'}</Badge>;
  };

  const handleViewDetails = (order) => {
    setSelectedOrder(order);
    setTrackingNumber(order.trackingNumber || '');
    setShowModal(true);
  };

  if (loading) {
    return (
      <Container className="mt-4">
        <div className="text-center">
          <Spinner animation="border" />
          <p>Loading orders...</p>
        </div>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="mt-4">
        <Alert variant="danger">
          {error}
          <Button variant="outline-danger" className="ms-3" onClick={fetchOrders}>
            Retry
          </Button>
        </Alert>
      </Container>
    );
  }

  return (
    <Container className="mt-4">
      <Card>
        <Card.Header>
          <h4 className="mb-0">Order Management</h4>
        </Card.Header>
        <Card.Body>
          <Row className="mb-3">
            <Col md={4}>
              <Form.Group>
                <Form.Label>Filter by Status</Form.Label>
                <Form.Select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="">All Status</option>
                  <option value="processing">Processing</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>

          {orders.length === 0 ? (
            <Alert variant="info">No orders found.</Alert>
          ) : (
            <div className="table-responsive">
              <Table striped bordered hover>
                <thead>
                  <tr>
                    <th onClick={() => handleSort('createdAt')}>
                      Date {sortBy === 'createdAt' && (sortOrder === 'asc' ? '↑' : '↓')}
                    </th>
                    <th>Order ID</th>
                    <th>Customer</th>
                    <th>Products</th>
                    <th onClick={() => handleSort('totalAmount')}>
                      Total {sortBy === 'totalAmount' && (sortOrder === 'asc' ? '↑' : '↓')}
                    </th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map(order => (
                    <tr key={order._id}>
                      <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                      <td>#{order._id.slice(-8)}</td>
                      <td>
                        {order.customer?.fullName}
                        <br />
                        <small className="text-muted">{order.customer?.email}</small>
                      </td>
                      <td>
                        {order.products.filter(p => p.merchant.toString() === localStorage.getItem('userId')).length} items
                      </td>
                      <td>₹{order.totalAmount?.toFixed(2)}</td>
                      <td>{getStatusBadge(order.status)}</td>
                      <td>
                        <Button
                          variant="outline-primary"
                          size="sm"
                          className="me-2"
                          onClick={() => {
                            setSelectedOrder(order);
                            setShowModal(true);
                          }}
                        >
                          <FaEye /> View
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          )}

          <div className="d-flex justify-content-center mt-3">
            <Button
              variant="outline-primary"
              className="me-2"
              disabled={page === 1}
              onClick={() => setPage(p => p - 1)}
            >
              Previous
            </Button>
            <Button
              variant="outline-primary"
              disabled={page === totalPages}
              onClick={() => setPage(p => p + 1)}
            >
              Next
            </Button>
          </div>
        </Card.Body>
      </Card>

      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Order Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedOrder && (
            <>
              <Row className="mb-4">
                <Col md={6}>
                  <h6>Customer Information</h6>
                  <p className="mb-1">Name: {selectedOrder.customer?.fullName}</p>
                  <p className="mb-1">Email: {selectedOrder.customer?.email}</p>
                </Col>
                <Col md={6}>
                  <h6>Order Information</h6>
                  <p className="mb-1">Order ID: #{selectedOrder._id}</p>
                  <p className="mb-1">Date: {new Date(selectedOrder.createdAt).toLocaleString()}</p>
                  <p className="mb-1">Status: {getStatusBadge(selectedOrder.status)}</p>
                </Col>
              </Row>

              <h6>Products</h6>
              <Table responsive>
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Quantity</th>
                    <th>Price</th>
                    <th>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedOrder.products
                    .filter(p => p.merchant.toString() === localStorage.getItem('userId'))
                    .map((product, index) => (
                      <tr key={index}>
                        <td>{product.product.name}</td>
                        <td>{product.quantity}</td>
                        <td>₹{product.price.toFixed(2)}</td>
                        <td>₹{(product.price * product.quantity).toFixed(2)}</td>
                      </tr>
                    ))}
                </tbody>
              </Table>

              <Row className="mt-4">
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>Update Status</Form.Label>
                    <Form.Select
                      value={selectedOrder.status}
                      onChange={(e) => handleStatusChange(selectedOrder._id, e.target.value)}
                      disabled={updateLoading}
                    >
                      <option value="processing">Processing</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>Tracking Number</Form.Label>
                    <Form.Control
                      type="text"
                      value={trackingNumber}
                      onChange={(e) => setTrackingNumber(e.target.value)}
                      placeholder="Enter tracking number"
                    />
                  </Form.Group>
                </Col>
              </Row>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default OrderManagement; 