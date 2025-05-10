import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Dashboard from './components/Dashboard/Dashboard'
import Appointments from './components/Turnos/Appointments'
import Payments from './components/Payments/Payments'
import Footer from './components/Footer/Footer'
import Navbar from './components/Navbar/Navbar'
import "./App.css"

export default function App() {
  return (

    <div>
      <Navbar/>
      <Routes>
        
        <Route path="/" element={<Dashboard />} />
        <Route path="/turnos" element={<Appointments />} />
        <Route path="/pagos" element={<Payments />} />
        
      </Routes>
      <Footer/>
    </div>
  )
}
