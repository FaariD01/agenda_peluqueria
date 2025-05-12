import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './components/Dashboard/Dashboard';
import Appointments from './components/Turnos/Appointments';
import Payments from './components/Payments/Payments';
import Footer from './components/Footer/Footer';
import Navbar from './components/Navbar/Navbar';
import LoginForm from './components/Login/LoginForm';
import Logo from './components/Logo/Logo';
import { AuthProvider , AuthContext } from './context/AuthContext.jsx';  // Importar el contexto
import { useContext } from 'react';
import './App.css';

export default function App() {
  return (
    <AuthProvider>
      <InnerApp />
    </AuthProvider>
  );
}

function InnerApp() {
  const { token } = useContext(AuthContext);

  const ProtectedRoute = ({ children }) => {
    return token ? children : <Navigate to="/login" />;
  };

  return (
    <>
      <Logo />
      <ProtectedRoute><Navbar /></ProtectedRoute>
      <Routes>
        <Route path="/login" element={<LoginForm />} />
        <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/turnos" element={<ProtectedRoute><Appointments /></ProtectedRoute>} />
        <Route path="/pagos" element={<ProtectedRoute><Payments /></ProtectedRoute>} />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
      <Footer />
    </>
  );
}


