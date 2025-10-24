import React, { useState } from "react";
import { db } from "../../Firebase/ConfigFirebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

const AddProductPage = () => {
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

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setProducto({
      ...producto,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !producto.nombre ||
      !producto.precio ||
      !producto.categoria ||
      !producto.stock
    ) {
      alert("Por favor completa todos los campos obligatorios.");
      return;
    }

    try {
      await addDoc(collection(db, "productos"), {
        ...producto,
        precio: Number(producto.precio),
        stock: Number(producto.stock),
        fechaCreacion: serverTimestamp(),
      });

      alert("✅ Producto agregado con éxito!");
      navigate("/admin");
    } catch (error) {
      console.error("❌ Error al agregar producto:", error);
      alert("Error al agregar producto. Intenta nuevamente.");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Agregar Producto</h2>
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

        <button type="submit">Agregar Producto</button>
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

export default AddProductPage;
