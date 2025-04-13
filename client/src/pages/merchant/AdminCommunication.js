import React, { useState, useEffect } from 'react';
import { Container, Card, Form, Button, Alert, Table, Badge } from 'react-bootstrap';
import axios from 'axios';

const AdminCommunication = () => {
  const [messages, setMessages] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState({
    subject: '',
    message: '',
    type: 'support' // or 'suggestion'
  });

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const response = await axios.get('/api/merchant/admin-messages');
      setMessages(response.data.data);
    } catch (err) {
      setError('Failed to load messages');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/merchant/contact-admin', formData);
      setSuccess('Message sent successfully');
      setFormData({ subject: '', message: '', type: 'support' });
      fetchMessages();
    } catch (err) {
      setError('Failed to send message');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const getStatusBadge = (status) => {
    const variants = {
      pending: 'warning',
      responded: 'success',
      closed: 'secondary'
    };
    return <Badge bg={variants[status] || 'primary'}>{status}</Badge>;
  };

  return (
    <Container fluid className="py-4">
      <h2 className="mb-4">Contact Admin</h2>

      {error && <Alert variant="danger" onClose={() => setError('')} dismissible>{error}</Alert>}
      {success && <Alert variant="success" onClose={() => setSuccess('')} dismissible>{success}</Alert>}

      <Card className="mb-4">
        <Card.Header>
          <h5 className="mb-0">New Message</h5>
        </Card.Header>
        <Card.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Type</Form.Label>
              <Form.Select
                name="type"
                value={formData.type}
                onChange={handleInputChange}
                required
              >
                <option value="support">Support Request</option>
                <option value="suggestion">Suggestion</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Subject</Form.Label>
              <Form.Control
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleInputChange}
                required
                placeholder="Enter subject"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Message</Form.Label>
              <Form.Control
                as="textarea"
                rows={4}
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                required
                placeholder="Enter your message"
              />
            </Form.Group>

            <Button type="submit" variant="primary">
              Send Message
            </Button>
          </Form>
        </Card.Body>
      </Card>

      <Card>
        <Card.Header>
          <h5 className="mb-0">Message History</h5>
        </Card.Header>
        <Card.Body>
          <Table responsive>
            <thead>
              <tr>
                <th>Date</th>
                <th>Type</th>
                <th>Subject</th>
                <th>Status</th>
                <th>Admin Response</th>
              </tr>
            </thead>
            <tbody>
              {messages.map(msg => (
                <tr key={msg._id}>
                  <td>{new Date(msg.createdAt).toLocaleDateString()}</td>
                  <td>
                    <Badge bg={msg.type === 'support' ? 'info' : 'primary'}>
                      {msg.type}
                    </Badge>
                  </td>
                  <td>{msg.subject}</td>
                  <td>{getStatusBadge(msg.status)}</td>
                  <td>
                    {msg.adminResponse ? (
                      <>
                        <div>{msg.adminResponse}</div>
                        <small className="text-muted">
                          {new Date(msg.responseDate).toLocaleDateString()}
                        </small>
                      </>
                    ) : (
                      <span className="text-muted">Awaiting response</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default AdminCommunication; 