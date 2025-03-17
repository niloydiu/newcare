import axios from "axios";
import { createContext, useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const DoctorContext = createContext();

const DoctorContextProvider = (props) => {
  const [dToken, setDToken] = useState(
    localStorage.getItem("dToken") ? localStorage.getItem("dToken") : ""
  );
  const [appointments, setAppointments] = useState([]);
  const [dashData, setDashData] = useState(false);
  const [profileData, setProfileData] = useState(false);

  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const getAppointments = async () => {
    try {
      // Extra starts
      // Check if token exists
      if (!dToken) {
        console.log("No token found");
        toast.error("Please login first");
        return;
      }

      // Extra ends

      // Extra starts
      // const { data } = await axios.get(
      //   backendUrl + "/api/doctor/appointments",
      //   {
      //     headers: { dToken },
      //   }
      // );

      const { data } = await axios.get(
        backendUrl + "/api/doctor/appointments",
        {
          headers: {
            Authorization: `Bearer ${dToken}`, // Try standard format
            dToken: dToken, // Also include original format
          },
        }
      );
      // Extra ends

      if (data.success) {
        setAppointments(data.appointments);
      } else {
        console.log(data.message);
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const completeAppointment = async (appointmentId) => {
    try {
      const { data } = await axios.post(
        backendUrl + "/api/doctor/complete-appointment",
        {
          appointmentId,
        },
        {
          headers: { dToken },
        }
      );
      if (data.success) {
        toast.success(data.message);
        getAppointments();
      } else {
        console.log(data.message);
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const cancelAppointment = async (appointmentId) => {
    try {
      const { data } = await axios.post(
        backendUrl + "/api/doctor/cancel-appointment",
        {
          appointmentId,
        },
        {
          headers: { dToken },
        }
      );
      if (data.success) {
        toast.success(data.message);
        getAppointments();
      } else {
        console.log(data.message);
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const getDashData = async () => {
    try {
      const { data } = await axios.get(backendUrl + "/api/doctor/dashboard", {
        headers: { dToken },
      });
      if (data.success) {
        setDashData(data.dashData);
        console.log(data.dashData);
      } else {
        console.log(data.message);
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const getProfileData = async () => {
    try {
      const { data } = await axios.get(backendUrl + "/api/doctor/profile", {
        headers: { dToken },
      });
      if (data.success) {
        setProfileData(data.profileData);
        console.log(data.profileData);
      } else {
        console.log(data.message);
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const value = {
    dToken,
    backendUrl,
    appointments,
    setAppointments,
    setDToken,
    getAppointments,
    completeAppointment,
    cancelAppointment,
    getDashData,
    dashData,
    setDashData,
    getProfileData,
    profileData,
    setProfileData,
  };
  return (
    <DoctorContext.Provider value={value}>
      {props.children}
    </DoctorContext.Provider>
  );
};

export default DoctorContextProvider;
