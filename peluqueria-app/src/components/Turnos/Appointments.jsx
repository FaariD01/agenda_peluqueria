import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash, faCheckCircle } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import "./Appoinments.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";



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
      const bloqueadoPor = t.servicio === "Coloración" ? 120 : 0;

      if (bloqueadoPor > 0) {
        const diferencia = Math.abs(nuevaFechaHora - tFechaHora) / (1000 * 60);
        if (diferencia < bloqueadoPor) return true;
      }

      if (turno.servicio === "Coloración") {
        const diferencia = (tFechaHora - nuevaFechaHora) / (1000 * 60);
        if (diferencia >= 0 && diferencia < 120) return true;
      }

      return (
        t.fecha === turno.fecha &&
        t.hora === turno.hora &&
        t.empleado === turno.empleado
      );
    });

      if (bloqueado) {
      toast.error("Este peluquero ya tiene un turno reservado en ese rango horario para este tipo de servicio.");
      return;
      }

    const turnoConEstado = { ...turno, estado: "pendiente" };

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
    <div className="bodyTurnos">
      <AppointmentForm
        onAdd={agregarTurno}
        initialData={editIndex !== null ? turnos[editIndex] : null}
        empleados={empleados}
      />

      <h2>Turnos agendados</h2>
      <ul>
        {turnos.map((t, i) => (
          <li key={i}>
            <div>
              {t.fecha} {t.hora} - <strong>{t.cliente}</strong> ({t.servicio}) con {t.empleado} -
              <span className={`ml-2 text-sm ${t.estado === "pendiente" ? "text-yellow-500" : "text-green-500"}`}>
                {t.estado === "pendiente" ? "Pendiente" : "Confirmado"}
              </span>
            </div>
            <div>
              {t.estado === "pendiente" ? (
                <button onClick={() => confirmarPago(i)}>
                  <FontAwesomeIcon icon={faCheckCircle} className="text-lg" />
                </button>
              ) : (
                <span>Turno confirmado</span>
              )}
              <button onClick={() => editarTurno(i)}>
                <FontAwesomeIcon icon={faEdit} />
              </button>
              <button onClick={() => eliminarTurno(i)} className="text-red-500 hover:text-red-700">
                <FontAwesomeIcon icon={faTrash} />
              </button>
            </div>
          </li>
        ))}
      </ul>

      <div className="buttonTurnos">
        <Link to="/">
          <button className="btnTurnos">Volver al panel principal</button>
        </Link>
      </div>
    </div>
  );
}

// Componente interno unificado
function AppointmentForm({ onAdd, initialData, empleados }) {
  const [formData, setFormData] = useState({
    cliente: "",
    servicio: "",
    empleado: "",
    fecha: "",
    hora: "",
  });

  const horarios = [
    "09:30", "10:00", "10:30", "11:00", "11:30", "12:00", "12:30", "13:00", "13:30",
    "16:00", "16:30", "17:00", "17:30", "18:00", "18:30", "19:00", "19:30", "20:00"
  ];

  const getValidDates = () => {
    const today = new Date();
    const validDates = [];
    const daysOfWeek = ["domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado"];

    for (let i = 0; i < 30; i++) {
      const currentDate = new Date(today);
      currentDate.setDate(today.getDate() + i);
      const dayOfWeek = currentDate.getDay();
      if (dayOfWeek !== 0 && dayOfWeek !== 1) {
        validDates.push({
          date: currentDate.toISOString().split('T')[0],
          day: daysOfWeek[dayOfWeek]
        });
      }
    }
    return validDates;
  };

  const [validDates, setValidDates] = useState(getValidDates());

  useEffect(() => {
    if (initialData) setFormData(initialData);
  }, [initialData]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onAdd) onAdd(formData);
    setFormData({
      cliente: "",
      servicio: "",
      empleado: "",
      fecha: "",
      hora: "",
    });
  };

  return (
    <>
    <div className="bodyTurnos">

   
    
    <form onSubmit={handleSubmit} className="space-y-4 p-4 max-w-md mx-auto">
      <input
        type="text"
        name="cliente"
        placeholder="Nombre del cliente"
        value={formData.cliente}
        onChange={handleChange}
        required
        className="w-full border p-2 rounded"
      />
      <select
        name="servicio"
        value={formData.servicio}
        onChange={handleChange}
        required
        className="border p-2 rounded w-full"
      >
        <option value="">Seleccionar servicio</option>
        <option value="Corte de pelo">Corte de pelo</option>
        <option value="Coloración">Coloración</option>
        <option value="Barba">Barba</option>
      </select>
      <select
        name="empleado"
        value={formData.empleado}
        onChange={handleChange}
        required
        className="w-full border p-2 rounded"
      >
        <option value="">Seleccionar empleado</option>
        {empleados.map((empleado, index) => (
          <option key={index} value={empleado}>
            {empleado}
          </option>
        ))}
      </select>
      <input
        type="date"
        name="fecha"
        min={new Date().toISOString().split("T")[0]}
        value={formData.fecha}
        onChange={handleChange}
        required
        className="w-full border p-2 rounded"
        list="valid-dates"
      />
      <datalist id="valid-dates">
        {validDates.map((dateObj, index) => (
          <option key={index} value={dateObj.date}>
            {dateObj.date} ({dateObj.day})
          </option>
        ))}
      </datalist>
      <select
        name="hora"
        value={formData.hora}
        onChange={handleChange}
        required
        className="w-full border p-2 rounded"
      >
        <option value="">Seleccionar hora</option>
        {horarios.map((hora, index) => (
          <option key={index} value={hora}>
            {hora}
          </option>
        ))}
      </select>
      <button
        type="submit"
        className=""
      >
        {initialData ? "Guardar cambios" : "Agendar turno"}
      </button>
      <ToastContainer />
    </form>
     </div>
    </>
  );
}
