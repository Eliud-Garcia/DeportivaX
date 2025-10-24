import React, { useState } from "react";
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Paper,
  Avatar,
  InputAdornment,
  IconButton,
} from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../Firebase/ConfigFirebase";
import { Link, useNavigate } from "react-router-dom";
import "./LoginPage.css";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      alert("Inicio de sesión exitoso");
      navigate("/products");
    } catch (err) {
      alert("Error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth={false} className="login-container">
      <Paper elevation={6} className="login-paper">
        <Avatar className="login-avatar">
          <LockOutlinedIcon fontSize="large" />
        </Avatar>

        <Typography variant="h5" fontWeight="bold" gutterBottom>
          Iniciar Sesión
        </Typography>

        <Typography variant="body2" color="text.secondary" mb={3}>
          Ingresa con tu correo y contraseña registrados.
        </Typography>

        <Box component="form" onSubmit={handleLogin}>
          <TextField
            fullWidth
            label="Correo electrónico"
            type="email"
            variant="outlined"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            margin="normal"
            required
          />

          <TextField
            fullWidth
            label="Contraseña"
            type={showPassword ? "text" : "password"}
            variant="outlined"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            margin="normal"
            required
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowPassword(!showPassword)}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            disabled={loading}
            className="login-button"
          >
            {loading ? "Ingresando..." : "Entrar"}
          </Button>
        </Box>

        <Typography variant="body2" className="login-register-text">
          ¿No tienes una cuenta?{" "}
          <Link to="/register" className="login-link">
            Regístrate aquí
          </Link>
        </Typography>
      </Paper>
    </Container>
  );
};

export default LoginPage;
