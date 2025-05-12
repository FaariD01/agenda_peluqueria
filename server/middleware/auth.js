const jwt = require('jsonwebtoken');
require('dotenv').config();

// Verificar que el token esté presente y sea válido
const authenticateToken = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  
  if (!token) {
    return res.status(401).json({ error: 'No se proporcionó un token de autenticación' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Token no válido' });
    }
    req.user = user; // Puedes guardar el usuario en el objeto `req`
    next(); // Continuar con la siguiente función de middleware o ruta
  });
};

// Verificar que el usuario tenga un rol específico
const requireRole = (role) => {
  return (req, res, next) => {
    if (req.user.role !== role) {
      return res.status(403).json({ error: 'No tienes permiso para acceder a esta ruta' });
    }
    next(); // Si tiene el rol adecuado, continuar
  };
};

module.exports = { authenticateToken, requireRole };
