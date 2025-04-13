import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from '../pages/merchant/Dashboard';
import ProductList from '../pages/merchant/ProductList';
import AddProduct from '../pages/merchant/AddProduct';
import OrderManagement from '../pages/merchant/OrderManagement';
import MerchantLayout from '../layouts/MerchantLayout';

const MerchantRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<MerchantLayout />}>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="products" element={<ProductList />} />
        <Route path="products/add" element={<AddProduct />} />
        <Route path="products/edit/:id" element={<AddProduct />} />
        <Route path="orders" element={<OrderManagement />} />
      </Route>
    </Routes>
  );
};

export default MerchantRoutes; 