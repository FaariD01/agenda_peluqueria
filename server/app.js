const express = require('express');
const cors = require('cors');
const { authenticateToken, requireRole } = require('./middleware/auth');
const authRoutes = require('./routes/auth.js');
require('dotenv').config();

const app = express();



// Middleware
app.use(cors()); // Permite peticiones desde cualquier origen (puedes personalizarlo según tus necesidades)
app.use(express.json()); // Para que Express pueda parsear el cuerpo de las peticiones JSON

// Rutas públicas
// Las rutas de autenticación como login y registro se manejan en authRoutes
app.use('/api/auth', authRoutes);

// Rutas protegidas
// Ruta para el admin, solo accesible por usuarios con el rol "admin"
app.get('/api/turnos/admin', authenticateToken, requireRole('admin'), (req, res) => {
  res.json({ mensaje: 'Vista para el peluquero (admin)' });
});

// Ruta para el cliente, solo accesible por usuarios con el rol "user"
app.get('/api/turnos', authenticateToken, requireRole('user'), (req, res) => {
  res.json({ mensaje: 'Vista para el cliente (user)' });
});

// Otras rutas que quieras agregar, como la ruta de ejemplo:
app.get('/api/dashboard', authenticateToken, (req, res) => {
  res.json({ mensaje: 'Dashboard accesible para usuarios autenticados' });
});

// Manejo de errores
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Algo salió mal en el servidor' });
});

// Iniciar servidor
app.listen(3000, () => {
  console.log('Servidor corriendo en http://localhost:3000');
});
