"use client"

import { useState, useEffect, useCallback } from "react"
import { Container, Row, Col, Card, Table, Button, Form, Modal, Badge, Pagination, InputGroup, Spinner } from "react-bootstrap"
import axios from "axios"
import { FaShoppingBag, FaSearch, FaPlus, FaEdit, FaTrash, FaCheck, FaTimes, FaFilter } from "react-icons/fa"

const AdminProducts = () => {
  const [products, setProducts] = useState([])
  const [filteredProducts, setFilteredProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [categories, setCategories] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [currentProduct, setCurrentProduct] = useState(null)
  const [error, setError] = useState(null)
  const [filters, setFilters] = useState({
    search: "",
    category: "",
    addedBy: "",
    isApproved: "",
  })

  const [formData, setFormData] = useState({
    productName: "",
    description: "",
    price: "",
    stockCount: "",
    category: "",
    imageUrl: "",
    discount: "0",
    isApproved: true,
  })

  const productsPerPage = 10

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const res = await axios.get(`/api/admin/products?page=${currentPage}&limit=${productsPerPage}`)
      const productsData = res.data.products || []
      setProducts(productsData)
      setFilteredProducts(productsData)
      setTotalPages(Math.ceil((res.data.total || 0) / productsPerPage))

      // Extract unique categories
      const uniqueCategories = [...new Set(productsData.map((product) => product.category || ""))]
      setCategories(uniqueCategories)
    } catch (error) {
      console.error("Error fetching products:", error)
      setError("Failed to fetch products. Please try again later.")
    } finally {
      setLoading(false)
    }
  }, [currentPage])

  useEffect(() => {
    fetchProducts()
  }, [fetchProducts])

  // Apply filters
  useEffect(() => {
    if (!products || !Array.isArray(products)) {
      setFilteredProducts([])
      return
    }

    let result = [...products]

    if (filters.search) {
      const searchTerm = filters.search.toLowerCase()
      result = result.filter(
        (product) =>
          (product.productName || "").toLowerCase().includes(searchTerm) ||
          (product.description || "").toLowerCase().includes(searchTerm),
      )
    }

    if (filters.category) {
      result = result.filter((product) => product.category === filters.category)
    }

    if (filters.addedBy) {
      result = result.filter((product) => product.addedBy === filters.addedBy)
    }

    if (filters.isApproved !== "") {
      const isApproved = filters.isApproved === "true"
      result = result.filter((product) => product.isApproved === isApproved)
    }

    setFilteredProducts(result)
  }, [filters, products])

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value,
    })
  }

  const resetFilters = () => {
    setFilters({
      search: "",
      category: "",
      addedBy: "",
      isApproved: "",
    })
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: name === "price" || name === "stockCount" || name === "discount" ? Number(value) : value,
    })
  }

  const handleAddProduct = async (e) => {
    e.preventDefault()
    try {
      await axios.post("/api/admin/products", formData)
      setShowAddModal(false)
      resetForm()
      fetchProducts()
    } catch (error) {
      console.error("Error adding product:", error)
      alert("Failed to add product. Please try again.")
    }
  }

  const handleEditProduct = async (e) => {
    e.preventDefault()
    try {
      await axios.put(`/api/admin/products/${currentProduct._id}`, formData)
      setShowEditModal(false)
      resetForm()
      fetchProducts()
    } catch (error) {
      console.error("Error updating product:", error)
      alert("Failed to update product. Please try again.")
    }
  }

  const handleDeleteProduct = async () => {
    try {
      await axios.delete(`/api/admin/products/${currentProduct._id}`)
      setShowDeleteModal(false)
      fetchProducts()
    } catch (error) {
      console.error("Error deleting product:", error)
      alert("Failed to delete product. Please try again.")
    }
  }

  const handleApproveProduct = async (productId, isApproved) => {
    try {
      await axios.put(`/api/admin/products/${productId}/approve`, { isApproved })
      fetchProducts()
    } catch (error) {
      console.error("Error approving product:", error)
      alert("Failed to update product approval status. Please try again.")
    }
  }

  const openEditModal = (product) => {
    setCurrentProduct(product)
    setFormData({
      productName: product.productName,
      description: product.description,
      price: product.price,
      stockCount: product.stockCount,
      category: product.category,
      imageUrl: product.imageUrl,
      discount: product.discount,
      isApproved: product.isApproved,
    })
    setShowEditModal(true)
  }

  const openDeleteModal = (product) => {
    setCurrentProduct(product)
    setShowDeleteModal(true)
  }

  const resetForm = () => {
    setFormData({
      productName: "",
      description: "",
      price: "",
      stockCount: "",
      category: "",
      imageUrl: "",
      discount: "0",
      isApproved: true,
    })
  }

  const renderPagination = () => {
    if (totalPages <= 1) return null

    const items = []
    for (let number = 1; number <= totalPages; number++) {
      items.push(
        <Pagination.Item key={number} active={number === currentPage} onClick={() => setCurrentPage(number)}>
          {number}
        </Pagination.Item>,
      )
    }

    return (
      <Pagination className="justify-content-center mt-4">
        <Pagination.Prev onClick={() => setCurrentPage(Math.max(1, currentPage - 1))} disabled={currentPage === 1} />
        {items}
        <Pagination.Next
          onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
        />
      </Pagination>
    )
  }

  if (loading) {
    return (
      <Container className="mt-5">
        <Row className="justify-content-center">
          <Col md={6} className="text-center">
            <Spinner animation="border" role="status">
              <span className="visually-hidden">Loading...</span>
            </Spinner>
            <p className="mt-2">Loading products...</p>
          </Col>
        </Row>
      </Container>
    )
  }

  if (error) {
    return (
      <Container className="mt-5">
        <Row className="justify-content-center">
          <Col md={6} className="text-center">
            <div className="alert alert-danger">{error}</div>
            <Button variant="primary" onClick={fetchProducts}>
              Retry
            </Button>
          </Col>
        </Row>
      </Container>
    )
  }

  return (
    <Container>
      <Row className="mb-4">
        <Col>
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h2>
                <FaShoppingBag className="me-2" />
                Product Management
              </h2>
              <p className="text-muted">Manage your product catalog</p>
            </div>
            <Button variant="primary" onClick={() => setShowAddModal(true)}>
              <FaPlus className="me-2" />
              Add Product
            </Button>
          </div>
        </Col>
      </Row>

      {/* Filters */}
      <Row className="mb-4">
        <Col>
          <Card className="shadow-sm">
            <Card.Body>
              <h5 className="mb-3">
                <FaFilter className="me-2" />
                Filter Products
              </h5>
              <Row>
                <Col md={3} className="mb-3">
                  <Form.Group>
                    <Form.Label>Search</Form.Label>
                    <InputGroup>
                      <Form.Control
                        type="text"
                        name="search"
                        value={filters.search}
                        onChange={handleFilterChange}
                        placeholder="Search products"
                      />
                      <InputGroup.Text>
                        <FaSearch />
                      </InputGroup.Text>
                    </InputGroup>
                  </Form.Group>
                </Col>
                <Col md={3} className="mb-3">
                  <Form.Group>
                    <Form.Label>Category</Form.Label>
                    <Form.Select name="category" value={filters.category} onChange={handleFilterChange}>
                      <option value="">All Categories</option>
                      {categories.map((category, index) => (
                        <option key={index} value={category}>
                          {category}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={3} className="mb-3">
                  <Form.Group>
                    <Form.Label>Added By</Form.Label>
                    <Form.Select name="addedBy" value={filters.addedBy} onChange={handleFilterChange}>
                      <option value="">All Sources</option>
                      <option value="admin">Admin</option>
                      <option value="merchant">Merchant</option>
                      <option value="AI">AI</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={3} className="mb-3">
                  <Form.Group>
                    <Form.Label>Status</Form.Label>
                    <Form.Select name="isApproved" value={filters.isApproved} onChange={handleFilterChange}>
                      <option value="">All Status</option>
                      <option value="true">Approved</option>
                      <option value="false">Pending</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>
              <div className="text-end">
                <Button variant="outline-secondary" onClick={resetFilters}>
                  Reset Filters
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Products Table */}
      <Row>
        <Col>
          <Card className="shadow-sm">
            <Card.Body>
              {filteredProducts.length > 0 ? (
                <Table responsive className="align-middle">
                  <thead>
                    <tr>
                      <th>Image</th>
                      <th>Name</th>
                      <th>Category</th>
                      <th>Price</th>
                      <th>Stock</th>
                      <th>Added By</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredProducts.map((product) => (
                      <tr key={product._id}>
                        <td>
                          <img
                            src={product.imageUrl || "/placeholder.svg"}
                            alt={product.productName}
                            style={{ width: "50px", height: "50px", objectFit: "cover" }}
                            className="rounded"
                          />
                        </td>
                        <td>
                          <div className="fw-bold">{product.productName || "N/A"}</div>
                          <small className="text-muted">{product.description?.substring(0, 50) || "N/A"}</small>
                        </td>
                        <td>{product.category || "N/A"}</td>
                        <td>
                          {product.price ? `₹${product.price}` : "N/A"}
                          {product.discount > 0 && (
                            <Badge bg="danger" className="ms-2">
                              {product.discount}% OFF
                            </Badge>
                          )}
                        </td>
                        <td>
                          <Badge bg={product.stockCount > 0 ? "success" : "danger"}>
                            {product.stockCount > 0 ? product.stockCount : "Out of Stock"}
                          </Badge>
                        </td>
                        <td>
                          <Badge
                            bg={
                              product.addedBy === "admin"
                                ? "primary"
                                : product.addedBy === "merchant"
                                  ? "info"
                                  : "warning"
                            }
                          >
                            {product.addedBy || "N/A"}
                          </Badge>
                        </td>
                        <td>
                          <Badge bg={product.isApproved ? "success" : "warning"}>
                            {product.isApproved ? "Approved" : "Pending"}
                          </Badge>
                        </td>
                        <td>
                          <div className="d-flex">
                            <Button
                              variant="outline-primary"
                              size="sm"
                              className="me-2"
                              onClick={() => openEditModal(product)}
                            >
                              <FaEdit />
                            </Button>
                            <Button
                              variant="outline-danger"
                              size="sm"
                              className="me-2"
                              onClick={() => openDeleteModal(product)}
                            >
                              <FaTrash />
                            </Button>
                            <Button
                              variant="outline-success"
                              size="sm"
                              onClick={() => handleApproveProduct(product._id, !product.isApproved)}
                            >
                              {product.isApproved ? <FaTimes /> : <FaCheck />}
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              ) : (
                <div className="text-center py-5">
                  <h4>No products found</h4>
                  <p className="text-muted">Try adjusting your filters or add new products</p>
                  <Button variant="primary" onClick={() => setShowAddModal(true)}>
                    <FaPlus className="me-2" />
                    Add Product
                  </Button>
                </div>
              )}

              {renderPagination()}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Add Product Modal */}
      <Modal show={showAddModal} onHide={() => setShowAddModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Add New Product</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleAddProduct}>
          <Modal.Body>
            <Row>
              <Col md={6} className="mb-3">
                <Form.Group>
                  <Form.Label>Product Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="productName"
                    value={formData.productName}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6} className="mb-3">
                <Form.Group>
                  <Form.Label>Category</Form.Label>
                  <Form.Control
                    type="text"
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    required
                    list="categories"
                  />
                  <datalist id="categories">
                    {categories.map((category, index) => (
                      <option key={index} value={category} />
                    ))}
                  </datalist>
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                required
              />
            </Form.Group>

            <Row>
              <Col md={4} className="mb-3">
                <Form.Group>
                  <Form.Label>Price (₹)</Form.Label>
                  <Form.Control
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    required
                    min="0"
                    step="0.01"
                  />
                </Form.Group>
              </Col>
              <Col md={4} className="mb-3">
                <Form.Group>
                  <Form.Label>Stock Count</Form.Label>
                  <Form.Control
                    type="number"
                    name="stockCount"
                    value={formData.stockCount}
                    onChange={handleInputChange}
                    required
                    min="0"
                  />
                </Form.Group>
              </Col>
              <Col md={4} className="mb-3">
                <Form.Group>
                  <Form.Label>Discount (%)</Form.Label>
                  <Form.Control
                    type="number"
                    name="discount"
                    value={formData.discount}
                    onChange={handleInputChange}
                    min="0"
                    max="100"
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Image URL</Form.Label>
              <Form.Control
                type="text"
                name="imageUrl"
                value={formData.imageUrl}
                onChange={handleInputChange}
                required
                placeholder="https://example.com/image.jpg"
              />
            </Form.Group>

            <Form.Group>
              <Form.Check
                type="checkbox"
                label="Approve Product"
                name="isApproved"
                checked={formData.isApproved}
                onChange={(e) => setFormData({ ...formData, isApproved: e.target.checked })}
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowAddModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              Add Product
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      {/* Edit Product Modal */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Edit Product</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleEditProduct}>
          <Modal.Body>
            <Row>
              <Col md={6} className="mb-3">
                <Form.Group>
                  <Form.Label>Product Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="productName"
                    value={formData.productName}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6} className="mb-3">
                <Form.Group>
                  <Form.Label>Category</Form.Label>
                  <Form.Control
                    type="text"
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    required
                    list="edit-categories"
                  />
                  <datalist id="edit-categories">
                    {categories.map((category, index) => (
                      <option key={index} value={category} />
                    ))}
                  </datalist>
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                required
              />
            </Form.Group>

            <Row>
              <Col md={4} className="mb-3">
                <Form.Group>
                  <Form.Label>Price (₹)</Form.Label>
                  <Form.Control
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    required
                    min="0"
                    step="0.01"
                  />
                </Form.Group>
              </Col>
              <Col md={4} className="mb-3">
                <Form.Group>
                  <Form.Label>Stock Count</Form.Label>
                  <Form.Control
                    type="number"
                    name="stockCount"
                    value={formData.stockCount}
                    onChange={handleInputChange}
                    required
                    min="0"
                  />
                </Form.Group>
              </Col>
              <Col md={4} className="mb-3">
                <Form.Group>
                  <Form.Label>Discount (%)</Form.Label>
                  <Form.Control
                    type="number"
                    name="discount"
                    value={formData.discount}
                    onChange={handleInputChange}
                    min="0"
                    max="100"
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Image URL</Form.Label>
              <Form.Control
                type="text"
                name="imageUrl"
                value={formData.imageUrl}
                onChange={handleInputChange}
                required
              />
            </Form.Group>

            <Form.Group>
              <Form.Check
                type="checkbox"
                label="Approve Product"
                name="isApproved"
                checked={formData.isApproved}
                onChange={(e) => setFormData({ ...formData, isApproved: e.target.checked })}
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowEditModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              Update Product
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      {/* Delete Product Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete the product "{currentProduct?.productName}"? This action cannot be undone.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDeleteProduct}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  )
}

export default AdminProducts
