import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
    Box,
    Typography,
    Button,
    CircularProgress,
    IconButton,
    TextField,
    Divider,
    Grid,
    Card,
    CardMedia,
    CardContent,
} from "@mui/material";
import { Add, Remove } from "@mui/icons-material";
import { doc, getDoc, updateDoc, collection, query, where, getDocs, limit } from "firebase/firestore";
import { db, auth } from "../../Firebase/ConfigFirebase";

const ProductDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [producto, setProducto] = useState(null);
    const [loading, setLoading] = useState(true);
    const [cantidad, setCantidad] = useState(1);
    const [relacionados, setRelacionados] = useState([]);

    // 🔹 Cargar producto principal
    useEffect(() => {
        const fetchProducto = async () => {
            try {
                const ref = doc(db, "productos", id);
                const snap = await getDoc(ref);
                if (snap.exists()) {
                    const prodData = { id: snap.id, ...snap.data() };
                    setProducto(prodData);
                    // Cargar productos relacionados
                    fetchRelacionados(prodData.categoria, prodData.id);
                }
            } catch (error) {
                console.error("Error cargando el producto:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchProducto();
    }, [id]);

    // 🔹 Cargar productos de la misma categoría
    const fetchRelacionados = async (categoria, excludeId) => {
        try {
            const q = query(
                collection(db, "productos"),
                where("categoria", "==", categoria),
                limit(10)
            );
            const snap = await getDocs(q);
            const productos = snap.docs
                .map((doc) => ({ id: doc.id, ...doc.data() }))
                .filter((p) => p.id !== excludeId); // excluir el producto actual
            setRelacionados(productos);
        } catch (error) {
            console.error("Error obteniendo productos relacionados:", error);
        }
    };

    // 🔹 Agregar al carrito con validación de stock
    const handleAddToCart = async () => {
        const user = auth.currentUser;
        if (!user) {
            alert("Debes iniciar sesión para agregar al carrito");
            return;
        }

        try {
            // Referencia del usuario y su carrito actual
            const userRef = doc(db, "usuarios", user.uid);
            const userSnap = await getDoc(userRef);
            let carrito = [];
            if (userSnap.exists()) carrito = userSnap.data().carrito || [];

            // Buscar si el producto ya está en el carrito
            const index = carrito.findIndex((p) => p.productoId === producto.id);
            const stockDisponible = producto.stock;

            // Calcular cantidad total si ya existe en el carrito
            const cantidadActual = index !== -1 ? carrito[index].cantidad : 0;
            const nuevaCantidad = cantidadActual + cantidad;

            // Validar stock
            if (nuevaCantidad > stockDisponible) {
                alert(`No hay suficiente stock. Solo quedan ${stockDisponible} unidades disponibles.`);
                return;
            }

            // Actualizar o agregar producto al carrito
            if (index !== -1) {
                carrito[index].cantidad = nuevaCantidad;
            } else {
                carrito.push({
                    productoId: producto.id,
                    cantidad,
                    nombre: producto.nombre,
                    precio: producto.precio,
                    imagen: producto.imagenUrl,
                });
            }

            // Guardar cambios en Firestore
            await updateDoc(userRef, { carrito });
            alert("✅ Producto agregado al carrito");
        } catch (error) {
            console.error("❌ Error al agregar al carrito:", error);
            alert("Ocurrió un error al agregar el producto al carrito");
        }
    };


    if (loading)
        return (
            <Box sx={{ display: "flex", justifyContent: "center", mt: 8 }}>
                <CircularProgress />
            </Box>
        );

    if (!producto)
        return (
            <Typography textAlign="center" mt={8}>
                Producto no encontrado
            </Typography>
        );

    return (
        <Box sx={{ p: 4, backgroundColor: "#fff" }}>
            {/* 🔸 Sección principal */}
            <Box
                sx={{
                    display: "flex",
                    flexWrap: "wrap",
                    justifyContent: "center",
                    gap: 6,
                    mb: 8,
                }}
            >
                {/* Imagen */}
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        bgcolor: "#f7f7f7",
                        borderRadius: 2,
                        height: 400,
                        width: 400,
                    }}
                >
                    <img
                        src={producto.imagenUrl}
                        alt={producto.nombre}
                        style={{ maxHeight: "90%", maxWidth: "90%", objectFit: "contain" }}
                    />
                </Box>

                {/* Info */}
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "flex-start",
                        width: 350,
                    }}
                >
                    <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
                        {producto.nombre}
                    </Typography>

                    <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
                        ${producto.precio?.toLocaleString("es-CO")}
                    </Typography>

                    <Typography variant="body2" sx={{ color: "gray", mb: 1 }}>
                        Categoría: {producto.categoria}
                    </Typography>

                    <Typography
                        variant="body2"
                        sx={{
                            color: producto.stock > 0 ? "green" : "red",
                            mb: 2,
                            fontWeight: "bold",
                        }}
                    >
                        {producto.stock > 0
                            ? `${producto.stock} unidades disponibles`
                            : "Agotado"}
                    </Typography>

                    <Divider sx={{ mb: 2, width: "100%" }} />

                    <Typography variant="body1" sx={{ mb: 3, color: "#333" }}>
                        {producto.descripcion}
                    </Typography>

                    {/* Cantidad */}
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 3 }}>
                        <IconButton
                            onClick={() => setCantidad((prev) => Math.max(1, prev - 1))}
                            sx={{ border: "1px solid #ccc" }}
                        >
                            <Remove />
                        </IconButton>
                        <TextField
                            value={cantidad}
                            size="small"
                            sx={{ width: 70 }}
                            inputProps={{ style: { textAlign: "center" }, readOnly: true }}
                        />
                        <IconButton
                            onClick={() =>
                                setCantidad((prev) =>
                                    prev < producto.stock ? prev + 1 : producto.stock
                                )
                            }
                            sx={{ border: "1px solid #ccc" }}
                        >
                            <Add />
                        </IconButton>
                    </Box>

                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleAddToCart}
                        disabled={producto.stock === 0}
                        sx={{
                            py: 1.5,
                            px: 4,
                            borderRadius: "8px",
                            textTransform: "none",
                            fontSize: "1rem",
                            fontWeight: 600,
                            backgroundColor: "#000",
                            "&:hover": { backgroundColor: "#222" },
                        }}
                    >
                        Agregar al carrito
                    </Button>
                </Box>
            </Box>

            {/* 🔸 Productos relacionados */}
            {relacionados.length > 0 && (
                <>
                    <Divider sx={{ mb: 4 }} />
                    <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
                        Productos relacionados
                    </Typography>

                    <Grid container spacing={3}>
                        {relacionados.map((item) => (
                            <Grid item xs={12} sm={6} md={3} key={item.id}>
                                <Card
                                    onClick={() => navigate(`/product/${item.id}`)}
                                    sx={{
                                        cursor: "pointer",
                                        transition: "0.3s",
                                        "&:hover": { boxShadow: 6 },
                                    }}
                                >
                                    <CardMedia
                                        component="img"
                                        height="160"
                                        image={item.imagenUrl}
                                        alt={item.nombre}
                                        sx={{ objectFit: "contain", p: 1 }}
                                    />
                                    <CardContent>
                                        <Typography
                                            variant="body1"
                                            sx={{ fontWeight: 600, mb: 1, textAlign: "center" }}
                                        >
                                            {item.nombre}
                                        </Typography>
                                        <Typography
                                            variant="body2"
                                            sx={{
                                                color: "text.secondary",
                                                textAlign: "center",
                                                fontWeight: 500,
                                            }}
                                        >
                                            ${item.precio.toLocaleString("es-CO")}
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                </>
            )}
        </Box>
    );
};

export default ProductDetailPage;
