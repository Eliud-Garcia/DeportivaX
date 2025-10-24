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
      <Typography variant="h4" align="center" gutterBottom sx={{ mt: 4 }}>
        Productos Disponibles
      </Typography>
      
      <Container sx={{ py: 8 }} maxWidth="md">
        {
          productos ? productos.map(item => (

            <CardProduct key={item.id} producto={item}></CardProduct>

          )) : <p>Cargando...</p>
        }

      </Container>

    </>
  )
}

export default ProductsPage
