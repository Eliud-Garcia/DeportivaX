import React from "react";
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  IconButton,
  Box,
  Button,
  Stack,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import VisibilityIcon from "@mui/icons-material/Visibility";

const CardMyCart = ({ item, onRemove, onAdd, onDecrease, onView }) => {
  return (
    <Card
      sx={{
        display: "flex",
        flexDirection: { xs: "column", sm: "row" },
        alignItems: "center",
        mb: 2,
        p: 2,
        borderRadius: 3,
        boxShadow: 3,
      }}
    >
      {/* Imagen */}
      {item.imagenUrl && (
        <CardMedia
          component="img"
          sx={{
            width: { xs: "100%", sm: 150 },
            height: 150,
            objectFit: "cover",
            borderRadius: 2,
          }}
          image={item.imagenUrl}
          alt={item.nombre}
        />
      )}

      {/* Contenido */}
      <CardContent sx={{ flex: 1, width: "100%" }}>
        <Typography variant="h6" fontWeight={600}>
          {item.nombre}
        </Typography>

        <Typography variant="body2" color="text.secondary">
          Cantidad: {item.cantidad}
        </Typography>

        <Typography variant="body1">
          Precio unitario: ${item.precio?.toLocaleString()}
        </Typography>

        <Typography
          variant="body1"
          sx={{ mt: 1, fontWeight: "bold", color: "primary.main" }}
        >
          Subtotal: ${(item.precio * item.cantidad).toLocaleString()}
        </Typography>

        {/* Botones de acciones */}
        <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
          <IconButton
            color="error"
            size="small"
            onClick={() => onRemove && onRemove(item)}
          >
            <DeleteIcon />
          </IconButton>

          <IconButton
            color="primary"
            size="small"
            onClick={() => onDecrease && onDecrease(item)}
            disabled={item.cantidad <= 1}
          >
            <RemoveIcon />
          </IconButton>

          <IconButton
            color="success"
            size="small"
            onClick={() => onAdd && onAdd(item)}
          >
            <AddIcon />
          </IconButton>

          <Button
            variant="outlined"
            size="small"
            startIcon={<VisibilityIcon />}
            onClick={() => onView && onView(item)}
            sx={{ ml: 2 }}
          >
            Ver producto
          </Button>
        </Stack>
      </CardContent>
    </Card>
  );
};

export default CardMyCart;
