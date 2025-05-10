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

  const getTurnosAgrupadosYOrdenados = (fecha) => {
    const turnosDelDia = getTurnosPorFecha(fecha);
  
    const agrupados = {};
  
    turnosDelDia.forEach((turno) => {
      if (!agrupados[turno.empleado]) {
        agrupados[turno.empleado] = [];
      }
      agrupados[turno.empleado].push(turno);
    });
  
    // Ordenar los turnos de cada empleado por hora
    Object.keys(agrupados).forEach((empleado) => {
      agrupados[empleado].sort((a, b) => a.hora.localeCompare(b.hora));
    });
  
    return agrupados;
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

        
  {/* Panel de gestión */}
  <div className="bg-gray-800 rounded-lg shadow-xl p-8 w-full max-w-4xl text-center">
    

    

    {/* Calendario */}
    <div className="calendario">
      <Calendar
        onChange={setDate}
        value={date}
        tileClassName={({ date }) => {
          const turnosDelDia = getTurnosPorFecha(date);
          let className = 'text-gray-300';
          if (turnosDelDia.length > 0) className = 'bg-blue-700 text-white';
          if (date.getDay() === 0 || date.getDay() === 1) className += ' opacity-50';
          return className;
        }}
        className="react-calendar custom-calendar"
        style={{
          backgroundColor: '#1f2937',
          color: '#fff',
          borderRadius: '10px',
          border: 'none',
        }}
        next2Label={null}
        prev2Label={null}
        tileDisabled={disableDays}
        navigationLabel={({ date }) =>
          date.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })
        }
      />
    </div>

   

    {/* Lista de turnos */}
  <div className="divListadoTurnos">
  <h2 className="">
    Turnos para {date.toLocaleDateString()}
  </h2>

  {Object.entries(getTurnosAgrupadosYOrdenados(date)).map(([empleado, turnosEmpleado]) => (
    <div key={empleado} className="mb-6">
      <h3 className="nombreEmpleado">✂️ {empleado}</h3>
      <ul className="listadoTurnos">
        {turnosEmpleado.map((turno, index) => (
          <li
            key={index}
            className="bg-gray-800 p-4 rounded-xl shadow-lg border border-gray-700 hover:shadow-xl transition-all duration-300"
          >
            <p className="text-white mb-2">
              <span className="font-semibold">🧍 Cliente:</span> {turno.cliente}
            </p>
            <p className="text-white mb-2">
              <span className="font-semibold">🕒 Hora:</span> {turno.hora}
            </p>
            <p className="text-white">
              <span className="font-semibold">💈 Servicio:</span> {turno.servicio}
            </p>
          </li>
        ))}
      </ul>
    </div>
  ))}

  {getTurnosPorFecha(date).length === 0 && (
    <p className="text-gray-400">No hay turnos agendados para este día.</p>
  )}
</div>
  </div>
  <footer>
    <div className="footer">
          <h3>© 2025 ChemTech</h3>
      </div> 
  </footer>
</div>

)};
    
    
   