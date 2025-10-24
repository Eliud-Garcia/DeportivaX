import React, { useState } from 'react';
import {
  Container,
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  CircularProgress,
} from '@mui/material';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { setDoc, doc } from 'firebase/firestore';
import { auth, db } from '../../Firebase/ConfigFirebase';
import { Link } from 'react-router-dom';

import './RegisterPage.css';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    nombre: '',
    telefono: '',
    direccion: '',
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { email, password, nombre, telefono, direccion } = formData;

      const res = await createUserWithEmailAndPassword(auth, email, password);

      await setDoc(doc(db, 'usuarios', res.user.uid), {
        nombre,
        telefono,
        direccion,
        email,
        rol: 'cliente',
        carrito: [],
      });

      alert('✅ Usuario registrado correctamente');
      setFormData({
        nombre: '',
        telefono: '',
        direccion: '',
        email: '',
        password: '',
      });
    } catch (err) {
      alert('⚠️ Error: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth={false} className="register-container">
      <Paper elevation={4} className="register-paper">
        <Typography variant="h5" align="center" gutterBottom fontWeight={600}>
          Crear una cuenta
        </Typography>

        <Box component="form" onSubmit={handleRegister} className="register-form">
          <TextField
            label="Nombre completo"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            required
          />
          <TextField
            label="Teléfono"
            name="telefono"
            type="tel"
            value={formData.telefono}
            onChange={handleChange}
            required
          />
          <TextField
            label="Dirección"
            name="direccion"
            value={formData.direccion}
            onChange={handleChange}
            required
          />
          <TextField
            label="Correo electrónico"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <TextField
            label="Contraseña"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            required
            inputProps={{ minLength: 6 }}
            helperText="Mínimo 6 caracteres"
          />

          <Button
            variant="contained"
            color="primary"
            type="submit"
            disabled={loading}
            className="register-button"
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : 'Registrarse'}
          </Button>
        </Box>

        <Typography variant="body2" align="center" className="register-login-text">
          ¿Ya tienes una cuenta?{' '}
          <Link to="/login" className="register-login-link">
            Inicia sesión
          </Link>
        </Typography>
      </Paper>
    </Container>
  );
};

export default RegisterPage;
