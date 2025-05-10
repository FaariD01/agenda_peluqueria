import React from 'react'
import { Link } from 'react-router-dom'
import "./navbar.css"
const Navbar = () => {
  return (
    <>
        {/* Encabezado con logo y título */}
    <div className="divLogo">
      <img
        src="/public/logo.png"
        alt="Logo"
        className="logo"
      />
      
    </div>
    <div className="navBar">
      <div className="buttonTurnos">
          <Link to="/">
            <button className="btnTurnos">
              Inicio
            </button>
          </Link>
      </div>
      <div className="buttonTurnos">
          <Link to="/turnos">
            <button className="btnTurnos">
              Ver y Agendar Turnos
            </button>
          </Link>
      </div>
        <div className="buttonTurnos">
          <Link to="/">
            <button className="btnTurnos">
              Conocenos
            </button>
          </Link>
      </div>
    </div>
    </>
  )
}

export default Navbar
