import { useEffect, useState } from "react"
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import { Toaster } from "react-hot-toast"
import "bootstrap/dist/css/bootstrap.min.css"
import "./assets/css/style.css"
import dynamic from 'next/dynamic'

// Context
import { AuthProvider } from "./context/AuthContext"

// Components
import Header from "./components/layout/Header"
import Footer from "./components/layout/Footer"
import GlobalStyles from './styles/GlobalStyles'

// Dynamic imports for all pages
const LandingPage = dynamic(() => import("./pages/LandingPage"), { ssr: false })
const SignIn = dynamic(() => import("./pages/auth/SignIn"), { ssr: false })
const SignUp = dynamic(() => import("./pages/auth/SignUp"), { ssr: false })
const OTPVerification = dynamic(() => import("./pages/auth/OTPVerification"), { ssr: false })
const UserDashboard = dynamic(() => import("./pages/user/Dashboard"), { ssr: false })
const Questionnaire = dynamic(() => import("./pages/user/Questionnaire"), { ssr: false })
const Catalog = dynamic(() => import("./pages/user/Catalog"), { ssr: false })
const Cart = dynamic(() => import("./pages/user/Cart"), { ssr: false })
const Checkout = dynamic(() => import("./pages/user/Checkout"), { ssr: false })
const OrderConfirmation = dynamic(() => import("./pages/user/OrderConfirmation"), { ssr: false })
const UserProfile = dynamic(() => import("./pages/user/Profile"), { ssr: false })
const UserOrders = dynamic(() => import("./pages/user/Orders"), { ssr: false })
const AdminDashboard = dynamic(() => import("./pages/admin/Dashboard"), { ssr: false })
const AdminProducts = dynamic(() => import("./pages/admin/Products"), { ssr: false })
const AdminOrders = dynamic(() => import("./pages/admin/Orders"), { ssr: false })
const AdminFeedback = dynamic(() => import("./pages/admin/Feedback"), { ssr: false })
const AdminMerchants = dynamic(() => import("./pages/admin/Merchants"), { ssr: false })
const MerchantDashboard = dynamic(() => import("./pages/merchant/Dashboard"), { ssr: false })
const AddProduct = dynamic(() => import("./pages/merchant/AddProduct"), { ssr: false })
const ProductStatus = dynamic(() => import("./pages/merchant/ProductStatus"), { ssr: false })
const PrivateRoute = dynamic(() => import("./components/routing/PrivateRoute"), { ssr: false })
const RoleRoute = dynamic(() => import("./components/routing/RoleRoute"), { ssr: false })

function App() {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) {
    return null
  }

  return (
    <Router>
      <AuthProvider>
        <GlobalStyles />
        <Header />
        <main>
          <Toaster position="top-right" toastOptions={{
            duration: 4000,
            style: {
              background: '#363636',
              color: '#fff',
            },
            success: {
              duration: 3000,
              theme: {
                primary: '#4aed88',
              }
            },
            error: {
              duration: 4000,
              theme: {
                primary: '#ff4b4b',
              }
            }
          }} />
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/verify-otp" element={<OTPVerification />} />

            {/* User Routes */}
            <Route
              path="/dashboard"
              element={
                <PrivateRoute>
                  <RoleRoute roles={["user"]}>
                    <UserDashboard />
                  </RoleRoute>
                </PrivateRoute>
              }
            />
            <Route
              path="/questionnaire"
              element={
                <PrivateRoute>
                  <RoleRoute roles={["user"]}>
                    <Questionnaire />
                  </RoleRoute>
                </PrivateRoute>
              }
            />
            <Route
              path="/catalog"
              element={
                <PrivateRoute>
                  <RoleRoute roles={["user"]}>
                    <Catalog />
                  </RoleRoute>
                </PrivateRoute>
              }
            />
            <Route
              path="/cart"
              element={
                <PrivateRoute>
                  <RoleRoute roles={["user"]}>
                    <Cart />
                  </RoleRoute>
                </PrivateRoute>
              }
            />
            <Route
              path="/checkout"
              element={
                <PrivateRoute>
                  <RoleRoute roles={["user"]}>
                    <Checkout />
                  </RoleRoute>
                </PrivateRoute>
              }
            />
            <Route
              path="/order-confirmation"
              element={
                <PrivateRoute>
                  <RoleRoute roles={["user"]}>
                    <OrderConfirmation />
                  </RoleRoute>
                </PrivateRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <PrivateRoute>
                  <RoleRoute roles={["user"]}>
                    <UserProfile />
                  </RoleRoute>
                </PrivateRoute>
              }
            />
            <Route
              path="/orders"
              element={
                <PrivateRoute>
                  <RoleRoute roles={["user"]}>
                    <UserOrders />
                  </RoleRoute>
                </PrivateRoute>
              }
            />

            {/* Admin Routes */}
            <Route
              path="/admin/dashboard"
              element={
                <PrivateRoute>
                  <RoleRoute roles={["admin"]}>
                    <AdminDashboard />
                  </RoleRoute>
                </PrivateRoute>
              }
            />
            <Route
              path="/admin/products"
              element={
                <PrivateRoute>
                  <RoleRoute roles={["admin"]}>
                    <AdminProducts />
                  </RoleRoute>
                </PrivateRoute>
              }
            />
            <Route
              path="/admin/orders"
              element={
                <PrivateRoute>
                  <RoleRoute roles={["admin"]}>
                    <AdminOrders />
                  </RoleRoute>
                </PrivateRoute>
              }
            />
            <Route
              path="/admin/feedback"
              element={
                <PrivateRoute>
                  <RoleRoute roles={["admin"]}>
                    <AdminFeedback />
                  </RoleRoute>
                </PrivateRoute>
              }
            />
            <Route
              path="/admin/merchants"
              element={
                <PrivateRoute>
                  <RoleRoute roles={["admin"]}>
                    <AdminMerchants />
                  </RoleRoute>
                </PrivateRoute>
              }
            />

            {/* Merchant Routes */}
            <Route
              path="/merchant/dashboard"
              element={
                <PrivateRoute>
                  <RoleRoute roles={["merchant"]}>
                    <MerchantDashboard />
                  </RoleRoute>
                </PrivateRoute>
              }
            />
            <Route
              path="/merchant/add-product"
              element={
                <PrivateRoute>
                  <RoleRoute roles={["merchant"]}>
                    <AddProduct />
                  </RoleRoute>
                </PrivateRoute>
              }
            />
            <Route
              path="/merchant/product-status"
              element={
                <PrivateRoute>
                  <RoleRoute roles={["merchant"]}>
                    <ProductStatus />
                  </RoleRoute>
                </PrivateRoute>
              }
            />
          </Routes>
        </main>
        <Footer />
      </AuthProvider>
    </Router>
  )
}

export default App
