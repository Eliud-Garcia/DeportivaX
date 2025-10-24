import React, { useState } from 'react'
import {
  Container,
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  CircularProgress
} from '@mui/material'
import { createUserWithEmailAndPassword } from 'firebase/auth'
import { setDoc, doc } from 'firebase/firestore'
import { auth, db } from '../../Firebase/ConfigFirebase'

const Register = () => {
  const [formData, setFormData] = useState({
    nombre: '',
    telefono: '',
    direccion: '',
    email: '',
    password: '',
  })
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleRegister = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const { email, password, nombre, telefono, direccion } = formData

      // Crear usuario en Firebase Auth
      const res = await createUserWithEmailAndPassword(auth, email, password)

      // Guardar datos en Firestore
      await setDoc(doc(db, 'usuarios', res.user.uid), {
        nombre,
        telefono,
        direccion,
        email,
        rol: 'cliente',
        carrito: [],
      })

      alert('✅ Usuario registrado correctamente')
      setFormData({
        nombre: '',
        telefono: '',
        direccion: '',
        email: '',
        password: '',
      })
    } catch (err) {
      alert('⚠️ Error: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Container maxWidth="sm" sx={{ mt: 10, mb: 8 }}>
      <Paper elevation={4} sx={{ p: 5, borderRadius: 3 }}>
        <Typography variant="h5" align="center" gutterBottom fontWeight={600}>
          Crear una cuenta
        </Typography>

        <Box component="form" onSubmit={handleRegister} sx={{ mt: 3, display: 'flex', flexDirection: 'column', gap: 2 }}>
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
            sx={{ mt: 2, py: 1.2, fontWeight: 600 }}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : 'Registrarse'}
          </Button>
        </Box>

        <Typography variant="body2" align="center" sx={{ mt: 3 }}>
          ¿Ya tienes una cuenta?{' '}
          <a href="/login" style={{ color: '#1976d2', textDecoration: 'none', fontWeight: 600 }}>
            Inicia sesión
          </a>
        </Typography>
      </Paper>
    </Container>
  )
}

export default Register
