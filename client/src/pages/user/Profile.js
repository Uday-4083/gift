"use client"

import { useState, useContext, useEffect } from "react"
import { Container, Row, Col, Card, Form, Button, Alert, Spinner } from "react-bootstrap"
import { AuthContext } from "../../context/AuthContext"
import axios from "axios"
import { FaUser, FaLock } from "react-icons/fa"

const Profile = () => {
  const { user, setUser } = useContext(AuthContext);
  const [profileData, setProfileData] = useState({
    fullName: '',
    email: '',
    age: '',
    gender: ''
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [profileError, setProfileError] = useState('');
  const [profileSuccess, setProfileSuccess] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');
  const [isProfileLoading, setIsProfileLoading] = useState(false);
  const [isPasswordLoading, setIsPasswordLoading] = useState(false);
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalSuggestions: 0
  });

  useEffect(() => {
    // Set initial profile data from user context
    if (user) {
      setProfileData({
        fullName: user.fullName || '',
        email: user.email || '',
        age: user.age || '',
        gender: user.gender || ''
      });
    }
    
    // Fetch user stats
    const fetchUserStats = async () => {
      try {
        // Fetch user's orders
        const ordersRes = await axios.get('/api/user/orders');
        
        // Fetch user's suggestions
        const suggestionsRes = await axios.get('/api/user/suggestions');
        
        setStats({
          totalOrders: ordersRes.data?.length || 0,
          totalSuggestions: suggestionsRes.data?.length || 0
        });
      } catch (error) {
        console.error('Error fetching user stats:', error);
      }
    };
    
    fetchUserStats();
  }, [user]);

  const handleProfileChange = e => {
    setProfileData({ ...profileData, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = e => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
  };

  const updateProfile = async e => {
    e.preventDefault();
    setProfileError('');
    setProfileSuccess('');
    
    try {
      setIsProfileLoading(true);
      
      // Make API call to update profile
      const response = await axios.put('/api/user/profile', {
        fullName: profileData.fullName,
        age: Number(profileData.age),
        gender: profileData.gender
      });
      
      // Update user context with new data
      setUser(prevUser => ({
        ...prevUser,
        ...response.data
      }));
      
      // Update local storage
      const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
      localStorage.setItem('user', JSON.stringify({
        ...storedUser,
        ...response.data
      }));
      
      setProfileSuccess('Profile updated successfully');
      setIsProfileLoading(false);
    } catch (err) {
      setProfileError(err.response?.data?.message || 'Failed to update profile');
      setIsProfileLoading(false);
    }
  };

  const updatePassword = async e => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess('');
    
    // Validate passwords
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError('New passwords do not match');
      return;
    }
    
    // Enhanced password validation
    if (passwordData.newPassword.length < 6) {
      setPasswordError('New password must be at least 6 characters long');
      return;
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/;
    if (!passwordRegex.test(passwordData.newPassword)) {
      setPasswordError('Password must contain at least one uppercase letter, one lowercase letter, and one number');
      return;
    }
    
    try {
      setIsPasswordLoading(true);
      
      // Make API call to update password
      await axios.put('/api/user/password', {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      });
      
      // Reset form
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      
      setPasswordSuccess('Password updated successfully');
      setIsPasswordLoading(false);
    } catch (err) {
      setPasswordError(err.response?.data?.message || 'Failed to update password');
      setIsPasswordLoading(false);
    }
  };

  return (
    <Container>
      <Row className="mb-4">
        <Col>
          <h2>My Profile</h2>
          <p className="text-muted">Manage your account information</p>
        </Col>
      </Row>
      
      <Row>
        <Col lg={4} className="mb-4">
          <Card className="shadow-sm">
            <Card.Body className="text-center">
              <div className="mb-3">
                <div className="bg-primary text-white rounded-circle d-inline-flex justify-content-center align-items-center" style={{ width: '100px', height: '100px' }}>
                  <FaUser size={40} />
                </div>
              </div>
              <h4>{user?.fullName || 'N/A'}</h4>
              <p className="text-muted">{user?.email || 'N/A'}</p>
              <hr />
              <Row>
                <Col xs={6}>
                  <div className="mb-2">
                    <h5>{stats.totalOrders}</h5>
                    <small className="text-muted">Orders</small>
                  </div>
                </Col>
                <Col xs={6}>
                  <div className="mb-2">
                    <h5>{stats.totalSuggestions}</h5>
                    <small className="text-muted">Recommendations</small>
                  </div>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
        
        <Col lg={8}>
          <Card className="shadow-sm mb-4">
            <Card.Header className="bg-white">
              <h5 className="mb-0">
                <FaUser className="me-2" />
                Personal Information
              </h5>
            </Card.Header>
            <Card.Body>
              {profileError && <Alert variant="danger">{profileError}</Alert>}
              {profileSuccess && <Alert variant="success">{profileSuccess}</Alert>}
              
              <Form onSubmit={updateProfile}>
                <Row>
                  <Col md={6} className="mb-3">
                    <Form.Group>
                      <Form.Label>Full Name</Form.Label>
                      <Form.Control
                        type="text"
                        name="fullName"
                        value={profileData.fullName}
                        onChange={handleProfileChange}
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6} className="mb-3">
                    <Form.Group>
                      <Form.Label>Email Address</Form.Label>
                      <Form.Control
                        type="email"
                        name="email"
                        value={profileData.email}
                        readOnly
                        disabled
                      />
                      <Form.Text className="text-muted">
                        Email cannot be changed
                      </Form.Text>
                    </Form.Group>
                  </Col>
                </Row>
                
                <Row>
                  <Col md={6} className="mb-3">
                    <Form.Group>
                      <Form.Label>Age</Form.Label>
                      <Form.Control
                        type="number"
                        name="age"
                        value={profileData.age}
                        onChange={handleProfileChange}
                        required
                        min="18"
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6} className="mb-3">
                    <Form.Group>
                      <Form.Label>Gender</Form.Label>
                      <Form.Select
                        name="gender"
                        value={profileData.gender}
                        onChange={handleProfileChange}
                        required
                      >
                        <option value="">Select gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                </Row>
                
                <Button 
                  variant="primary" 
                  type="submit"
                  disabled={isProfileLoading}
                >
                  {isProfileLoading ? (
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
                    'Update Profile'
                  )}
                </Button>
              </Form>
            </Card.Body>
          </Card>
          
          <Card className="shadow-sm">
            <Card.Header className="bg-white">
              <h5 className="mb-0">
                <FaLock className="me-2" />
                Change Password
              </h5>
            </Card.Header>
            <Card.Body>
              {passwordError && <Alert variant="danger">{passwordError}</Alert>}
              {passwordSuccess && <Alert variant="success">{passwordSuccess}</Alert>}

              <Form onSubmit={updatePassword}>
                <Row>
                  <Col md={6} className="mb-3">
                    <Form.Group>
                      <Form.Label>Current Password</Form.Label>
                      <Form.Control
                        type="password"
                        name="currentPassword"
                        value={passwordData.currentPassword}
                        onChange={handlePasswordChange}
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6} className="mb-3">
                    <Form.Group>
                      <Form.Label>New Password</Form.Label>
                      <Form.Control
                        type="password"
                        name="newPassword"
                        value={passwordData.newPassword}
                        onChange={handlePasswordChange}
                        required
                        minLength="6"
                      />
                    </Form.Group>
                  </Col>
                </Row>
                
                <Row>
                  <Col md={6} className="mb-3">
                    <Form.Group>
                      <Form.Label>Confirm Password</Form.Label>
                      <Form.Control
                        type="password"
                        name="confirmPassword"
                        value={passwordData.confirmPassword}
                        onChange={handlePasswordChange}
                        required
                        minLength="6"
                      />
                    </Form.Group>
                  </Col>
                </Row>
                
                <Button 
                  variant="primary" 
                  type="submit"
                  disabled={isPasswordLoading}
                >
                  {isPasswordLoading ? (
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
                    'Update Password'
                  )}
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Profile;
