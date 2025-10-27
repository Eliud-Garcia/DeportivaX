import React from "react";
import "./Footer.css";
import { FaInstagram, FaFacebook, FaTiktok } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const Footer = () => {
  const navigate = useNavigate();

  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Sección de logo y descripción */}
        <div className="footer-section about">
          <h2 className="footer-logo" onClick={() => navigate("/")} style={{ cursor: "pointer" }}>
            DeportivaX
          </h2>
          <p>
            Promoviendo el deporte, la pasión y la comunidad. Síguenos y sé
            parte del movimiento.
          </p>
        </div>

        {/* Sección de enlaces rápidos */}
        <div className="footer-section links">
          <h3>Enlaces</h3>
          <ul>
            <li onClick={() => navigate("/")} className="footer-link">Inicio</li>
            <li onClick={() => navigate("/products")} className="footer-link">Productos</li>
            <li onClick={() => navigate("/login")} className="footer-link">Login</li>
            <li onClick={() => navigate("/contact")} className="footer-link">Contacto</li>
          </ul>
        </div>

        {/* Sección de redes sociales */}
        <div className="footer-section social">
          <h3>Síguenos</h3>
          <div className="social-icons">
            <a
              href="https://www.instagram.com/deportivax_0000/"
              target="_blank"
              rel="noreferrer"
            >
              <FaInstagram />
            </a>
            <a
              href="https://www.facebook.com/profile.php?id=61581036340279"
              target="_blank"
              rel="noreferrer"
            >
              <FaFacebook />
            </a>
            <a
              href="https://www.tiktok.com/@deportivax_"
              target="_blank"
              rel="noreferrer"
            >
              <FaTiktok />
            </a>
          </div>
        </div>
      </div>

      {/* Línea inferior de derechos */}
      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} DeportivaX. Todos los derechos reservados.</p>
      </div>
    </footer>
  );
};

export default Footer;
