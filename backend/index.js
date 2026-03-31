const express = require('express');
const cors = require('cors');
const sql = require('mssql');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());

const dbConfig = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    server: process.env.DB_SERVER,
    database: process.env.DB_DATABASE,
    options: {
        encrypt: true,
        trustServerCertificate: true
    }
};

// RUTA 1: GUARDAR (POST)
app.post('/api/videojuegos', async (req, res) => {
    try {
        const { titulo, anio, genero, usuario_uid } = req.body;
        let pool = await sql.connect(dbConfig);
        await pool.request()
            .input('titulo', sql.VarChar, titulo)
            .input('anio', sql.Int, anio)
            .input('genero', sql.Int, genero)
            .input('uid', sql.VarChar, usuario_uid)
            .query('INSERT INTO Videojuegos (titulo, anio, genero_id, usuario_uid) VALUES (@titulo, @anio, @genero, @uid)');

        res.json({ status: 'ok', mensaje: 'Videojuego guardado en Somee' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});

// RUTA 2: LISTAR (GET)
app.get('/api/videojuegos', async (req, res) => {
    try {
        const { uid } = req.query;

        console.log("UID recibido:", uid);

        let pool = await sql.connect(dbConfig);
        const result = await pool.request()
            .input('uid', sql.VarChar, uid)
            .query(`
                SELECT *
                FROM Videojuegos
                WHERE usuario_uid = @uid
            `);

        console.log("RESULTADO:", result.recordset);

        res.json(result.recordset);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});

// PRUEBA DE VIDA
app.get('/api/prueba', (req, res) => {
    res.json({ mensaje: 'Servidor en Railway activo y conectado a Somee' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor en puerto ${PORT}`);
});