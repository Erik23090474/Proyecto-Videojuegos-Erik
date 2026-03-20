const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');
require('dotenv').config();

const app = express();
const PORT = 3000;

// Configuración de permisos y lectura de JSON
app.use(cors());
app.use(express.json());

// Ruta de prueba para saber si el servidor vive
app.get('/api/prueba', (req, res) => {
  res.json({ mensaje: '¡Hola Erik, el servidor de Node.js está funcionando!' });
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});