import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Button,
  Container,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  IconButton,
} from "@mui/material";
import { Add, Edit, Delete } from "@mui/icons-material";
import { collection, getDocs, deleteDoc, doc, getDoc } from "firebase/firestore";
import { db, auth } from "../../Firebase/ConfigFirebase";
import { useNavigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";

const AdminPage = () => {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();

  // ✅ Verificar si el usuario logueado es admin
  useEffect(() => {
    const verificarAdmin = async () => {
      onAuthStateChanged(auth, async (user) => {
        if (!user) {
          navigate("/"); // Redirigir si no está logueado
          return;
        }

        try {
          const userRef = doc(db, "usuarios", user.uid);
          const userSnap = await getDoc(userRef);

          if (userSnap.exists() && userSnap.data().rol === "admin") {
            setIsAdmin(true);
          } else {
            alert("Acceso denegado: no tienes permisos de administrador.");
            navigate("/");
          }
        } catch (error) {
          console.error("Error verificando rol:", error);
        }
      });
    };

    verificarAdmin();
  }, [navigate]);

  // 🔹 Obtener productos desde Firestore
  useEffect(() => {
    if (!isAdmin) return; // Solo cargar productos si es admin

    const obtenerProductos = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "productos"));
        const lista = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setProductos(lista);
      } catch (error) {
        console.error("❌ Error al cargar productos:", error);
      } finally {
        setLoading(false);
      }
    };

    obtenerProductos();
  }, [isAdmin]);

  // 🔹 Eliminar producto
  const handleDelete = async (id) => {
    if (!window.confirm("¿Seguro que deseas eliminar este producto?")) return;

    try {
      await deleteDoc(doc(db, "productos", id));
      setProductos(productos.filter((p) => p.id !== id));
      alert("✅ Producto eliminado con éxito");
    } catch (error) {
      console.error("❌ Error al eliminar producto:", error);
    }
  };

  // 🔹 Redirigir a página de edición
  const handleEdit = (id) => {
    navigate(`/admin/edit/${id}`);
  };

  // 🔹 Redirigir a página de creación
  const handleAdd = () => {
    navigate("/admin/add");
  };

  if (!isAdmin) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container className="admin-page">
      <Box className="admin-header">
        <Typography variant="h4" fontWeight="bold">
          Panel de Administración
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<Add />}
          onClick={handleAdd}
        >
          Agregar producto
        </Button>
      </Box>

      <Typography variant="body1" sx={{ mb: 3 }}>
        Administra los productos de tu tienda: agrega nuevos, edita existentes o elimínalos.
      </Typography>

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
          <CircularProgress />
        </Box>
      ) : (
        <TableContainer component={Paper} sx={{ mt: 2 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell><strong>Imagen</strong></TableCell>
                <TableCell><strong>Nombre</strong></TableCell>
                <TableCell><strong>Precio</strong></TableCell>
                <TableCell><strong>Stock</strong></TableCell>
                <TableCell><strong>Destacado</strong></TableCell>
                <TableCell align="center"><strong>Acciones</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {productos.map((p) => (
                <TableRow key={p.id}>
                  <TableCell>
                    <img
                      src={p.imagenUrl}
                      alt={p.nombre}
                      style={{ width: 70, height: 70, objectFit: "contain" }}
                    />
                  </TableCell>
                  <TableCell>{p.nombre}</TableCell>
                  <TableCell>${p.precio}</TableCell>
                  <TableCell>{p.stock}</TableCell>
                  <TableCell>{p.destacado ? "Sí" : "No"}</TableCell>
                  <TableCell align="center">
                    <IconButton color="primary" onClick={() => handleEdit(p.id)}>
                      <Edit />
                    </IconButton>
                    <IconButton color="error" onClick={() => handleDelete(p.id)}>
                      <Delete />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
              {productos.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    No hay productos registrados.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Container>
  );
};

export default AdminPage;
