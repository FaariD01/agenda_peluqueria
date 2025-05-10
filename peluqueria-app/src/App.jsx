import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import Appointments from './pages/Appointments'
import Payments from './pages/Payments'

import "./App.css"

export default function App() {
  return (

    <div>
    
    <Routes>
      
      <Route path="/" element={<Dashboard />} />
      <Route path="/turnos" element={<Appointments />} />
      <Route path="/pagos" element={<Payments />} />
      
    </Routes>
    </div>
  )
}
