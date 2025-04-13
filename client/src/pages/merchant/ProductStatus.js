import React, { useState, useEffect } from 'react';
import { Container, Table, Badge, Button, Alert, Spinner } from 'react-bootstrap';
import axios from 'axios';

const ProductStatus = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updateLoading, setUpdateLoading] = useState(null);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/merchant/products');
      setProducts(Array.isArray(response.data) ? response.data : []);
      setError('');
    } catch (err) {
      setError('Failed to load products. Please try again later.');
      console.error('Error fetching products:', err);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'active':
        return <Badge bg="success">Active</Badge>;
      case 'inactive':
        return <Badge bg="secondary">Inactive</Badge>;
      default:
        return <Badge bg="warning">Unknown</Badge>;
    }
  };

  const toggleStatus = async (id, currentStatus) => {
    try {
      setUpdateLoading(id);
      const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
      
      await axios.patch(`/api/merchant/products/${id}/status`, {
        status: newStatus
      });

      setProducts(prevProducts => {
        if (!Array.isArray(prevProducts)) return [];
        return prevProducts.map(product => {
          if (product.id === id) {
            return {
              ...product,
              status: newStatus
            };
          }
          return product;
        });
      });

      setError('');
    } catch (err) {
      setError('Failed to update product status. Please try again.');
      console.error('Error updating product status:', err);
    } finally {
      setUpdateLoading(null);
    }
  };

  if (loading) {
    return (
      <Container className="py-4 text-center">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </Container>
    );
  }

  return (
    <Container className="py-4">
      <h2 className="mb-4">Product Status</h2>
      
      {error && (
        <Alert variant="danger" dismissible onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      {!Array.isArray(products) || products.length === 0 ? (
        <Alert variant="info">
          No products found. Start by adding some products.
        </Alert>
      ) : (
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map(product => (
              <tr key={product.id}>
                <td>{product.id || 'N/A'}</td>
                <td>{product.name || 'N/A'}</td>
                <td>${(product.price || 0).toFixed(2)}</td>
                <td>{product.stock || 0}</td>
                <td>{getStatusBadge(product.status)}</td>
                <td>
                  <Button
                    variant={product.status === 'active' ? 'warning' : 'success'}
                    size="sm"
                    onClick={() => toggleStatus(product.id, product.status)}
                    disabled={updateLoading === product.id}
                  >
                    {updateLoading === product.id ? (
                      <>
                        <Spinner
                          as="span"
                          animation="border"
                          size="sm"
                          role="status"
                          aria-hidden="true"
                          className="me-2"
                        />
                        Updating...
                      </>
                    ) : (
                      product.status === 'active' ? 'Deactivate' : 'Activate'
                    )}
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </Container>
  );
};

export default ProductStatus; 