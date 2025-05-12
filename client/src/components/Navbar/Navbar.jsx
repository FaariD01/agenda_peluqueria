import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';  // Asegúrate de que AuthContext esté importado correctamente
import "./navbar.css"
const Navbar = () => {
  const { token, logout } = useContext(AuthContext);  // Accede al token y la función logout del contexto

  if (!token) {
    return null;  // Si no hay token, no se muestra el Navbar
  }

  return (
    <div className="navBar">
      <div className="buttonTurnos">
        <Link to="/">
          <button className="btnTurnos">Inicio</button>
        </Link>
      </div>
      <div className="buttonTurnos">
        <Link to="/turnos">
          <button className="btnTurnos">Gestionar Turnos</button>
        </Link>
      </div>
      <div className="buttonTurnos">
        <Link to="/pagos">
          <button className="btnTurnos">Gestionar Pagos</button>
        </Link>
      </div>
      <div className="buttonTurnos">
      <Link to="/login">
        <button className="btnTurnos" onClick={logout}>Cerrar sesión</button>
      </Link>
      </div>
    </div>
  );
};

export default Navbar;
