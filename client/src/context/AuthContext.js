"use client"

import { createContext, useState, useEffect } from "react"
import axios from "axios"

export const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Load user from localStorage on initial render
  useEffect(() => {
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
    setLoading(false)
  }, [])

  // Register user
  const register = async (userData) => {
    try {
      setLoading(true)
      const endpoint = userData.role === 'merchant' ? '/api/auth/merchant/signup' : '/api/auth/register'
      const res = await axios.post(endpoint, userData)
      setLoading(false)
      return res.data
    } catch (err) {
      setLoading(false)
      setError(err.response?.data?.message || "An error occurred")
      throw err
    }
  }

  // Verify OTP
  const verifyOTP = async (email, otp) => {
    try {
      setLoading(true)
      const res = await axios.post("/api/auth/verify-otp", { email, otp })

      // Save user to state and localStorage
      setUser(res.data)
      localStorage.setItem("user", JSON.stringify(res.data))

      // Set auth token in axios headers
      if (res.data.token) {
        axios.defaults.headers.common["Authorization"] = `Bearer ${res.data.token}`
      }

      setLoading(false)
      return res.data
    } catch (err) {
      setLoading(false)
      setError(err.response?.data?.message || "An error occurred")
      throw err
    }
  }

  // Login user
  const login = async (email, password) => {
    try {
      setLoading(true)
      setError(null)
      
      // Clear any existing auth data
      localStorage.removeItem("user")
      delete axios.defaults.headers.common["Authorization"]

      const res = await axios.post("/api/auth/login", { email, password })

      // Save user to state and localStorage
      const userData = res.data
      setUser(userData)
      localStorage.setItem("user", JSON.stringify(userData))

      // Set auth token in axios headers
      if (userData.token) {
        axios.defaults.headers.common["Authorization"] = `Bearer ${userData.token}`
      }

      setLoading(false)
      return userData
    } catch (err) {
      setLoading(false)
      const errorMessage = err.response?.data?.message || "An error occurred during login"
      setError(errorMessage)
      throw err
    }
  }

  // Logout user
  const logout = () => {
    // Remove user from state and localStorage
    setUser(null)
    localStorage.removeItem("user")
    setError(null)

    // Remove auth token from axios headers
    delete axios.defaults.headers.common["Authorization"]
  }

  // Resend OTP
  const resendOTP = async (email) => {
    try {
      setLoading(true)
      const res = await axios.post("/api/auth/resend-otp", { email })
      setLoading(false)
      return res.data
    } catch (err) {
      setLoading(false)
      setError(err.response?.data?.message || "An error occurred")
      throw err
    }
  }

  // Add axios response interceptor to handle token expiration
  useEffect(() => {
    const interceptor = axios.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401 && user) {
          // Token expired or invalid, logout user
          logout()
        }
        return Promise.reject(error)
      }
    )

    return () => {
      // Remove interceptor on cleanup
      axios.interceptors.response.eject(interceptor)
    }
  }, [user])

  // Set auth token in axios headers if user exists
  useEffect(() => {
    if (user?.token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${user.token}`
    } else {
      delete axios.defaults.headers.common["Authorization"]
    }
  }, [user])

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        register,
        verifyOTP,
        login,
        logout,
        resendOTP,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
