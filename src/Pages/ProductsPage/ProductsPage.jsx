import React, { useEffect, useState } from 'react'
import { collection, getDocs } from 'firebase/firestore'
import { db } from '../../Firebase/ConfigFirebase'
import CardProduct from '../../Components/CardProduct/CardProduct'

// Material UI
import {
  Container,
  Grid,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Typography,
  Button,
  CircularProgress,
  Box
} from '@mui/material'
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'

const ProductsPage = () => {
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

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    )
  }

  return (
    <>
      <>
        {/* Título principal */}
        <Box sx={{ textAlign: 'center', mt: 6, mb: 2 }}>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            Productos Disponibles
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Explora nuestra selección de artículos deportivos de alta calidad
          </Typography>
        </Box>

        {/* Contenedor de productos */}
        <Container maxWidth="lg" sx={{ py: 6 }}>
          {productos && productos.length > 0 ? (
            <Grid container spacing={4} justifyContent="center">
              {productos.map((item) => (
                <Grid item key={item.id} xs={12} sm={6} md={4} lg={3}>
                  <CardProduct producto={item} />
                </Grid>
              ))}
            </Grid>
          ) : (
            <Typography
              variant="body1"
              align="center"
              color="text.secondary"
              sx={{ py: 4 }}
            >
              {productos ? 'No hay productos disponibles en este momento.' : 'Cargando...'}
            </Typography>
          )}
        </Container>
      </>


    </>
  )
}

export default ProductsPage
