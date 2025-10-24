import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../../Firebase/ConfigFirebase";
import {
  doc,
  getDoc,
  updateDoc,
  collection,
  setDoc,
  getDocs,
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import "./CheckoutPage.css";

const bancos = [
  "Bancolombia",
  "Davivienda",
  "Banco de Bogotá",
  "Banco Popular",
  "Banco de Occidente",
  "Itaú",
  "Nequi",
  "BBVA",
];

const CheckoutPage = () => {
  const [usuario, setUsuario] = useState(null);
  const [carrito, setCarrito] = useState([]);
  const [banco, setBanco] = useState("");
  const [procesando, setProcesando] = useState(false);
  const navigate = useNavigate();

  // 1️⃣ Escuchar usuario autenticado
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userRef = doc(db, "usuarios", user.uid);
        const snap = await getDoc(userRef);
        if (snap.exists()) {
          setUsuario({ id: user.uid, ...snap.data() });
          setCarrito(snap.data().carrito || []);
        }
      } else {
        navigate("/login");
      }
    });
    return () => unsub();
  }, [navigate]);

  // 2️⃣ Calcular total
  const total = carrito.reduce(
    (sum, p) => sum + (p.precio || 0) * (p.cantidad || 1),
    0
  );

  // 3️⃣ Confirmar pago
  const handleConfirmarPago = async () => {
    if (!banco) {
      alert("Por favor selecciona un banco.");
      return;
    }
    if (!usuario || carrito.length === 0) {
      alert("Carrito vacío o usuario no válido.");
      return;
    }

    setProcesando(true);

    try {
      // 🔹 Crear registro
      const registro = {
        usuarioId: usuario.id,
        nombre: usuario.nombre || usuario.displayName || "Sin nombre",
        fecha: new Date().toISOString(),
        banco,
        total,
        productos: carrito.map((p) => ({
          id: p.productoId || p.id,
          nombre: p.nombre,
          cantidad: p.cantidad,
          precio: p.precio,
        })),
      };

      await setDoc(doc(collection(db, "Registro")), registro);

      // 🔹 Actualizar stock de productos
      const productosSnap = await getDocs(collection(db, "productos"));
      const productosMap = {};
      productosSnap.forEach((d) => {
        productosMap[d.id] = d.data();
      });

      for (const item of carrito) {
        const prodId = item.productoId || item.id;
        const ref = doc(db, "productos", prodId);
        const actual = productosMap[prodId]?.stock || 0;
        const nuevoStock = Math.max(actual - item.cantidad, 0);
        await updateDoc(ref, { stock: nuevoStock });
      }

      // 🔹 Vaciar carrito del usuario
      const userRef = doc(db, "usuarios", usuario.id);
      await updateDoc(userRef, { carrito: [] });

      alert("✅ Pago confirmado y compra registrada correctamente.");
      navigate("/products");
    } catch (e) {
      console.error("Error al procesar el pago:", e);
      alert("Ocurrió un error al procesar la compra.");
    } finally {
      setProcesando(false);
    }
  };

  return (
    <div className="checkout-container">
      <div className="checkout-card">
        <h2>Pasarela de Pago PSE 💳</h2>

        {usuario && (
          <div className="checkout-user">
            <p><strong>Usuario:</strong> {usuario.nombre || "Sin nombre"}</p>
            <p><strong>Correo:</strong> {usuario.correo || auth.currentUser?.email}</p>
          </div>
        )}

        <div className="checkout-summary">
          <h3>Resumen del carrito</h3>
          {carrito.length === 0 ? (
            <p>Carrito vacío 🛒</p>
          ) : (
            carrito.map((p) => (
              <div key={p.id} className="checkout-item">
                <span>{p.nombre} × {p.cantidad}</span>
                <span>${(p.precio * p.cantidad).toLocaleString()}</span>
              </div>
            ))
          )}
          <div className="checkout-total">
            <strong>Total: ${total.toLocaleString()}</strong>
          </div>
        </div>

        <div className="checkout-bank">
          <label>Selecciona tu banco:</label>
          <select
            value={banco}
            onChange={(e) => setBanco(e.target.value)}
            className="checkout-select"
          >
            <option value="">-- Selecciona un banco --</option>
            {bancos.map((b) => (
              <option key={b}>{b}</option>
            ))}
          </select>
        </div>

        <div className="checkout-actions">
          <button className="btn-back" onClick={() => navigate(-1)}>
            ← Volver
          </button>
          <button
            className="btn-confirm"
            onClick={handleConfirmarPago}
            disabled={procesando || carrito.length === 0}
          >
            {procesando ? "Procesando..." : "Confirmar pago"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
