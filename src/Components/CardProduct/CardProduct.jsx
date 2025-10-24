import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import CardActionArea from '@mui/material/CardActionArea';

const CardProduct = ({ producto }) => {
  return (
    <Card sx={{ maxWidth: 345 }}>
      <CardActionArea>
        <CardMedia
          component="img"
          height="140"
          image={producto.imagenUrl}
          alt={"producto " + producto.nombre}
          sx={{
            objectFit: 'contain'
          }}
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            {producto.nombre}
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            {producto.descripcion}
          </Typography>

          <Typography variant="body1" sx={{ color: 'blue' }}>
            {producto.precio}
          </Typography>
          
        </CardContent>
        
      </CardActionArea>
    </Card>
  );
}

export default CardProduct;