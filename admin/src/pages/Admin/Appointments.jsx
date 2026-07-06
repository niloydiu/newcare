import { useContext, useEffect, useState } from "react";
import { assets } from "../../assets/assets_admin/assets";
import { AdminContext } from "../../context/AdminContext";
import { AppContext } from "../../context/AppContext";

const Appointments = () => {
  const {
    aToken,
    getAllAppointments,
    appointments,
    cancelAppointment,
    deleteAppointment,
    rescheduleAppointmentAdmin,
    doctors,
    getAllDoctors,
  } = useContext(AdminContext);

  const { calculateAge, slotDateFormat, currency } = useContext(AppContext);

  // States for Rescheduling
  const [rescheduleItem, setRescheduleItem] = useState(null);
  const [docSlots, setDocSlots] = useState([]);
  const [selectedSlotIndex, setSelectedSlotIndex] = useState(0);
  const [selectedSlotTime, setSelectedSlotTime] = useState("");
  const daysOfWeek = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

  useEffect(() => {
    if (aToken) {
      getAllAppointments();
      getAllDoctors();
    }
  }, [aToken]);

  // Generate slots for the selected doctor
  const getAvailableSlots = (docInfo) => {
    if (!docInfo) return;
    const slots = [];
    const today = new Date();

    for (let i = 0; i < 7; i++) {
      let currentDate = new Date(today);
      currentDate.setDate(today.getDate() + i);

      let endTime = new Date(today);
      endTime.setDate(today.getDate() + i);
      endTime.setHours(21, 0, 0, 0);

      if (today.getDate() === currentDate.getDate()) {
        currentDate.setHours(
          currentDate.getHours() > 10 ? currentDate.getHours() + 1 : 10
        );
        currentDate.setMinutes(currentDate.getMinutes() > 30 ? 30 : 0);
      } else {
        currentDate.setHours(10);
        currentDate.setMinutes(0);
      }

      let timeSlots = [];
      while (currentDate < endTime) {
        let formattedTime = currentDate.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        });

        let day = currentDate.getDate();
        let month = currentDate.getMonth() + 1;
        let year = currentDate.getFullYear();
        const slotDate = day + "_" + month + "_" + year;
        const slotTime = formattedTime;

        const isBooked =
          docInfo.slots_booked &&
          docInfo.slots_booked[slotDate] &&
          docInfo.slots_booked[slotDate].includes(slotTime);

        if (!isBooked) {
          timeSlots.push({
            dateTime: new Date(currentDate),
            time: formattedTime,
            dateKey: slotDate,
          });
        }
        currentDate.setMinutes(currentDate.getMinutes() + 30);
      }
      slots.push(timeSlots);
    }
    setDocSlots(slots);
    setSelectedSlotIndex(0);
    setSelectedSlotTime("");
  };

  const handleOpenReschedule = (item) => {
    setRescheduleItem(item);
    const doctorDetails = doctors.find((d) => d._id === item.docId);
    if (doctorDetails) {
      getAvailableSlots(doctorDetails);
    } else {
      // Fallback if doctor is not loaded, use dummy slots or fetch
      getAvailableSlots(item.docData);
    }
  };

  const handleCloseReschedule = () => {
    setRescheduleItem(null);
    setDocSlots([]);
  };

  const handleConfirmReschedule = async () => {
    if (!selectedSlotTime) return;
    const dateObj = docSlots[selectedSlotIndex][0]?.dateTime;
    if (!dateObj) return;

    const day = dateObj.getDate();
    const month = dateObj.getMonth() + 1;
    const year = dateObj.getFullYear();
    const dateKey = `${day}_${month}_${year}`;

    const success = await rescheduleAppointmentAdmin(
      rescheduleItem._id,
      dateKey,
      selectedSlotTime
    );
    if (success) {
      handleCloseReschedule();
    }
  };

  const handleDelete = (appointmentId, patientName) => {
    if (
      window.confirm(
        `Are you sure you want to permanently delete the appointment for patient "${patientName}"?`
      )
    ) {
      deleteAppointment(appointmentId);
    }
  };

  return (
    <div className="m-6 w-full max-w-6xl animate-fade-in relative">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-zinc-800">All Appointments</h2>
        <p className="text-zinc-500 text-sm mt-1">
          Monitor and manage clinic appointments, reschedule sessions, and purge logs
        </p>
      </div>

      <div className="bg-white border border-zinc-100 rounded-2xl shadow-sm overflow-hidden">
        {/* Table Header */}
        <div className="hidden md:grid grid-cols-[0.5fr_2fr_1fr_2.5fr_2.5fr_1fr_2fr] py-4 px-6 border-b border-zinc-100 bg-zinc-50 text-zinc-500 text-xs font-bold uppercase tracking-wider">
          <p>#</p>
          <p>Patient</p>
          <p>Age</p>
          <p>Date & Time</p>
          <p>Doctor</p>
          <p>Fees</p>
          <p className="text-right">Actions</p>
        </div>

        {/* Table Rows */}
        <div className="divide-y divide-zinc-50">
          {appointments && appointments.length === 0 ? (
            <div className="p-6 text-center text-zinc-400 text-sm">
              No appointments found.
            </div>
          ) : (
            appointments.map((item, index) => (
              <div
                key={index}
                className="flex flex-col md:grid md:grid-cols-[0.5fr_2fr_1fr_2.5fr_2.5fr_1fr_2fr] items-start md:items-center py-4 px-6 text-sm text-zinc-650 hover:bg-zinc-50/40 transition-colors gap-3 md:gap-0"
              >
                {/* Index */}
                <p className="hidden md:block font-bold text-zinc-400">
                  {index + 1}
                </p>

                {/* Patient Profile */}
                <div className="flex items-center gap-3">
                  <img
                    src={
                      item.userData.image ||
                      "https://cdn-icons-png.flaticon.com/512/149/149071.png"
                    }
                    alt="Patient"
                    className="w-9 h-9 rounded-full object-cover border border-zinc-100 bg-zinc-50"
                  />
                  <div>
                    <span className="font-bold text-zinc-800 block md:inline">
                      {item.userData.name}
                    </span>
                    <span className="md:hidden block text-xs text-zinc-400 mt-0.5">
                      Age: {calculateAge(item.userData.dob)}
                    </span>
                  </div>
                </div>

                {/* Age */}
                <p className="hidden md:block text-zinc-600 font-semibold">
                  {calculateAge(item.userData.dob)}
                </p>

                {/* Date & Time */}
                <div className="text-zinc-600 font-semibold">
                  <p>{slotDateFormat(item.slotDate)}</p>
                  <p className="text-xs text-zinc-400 font-medium mt-0.5">
                    Slot: {item.slotTime}
                  </p>
                </div>

                {/* Doctor Profile */}
                <div className="flex items-center gap-3">
                  <img
                    src={item.docData.image}
                    alt="Doctor"
                    className="w-9 h-9 rounded-full object-cover border border-zinc-100 bg-indigo-50"
                  />
                  <div>
                    <span className="font-bold text-zinc-800 block">
                      {item.docData.name}
                    </span>
                    <span className="text-[10px] text-zinc-400 block mt-0.5">
                      {item.docData.speciality}
                    </span>
                  </div>
                </div>

                {/* Fees */}
                <p className="font-bold text-zinc-800">
                  {currency}
                  {item.amount}
                </p>

                {/* Actions */}
                <div className="flex items-center justify-between md:justify-end gap-3 w-full md:w-auto">
                  <div className="md:hidden text-xs text-zinc-400 font-bold uppercase">Actions</div>
                  
                  <div className="flex items-center gap-2">
                    {item.cancelled ? (
                      <span className="px-3 py-1 bg-red-50 text-red-500 text-xs font-semibold rounded-full border border-red-100">
                        Cancelled
                      </span>
                    ) : item.isCompleted ? (
                      <span className="px-3 py-1 bg-green-50 text-green-600 text-xs font-semibold rounded-full border border-green-100">
                        Completed
                      </span>
                    ) : (
                      <>
                        {/* Reschedule Button */}
                        <button
                          onClick={() => handleOpenReschedule(item)}
                          className="px-3 py-1.5 rounded-lg border border-primary/20 text-primary font-bold text-xs bg-primary/5 hover:bg-primary/10 transition-colors cursor-pointer"
                        >
                          Reschedule
                        </button>

                        {/* Cancel Button */}
                        <button
                          onClick={() => cancelAppointment(item._id)}
                          className="p-1.5 rounded-lg border border-zinc-150 hover:border-red-200 hover:bg-red-50 text-zinc-500 hover:text-red-500 transition-colors cursor-pointer"
                          title="Cancel Booking"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4.5 w-4.5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                        </button>
                      </>
                    )}

                    {/* Delete record button */}
                    <button
                      onClick={() => handleDelete(item._id, item.userData.name)}
                      className="p-1.5 rounded-lg border border-zinc-150 hover:border-zinc-300 hover:bg-zinc-100 text-zinc-400 hover:text-zinc-600 transition-colors cursor-pointer"
                      title="Delete Record"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4.5 w-4.5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Reschedule Calendar Modal overlay */}
      {rescheduleItem && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-3xl w-full max-w-md shadow-xl overflow-hidden animate-slide-up">
            <div className="px-6 py-4 border-b border-zinc-100 flex items-center justify-between">
              <h3 className="text-lg font-bold text-zinc-800">Reschedule Appointment</h3>
              <button
                onClick={handleCloseReschedule}
                className="p-1.5 hover:bg-zinc-100 rounded-full transition-colors cursor-pointer"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-zinc-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <div className="p-6">
              <p className="text-sm text-zinc-500 mb-4">
                Select a new slot for <strong>{rescheduleItem.userData.name}</strong> with{" "}
                <strong>{rescheduleItem.docData.name}</strong>.
              </p>

              {/* Date slots row */}
              <div className="flex gap-3 overflow-x-auto pb-4 custom-scrollbar">
                {docSlots.length > 0 &&
                  docSlots.map((item, index) => {
                    const dateObj = item[0]?.dateTime;
                    if (!dateObj) return null;
                    return (
                      <div
                        key={index}
                        onClick={() => {
                          setSelectedSlotIndex(index);
                          setSelectedSlotTime("");
                        }}
                        className={`flex flex-col items-center justify-center py-3 px-4 rounded-2xl cursor-pointer border min-w-[70px] transition-all ${
                          selectedSlotIndex === index
                            ? "bg-primary border-primary text-white shadow-md shadow-primary/20"
                            : "bg-white border-zinc-200 text-zinc-650 hover:bg-zinc-50"
                        }`}
                      >
                        <span className="text-[10px] font-bold tracking-wider">
                          {daysOfWeek[dateObj.getDay()]}
                        </span>
                        <span className="text-lg font-bold mt-1">
                          {dateObj.getDate()}
                        </span>
                      </div>
                    );
                  })}
              </div>

              {/* Time slots grid */}
              <span className="block text-xs font-bold text-zinc-400 uppercase mt-4 mb-2">
                Available Times
              </span>
              <div className="grid grid-cols-4 gap-2.5 max-h-[180px] overflow-y-auto pr-1 custom-scrollbar">
                {docSlots.length > 0 && docSlots[selectedSlotIndex].length === 0 ? (
                  <div className="col-span-4 text-center py-6 text-zinc-400 text-xs">
                    No slots available for this day.
                  </div>
                ) : (
                  docSlots.length > 0 &&
                  docSlots[selectedSlotIndex].map((slot, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedSlotTime(slot.time)}
                      className={`py-2 text-xs font-bold rounded-xl border transition-all cursor-pointer ${
                        selectedSlotTime === slot.time
                          ? "bg-primary border-primary text-white shadow-xs"
                          : "bg-white border-zinc-200 text-zinc-650 hover:bg-zinc-50"
                      }`}
                    >
                      {slot.time}
                    </button>
                  ))
                )}
              </div>

              {/* Action buttons */}
              <div className="mt-6 pt-5 border-t border-zinc-100 flex items-center justify-end gap-3">
                <button
                  onClick={handleCloseReschedule}
                  className="px-5 py-2.5 rounded-xl border border-zinc-200 text-zinc-600 font-bold text-sm hover:bg-zinc-50 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmReschedule}
                  disabled={!selectedSlotTime}
                  className={`px-5 py-2.5 rounded-xl font-bold text-sm shadow-md transition cursor-pointer ${
                    selectedSlotTime
                      ? "bg-primary text-white hover:opacity-95 shadow-primary/10"
                      : "bg-zinc-100 text-zinc-400 border border-zinc-200 cursor-not-allowed shadow-none"
                  }`}
                >
                  Confirm Slot
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Appointments;
