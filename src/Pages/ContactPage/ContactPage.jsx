// src/pages/ContactPage/ContactPage.jsx
import React, { useState } from "react";
import "./ContactPage.css";

const ContactPage = () => {
    // Form
    const [form, setForm] = useState({ nombre: "", correo: "", asunto: "", mensaje: "" });
    const [errors, setErrors] = useState({});
    const [sending, setSending] = useState(false);
    const [success, setSuccess] = useState(false);

    // FAQ acordeón
    const [openFAQ, setOpenFAQ] = useState(null);

    const validate = () => {
        const e = {};
        if (!form.nombre.trim()) e.nombre = "El nombre es obligatorio";
        if (!form.correo.trim()) e.correo = "El correo es obligatorio";
        else if (!/^\S+@\S+\.\S+$/.test(form.correo)) e.correo = "Correo inválido";
        if (!form.asunto.trim()) e.asunto = "El asunto es obligatorio";
        if (!form.mensaje.trim() || form.mensaje.trim().length < 10) e.mensaje = "Escribe al menos 10 caracteres";
        return e;
    };

    const handleChange = (e) => {
        setForm((s) => ({ ...s, [e.target.name]: e.target.value }));
        setErrors((prev) => ({ ...prev, [e.target.name]: null }));
    };

    const handleSubmit = async (ev) => {
        ev.preventDefault();
        const e = validate();
        if (Object.keys(e).length) {
            setErrors(e);
            return;
        }

        // Simula envío / aquí llama a tu backend o a Firebase
        try {
            setSending(true);
            // Ejemplo real (comenta si no tienes endpoint):
            // const res = await fetch('/api/contact', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify(form) });
            // if (!res.ok) throw new Error('Error en el servidor');

            // Simulación delay
            await new Promise((r) => setTimeout(r, 900));

            // Si usas Firestore podrías guardar aquí la petición como "registro de contacto".
            setSuccess(true);
            setForm({ nombre: "", correo: "", asunto: "", mensaje: "" });
            setErrors({});
            setTimeout(() => setSuccess(false), 3500);
        } catch (err) {
            console.error("Error enviando contacto:", err);
            alert("Ocurrió un error al enviar. Intenta de nuevo.");
        } finally {
            setSending(false);
        }
    };

    // WhatsApp quick link (personaliza el número)
    const openWhatsApp = () => {
        const phone = "57YOURNUMBER"; // ejemplo: 573001234567
        const text = encodeURIComponent("Hola, quiero soporte sobre...");
        window.open(`https://wa.me/${phone}?text=${text}`, "_blank");
    };

    // CTA flotante action
    const handleCTAClick = () => {
        // Scroll al formulario
        const f = document.getElementById("contact-form");
        if (f) f.scrollIntoView({ behavior: "smooth", block: "center" });
    };

    return (
        <main className="contact-page">
            <section className="hero">
                <div className="hero-inner">
                    <h1>Contáctanos</h1>
                    <p className="lead">¿Tienes dudas, sugerencias o quieres soporte? Escribe y te respondemos pronto.</p>
                    <div className="hero-actions">
                        <button className="btn btn-primary" onClick={handleCTAClick}>Enviar mensaje</button>
                        <button className="btn btn-ghost" onClick={openWhatsApp}>Chatear por WhatsApp</button>
                    </div>
                </div>
                <div className="hero-visual">
                    {/* SVG ilustrativo */}
                    <svg width="220" height="160" viewBox="0 0 220 160" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                        <rect x="8" y="16" width="204" height="112" rx="12" fill="#E9F0FF" />
                        <path d="M24 44h172M24 68h120M24 92h80" stroke="#B7D0FF" strokeWidth="3" strokeLinecap="round" />
                        <circle cx="176" cy="46" r="18" fill="#1976D2" />
                        <path d="M172 42h8v8h-8z" fill="#fff" />
                    </svg>
                </div>
            </section>

            <section className="content grid">
                <aside className="contact-cards">
                    <div className="card">
                        <h3>Horario de soporte</h3>
                        <p>📅 Lun - Vie · 8:30 - 18:00</p>
                        <p>⏱️ Respuesta estimada: 24–48 hrs</p>
                    </div>

                    <div className="card">
                        <h3>Contacto rápido</h3>
                        <p>📞 <a href="tel:+573001234567">+57 300 123 4567</a></p>
                        <p>✉️ <a href="mailto:soporte@tuapp.com">soporte@tuapp.com</a></p>
                        <div className="socials">
                            <a href="#" aria-label="Twitter">🐦</a>
                            <a href="#" aria-label="Instagram">📸</a>
                            <a href="#" aria-label="LinkedIn">💼</a>
                        </div>
                    </div>

                    <div className="card map-card">
                        <h3>Nuestra ubicación</h3>
                        <div className="map-wrap" aria-hidden>
                            <iframe
                                title="mapa"
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3976.000000000!2d-74.0817!3d4.6097!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDTCsDM2JzQ4LjAiUyA3NMKwMDQnMDcuNiJX!5e0!3m2!1ses!2sco!4v1600000000000"
                                frameBorder="0"
                                loading="lazy"
                            />
                        </div>
                    </div>
                </aside>

                <article className="contact-form-area">
                    <div className="card form-card">
                        <h2>Escríbenos</h2>

                        <form id="contact-form" onSubmit={handleSubmit} noValidate>
                            <label className="field">
                                <span>Nombre</span>
                                <input
                                    name="nombre"
                                    value={form.nombre}
                                    onChange={handleChange}
                                    placeholder="Tu nombre completo"
                                    aria-invalid={!!errors.nombre}
                                />
                                {errors.nombre && <small className="error">{errors.nombre}</small>}
                            </label>

                            <label className="field">
                                <span>Correo</span>
                                <input
                                    name="correo"
                                    type="email"
                                    value={form.correo}
                                    onChange={handleChange}
                                    placeholder="tu@ejemplo.com"
                                    aria-invalid={!!errors.correo}
                                />
                                {errors.correo && <small className="error">{errors.correo}</small>}
                            </label>

                            <label className="field">
                                <span>Asunto</span>
                                <input
                                    name="asunto"
                                    value={form.asunto}
                                    onChange={handleChange}
                                    placeholder="Ej: Problema con pedido #1234"
                                    aria-invalid={!!errors.asunto}
                                />
                                {errors.asunto && <small className="error">{errors.asunto}</small>}
                            </label>

                            <label className="field">
                                <span>Mensaje</span>
                                <textarea
                                    name="mensaje"
                                    rows="6"
                                    value={form.mensaje}
                                    onChange={handleChange}
                                    placeholder="Cuéntanos con detalle..."
                                    aria-invalid={!!errors.mensaje}
                                />
                                {errors.mensaje && <small className="error">{errors.mensaje}</small>}
                            </label>

                            <div className="form-actions">
                                <button type="button" className="btn btn-ghost" onClick={() => { setForm({ nombre: "", correo: "", asunto: "", mensaje: "" }); setErrors({}); }}>
                                    Limpiar
                                </button>

                                <button type="submit" className="btn btn-primary" disabled={sending}>
                                    {sending ? "Enviando..." : "Enviar mensaje"}
                                </button>
                            </div>

                            {success && <div className="success-pill">✅ Mensaje enviado. Te contactamos pronto.</div>}
                        </form>
                    </div>
                    <div className="card faq-card container">
                        <h3>Preguntas frecuentes</h3>
                        <div className="faq-simple">
                            <div className="faq-item">
                                <p className="faq-q">¿Cuánto tarda una respuesta?</p>
                                <p className="faq-a">Nuestro tiempo estimado de respuesta es de 24 a 48 horas en días hábiles.</p>
                            </div>

                            <div className="faq-item">
                                <p className="faq-q">¿Dónde puedo ver mis órdenes?</p>
                                <p className="faq-a">En tu perfil → Mis órdenes. Allí verás el estado y los detalles de cada pedido.</p>
                            </div>

                            <div className="faq-item">
                                <p className="faq-q">¿Aceptan devoluciones?</p>
                                <p className="faq-a">Sí, puedes revisar nuestra política de devoluciones en la sección de Términos y Condiciones.</p>
                            </div>
                        </div>
                    </div>

                </article>

                {/* si quiere agregar algo, justo qui*/ }                
                

            </section>
            {/* CTA flotante */}
            <button className="fab" onClick={handleCTAClick} aria-label="Contactar">
                💬
            </button>
        </main>
    );
};

export default ContactPage;
