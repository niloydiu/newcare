import React, { useContext, useEffect } from "react";
import { assets } from "../../assets/assets_admin/assets";
import { AdminContext } from "../../context/AdminContext";
import { AppContext } from "../../context/AppContext";

const Dashboard = () => {
  const { aToken, getDashData, dashData, cancelAppointment } =
    useContext(AdminContext);
  const { slotDateFormat } = useContext(AppContext);
  useEffect(() => {
    if (aToken) {
      getDashData();
    }
  }, [aToken]);

  return (
    dashData && (
      <div className=" m-5">
        <div className=" flex flex-wrap gap-3">
          <div className=" flex items-center gap-2 bg-white p-4 min-w-52 rounded border-2 border-gray-100 cursor-pointer hover:scale-105 transition-all duration-300">
            <img src={assets.doctor_icon} alt="doctor_icon" className=" w-14" />
            <div>
              <p className=" text-xl font-semibold text-gray-600">
                {dashData.doctors}
              </p>
              <p className=" text-gray-400">Doctors</p>
            </div>
          </div>
          <div className=" flex items-center gap-2 bg-white p-4 min-w-52 rounded border-2 border-gray-100 cursor-pointer hover:scale-105 transition-all duration-300">
            <img
              src={assets.appointments_icon}
              alt="appointment_icon"
              className=" w-14"
            />
            <div>
              <p className=" text-xl font-semibold text-gray-600">
                {dashData.appointments}
              </p>
              <p className=" text-gray-400">Appointments</p>
            </div>
          </div>
          <div className=" flex items-center gap-2 bg-white p-4 min-w-52 rounded border-2 border-gray-100 cursor-pointer hover:scale-105 transition-all duration-300">
            <img
              src={assets.patients_icon}
              alt="patients_icon"
              className=" w-14"
            />
            <div>
              <p className=" text-xl font-semibold text-gray-600">
                {dashData.patients}
              </p>
              <p className=" text-gray-400">Patients</p>
            </div>
          </div>
        </div>
        <div className=" bg-white">
          <div className=" flex items-center gap-2.5 px-4 py-4 mt-10 rounded-t border border-gray-100">
            <img src={assets.list_icon} alt="list_icon" />
            <p>Latest Bookings</p>
          </div>
          <div className=" pt-4 border border-gray-100 border-t-0">
            {dashData.latestAppointments.map((item, index) => (
              <div
                key={index}
                className=" flex items-center px-6 py-3 gap-3 hover:bg-gray-100"
              >
                <img
                  src={item.docData.image}
                  alt="Doctor's image"
                  className=" rounded-full w-10"
                />
                <div className=" flex-1 text-sm">
                  <p className=" text-gray-800 font-medium">
                    {item.docData.name}
                  </p>
                  <p className=" text-gray-600">
                    {slotDateFormat(item.slotDate)}
                  </p>
                </div>
                {item.cancelled ? (
                  <p className=" text-red-400 text-xs font-medium">Cancelled</p>
                ) : item.isCompleted ? (
                  <p className=" text-green-500 text-xs font-medium">
                    Completed
                  </p>
                ) : (
                  <img
                    onClick={() => cancelAppointment(item._id)}
                    src={assets.cancel_icon}
                    alt="cancel_icon"
                    className=" w-10 cursor-pointer"
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  );
};

export default Dashboard;
