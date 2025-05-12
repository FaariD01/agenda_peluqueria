import React, { createContext, useState, useEffect } from 'react';

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [role, setRole] = useState(null);

  // Verificar el token y rol al cargar la aplicación
  useEffect(() => {
    const storedToken = sessionStorage.getItem('authToken');
    const storedRole = sessionStorage.getItem('userRole');

    if (storedToken && storedRole) {
      setToken(storedToken);
      setRole(storedRole);
    }
  }, []);

  // Función para establecer el token y rol
  const login = (token, role) => {
    sessionStorage.setItem('authToken', token);
    sessionStorage.setItem('userRole', role);
    setToken(token);
    setRole(role);
  };

  // Función para cerrar sesión
  const logout = () => {
    sessionStorage.removeItem('authToken');
    sessionStorage.removeItem('userRole');
    setToken(null);
    setRole(null);
  };

  return (
    <AuthContext.Provider value={{ token, role, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthProvider, AuthContext };
