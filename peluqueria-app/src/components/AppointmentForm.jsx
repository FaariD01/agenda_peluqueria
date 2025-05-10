import { useEffect, useState } from "react";

export default function AppointmentForm({ onAdd, initialData, empleados }) {
  const [formData, setFormData] = useState({
    cliente: "",
    servicio: "",
    empleado: "",
    fecha: "",
    hora: "",
  });

  // Listado de horarios permitidos
  const horarios = [
    "09:30", "10:00", "10:30", "11:00", "11:30", "12:00", "12:30", "13:00", "13:30",
    "16:00", "16:30", "17:00", "17:30", "18:00", "18:30", "19:00", "19:30", "20:00"
  ];

  // Función para obtener las fechas válidas, deshabilitando los lunes (1) y domingos (0)
  const getValidDates = () => {
    const today = new Date();
    const validDates = [];

    const daysOfWeek = ["domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado"];

    for (let i = 0; i < 30; i++) { // Vamos a permitir seleccionar fechas dentro de los próximos 30 días
      const currentDate = new Date(today);
      currentDate.setDate(today.getDate() + i);
      const dayOfWeek = currentDate.getDay(); // 0: domingo, 1: lunes, ..., 6: sábado

      // Deshabilitar lunes (1) y domingo (0)
      if (dayOfWeek !== 0 && dayOfWeek !== 1) {
        // Añadir la fecha con el nombre del día
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
        <option value="Peinado">Peinado</option>
        <option value="Barba">Barba</option>
        {/* Agregá más opciones según tu necesidad */}
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
        min={new Date().toISOString().split("T")[0]} // Limita la fecha mínima a hoy
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
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        {initialData ? "Guardar cambios" : "Agendar turno"}
      </button>
    </form>
  );
}
