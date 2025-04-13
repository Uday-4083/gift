"use client"

import { useState, useEffect, useCallback } from "react"
import { Container, Row, Col, Card, Table, Button, Badge, Modal, Pagination, Spinner } from "react-bootstrap"
import axios from "axios"
import { FaUserTag, FaCheck, FaTimes, FaEye } from "react-icons/fa"

const AdminMerchants = () => {
  const [merchants, setMerchants] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [showViewModal, setShowViewModal] = useState(false)
  const [currentMerchant, setCurrentMerchant] = useState(null)
  const [merchantProducts, setMerchantProducts] = useState([])
  const [loadingProducts, setLoadingProducts] = useState(false)

  const merchantsPerPage = 10

  const fetchMerchants = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const res = await axios.get(`/api/admin/merchants?page=${currentPage}&limit=${merchantsPerPage}`)
      const merchantsData = res.data.merchants || []
      setMerchants(merchantsData)
      setTotalPages(Math.ceil((res.data.total || 0) / merchantsPerPage))
    } catch (error) {
      console.error("Error fetching merchants:", error)
      setError("Failed to fetch merchants. Please try again later.")
    } finally {
      setLoading(false)
    }
  }, [currentPage])

  useEffect(() => {
    fetchMerchants()
  }, [fetchMerchants])

  const approveMerchant = async (id, isApproved) => {
    try {
      await axios.put(`/api/admin/merchants/${id}/approve`, { isApproved })
      fetchMerchants()
    } catch (error) {
      console.error("Error updating merchant status:", error)
      alert("Failed to update merchant status. Please try again.")
    }
  }

  const viewMerchantDetails = async (merchant) => {
    setCurrentMerchant(merchant)
    setShowViewModal(true)

    try {
      setLoadingProducts(true)
      const res = await axios.get(`/api/admin/merchants/${merchant._id}/products`)
      setMerchantProducts(res.data || [])
    } catch (error) {
      console.error("Error fetching merchant products:", error)
      setMerchantProducts([])
    } finally {
      setLoadingProducts(false)
    }
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
            <p className="mt-2">Loading merchants...</p>
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
            <Button variant="primary" onClick={fetchMerchants}>
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
          <h2>
            <FaUserTag className="me-2" />
            Merchant Management
          </h2>
          <p className="text-muted">View and manage merchant accounts</p>
        </Col>
      </Row>

      <Row>
        <Col>
          <Card className="shadow-sm">
            <Card.Body>
              <Table responsive className="align-middle">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Joined Date</th>
                    <th>Products</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {merchants && merchants.length > 0 ? (
                    merchants.map((merchant) => (
                      <tr key={merchant._id}>
                        <td>{merchant.fullName || "N/A"}</td>
                        <td>{merchant.email || "N/A"}</td>
                        <td>{new Date(merchant.createdAt || "").toLocaleDateString()}</td>
                        <td>{merchant.productCount || 0}</td>
                        <td>
                          <Badge bg={merchant.isApproved ? "success" : "warning"}>
                            {merchant.isApproved ? "Approved" : "Pending"}
                          </Badge>
                        </td>
                        <td>
                          <Button
                            variant="outline-primary"
                            size="sm"
                            className="me-2"
                            onClick={() => viewMerchantDetails(merchant)}
                          >
                            <FaEye />
                          </Button>
                          <Button
                            variant={merchant.isApproved ? "outline-danger" : "outline-success"}
                            size="sm"
                            onClick={() => approveMerchant(merchant._id, !merchant.isApproved)}
                          >
                            {merchant.isApproved ? <FaTimes /> : <FaCheck />}
                          </Button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="text-center">
                        No merchants found
                      </td>
                    </tr>
                  )}
                </tbody>
              </Table>

              {renderPagination()}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* View Merchant Modal */}
      <Modal show={showViewModal} onHide={() => setShowViewModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Merchant Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {currentMerchant && (
            <>
              <Row className="mb-4">
                <Col md={6}>
                  <h6>Account Information</h6>
                  <p className="mb-1">
                    <strong>Name:</strong> {currentMerchant.fullName || "N/A"}
                  </p>
                  <p className="mb-1">
                    <strong>Email:</strong> {currentMerchant.email || "N/A"}
                  </p>
                  <p className="mb-1">
                    <strong>Joined:</strong> {new Date(currentMerchant.createdAt || "").toLocaleDateString()}
                  </p>
                  <p className="mb-1">
                    <strong>Status:</strong>{" "}
                    <Badge bg={currentMerchant.isApproved ? "success" : "warning"}>
                      {currentMerchant.isApproved ? "Approved" : "Pending"}
                    </Badge>
                  </p>
                </Col>
              </Row>

              <h6>Products</h6>
              {loadingProducts ? (
                <div className="text-center py-3">
                  <Spinner animation="border" size="sm" />
                  <p className="mt-2">Loading products...</p>
                </div>
              ) : merchantProducts.length > 0 ? (
                <Table responsive>
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Category</th>
                      <th>Price</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {merchantProducts.map((product) => (
                      <tr key={product._id}>
                        <td>{product.productName || "N/A"}</td>
                        <td>{product.category || "N/A"}</td>
                        <td>${product.price || 0}</td>
                        <td>
                          <Badge bg={product.isApproved ? "success" : "warning"}>
                            {product.isApproved ? "Approved" : "Pending"}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              ) : (
                <p className="text-muted">No products found</p>
              )}
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowViewModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  )
}

export default AdminMerchants
