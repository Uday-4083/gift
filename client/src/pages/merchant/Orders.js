import React, { useState, useEffect } from 'react';
import { Container, Table, Badge, Alert, Button, Modal, Form } from 'react-bootstrap';
import axios from 'axios';

const MerchantOrders = () => {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await axios.get('/api/merchant/orders');
      setOrders(response.data.data);
    } catch (err) {
      setError('Failed to load orders');
    }
  };

  const handleUpdateStatus = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`/api/merchant/orders/${selectedOrder._id}/status`, {
        status: e.target.status.value
      });
      setSuccess('Order status updated successfully');
      setShowModal(false);
      fetchOrders();
    } catch (err) {
      setError('Failed to update order status');
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
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Order Management</h2>
      </div>

      {error && <Alert variant="danger" onClose={() => setError('')} dismissible>{error}</Alert>}
      {success && <Alert variant="success" onClose={() => setSuccess('')} dismissible>{success}</Alert>}

      <Table responsive hover className="shadow-sm">
        <thead className="bg-light">
          <tr>
            <th>Order ID</th>
            <th>Items</th>
            <th>Total Amount</th>
            <th>Status</th>
            <th>Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {orders.map(order => (
            <tr key={order._id}>
              <td>{order.orderNumber}</td>
              <td>
                {order.items.map(item => (
                  <div key={item.product._id}>
                    {item.product.name} x {item.quantity}
                  </div>
                ))}
              </td>
              <td>${order.totalAmount}</td>
              <td>{getStatusBadge(order.status)}</td>
              <td>{new Date(order.createdAt).toLocaleDateString()}</td>
              <td>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => {
                    setSelectedOrder(order);
                    setShowModal(true);
                  }}
                  disabled={order.status === 'completed' || order.status === 'cancelled'}
                >
                  Update Status
                </Button>
              </td>
            </tr>
          ))}
          {orders.length === 0 && (
            <tr>
              <td colSpan="6" className="text-center">No orders found</td>
            </tr>
          )}
        </tbody>
      </Table>

      {/* Update Status Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Update Order Status</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleUpdateStatus}>
            <Form.Group className="mb-3">
              <Form.Label>Status</Form.Label>
              <Form.Select
                name="status"
                defaultValue={selectedOrder?.status}
                required
              >
                <option value="pending">Pending</option>
                <option value="processing">Processing</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </Form.Select>
            </Form.Group>

            <div className="d-flex justify-content-end gap-2">
              <Button variant="secondary" onClick={() => setShowModal(false)}>
                Cancel
              </Button>
              <Button variant="primary" type="submit">
                Update Status
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default MerchantOrders; 