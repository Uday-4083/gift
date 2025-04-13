"use client"

import { useState, useEffect, useCallback } from "react"
import { Container, Row, Col, Card, Table, Badge, Button, Pagination } from "react-bootstrap"
import axios from "axios"
import { FaComments, FaCheck, FaTrash } from "react-icons/fa"

const AdminFeedback = () => {
  const [feedback, setFeedback] = useState([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  const feedbackPerPage = 10

  const fetchFeedback = useCallback(async () => {
    try {
      setLoading(true)
      const res = await axios.get(`/api/admin/feedback?page=${currentPage}&limit=${feedbackPerPage}`)
      setFeedback(res.data.feedback)
      setTotalPages(Math.ceil(res.data.total / feedbackPerPage))
      setLoading(false)
    } catch (error) {
      console.error("Error fetching feedback:", error)
      setLoading(false)
    }
  }, [currentPage, feedbackPerPage])

  useEffect(() => {
    fetchFeedback()
  }, [fetchFeedback])

  const markAsRead = async (id) => {
    try {
      await axios.put(`/api/admin/feedback/${id}/read`)
      fetchFeedback()
    } catch (error) {
      console.error("Error marking feedback as read:", error)
      alert("Failed to update feedback status. Please try again.")
    }
  }

  const deleteFeedback = async (id) => {
    if (window.confirm("Are you sure you want to delete this feedback?")) {
      try {
        await axios.delete(`/api/admin/feedback/${id}`)
        fetchFeedback()
      } catch (error) {
        console.error("Error deleting feedback:", error)
        alert("Failed to delete feedback. Please try again.")
      }
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

  return (
    <Container>
      <Row className="mb-4">
        <Col>
          <h2>
            <FaComments className="me-2" />
            User Feedback
          </h2>
          <p className="text-muted">View and manage user feedback and suggestions</p>
        </Col>
      </Row>

      <Row>
        <Col>
          <Card className="shadow-sm">
            <Card.Body>
              {loading ? (
                <div className="text-center py-5">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                  <p className="mt-3">Loading feedback...</p>
                </div>
              ) : feedback.length > 0 ? (
                <Table responsive className="align-middle">
                  <thead>
                    <tr>
                      <th>User</th>
                      <th>Subject</th>
                      <th>Message</th>
                      <th>Date</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {feedback.map((item) => (
                      <tr key={item._id} className={!item.isRead ? "table-light" : ""}>
                        <td>
                          <div>{item.user.fullName}</div>
                          <small className="text-muted">{item.user.email}</small>
                        </td>
                        <td>{item.subject}</td>
                        <td>{item.message.substring(0, 100)}...</td>
                        <td>{new Date(item.createdAt).toLocaleDateString()}</td>
                        <td>{item.isRead ? <Badge bg="success">Read</Badge> : <Badge bg="warning">Unread</Badge>}</td>
                        <td>
                          {!item.isRead && (
                            <Button
                              variant="outline-success"
                              size="sm"
                              className="me-2"
                              onClick={() => markAsRead(item._id)}
                            >
                              <FaCheck />
                            </Button>
                          )}
                          <Button variant="outline-danger" size="sm" onClick={() => deleteFeedback(item._id)}>
                            <FaTrash />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              ) : (
                <div className="text-center py-5">
                  <h4>No feedback found</h4>
                  <p className="text-muted">There are no user feedback or suggestions at this time</p>
                </div>
              )}

              {renderPagination()}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  )
}

export default AdminFeedback
