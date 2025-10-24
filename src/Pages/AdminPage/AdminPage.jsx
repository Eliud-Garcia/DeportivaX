import React, { useEffect, useState } from "react";
import { collection, getDocs, deleteDoc, doc, getDoc } from "firebase/firestore";
import { db, auth } from "../../Firebase/ConfigFirebase";
import { useNavigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import "./AdminPage.css"; // estilos simples opcionales

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
          navigate("/");
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

  // 🔹 Obtener productos
  useEffect(() => {
    if (!isAdmin) return;

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

  // 🔹 Redirigir a editar
  const handleEdit = (id) => {
    navigate(`/admin/edit/${id}`);
  };

  // 🔹 Redirigir a crear
  const handleAdd = () => {
    navigate("/admin/add");
  };

  if (!isAdmin) {
    return (
      <div className="loader-container">
        <p>Cargando...</p>
      </div>
    );
  }

  return (
    <div className="admin-page">
      <div className="admin-header">
        <h2>Panel de Administración</h2>
        <button onClick={handleAdd}>Agregar producto</button>
      </div>

      <p>Administra los productos de tu tienda: agrega, edita o elimina.</p>

      {loading ? (
        <p>Cargando productos...</p>
      ) : (
        <div className="table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Imagen</th>
                <th>Nombre</th>
                <th>Precio</th>
                <th>Stock</th>
                <th>Destacado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {productos.map((p) => (
                <tr key={p.id}>
                  <td>
                    <img
                      src={p.imagenUrl}
                      alt={p.nombre}
                      className="product-image"
                    />
                  </td>
                  <td>{p.nombre}</td>
                  <td>${p.precio}</td>
                  <td>{p.stock}</td>
                  <td>{p.destacado ? "Sí" : "No"}</td>
                  <td>
                    <button onClick={() => handleEdit(p.id)}>Editar</button>
                    <button
                      className="delete-btn"
                      onClick={() => handleDelete(p.id)}
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}

              {productos.length === 0 && (
                <tr>
                  <td colSpan="6">No hay productos registrados.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminPage;
