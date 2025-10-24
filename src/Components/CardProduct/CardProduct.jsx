import * as React from "react";
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  Box,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../../Firebase/ConfigFirebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";

const CardProduct = ({ producto }) => {
  const navigate = useNavigate();

  const handleViewProduct = () => {
    navigate(`/product/${producto.id}`);
  };

  const handleAddToCart = async () => {
    const user = auth.currentUser;
    if (!user) {
      navigate("/login");
      alert("Debes iniciar sesión para agregar productos al carrito");
      return;
    }

    try {
      const userRef = doc(db, "usuarios", user.uid);
      const userSnap = await getDoc(userRef);

      let carrito = [];
      if (userSnap.exists()) carrito = userSnap.data().carrito || [];

      const index = carrito.findIndex((p) => p.productoId === producto.id);

      if (index !== -1) carrito[index].cantidad += 1;
      else {
        carrito.push({
          productoId: producto.id,
          cantidad: 1,
          nombre: producto.nombre,
          precio: producto.precio,
          imagen: producto.imagenUrl,
        });
      }

      await updateDoc(userRef, { carrito });
      alert("✅ Producto agregado al carrito");
    } catch (error) {
      console.error("❌ Error al agregar al carrito:", error);
      alert("Error al agregar el producto al carrito");
    }
  };

  return (
    <Card
      sx={{
        width: 280,
        borderRadius: 3,
        boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.08)",
        backgroundColor: "white",
        transition: "transform 0.2s ease, box-shadow 0.2s ease",
        "&:hover": {
          transform: "translateY(-5px)",
          boxShadow: "0px 6px 25px rgba(0, 0, 0, 0.12)",
        },
        textAlign: "center",
        cursor: "pointer",
      }}
    >
      <Box
        sx={{
          width: "100%",
          height: 220,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#f8f8f8",
          borderTopLeftRadius: 12,
          borderTopRightRadius: 12,
        }}
      >
        <CardMedia
          component="img"
          image={producto.imagenUrl}
          alt={producto.nombre}
          sx={{
            width: "90%",
            height: "200px",
            objectFit: "cover",
          }}
        />
      </Box>

      <CardContent sx={{ pb: 1 }}>
        <Typography
          variant="subtitle1"
          sx={{
            fontWeight: "bold",
            color: "#333",
            textTransform: "uppercase",
            letterSpacing: 0.5,
            mt: 1,
          }}
        >
          {producto.nombre}
        </Typography>

        <Typography
          variant="body1"
          sx={{
            color: "#444",
            fontWeight: 500,
            mb: 2,
          }}
        >
          ${producto.precio?.toLocaleString("es-CO")}
        </Typography>

        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            gap: 1,
            pb: 1,
          }}
        >
          <Button
            variant="outlined"
            size="small"
            onClick={handleViewProduct}
            sx={{
              borderRadius: "20px",
              textTransform: "none",
              fontWeight: "bold",
            }}
          >
            Ver producto
          </Button>
          <Button
            variant="contained"
            size="small"
            onClick={handleAddToCart}
            sx={{
              borderRadius: "20px",
              textTransform: "none",
              fontWeight: "bold",
            }}
          >
            Agregar
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

export default CardProduct;
