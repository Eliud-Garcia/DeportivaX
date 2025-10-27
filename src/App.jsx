import React from 'react'
import LoginPage from './Pages/LoginPage/LoginPage.jsx'
import RegisterPage from './Pages/RegisterPage/RegisterPage.jsx'
import ProductsPage from './Pages/ProductsPage/ProductsPage.jsx'
import AdminPage from './Pages/AdminPage/AdminPage.jsx'
import Header from './Components/Header/Header.jsx'
import HomePage from './Pages/HomePage/HomePage.jsx'
import CartPage from './Pages/CartPage/CartPage.jsx'
import ProductDetailPage from './Pages/ProductDetailPage/ProductDetailPage.jsx'
import CheckoutPage from './Pages/CheckoutPage/CheckoutPage.jsx'
import AddProductPage from './Pages/AddProductPage/AddProductPage.jsx'
import EditProductPage from './Pages/EditProductPage/EditProductPage.jsx'
import ContactPage from './Pages/ContactPage/ContactPage.jsx'
import Footer from './Components/Footer/Footer.jsx'

import './App.css'
import { HashRouter as Router, Routes, Route } from 'react-router-dom';

const App = () => {
  return (
    
    <>
      <Router>
        <Header />
        <Routes>
          
          <Route path='/' element={<HomePage />} />
          <Route path='/login' element={<LoginPage />} />
          <Route path='/register' element={<RegisterPage />} />
          <Route path='/products' element={<ProductsPage />} />
          <Route path='/mycart' element={<CartPage />} />
          <Route path='/product/:id' element={<ProductDetailPage />} />
          <Route path='/checkout' element={<CheckoutPage />} />
          <Route path='/admin' element={<AdminPage />} />
          <Route path='/admin/add' element={<AddProductPage />} />
          <Route path='/admin/edit/:id' element={<EditProductPage />} />
          <Route path='/contact' element={<ContactPage/>} />

        </Routes>
        <Footer />
      </Router>
    </>
  )
}

export default App