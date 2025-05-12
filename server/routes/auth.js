const express = require('express');
const fs = require('fs');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const path = require('path');
require('dotenv').config(); // Cargar variables de entorno
const router = express.Router();

// Cargar la clave secreta desde .env
const SECRET_KEY = process.env.SECRET_KEY;

// Leer usuarios desde el archivo JSON
const getUsers = () => {
  const filePath = path.join(__dirname, '..', 'data', 'user.json');  // Ajustamos la ruta
  const data = fs.readFileSync(filePath, 'utf-8');  // Leemos el archivo
  return JSON.parse(data);  // Parseamos el contenido
};

// Guardar usuarios en el archivo JSON
const saveUsers = (users) => {
  const filePath = path.join(__dirname, '..', 'data', 'user.json');  // Ajustamos la ruta
  fs.writeFileSync(filePath, JSON.stringify(users, null, 2));  // Guardamos los datos
};

// Guardar un solo usuario
const saveUser = (newUser) => {
  const users = getUsers(); // Obtener los usuarios existentes
  users.push(newUser); // Añadir el nuevo usuario al arreglo de usuarios
  saveUsers(users); // Guardar los usuarios actualizados en el archivo
};

router.post('/login', (req, res) => {
  const { email, password } = req.body;

  // Validar que los datos no estén vacíos
  if (!email || !password) {
    return res.status(400).json({ error: 'Por favor ingrese el correo electrónico y la contraseña' });
  }

  const users = getUsers();
  const user = users.find(u => u.email === email);

  if (!user) {
    return res.status(401).json({ error: 'Usuario no encontrado' });
  }

  // Comparar la contraseña encriptada usando bcrypt
  if (!bcrypt.compareSync(password, user.password)) {
    return res.status(401).json({ error: 'Contraseña incorrecta' });
  }

  // Crear el token
  const token = jwt.sign({ id: user.id, role: user.role }, SECRET_KEY, { expiresIn: '1d' });

  // Devolver el token, rol y nombre del usuario
  res.json({ token, role: user.role, name: user.name });
});

// Ruta de registro
router.post('/register', async (req, res) => {
  const { email, password, name } = req.body;

  // Verificar si el usuario ya existe
  const users = getUsers();
  const userExists = users.find(user => user.email === email);

  if (userExists) {
    return res.status(400).json({ error: 'El usuario ya existe' });
  }

  // Encriptar la contraseña
  const hashedPassword = await bcrypt.hash(password, 10);

  // Crear el nuevo usuario
  const newUser = { email, password: hashedPassword, name, role: 'user' }; // Establecer un rol por defecto

  // Guardar el nuevo usuario
  saveUser(newUser); // Guardar al usuario en el archivo JSON

  res.status(201).json({ message: 'Usuario registrado exitosamente' });
});

module.exports = router;
