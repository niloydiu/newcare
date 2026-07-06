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
      <div className="m-6 animate-fade-in">
        {/* Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {/* Doctors Card */}
          <div className="flex items-center gap-4 bg-white p-6 rounded-2xl border border-zinc-100 hover:shadow-lg transition-all duration-300 group">
            <div className="w-16 h-16 rounded-xl bg-indigo-50 flex items-center justify-center group-hover:bg-primary/10 transition-colors">
              <img src={assets.doctor_icon} alt="doctor_icon" className="w-10" />
            </div>
            <div>
              <p className="text-2xl font-bold text-zinc-800">{dashData.doctors}</p>
              <p className="text-zinc-500 text-sm font-semibold">Total Doctors</p>
            </div>
          </div>

          {/* Appointments Card */}
          <div className="flex items-center gap-4 bg-white p-6 rounded-2xl border border-zinc-100 hover:shadow-lg transition-all duration-300 group">
            <div className="w-16 h-16 rounded-xl bg-blue-50 flex items-center justify-center group-hover:bg-blue-100 transition-colors">
              <img src={assets.appointments_icon} alt="appointment_icon" className="w-10" />
            </div>
            <div>
              <p className="text-2xl font-bold text-zinc-800">{dashData.appointments}</p>
              <p className="text-zinc-500 text-sm font-semibold">Total Appointments</p>
            </div>
          </div>

          {/* Patients Card */}
          <div className="flex items-center gap-4 bg-white p-6 rounded-2xl border border-zinc-100 hover:shadow-lg transition-all duration-300 group">
            <div className="w-16 h-16 rounded-xl bg-teal-50 flex items-center justify-center group-hover:bg-teal-100 transition-colors">
              <img src={assets.patients_icon} alt="patients_icon" className="w-10" />
            </div>
            <div>
              <p className="text-2xl font-bold text-zinc-800">{dashData.patients}</p>
              <p className="text-zinc-500 text-sm font-semibold">Total Patients</p>
            </div>
          </div>
        </div>

        {/* Latest Bookings Table */}
        <div className="bg-white rounded-2xl border border-zinc-100 shadow-sm mt-8 overflow-hidden">
          <div className="flex items-center gap-2.5 px-6 py-5 border-b border-zinc-100">
            <img src={assets.list_icon} alt="list_icon" className="w-5 h-5" />
            <h3 className="font-bold text-zinc-800 text-lg">Latest Bookings</h3>
          </div>
          
          <div className="divide-y divide-zinc-50">
            {dashData.latestAppointments.length === 0 ? (
              <div className="p-6 text-center text-zinc-400 text-sm">No recent bookings.</div>
            ) : (
              dashData.latestAppointments.map((item, index) => (
                <div
                  key={index}
                  className="flex flex-col sm:flex-row sm:items-center justify-between px-6 py-4 gap-4 hover:bg-zinc-50/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={item.docData.image}
                      alt="Doctor"
                      className="rounded-full w-10 h-10 object-cover border border-zinc-100 bg-indigo-50"
                    />
                    <div>
                      <p className="text-zinc-850 font-bold text-sm">{item.docData.name}</p>
                      <p className="text-zinc-400 text-xs mt-0.5">{slotDateFormat(item.slotDate)}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-6 text-sm">
                    <span className="text-zinc-500 font-medium">Slot: {item.slotTime}</span>
                    
                    <div>
                      {item.cancelled ? (
                        <span className="px-3 py-1 bg-red-50 text-red-500 text-xs font-semibold rounded-full border border-red-100">
                          Cancelled
                        </span>
                      ) : item.isCompleted ? (
                        <span className="px-3 py-1 bg-green-50 text-green-600 text-xs font-semibold rounded-full border border-green-100">
                          Completed
                        </span>
                      ) : (
                        <button
                          onClick={() => cancelAppointment(item._id)}
                          className="flex items-center justify-center p-1.5 rounded-full hover:bg-red-50 border border-zinc-100 hover:border-red-200 transition-colors cursor-pointer group"
                          title="Cancel Booking"
                        >
                          <img
                            src={assets.cancel_icon}
                            alt="Cancel"
                            className="w-5 h-5 group-hover:scale-105 transition-transform"
                          />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    )
  );
};

export default Dashboard;
