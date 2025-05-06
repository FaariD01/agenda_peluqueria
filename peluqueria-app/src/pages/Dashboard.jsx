import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "./dashboard.css";

export default function PanelPrincipal() {
  const [turnos, setTurnos] = useState([]); // Estado para los turnos
  const [date, setDate] = useState(new Date()); // Fecha seleccionada en el calendario

  useEffect(() => {
    // Aquí cargamos los turnos desde el localStorage (o puede ser desde una API)
    const turnosGuardados = JSON.parse(localStorage.getItem("turnos")) || [];
    setTurnos(turnosGuardados);
  }, []);

  const getTurnosPorFecha = (fecha) => {
    const fechaStr = fecha.toISOString().split('T')[0]; // Solo la fecha en formato YYYY-MM-DD
    return turnos.filter(turno => turno.fecha === fechaStr);
  };

  // Función para deshabilitar días que no sean martes a sábados
  const disableDays = ({ date }) => {
    const day = date.getDay(); // Obtener el día de la semana (0: domingo, 1: lunes, ..., 6: sábado)
    return day === 0 || day === 1; // Deshabilitar domingos (0) y lunes (1)
  };

  return (
    <div className="h-screen flex flex-col items-center justify-center bg-gray-900 p-6">
      <div className="bg-gray-800 rounded-lg shadow-xl p-8 w-full max-w-4xl text-center">
        <h1 className="text-2xl font-bold text-white mb-6">Panel de Gestión</h1>
        
        {/* Botón para ir a la gestión de turnos */}
        <Link to="/turnos">
          <button className="w-full md:w-auto bg-blue-600 text-white py-3 px-6 rounded-lg shadow-lg hover:bg-blue-700 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-300">
            Ver y Agendar Turnos
          </button>
        </Link>

        {/* Calendario en modo oscuro */}
        <div className="mt-8">
        <Calendar
  onChange={setDate}
  value={date}
  tileClassName={({ date, view }) => {
    const turnosDelDia = getTurnosPorFecha(date);
    let className = 'text-gray-300'; // Color de texto predeterminado para los días

    if (turnosDelDia.length > 0) {
      className = 'bg-blue-700 text-white'; // Fondo azul para los días con turnos
    }

    if (date.getDay() === 0 || date.getDay() === 1) {
      className += ' opacity-50'; // Deshabilitar domingos y lunes
    }

    return className;
  }}
  className="react-calendar custom-calendar"
  style={{
    backgroundColor: '#1f2937', // Fondo oscuro
    color: '#fff', // Texto blanco
    borderRadius: '10px', // Bordes redondeados
    border: 'none', // Sin borde
  }}
  next2Label={null} // Opcional: para ocultar el botón de cambiar de mes
  prev2Label={null} // Opcional: para ocultar el botón de cambiar de mes
  tileDisabled={disableDays} // Limitar días de trabajo (martes a sábados)
  navigationLabel={({ date }) => date.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })} // Mostrar mes y año en español
/>


        </div>




        {/* Mostrar turnos de la fecha seleccionada */}
        <div className="mt-6">
          <h2 className="text-xl font-semibold text-white">Turnos para {date.toLocaleDateString()}</h2>
          <ul className="mt-4">
            {getTurnosPorFecha(date).map((turno, index) => (
              <li key={index} className="py-2 px-4 bg-gray-600 rounded-md mb-2">
                <p><strong>Cliente:</strong> {turno.cliente}</p>
                <p><strong>Hora:</strong> {turno.hora}</p>
                <p><strong>Empleado:</strong> {turno.empleado}</p>
                <p><strong>Servicio:</strong> {turno.servicio}</p>
              </li>
            ))}
            {getTurnosPorFecha(date).length === 0 && <p>No hay turnos agendados para este día.</p>}
          </ul>
        </div>
      </div>
    </div>
  );
}
