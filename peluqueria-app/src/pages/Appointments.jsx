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
    const duplicado = turnos.some(
      (t, i) =>
        i !== editIndex &&
        t.fecha === turno.fecha &&
        t.hora === turno.hora &&
        t.empleado === turno.empleado
    );

    if (duplicado) {
      alert("Ya existe un turno para esa fecha, hora y empleado.");
      return;
    }

    const otroEmpleadoEnMismoHorario = turnos.some(
      (t) =>
        t.fecha === turno.fecha &&
        t.hora === turno.hora &&
        t.empleado !== turno.empleado
    );

    if (otroEmpleadoEnMismoHorario || !duplicado) {
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
    } else {
      alert("No se puede agendar el turno en el mismo horario y con el mismo peluquero.");
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
    <div className="p-6 max-w-7xl mx-auto bg-white rounded-lg shadow-xl">
      <h1 className="text-2xl font-bold text-gray-700 mb-6">Gestión de turnos</h1>
      
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
      <Link to="/">
          <button className="w-full md:w-auto bg-gray-600 text-white py-3 px-6 rounded-lg shadow-lg hover:bg-gray-700 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-gray-300 mt-6">
            Volver al Panel Principal
          </button>
        </Link>
      
    </div>
  );
}
