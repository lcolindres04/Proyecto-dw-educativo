const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');

const app = express();
app.use(cors());
app.use(express.json());

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '#curso%DW.2026-2',
  database: process.env.DB_NAME || 'dw_educativo',
  port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 3306,
  ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false
};

async function getDB() {
  return await mysql.createConnection(dbConfig);
}

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Servidor activo' });
});

app.post('/api/estudiantes', async (req, res) => {
  try {
    const { nombre, edad } = req.body;
    if (!nombre || !edad) return res.status(400).json({ error: 'Datos incompletos' });
    const conn = await getDB();
    const [result] = await conn.execute('INSERT INTO estudiantes (nombre, edad) VALUES (?, ?)', [nombre, edad]);
    await conn.end();
    res.json({ id: result.insertId, nombre, edad });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/actividades', async (req, res) => {
  try {
    const conn = await getDB();
    const [rows] = await conn.execute('SELECT * FROM actividades');
    await conn.end();
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/progresos', async (req, res) => {
  try {
    const { estudiante_id, actividad_id, puntaje } = req.body;
    if (!estudiante_id || !actividad_id || puntaje === undefined) {
      return res.status(400).json({ error: 'Faltan parámetros' });
    }
    const conn = await getDB();
    const [result] = await conn.execute(
      'INSERT INTO progresos (estudiante_id, actividad_id, puntaje) VALUES (?, ?, ?)',
      [estudiante_id, actividad_id, puntaje]
    );
    await conn.end();
    res.json({ id: result.insertId, status: 'ok' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/progresos', async (req, res) => {
  try {
    const { estudiante_id } = req.query;
    const conn = await getDB();
    let query = `
      SELECT p.id, e.nombre AS estudiante, e.edad, a.titulo AS actividad, a.nivel, p.puntaje, p.fecha
      FROM progresos p
      JOIN estudiantes e ON p.estudiante_id = e.id
      JOIN actividades a ON p.actividad_id = a.id
    `;
    const params = [];
    if (estudiante_id) {
      query += ' WHERE p.estudiante_id = ?';
      params.push(estudiante_id);
    }
    query += ' ORDER BY p.fecha DESC';
    const [rows] = await conn.execute(query, params);
    await conn.end();
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/estudiantes', async (req, res) => {
  try {
    const conn = await getDB();
    const [rows] = await conn.execute('SELECT * FROM estudiantes ORDER BY nombre ASC');
    await conn.end();
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Backend activo en puerto ${PORT}`);
});
