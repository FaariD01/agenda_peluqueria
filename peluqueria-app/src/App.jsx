import { Routes, Route } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import Appointments from './pages/Appointments'
import Payments from './pages/Payments'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/turnos" element={<Appointments />} />
      <Route path="/pagos" element={<Payments />} />
    </Routes>
  )
}
