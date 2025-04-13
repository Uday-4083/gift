"use client"

import { useContext } from "react"
import { Navigate } from "react-router-dom"
import { AuthContext } from "../../context/AuthContext"
import Spinner from "../layout/Spinner"

const RoleRoute = ({ roles, children }) => {
  const { user, loading } = useContext(AuthContext)

  if (loading) {
    return <Spinner />
  }

  // If no user is logged in, redirect to sign in
  if (!user) {
    return <Navigate to="/signin" />
  }

  // Check if user has the required role
  if (!roles.includes(user.role)) {
    // Redirect to appropriate dashboard based on user's actual role
    switch (user.role) {
      case "admin":
        return <Navigate to="/admin/dashboard" />
      case "merchant":
        return <Navigate to="/merchant/dashboard" />
      case "user":
        return <Navigate to="/dashboard" />
      default:
        return <Navigate to="/signin" />
    }
  }

  return children
}

export default RoleRoute
