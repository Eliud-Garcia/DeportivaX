import React, { useState, useEffect } from "react";
import { db } from "../../Firebase/ConfigFirebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useNavigate, useParams } from "react-router-dom";

const EditProductPage = () => {
  const { id } = useParams(); // ID del producto desde la URL
  const navigate = useNavigate();
  const [producto, setProducto] = useState({
    categoria: "",
    descripcion: "",
    destacado: false,
    fechaCreacion: "",
    imagenUrl: "",
    nombre: "",
    precio: "",
    stock: "",
  });
  const [loading, setLoading] = useState(true);

  // 🔹 Cargar los datos del producto
  useEffect(() => {
    const obtenerProducto = async () => {
      try {
        const docRef = doc(db, "productos", id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          setProducto({
            categoria: data.categoria || "",
            descripcion: data.descripcion || "",
            destacado: data.destacado || false,
            fechaCreacion: data.fechaCreacion?.toDate
              ? data.fechaCreacion.toDate().toISOString().slice(0, 10)
              : "",
            imagenUrl: data.imagenUrl || "",
            nombre: data.nombre || "",
            precio: data.precio || "",
            stock: data.stock || "",
          });
        } else {
          alert("Producto no encontrado");
          navigate("/admin");
        }
      } catch (error) {
        console.error("❌ Error al obtener producto:", error);
      } finally {
        setLoading(false);
      }
    };

    obtenerProducto();
  }, [id, navigate]);

  // 🔹 Manejar cambios del formulario
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setProducto({
      ...producto,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  // 🔹 Guardar cambios
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const docRef = doc(db, "productos", id);
      await updateDoc(docRef, {
        ...producto,
        precio: Number(producto.precio),
        stock: Number(producto.stock),
      });

      alert("✅ Producto actualizado correctamente!");
      navigate("/admin");
    } catch (error) {
      console.error("❌ Error al actualizar producto:", error);
      alert("Error al actualizar producto.");
    }
  };

  if (loading) {
    return <p>Cargando producto...</p>;
  }

  return (
    <div style={{ padding: "20px" }}>
      <h2>Editar Producto</h2>
      <form
        onSubmit={handleSubmit}
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "10px",
          maxWidth: "400px",
        }}
      >
        <label>
          Nombre:
          <input
            type="text"
            name="nombre"
            value={producto.nombre}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Categoría:
          <input
            type="text"
            name="categoria"
            value={producto.categoria}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Descripción:
          <textarea
            name="descripcion"
            value={producto.descripcion}
            onChange={handleChange}
            required
          ></textarea>
        </label>

        <label>
          Precio:
          <input
            type="number"
            name="precio"
            value={producto.precio}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Stock:
          <input
            type="number"
            name="stock"
            value={producto.stock}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Imagen URL:
          <input
            type="text"
            name="imagenUrl"
            value={producto.imagenUrl}
            onChange={handleChange}
          />
        </label>

        <label>
          Destacado:
          <input
            type="checkbox"
            name="destacado"
            checked={producto.destacado}
            onChange={handleChange}
          />
        </label>

        <label>
          Fecha de creación:
          <input
            type="date"
            name="fechaCreacion"
            value={producto.fechaCreacion}
            onChange={handleChange}
            disabled
          />
        </label>

        <button type="submit">Guardar Cambios</button>
        <button
          type="button"
          onClick={() => navigate("/admin")}
          style={{ marginTop: "5px" }}
        >
          Cancelar
        </button>
      </form>
    </div>
  );
};

export default EditProductPage;
