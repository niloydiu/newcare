import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Appcontext } from "../context/Appcontext";

const Myappointments = () => {
  const { backendUrl, token, doctors, getDoctorsData } = useContext(Appcontext);
  const [appointments, setAppointments] = useState([]);
  
  // Rescheduling Modal states
  const [rescheduleApp, setRescheduleApp] = useState(null);
  const [doctorsSlot, setDoctorsSlot] = useState([]);
  const [slotIndex, setSlotIndex] = useState(0);
  const [slotTime, setSlotTime] = useState("");
  const [loadingSlots, setLoadingSlots] = useState(false);

  // Review Modal states
  const [reviewApp, setReviewApp] = useState(null);
  const [rating, setRating] = useState(5);
  const [reviewText, setReviewText] = useState("");
  const [hoverRating, setHoverRating] = useState(0);

  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
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
      } else {
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

  // Generate Slots for Rescheduling
  const getAvailableSlot = async (docInfo) => {
    if (!docInfo) return;
    setLoadingSlots(true);
    setDoctorsSlot([]);

    let today = new Date();
    let allSlots = [];

    for (let i = 0; i < 7; i++) {
      let currentDate = new Date(today);
      currentDate.setDate(today.getDate() + i);

      let endTime = new Date();
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
        
        const isSlotAvailable =
          docInfo.slots_booked[slotDate] &&
          docInfo.slots_booked[slotDate].includes(slotTime)
            ? false
            : true;

        if (isSlotAvailable) {
          timeSlots.push({
            dateTime: new Date(currentDate),
            time: formattedTime,
          });
        }
        currentDate.setMinutes(currentDate.getMinutes() + 30);
      }
      allSlots.push(timeSlots);
    }

    setDoctorsSlot(allSlots);
    setLoadingSlots(false);
  };

  const handleRescheduleClick = (appt) => {
    const docInfo = doctors.find((doc) => doc._id === appt.docId);
    if (!docInfo) {
      toast.error("Doctor data not found");
      return;
    }
    setRescheduleApp(appt);
    setSlotIndex(0);
    setSlotTime("");
    getAvailableSlot(docInfo);
  };

  const submitReschedule = async () => {
    if (!slotTime) {
      toast.error("Please select a new time slot");
      return;
    }

    try {
      const date = doctorsSlot[slotIndex][0].dateTime;
      let day = date.getDate();
      let month = date.getMonth() + 1;
      let year = date.getFullYear();
      const newSlotDate = day + "_" + month + "_" + year;

      const { data } = await axios.post(
        backendUrl + "/api/user/reschedule-appointment",
        {
          appointmentId: rescheduleApp._id,
          newSlotDate,
          newSlotTime: slotTime,
        },
        { headers: { token } }
      );

      if (data.success) {
        toast.success(data.message);
        setRescheduleApp(null);
        getUserAppointments();
        getDoctorsData();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Rescheduling failed");
    }
  };

  const handleReviewClick = (appt) => {
    setReviewApp(appt);
    setRating(5);
    setReviewText("");
  };

  const submitReview = async () => {
    try {
      const { data } = await axios.post(
        backendUrl + "/api/user/add-review",
        {
          appointmentId: reviewApp._id,
          rating,
          review: reviewText,
        },
        { headers: { token } }
      );

      if (data.success) {
        toast.success("Thank you for your feedback!");
        setReviewApp(null);
        getUserAppointments();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Review submission failed");
    }
  };

  useEffect(() => {
    if (token) {
      getUserAppointments();
    }
  }, [token]);

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold text-zinc-800 pb-4 mb-6 border-b border-zinc-200">
        My Appointments
      </h2>
      
      {appointments.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl shadow-sm border border-zinc-100">
          <p className="text-zinc-400 text-lg">No appointments booked yet.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          {appointments.map((item, index) => {
            const isUpcoming = !item.cancelled && !item.isCompleted;
            return (
              <div
                key={index}
                className="bg-white p-5 rounded-2xl shadow-sm border border-zinc-100 hover:shadow-md transition-all duration-300 flex flex-col md:flex-row md:items-center justify-between gap-5"
              >
                <div className="flex gap-5">
                  <img
                    src={item.docData.image}
                    alt={item.docData.name}
                    className="w-24 h-24 md:w-28 md:h-28 rounded-xl object-cover bg-indigo-50/50 border border-zinc-100 flex-shrink-0"
                  />
                  <div className="flex flex-col justify-center text-sm text-zinc-600">
                    <p className="text-lg font-bold text-zinc-800">
                      {item.docData.name}
                    </p>
                    <p className="text-primary font-medium">{item.docData.speciality}</p>
                    
                    <div className="mt-2 text-zinc-500 text-xs">
                      <span className="font-semibold text-zinc-700">Address:</span>{" "}
                      {item.docData.address.line1}, {item.docData.address.line2}
                    </div>
                    
                    <div className="mt-3 inline-flex items-center gap-2 bg-zinc-50 border border-zinc-100 px-3 py-1.5 rounded-lg text-zinc-700 text-xs w-max">
                      <span className="font-semibold text-zinc-800">Date & Time:</span>
                      <span>{slotDateFromat(item.slotDate)} | {item.slotTime}</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-3.5 md:w-52">
                  {isUpcoming && (
                    <>
                      <button
                        onClick={() => handleRescheduleClick(item)}
                        className="w-full text-center py-2.5 rounded-xl border border-primary text-primary font-medium hover:bg-primary hover:text-white active:scale-98 transition-all cursor-pointer text-sm shadow-sm"
                      >
                        Reschedule
                      </button>
                      <button
                        onClick={() => cancelAppointment(item._id)}
                        className="w-full text-center py-2.5 rounded-xl border border-red-200 text-red-500 font-medium hover:bg-red-500 hover:text-white hover:border-red-500 active:scale-98 transition-all cursor-pointer text-sm"
                      >
                        Cancel Appointment
                      </button>
                    </>
                  )}
                  
                  {item.cancelled && (
                    <div className="w-full text-center py-2.5 bg-red-50/60 border border-red-100 rounded-xl text-red-500 font-semibold text-sm">
                      Cancelled
                    </div>
                  )}

                  {item.isCompleted && (
                    <div className="flex flex-col gap-2">
                      <div className="w-full text-center py-2 bg-green-50/60 border border-green-100 rounded-xl text-green-600 font-semibold text-sm">
                        Completed
                      </div>
                      {!item.isReviewed ? (
                        <button
                          onClick={() => handleReviewClick(item)}
                          className="w-full text-center py-2 bg-primary text-white rounded-xl font-medium hover:bg-opacity-90 active:scale-98 transition-all cursor-pointer text-xs"
                        >
                          Write a Review
                        </button>
                      ) : (
                        <div className="text-center text-xs text-zinc-400 font-medium bg-zinc-50 py-1.5 rounded-lg border border-zinc-100 flex items-center justify-center gap-1">
                          <span>⭐ {item.rating} / 5 Reviewed</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Rescheduling Modal */}
      {rescheduleApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="bg-primary/5 px-6 py-4 flex items-center justify-between border-b border-zinc-100">
              <div>
                <h3 className="font-bold text-lg text-zinc-800">Reschedule Appointment</h3>
                <p className="text-xs text-zinc-500">Select a new date and time slot</p>
              </div>
              <button
                onClick={() => setRescheduleApp(null)}
                className="w-8 h-8 rounded-full hover:bg-zinc-100 flex items-center justify-center text-zinc-400 hover:text-zinc-600 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="p-6">
              {loadingSlots ? (
                <div className="flex flex-col justify-center items-center py-10">
                  <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                  <p className="text-zinc-400 text-sm mt-3">Loading available slots...</p>
                </div>
              ) : (
                <>
                  <p className="text-sm font-semibold text-zinc-700 mb-3">1. Select Date</p>
                  <div className="flex gap-3 overflow-x-auto pb-3 scrollbar-thin">
                    {doctorsSlot.map((item, index) => (
                      <div
                        key={index}
                        onClick={() => {
                          setSlotIndex(index);
                          setSlotTime("");
                        }}
                        className={`flex-shrink-0 flex flex-col items-center justify-center w-16 py-3.5 border rounded-xl cursor-pointer transition-all ${
                          slotIndex === index
                            ? "bg-primary border-primary text-white shadow-md shadow-primary/20 scale-105"
                            : "border-zinc-200 text-zinc-600 hover:border-zinc-400 bg-white"
                        }`}
                      >
                        <p className="text-xs font-semibold uppercase">
                          {item[0] && daysOfWeek[item[0].dateTime.getDay()]}
                        </p>
                        <p className="text-base font-bold mt-1">
                          {item[0] && item[0].dateTime.getDate()}
                        </p>
                      </div>
                    ))}
                  </div>

                  <p className="text-sm font-semibold text-zinc-700 mt-5 mb-3">2. Select Time Slot</p>
                  <div className="grid grid-cols-4 gap-2.5 max-h-48 overflow-y-auto pr-1">
                    {doctorsSlot[slotIndex]?.length > 0 ? (
                      doctorsSlot[slotIndex].map((item, index) => (
                        <div
                          key={index}
                          onClick={() => setSlotTime(item.time)}
                          className={`text-center py-2 border rounded-lg cursor-pointer text-xs font-medium transition-all ${
                            item.time === slotTime
                              ? "bg-primary border-primary text-white shadow-sm"
                              : "border-zinc-200 text-zinc-600 hover:border-zinc-400 bg-white"
                          }`}
                        >
                          {item.time.toLowerCase()}
                        </div>
                      ))
                    ) : (
                      <div className="col-span-4 text-center py-6 text-zinc-400 text-xs">
                        No slots available for this day.
                      </div>
                    )}
                  </div>

                  <div className="flex gap-3 mt-8">
                    <button
                      onClick={() => setRescheduleApp(null)}
                      className="flex-1 py-2.5 border border-zinc-200 text-zinc-600 rounded-xl font-medium hover:bg-zinc-50 active:scale-98 transition cursor-pointer text-sm"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={submitReschedule}
                      className="flex-1 py-2.5 bg-primary text-white rounded-xl font-semibold hover:bg-opacity-95 active:scale-98 transition cursor-pointer text-sm shadow-md shadow-primary/10"
                    >
                      Confirm Reschedule
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Write a Review Modal */}
      {reviewApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="bg-primary/5 px-6 py-4 flex items-center justify-between border-b border-zinc-100">
              <div>
                <h3 className="font-bold text-lg text-zinc-800">Write a Review</h3>
                <p className="text-xs text-zinc-500">Rate your consultation with {reviewApp.docData.name}</p>
              </div>
              <button
                onClick={() => setReviewApp(null)}
                className="w-8 h-8 rounded-full hover:bg-zinc-100 flex items-center justify-center text-zinc-400 hover:text-zinc-600 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="p-6 flex flex-col gap-5">
              <div className="flex flex-col items-center gap-2">
                <p className="text-sm font-semibold text-zinc-700">How was your experience?</p>
                <div className="flex gap-1.5 text-3xl">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      className={`cursor-pointer focus:outline-none transition-transform active:scale-125 ${
                        star <= (hoverRating || rating) ? "text-amber-400" : "text-zinc-200"
                      }`}
                    >
                      ★
                    </button>
                  ))}
                </div>
                <p className="text-xs text-zinc-400 italic">
                  {rating === 1 && "Terrible"}
                  {rating === 2 && "Poor"}
                  {rating === 3 && "Average"}
                  {rating === 4 && "Very Good"}
                  {rating === 5 && "Excellent"}
                </p>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-zinc-700">Write your feedback</label>
                <textarea
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  placeholder="Share details of your experience with this doctor..."
                  rows={4}
                  className="w-full border border-zinc-200 rounded-xl p-3 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none transition resize-none placeholder:text-zinc-400"
                ></textarea>
              </div>

              <div className="flex gap-3 mt-4">
                <button
                  onClick={() => setReviewApp(null)}
                  className="flex-1 py-2.5 border border-zinc-200 text-zinc-600 rounded-xl font-medium hover:bg-zinc-50 active:scale-98 transition cursor-pointer text-sm"
                >
                  Cancel
                </button>
                <button
                  onClick={submitReview}
                  className="flex-1 py-2.5 bg-primary text-white rounded-xl font-semibold hover:bg-opacity-95 active:scale-98 transition cursor-pointer text-sm shadow-md shadow-primary/10"
                >
                  Submit Review
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Myappointments;
