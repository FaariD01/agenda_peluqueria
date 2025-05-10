import { useEffect, useState } from "react";
import AppointmentForm from "../components/AppointmentForm";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash, faCheckCircle } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";

export default function Appointments() {
  const [turnos, setTurnos] = useState([]);
  const [editIndex, setEditIndex] = useState(null);

  const empleados = ["Pablo", "Joaco"];

  useEffect(() => {
    const guardados = localStorage.getItem("turnos");
    if (guardados) setTurnos(JSON.parse(guardados));
  }, []);

  useEffect(() => {
    localStorage.setItem("turnos", JSON.stringify(turnos));
  }, [turnos]);

  const agregarTurno = (turno) => {
    const nuevaFechaHora = new Date(`${turno.fecha}T${turno.hora}`);
  
    const bloqueado = turnos.some((t, i) => {
      if (i === editIndex) return false;
  
      if (t.empleado !== turno.empleado) return false;
  
      const tFechaHora = new Date(`${t.fecha}T${t.hora}`);
  
      // Duración bloqueada en minutos
      const bloqueadoPor = t.servicio === "Coloración" ? 120 : 0;
  
      if (bloqueadoPor > 0) {
        const diferencia = Math.abs(nuevaFechaHora - tFechaHora) / (1000 * 60);
        if (diferencia < bloqueadoPor) return true;
      }
  
      // Si el nuevo turno es "Coloración", también bloquear turnos existentes en las 2h posteriores
      if (turno.servicio === "Coloración") {
        const diferencia = (tFechaHora - nuevaFechaHora) / (1000 * 60);
        if (diferencia >= 0 && diferencia < 120) return true;
      }
  
      // Mismo día/hora/empleado = duplicado directo
      return (
        t.fecha === turno.fecha &&
        t.hora === turno.hora &&
        t.empleado === turno.empleado
      );
    });
  
    if (bloqueado) {
      alert("Este peluquero ya tiene un turno reservado en ese rango horario para este tipo de servicio.");
      return;
    }
  
    const turnoConEstado = {
      ...turno,
      estado: "pendiente",
    };
  
    if (editIndex !== null) {
      const nuevos = [...turnos];
      nuevos[editIndex] = turnoConEstado;
      setTurnos(nuevos);
      setEditIndex(null);
    } else {
      setTurnos((prev) => [...prev, turnoConEstado]);
    }
  };

  const confirmarPago = (index) => {
    const nuevos = [...turnos];
    nuevos[index].estado = "confirmado";

    setTurnos(nuevos);
  };

  const eliminarTurno = (index) => {
    const nuevos = turnos.filter((_, i) => i !== index);
    setTurnos(nuevos);
  };

  const editarTurno = (index) => {
    setEditIndex(index);
  };

  return (

      <div className="bodyDashboard">
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
      
      
      <AppointmentForm
        onAdd={agregarTurno}
        initialData={editIndex !== null ? turnos[editIndex] : null}
        empleados={empleados}
      />

      <h2 className="mt-8 text-xl font-semibold text-gray-800">Turnos agendados</h2>
      <ul className="mt-4 space-y-4">
        {turnos.map((t, i) => (
          <li
            key={i}
            className="flex justify-between items-center bg-gray-100 p-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
          >
            <div className="text-gray-700 font-medium">
              {t.fecha} {t.hora} - <strong>{t.cliente}</strong> ({t.servicio}) con {t.empleado} - 
              <span className={`ml-2 text-sm ${t.estado === "pendiente" ? "text-yellow-500" : "text-green-500"}`}>
                {t.estado === "pendiente" ? "Pendiente" : "Confirmado"}
              </span>
            </div>
            <div className="flex items-center space-x-4">
              {t.estado === "pendiente" ? (
                <button
                  onClick={() => confirmarPago(i)}
                  className="text-green-500 hover:text-green-700"
                >
                  <FontAwesomeIcon icon={faCheckCircle} className="text-lg" />
                </button>
              ) : (
                <span className="text-green-600">Turno confirmado</span>
              )}
              <button
                onClick={() => editarTurno(i)}
                className="text-blue-500 hover:text-blue-700"
              >
                <FontAwesomeIcon icon={faEdit} className="text-lg" />
              </button>
              <button
                onClick={() => eliminarTurno(i)}
                className="text-red-500 hover:text-red-700"
              >
                <FontAwesomeIcon icon={faTrash} className="text-lg" />
              </button>
            </div>
          </li>
        ))}
      </ul>
      <div className="buttonTurnos">
        <Link to="/">
          <button className="btnTurnos">
            Volver al panel principal
          </button>
        </Link>
    </div>
      
    </div>
  );
}
