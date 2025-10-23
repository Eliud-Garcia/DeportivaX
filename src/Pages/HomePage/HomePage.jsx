import React from 'react'
import { Box, Typography, Button, Container, Grid, Card, CardMedia, CardContent, CardActions } from '@mui/material'

const HomePage = () => {
  const productosDestacados = [
    {
      id: 1,
      nombre: 'Zapatillas Running Pro X',
      imagen: 'https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?auto=format&fit=crop&w=800&q=80',
      precio: 299000,
    },
    {
      id: 2,
      nombre: 'Camiseta Deportiva DryFit',
      imagen: 'https://images.unsplash.com/photo-1606813902917-8c12f9f7c045?auto=format&fit=crop&w=800&q=80',
      precio: 89000,
    },
    {
      id: 3,
      nombre: 'Guantes de Gimnasio GripPro',
      imagen: 'https://images.unsplash.com/photo-1579758629938-03607ccdbaba?auto=format&fit=crop&w=800&q=80',
      precio: 49000,
    },
  ]

  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          height: '70vh',
          backgroundImage:
            'url(https://images.unsplash.com/photo-1521412644187-c49fa049e84d?auto=format&fit=crop&w=1600&q=80)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          color: 'white',
          textAlign: 'center',
          px: 2,
        }}
      >
        <Typography variant="h3" sx={{ fontWeight: 'bold', textShadow: '2px 2px 8px rgba(0,0,0,0.6)' }}>
          Bienvenido a DeportivaX
        </Typography>
        <Typography variant="h6" sx={{ mt: 2, mb: 3, maxWidth: 600 }}>
          Encuentra los mejores productos deportivos para superar tus límites.  
          ¡Ropa, calzado y accesorios para cada disciplina!
        </Typography>
        <Button
          variant="contained"
          color="primary"
          size="large"
          sx={{
            fontWeight: 600,
            borderRadius: 2,
            px: 4,
            py: 1.5,
            backgroundColor: '#1976d2',
            '&:hover': { backgroundColor: '#125a9c' },
          }}
          href="/productos"
        >
          Ver productos
        </Button>
      </Box>

      {/* Productos Destacados */}
      <Container sx={{ py: 8 }}>
        <Typography variant="h4" align="center" fontWeight={700} gutterBottom>
          Productos Destacados
        </Typography>

        <Grid container spacing={4} sx={{ mt: 2 }}>
          {productosDestacados.map((producto) => (
            <Grid item key={producto.id} xs={12} sm={6} md={4}>
              <Card
                sx={{
                  borderRadius: 3,
                  boxShadow: 3,
                  transition: 'transform 0.3s',
                  '&:hover': { transform: 'scale(1.03)' },
                }}
              >
                <CardMedia
                  component="img"
                  height="220"
                  image={producto.imagen}
                  alt={producto.nombre}
                />
                <CardContent>
                  <Typography variant="h6" fontWeight={600}>
                    {producto.nombre}
                  </Typography>
                  <Typography color="text.secondary">${producto.precio.toLocaleString('es-CO')}</Typography>
                </CardContent>
                <CardActions sx={{ justifyContent: 'center', pb: 2 }}>
                  <Button
                    size="small"
                    variant="contained"
                    sx={{ borderRadius: 2, fontWeight: 600 }}
                  >
                    Agregar al carrito
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Footer */}
      <Box sx={{ py: 3, textAlign: 'center', bgcolor: '#f5f5f5', mt: 5 }}>
        <Typography variant="body2" color="text.secondary">
          © {new Date().getFullYear()} DeportivaX — Todos los derechos reservados.
        </Typography>
      </Box>
    </Box>
  )
}

export default HomePage
