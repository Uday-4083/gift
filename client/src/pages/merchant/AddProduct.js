import React, { useState } from 'react';
import { Container, Form, Button, Alert, Row, Col, Spinner } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AddProduct = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [product, setProduct] = useState({
    name: '',
    description: '',
    basePrice: '',
    category: '',
    stock: '',
    imageUrl: ''
  });

  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState('');
  const [success, setSuccess] = useState('');

  const validateForm = () => {
    const newErrors = {};
    
    if (!product.name.trim()) {
      newErrors.name = 'Product name is required';
    }
    
    if (!product.description.trim()) {
      newErrors.description = 'Description is required';
    }
    
    if (!product.basePrice || isNaN(product.basePrice) || Number(product.basePrice) <= 0) {
      newErrors.basePrice = 'Please enter a valid price';
    }
    
    if (!product.category.trim()) {
      newErrors.category = 'Category is required';
    }
    
    if (!product.stock || isNaN(product.stock) || Number(product.stock) < 0) {
      newErrors.stock = 'Please enter a valid stock quantity';
    }

    if (!product.imageUrl.trim()) {
      newErrors.imageUrl = 'Product image URL is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    
    if (type === 'file') {
      setProduct(prev => ({
        ...prev,
        images: Array.from(files).map(file => URL.createObjectURL(file))
      }));
    } else {
      setProduct(prev => ({
        ...prev,
        [name]: value
      }));
    }

    // Clear field-specific error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError('');
    setSuccess('');

    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      
      const response = await axios.post('/api/merchant/products', {
        name: product.name,
        description: product.description,
        basePrice: Number(product.basePrice),
        category: product.category,
        stock: Number(product.stock),
        imageUrl: product.imageUrl
      });

      if (response.data.success) {
        setSuccess('Product added successfully! Awaiting admin approval.');
        setProduct({
          name: '',
          description: '',
          basePrice: '',
          category: '',
          stock: '',
          imageUrl: ''
        });

        // Redirect to product status page after 2 seconds
        setTimeout(() => {
          navigate('/merchant/products');
        }, 2000);
      } else {
        throw new Error(response.data.message || 'Failed to add product');
      }
    } catch (err) {
      console.error('Error adding product:', err);
      setSubmitError(err.response?.data?.message || 'Failed to add product. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="py-4">
      <h2 className="mb-4">Add New Product</h2>
      
      {submitError && (
        <Alert variant="danger" dismissible onClose={() => setSubmitError('')}>
          {submitError}
        </Alert>
      )}
      
      {success && (
        <Alert variant="success" dismissible onClose={() => setSuccess('')}>
          {success}
        </Alert>
      )}
      
      <Form onSubmit={handleSubmit}>
        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Product Name *</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={product.name}
                onChange={handleChange}
                isInvalid={!!errors.name}
              />
              <Form.Control.Feedback type="invalid">
                {errors.name}
              </Form.Control.Feedback>
            </Form.Group>
          </Col>

          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Category *</Form.Label>
              <Form.Control
                type="text"
                name="category"
                value={product.category}
                onChange={handleChange}
                isInvalid={!!errors.category}
              />
              <Form.Control.Feedback type="invalid">
                {errors.category}
              </Form.Control.Feedback>
            </Form.Group>
          </Col>
        </Row>

        <Form.Group className="mb-3">
          <Form.Label>Description *</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            name="description"
            value={product.description}
            onChange={handleChange}
            isInvalid={!!errors.description}
          />
          <Form.Control.Feedback type="invalid">
            {errors.description}
          </Form.Control.Feedback>
        </Form.Group>

        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Base Price *</Form.Label>
              <Form.Control
                type="number"
                step="0.01"
                name="basePrice"
                value={product.basePrice}
                onChange={handleChange}
                isInvalid={!!errors.basePrice}
              />
              <Form.Control.Feedback type="invalid">
                {errors.basePrice}
              </Form.Control.Feedback>
            </Form.Group>
          </Col>

          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Stock *</Form.Label>
              <Form.Control
                type="number"
                name="stock"
                value={product.stock}
                onChange={handleChange}
                isInvalid={!!errors.stock}
              />
              <Form.Control.Feedback type="invalid">
                {errors.stock}
              </Form.Control.Feedback>
            </Form.Group>
          </Col>
        </Row>

        <Form.Group className="mb-3">
          <Form.Label>Product Image URL *</Form.Label>
          <Form.Control
            type="text"
            name="imageUrl"
            value={product.imageUrl}
            onChange={handleChange}
            placeholder="Enter image URL"
            isInvalid={!!errors.imageUrl}
          />
          <Form.Control.Feedback type="invalid">
            {errors.imageUrl}
          </Form.Control.Feedback>
          <Form.Text className="text-muted">
            Enter a valid image URL for your product (e.g., https://example.com/image.jpg)
          </Form.Text>
        </Form.Group>

        <Button 
          variant="primary" 
          type="submit"
          disabled={loading}
        >
          {loading ? (
            <>
              <Spinner
                as="span"
                animation="border"
                size="sm"
                className="me-2"
              />
              Adding Product...
            </>
          ) : (
            'Add Product'
          )}
        </Button>
      </Form>
    </Container>
  );
};

export default AddProduct; 