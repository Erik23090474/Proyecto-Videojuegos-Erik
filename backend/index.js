const express = require('express');
const cors = require('cors');
const sql = require('mssql'); // Cambiamos mysql2 por mssql
require('dotenv').config();

const app = express();

// Configuración de permisos y lectura de JSON
app.use(cors());
app.use(express.json());

// Configuración de la conexión a SQL Server (Somee)
const dbConfig = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    server: process.env.DB_SERVER,
    database: process.env.DB_DATABASE,
    options: {
        encrypt: true, // Obligatorio para Azure/Somee
        trustServerCertificate: true // Para evitar errores de certificado en desarrollo
    }
};

// Ruta para GUARDAR un videojuego (POST)
app.post('/api/videojuegos', async (req, res) => {
    try {
        const { titulo, anio, genero, usuario_uid } = req.body;
        
        // Conectamos a la base de datos
        let pool = await sql.connect(dbConfig);
        
        // Ejecutamos la consulta
        await pool.request()
            .input('titulo', sql.VarChar, titulo)
            .input('anio', sql.Int, anio)
            .input('genero', sql.Int, genero)
            .input('uid', sql.VarChar, usuario_uid)
            .query('INSERT INTO Videojuegos (titulo, anio, genero_id, usuario_uid) VALUES (@titulo, @anio, @genero, @uid)');

        res.json({ status: 'ok', mensaje: 'Videojuego guardado en Somee con éxito' });
    } catch (err) {
        console.error('Error al insertar:', err);
        res.status(500).json({ status: 'error', error: err.message });
    }
});

// Ruta de prueba para saber si el servidor vive
app.get('/api/prueba', (req, res) => {
  res.json({ mensaje: '¡Hola Erik, el servidor de Node.js en Railway está funcionando!' });
});

// En la nube, el puerto lo asigna Railway o usa el 3000 por defecto
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});