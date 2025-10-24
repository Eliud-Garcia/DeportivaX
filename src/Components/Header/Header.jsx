import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Button,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Box,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { auth } from '../../Firebase/ConfigFirebase'
import { onAuthStateChanged, signOut } from "firebase/auth";
import "./Header.css";

const Header = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // Escuchar cambios de autenticación
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const toggleDrawer = (open) => (event) => {
    if (event.type === "keydown" && (event.key === "Tab" || event.key === "Shift")) return;
    setDrawerOpen(open);
  };

  const handleLogout = async () => {
    await signOut(auth);
  };

  const menuItems = [
    { text: "Inicio", path: "/" },
    { text: "Productos", path: "/products" },
    { text: "Nosotros", path: "/nosotros" },
    { text: "Contacto", path: "/contacto" },
  ];

  const goTo = (path) => {
    navigate(path);
    setDrawerOpen(false);
  };

  return (
    <>
      <AppBar position="static" className="header">
        <Toolbar className="toolbar">
          {/* LOGO */}
          <Typography variant="h6" className="logo" onClick={() => navigate("/")}>
            ⚡ SportZone
          </Typography>

          {/* MENÚ EN ESCRITORIO */}
          <Box className="nav-links">
            {menuItems.map((item) => (
              <Button
                key={item.text}
                color="inherit"
                onClick={() => goTo(item.path)}
                className="nav-button"
              >
                {item.text}
              </Button>
            ))}
          </Box>

          {/* LOGIN / LOGOUT */}
          {user ? (
            <Button color="secondary" variant="contained" onClick={handleLogout}>
              Cerrar sesión
            </Button>
          ) : (
            <Button color="inherit" onClick={() => navigate("/login")}>
              Iniciar sesión
            </Button>
          )}

          {/* MENÚ HAMBURGUESA MÓVIL */}
          <IconButton
            edge="end"
            color="inherit"
            aria-label="menu"
            className="menu-icon"
            onClick={toggleDrawer(true)}
          >
            <MenuIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* DRAWER RESPONSIVE */}
      <Drawer anchor="right" open={drawerOpen} onClose={toggleDrawer(false)}>
        <Box className="drawer">
          <List>
            {menuItems.map((item) => (
              <ListItem button key={item.text} onClick={() => goTo(item.path)}>
                <ListItemText primary={item.text} />
              </ListItem>
            ))}

            {user ? (
              <ListItem button onClick={handleLogout}>
                <ListItemText primary="Cerrar sesión" />
              </ListItem>
            ) : (
              <ListItem button onClick={() => goTo("/login")}>
                <ListItemText primary="Iniciar sesión" />
              </ListItem>
            )}
          </List>
        </Box>
      </Drawer>
    </>
  );
};

export default Header;
