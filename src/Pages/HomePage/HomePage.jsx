import React, { useEffect, useState } from 'react'
import CardProduct from '../../Components/CardProduct/CardProduct' // Importamos tu componente reutilizable
import { collection, getDocs } from 'firebase/firestore'
import { db } from '../../Firebase/ConfigFirebase'
import { Link } from 'react-router-dom';

import {
  Box,
  Typography,
  Button,
  Container,
} from '@mui/material'
import './HomePage.css'

const HomePage = () => {
  const [productos, setProductos] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const obtenerProductos = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'productos'))
        const lista = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
        setProductos(lista)
      } catch (error) {
        console.error('Error al cargar productos:', error)
      } finally {
        setLoading(false)
      }
    }

    obtenerProductos()
  }, [])

  return (
    <main>
      {/* Hero Section */}
      <Box className="hero-section">
        <Container maxWidth="md">
          <Typography variant="h2" component="h1" fontWeight="bold" gutterBottom >
            Bienvenido a DeportivaX
          </Typography>
          <Typography variant="h5" gutterBottom>
            Todo lo que necesitas para alcanzar tu máximo rendimiento.
          </Typography>
          <Button
            variant="contained"
            color="primary"
            size="large"
            className="hero-button"
            component={Link}
            to="/products"
          >
            Explorar productos
          </Button>
        </Container>
      </Box>

      <Container className="productos-section">
        <Typography variant="h4" align="center" fontWeight="bold" gutterBottom className='productos-destacados-txt'> 
          Productos destacados
        </Typography>

        <Container  spacing={4} justifyContent="center" className='productos-destacados-section'>
          {
            productos ? productos
              .filter(item => item.destacado && item.stock > 0) // Filtrar productos destacados
              .map(item => (
                <CardProduct key={item.id} producto={item}></CardProduct>
              )) : <p>Cargando...</p>
          }
        </Container>

      </Container>

      {/* CTA final */}
<Box className="cta-section">
  <Container maxWidth="sm">
    <Typography variant="h4" fontWeight="bold" gutterBottom>
      ¡Únete a la comunidad DeportivaX!
    </Typography>
    <Typography variant="body1" gutterBottom>
      Crea tu cuenta o inicia sesión para acceder a ofertas exclusivas, 
      novedades y recompensas por tus compras.
    </Typography>

    <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center', gap: 2 }}>
      <Button
        variant="contained"
        color="primary"
        size="large"
        className="cta-button"
        component={Link}
        to="/register"
      >
        Registrarse
      </Button>
      <Button
        variant="outlined"
        color="primary"
        size="large"
        component={Link}
        to="/login"
      >
        Iniciar sesión
      </Button>
    </Box>
  </Container>
</Box>
    </main>
  )
}

export default HomePage
