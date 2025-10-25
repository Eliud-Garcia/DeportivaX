import { useEffect, useState } from "react";
import CardProduct from "../../Components/CardProduct/CardProduct";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../Firebase/ConfigFirebase";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";


import {
  Box,
  Typography,
  Button,
  Container,
  CircularProgress,
  Grid,
} from "@mui/material";
import "./HomePage.css";


const HomePage = () => {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const obtenerProductosDestacados = async () => {
      try {
        // 🔹 Consulta solo productos destacados y con stock mayor a 0
        const productosRef = collection(db, "productos");
        const q = query(
          productosRef,
          where('destacado', '==', true),
        );

        const querySnapshot = await getDocs(q);
        const lista = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setProductos(lista);
      } catch (error) {
        console.error("❌ Error al cargar productos destacados:", error);
      } finally {
        setLoading(false);
      }
    };

    obtenerProductosDestacados();
  }, []);

  return (
    <main>
      {/* HERO SECTION */}
      <Box className="hero-section">
        <Container maxWidth="md">
          <Typography variant="h2" component="h1" fontWeight="bold" gutterBottom>
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

      {/* PRODUCTOS DESTACADOS */}
      <Container className="productos-section">
        <Typography
          variant="h4"
          align="center"
          fontWeight="bold"
          gutterBottom
          className="productos-destacados-txt"
        >
          Productos destacados
        </Typography>

        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
            <CircularProgress />
          </Box>
        ) : productos.length > 0 ? (
          <Grid
            container
            spacing={3}
            justifyContent="center"
            className="productos-destacados-section"
          >
            {productos.map((item) => (
              <Grid item key={item.id} xs={12} sm={6} md={4} lg={3}>
                <CardProduct producto={item} />
              </Grid>
            ))}
          </Grid>
        ) : (
          <Typography align="center" sx={{ mt: 3 }}>
            No hay productos destacados en este momento.
          </Typography>
        )}
      </Container>

      {/* CTA FINAL */}
      <Box className="cta-section">
        <Container maxWidth="sm">
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            ¡Únete a la comunidad DeportivaX!
          </Typography>
          <Typography variant="body1" gutterBottom>
            Crea tu cuenta o inicia sesión para acceder a ofertas exclusivas,
            novedades y recompensas por tus compras.
          </Typography>

          <Box sx={{ mt: 3, display: "flex", justifyContent: "center", gap: 2 }}>
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

      <button className="contact-btn" onClick = {()=>{
        navigate('/contact');
      }}>
        💬
      </button>
    </main>
  );

};

export default HomePage;
