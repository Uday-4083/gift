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
  InputGroup
} from 'react-bootstrap';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { FaSearch, FaEdit, FaTrash } from 'react-icons/fa';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [status, setStatus] = useState('');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');
  const [categories, setCategories] = useState([]);
  const [updateLoading, setUpdateLoading] = useState(null);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/merchant/products', {
        params: {
          page,
          search,
          category,
          status,
          sortBy,
          sortOrder
        }
      });

      setProducts(response.data.products);
      setTotalPages(response.data.pagination.pages);
      setCategories(response.data.filters.categories);
      setError('');
    } catch (err) {
      setError('Failed to load products. Please try again.');
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [page, category, status, sortBy, sortOrder]);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      if (page === 1) {
        fetchProducts();
      } else {
        setPage(1);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [search]);

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  const handleStatusToggle = async (productId, currentStatus) => {
    try {
      setUpdateLoading(productId);
      const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
      
      await axios.patch(`/api/merchant/products/${productId}/status`, {
        status: newStatus
      });

      setProducts(products.map(product => {
        if (product._id === productId) {
          return { ...product, status: newStatus };
        }
        return product;
      }));

      setError('');
    } catch (err) {
      setError('Failed to update product status. Please try again.');
      console.error('Error updating product status:', err);
    } finally {
      setUpdateLoading(null);
    }
  };

  const getStatusBadge = (status) => {
    return (
      <Badge bg={status === 'active' ? 'success' : 'secondary'}>
        {status === 'active' ? 'Active' : 'Inactive'}
      </Badge>
    );
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
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Products</h2>
        <Link to="/merchant/products/add">
          <Button variant="primary">Add New Product</Button>
        </Link>
      </div>

      {error && (
        <Alert variant="danger" dismissible onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      <Card className="mb-4">
        <Card.Body>
          <Row className="align-items-end">
            <Col md={4}>
              <Form.Group>
                <Form.Label>Search Products</Form.Label>
                <InputGroup>
                  <InputGroup.Text>
                    <FaSearch />
                  </InputGroup.Text>
                  <Form.Control
                    type="text"
                    placeholder="Search by name or description"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </InputGroup>
              </Form.Group>
            </Col>
            <Col md={3}>
              <Form.Group>
                <Form.Label>Category</Form.Label>
                <Form.Select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  <option value="">All Categories</option>
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={3}>
              <Form.Group>
                <Form.Label>Status</Form.Label>
                <Form.Select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                >
                  <option value="">All Status</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {products.length === 0 ? (
        <Alert variant="info">
          No products found. {search && 'Try adjusting your search criteria.'}
        </Alert>
      ) : (
        <>
          <div className="table-responsive">
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Image</th>
                  <th onClick={() => handleSort('name')} style={{ cursor: 'pointer' }}>
                    Name {sortBy === 'name' && (sortOrder === 'asc' ? '↑' : '↓')}
                  </th>
                  <th onClick={() => handleSort('price')} style={{ cursor: 'pointer' }}>
                    Price {sortBy === 'price' && (sortOrder === 'asc' ? '↑' : '↓')}
                  </th>
                  <th>Category</th>
                  <th onClick={() => handleSort('stock')} style={{ cursor: 'pointer' }}>
                    Stock {sortBy === 'stock' && (sortOrder === 'asc' ? '↑' : '↓')}
                  </th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map(product => (
                  <tr key={product._id}>
                    <td>
                      <img
                        src={product.image || '/placeholder.png'}
                        alt={product.name}
                        style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                      />
                    </td>
                    <td>{product.name}</td>
                    <td>${product.price.toFixed(2)}</td>
                    <td>{product.category}</td>
                    <td>{product.stock}</td>
                    <td>{getStatusBadge(product.status)}</td>
                    <td>
                      <Link to={`/merchant/products/edit/${product._id}`}>
                        <Button variant="outline-primary" size="sm" className="me-2">
                          <FaEdit /> Edit
                        </Button>
                      </Link>
                      <Button
                        variant={product.status === 'active' ? 'outline-warning' : 'outline-success'}
                        size="sm"
                        onClick={() => handleStatusToggle(product._id, product.status)}
                        disabled={updateLoading === product._id}
                      >
                        {updateLoading === product._id ? (
                          <Spinner
                            as="span"
                            animation="border"
                            size="sm"
                            role="status"
                            aria-hidden="true"
                          />
                        ) : (
                          product.status === 'active' ? 'Deactivate' : 'Activate'
                        )}
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>

          <div className="d-flex justify-content-center mt-4">
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
        </>
      )}
    </Container>
  );
};

export default ProductList; 