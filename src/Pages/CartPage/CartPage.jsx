import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  CircularProgress,
  Button,
} from "@mui/material";
import { auth, db } from "../../Firebase/ConfigFirebase";
import { onAuthStateChanged } from "firebase/auth";
import {
  doc,
  getDoc,
  collection,
  getDocs,
  updateDoc,
  setDoc,
} from "firebase/firestore";
import CardMyCart from "../../Components/CardMyCart/CardMyCart.jsx";

const CartPage = () => {
  const [user, setUser] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // 🧭 Navegar a producto
  const handleViewProduct = (item) => {
    navigate(`/product/${item.id}`);
  };

  // 🔹 Agregar cantidad
  const handleAdd = async (item) => {
    const user = auth.currentUser;
    if (!user) return;

    try {
      const userRef = doc(db, "usuarios", user.uid);
      const userSnap = await getDoc(userRef);
      const productRef = doc(db, "productos", item.id);
      const productSnap = await getDoc(productRef);

      if (!productSnap.exists()) return alert("❌ Producto no encontrado");

      const productData = productSnap.data();
      const stockDisponible = productData.stock;

      let carrito = userSnap.exists() ? userSnap.data().carrito || [] : [];
      const index = carrito.findIndex((c) => c.productoId === item.id);

      if (index !== -1) {
        if (carrito[index].cantidad >= stockDisponible) {
          alert("⚠️ No hay suficiente stock");
          return;
        }
        carrito[index].cantidad++;
      } else {
        carrito.push({
          productoId: item.id,
          cantidad: 1,
          nombre: item.nombre,
          precio: item.precio,
          imagen: item.imagen,
        });
      }

      await updateDoc(userRef, { carrito });

      // 🔁 Refrescar carrito local
      const updated = cartItems.map((p) =>
        p.id === item.id ? { ...p, cantidad: p.cantidad + 1 } : p
      );
      setCartItems(updated);
    } catch (error) {
      console.error("❌ Error al agregar producto:", error);
    }
  };

  // 🔹 Disminuir cantidad
  const handleDecrease = async (item) => {
    const user = auth.currentUser;
    if (!user) return;

    try {
      const userRef = doc(db, "usuarios", user.uid);
      const userSnap = await getDoc(userRef);
      if (!userSnap.exists()) return;

      let carrito = userSnap.data().carrito || [];
      const index = carrito.findIndex((c) => c.productoId === item.id);
      if (index === -1) return;

      if (carrito[index].cantidad > 1) {
        carrito[index].cantidad--;
      } else {
        carrito.splice(index, 1);
      }

      await setDoc(userRef, { carrito }, { merge: true });

      // 🔁 Actualizar en pantalla
      const updated = carrito.length
        ? cartItems
            .map((p) =>
              p.id === item.id
                ? carrito.find((c) => c.productoId === p.id)
                  ? { ...p, cantidad: carrito.find((c) => c.productoId === p.id).cantidad }
                  : null
                : p
            )
            .filter(Boolean)
        : [];

      setCartItems(updated);
    } catch (error) {
      console.error("❌ Error al disminuir producto:", error);
    }
  };

  // 🔹 Eliminar producto completamente
  const handleRemove = async (item) => {
    const user = auth.currentUser;
    if (!user) return;

    try {
      const userRef = doc(db, "usuarios", user.uid);
      const userSnap = await getDoc(userRef);
      if (!userSnap.exists()) return;

      let carrito = userSnap.data().carrito || [];
      carrito = carrito.filter((c) => c.productoId !== item.id);

      await updateDoc(userRef, { carrito });

      // 🔁 Actualizar en tiempo real
      setCartItems(cartItems.filter((p) => p.id !== item.id));
    } catch (error) {
      console.error("❌ Error al eliminar producto:", error);
    }
  };

  // 1️⃣ Escuchar estado del usuario
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (!currentUser) {
        alert("Debes iniciar sesión para ver tu carrito");
        navigate("/login");
        return;
      }
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, [navigate]);

  // 2️⃣ Cargar carrito desde Firestore
  useEffect(() => {
    const loadCart = async () => {
      if (!user) return;

      try {
        const userDocRef = doc(db, "usuarios", user.uid);
        const userSnap = await getDoc(userDocRef);

        if (userSnap.exists()) {
          const carrito = userSnap.data().carrito || [];

          const productsRef = collection(db, "productos");
          const productsSnap = await getDocs(productsRef);

          const productMap = {};
          productsSnap.forEach((p) => {
            productMap[p.id] = { id: p.id, ...p.data() };
          });

          const cartWithDetails = carrito
            .map((item) => {
              const producto = productMap[item.productoId];
              if (!producto) return null;
              return { ...producto, cantidad: item.cantidad };
            })
            .filter(Boolean);

          setCartItems(cartWithDetails);
        }
      } catch (error) {
        console.error("Error cargando el carrito:", error);
      } finally {
        setLoading(false);
      }
    };

    loadCart();
  }, [user]);

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!cartItems.length) {
    return (
      <Box sx={{ textAlign: "center", mt: 8 }}>
        <Typography variant="h5">Tu carrito está vacío 🛒</Typography>
        <Button
          variant="contained"
          sx={{ mt: 3 }}
          onClick={() => navigate("/products")}
        >
          Ver productos
        </Button>
      </Box>
    );
  }

  const total = cartItems.reduce(
    (sum, item) => sum + item.precio * item.cantidad,
    0
  );

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ mb: 3 }}>
        🛍️ Tu carrito
      </Typography>

      {cartItems.map((item) => (
        <CardMyCart
          key={item.id}
          item={item}
          onAdd={handleAdd}
          onDecrease={handleDecrease}
          onRemove={handleRemove}
          onView={handleViewProduct}
        />
      ))}

      <Box sx={{ mt: 4, textAlign: "right" }}>
        <Typography variant="h5">Total: ${total.toLocaleString()}</Typography>
        <Button variant="contained" color="primary" sx={{ mt: 2 }}>
          Finalizar compra
        </Button>
      </Box>
    </Box>
  );
};

export default CartPage;
