"use client"

import { useContext } from "react"
import { Navigate } from "react-router-dom"
import { AuthContext } from "../../context/AuthContext"
import Spinner from "../layout/Spinner"

const PrivateRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext)

  if (loading) {
    return <Spinner />
  }

  if (!user) {
    return <Navigate to="/signin" />
  }

  return children
}

export default PrivateRoute
