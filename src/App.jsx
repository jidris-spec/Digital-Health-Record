// src/App.jsx
import { Routes, Route } from "react-router-dom";

import Login from "./pages/Login.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import PatientsList from "./pages/PatientsList.jsx";
import AddPatient from "./pages/AddPatient.jsx";
import PatientProfile from "./pages/PatientProfile.jsx";
import ProtectedRoute from "./ProtectedRoute.jsx";

export default function App() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/" element={<Login />} />

      {/* Protected */}
      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/patients" element={<PatientsList />} />
        <Route path="/patients/new" element={<AddPatient />} />
        <Route path="/patients/:id" element={<PatientProfile />} />
      </Route>
    </Routes>
  );
}
