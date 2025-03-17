import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Appcontext } from "../context/Appcontext";

const Myappointments = () => {
  const { backendUrl, token, getDoctorsData } = useContext(Appcontext);
  const [appointments, setAppointments] = useState([]);
  const months = [
    "",
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const slotDateFromat = (slotDate) => {
    const dateArray = slotDate.split("_");
    return (
      dateArray[0] + " " + months[Number(dateArray[1])] + " " + dateArray[2]
    );
  };
  const getUserAppointments = async () => {
    try {
      const { data } = await axios.get(backendUrl + "/api/user/appointments", {
        headers: { token },
      });
      if (data.success) {
        setAppointments(data.appointments.reverse());
        console.log(data.appointments);
      } else {
        console.log(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };
  const cancelAppointment = async (appointmentId) => {
    try {
      const { data } = await axios.post(
        backendUrl + "/api/user/cancel-appointment",
        { appointmentId },
        { headers: { token } }
      );
      if (data.success) {
        toast.success(data.message);
        getUserAppointments();
        getDoctorsData();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };
  useEffect(() => {
    if (token) {
      getUserAppointments();
    }
  }, [token]);

  return (
    <div>
      <p className=" pb-3 mt-12 font-medium text-zinc-700 border-b border-zinc-300">
        My Appointments
      </p>
      <div>
        {appointments.slice(0, 3).map((item, index) => (
          <div
            key={index}
            className=" grid grid-cols-[1fr_2fr] gap-4 sm:flex sm:gap-6 py-2 border-b border-zinc-300"
          >
            <div>
              <img
                src={item.docData.image}
                alt="Doctor's image"
                className=" w-32 bg-indigo-50 "
              />
            </div>
            <div className=" flex-1  text-sm text-zinc-600">
              <p className=" text-neutral-800 font-semibold ">
                {item.docData.name}
              </p>
              <p>{item.docData.speciality}</p>
              <p className=" text-zinc-700 font-medium mt-1">Address:</p>
              <p className=" text-xs">{item.docData.address.line1}</p>
              <p className=" text-xs">{item.docData.address.line2}</p>
              <p className=" text-sm mt-1">
                <span className=" text-sm text-neutral-700 font-medium">
                  Date & time:
                </span>
                {slotDateFromat(item.slotDate)} | {item.slotTime}
              </p>
            </div>
            <div></div>
            <div className=" flex flex-col gap-2 justify-end">
              {/* {!item.cancelled && (
                <button className=" text-sm text-stone-500 text-center sm:min-w-48 py-2 border hover:bg-primary hover:text-white transition-all duration-300">
                  Pay Cash Offline
                </button>
              )} */}
              {!item.cancelled && !item.isCompleted && (
                <button
                  onClick={() => cancelAppointment(item._id)}
                  className=" text-sm text-stone-500 text-center sm:min-w-48 py-2 border hover:bg-red-600 hover:text-white transition-all duration-300"
                >
                  Cancel Appointment
                </button>
              )}
              {item.cancelled && !item.isCompleted && (
                <button className=" sm:min-w-48 py-2 border border-red-500 rounded text-red-500">
                  Appointment cancelled
                </button>
              )}
              {item.isCompleted && (
                <button className=" sm:min-w-48 py-2 border border-green-500 rounded text-green-500">
                  Completed
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Myappointments;
