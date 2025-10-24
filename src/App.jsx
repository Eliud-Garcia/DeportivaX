import React from 'react'
import LoginPage from './Pages/LoginPage/LoginPage.jsx'
import RegisterPage from './Pages/RegisterPage/RegisterPage.jsx'
import ProductsPage from './Pages/ProductsPage/ProductsPage.jsx'
import AdminPage from './Pages/AdminPage/AdminPage.jsx'
import { useAuth } from './context/AuthContext'
import Header from './Components/Header/Header.jsx'
import HomePage from './Pages/HomePage/HomePage.jsx'



import './App.css'
import { HashRouter as Router, Routes, Route } from 'react-router-dom';

const App = () => {
  const { user } = useAuth()
  return (
    
    <>
      <Router>
        <Header />
        <Routes>
          <Route path='/' element={<HomePage />} />
          <Route path='/login' element={<LoginPage />} />
          <Route path='/register' element={<RegisterPage />} />
          <Route path='/products' element={<ProductsPage />} />
        </Routes>
      </Router>
    </>
  )
}

export default App