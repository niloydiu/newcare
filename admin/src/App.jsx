import { useContext } from "react";
import { Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Navbar from "./components/Navbar.jsx";
import Sidebar from "./components/Sidebar.jsx";
import { AdminContext } from "./context/AdminContext.jsx";
import { DoctorContext } from "./context/DoctorContext.jsx";
import AddDoctor from "./pages/Admin/AddDoctor.jsx";
import Appointments from "./pages/Admin/Appointments.jsx";
import Dashboard from "./pages/Admin/Dashboard.jsx";
import DoctorList from "./pages/Admin/DoctorList.jsx";
import DoctorAppointments from "./pages/Doctor/DoctorAppointments.jsx";
import DoctorDashboard from "./pages/Doctor/DoctorDashboard.jsx";
import DoctorProfile from "./pages/Doctor/DoctorProfile.jsx";
import Login from "./pages/Login.jsx";

const App = () => {
  const { aToken } = useContext(AdminContext);
  const { dToken } = useContext(DoctorContext);
  return aToken || dToken ? (
    <div className=" bg-[#f8f9fd]">
      <ToastContainer />
      <Navbar />
      <div className=" flex items-start">
        <Sidebar />
        <Routes>
          {/* Admin Route  */}
          <Route path="/" element={<></>} />
          <Route path="/admin-dashboard" element={<Dashboard />} />
          <Route path="/all-appointments" element={<Appointments />} />
          <Route path="/add-doctor" element={<AddDoctor />} />
          <Route path="/doctor-list" element={<DoctorList />} />

          {/* Doctor Route  */}
          <Route path="doctor-dashboard" element={<DoctorDashboard />} />
          <Route path="doctor-appointments" element={<DoctorAppointments />} />
          <Route path="doctor-profile" element={<DoctorProfile />} />
        </Routes>
      </div>
    </div>
  ) : (
    <>
      <Login />
      <ToastContainer />
    </>
  );
};

export default App;
