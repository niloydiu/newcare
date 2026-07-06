import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { assets } from "../assets/assets_frontend/assets";
import Relateddoctors from "../components/Relateddoctors";
import { Appcontext } from "../context/Appcontext";

const Appointment = () => {
  const { docId } = useParams();
  const { doctors, currencySymbol, backendUrl, token, getDoctorsData } =
    useContext(Appcontext);
  const [docInfo, setDocInfo] = useState(null);
  const [doctorsSlot, setDoctorsSlot] = useState([]);
  const [slotIndex, setSlotIndex] = useState(0);
  const [slotTime, setSlotTime] = useState("");
  const [reviews, setReviews] = useState([]);
  const [averageRating, setAverageRating] = useState(0);
  const [totalReviews, setTotalReviews] = useState(0);
  const navigate = useNavigate();

  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const fetchDocInfo = async () => {
    const docInfo = doctors.find((doc) => doc._id === docId);
    setDocInfo(docInfo);
  };

  const fetchDocReviews = async () => {
    try {
      const { data } = await axios.get(backendUrl + "/api/doctor/reviews?docId=" + docId);
      if (data.success) {
        setReviews(data.reviews);
        setAverageRating(data.averageRating);
        setTotalReviews(data.totalReviews);
      }
    } catch (error) {
      console.log("Error fetching reviews:", error);
    }
  };
  const getAvailableSlot = async () => {
    setDoctorsSlot([]);

    // Getting Current date
    let today = new Date();
    for (let i = 0; i < 7; i++) {
      // Getting date with index
      let currentDate = new Date(today);
      currentDate.setDate(today.getDate() + i);

      // Settings and time of the date with index
      let endTime = new Date();
      endTime.setDate(today.getDate() + i);
      endTime.setHours(21, 0, 0, 0);

      // Setting hours for the date with index
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
          // Add slot to array
          timeSlots.push({
            dateTime: new Date(currentDate),
            time: formattedTime,
          });
        }

        // Increment current time by 30 minutes
        currentDate.setMinutes(currentDate.getMinutes() + 30);
      }
      setDoctorsSlot((prev) => [...prev, timeSlots]);
    }
  };

  const bookAppointment = async () => {
    if (!token) {
      toast.warn("Please login to book an appointment");
      return navigate("/login");
    }
    if (!slotTime) {
      toast.error("Please select a time slot first");
      return;
    }

    if (!docInfo.available) {
      toast.error("This doctor is currently not available for appointments");
      return;
    }

    try {
      // const date = doctorsSlot[slotIndex][0].dateTime;
      // let day = date.getDate();
      // let month = date.getMonth() + 1;
      // let year = date.getFullYear();

      // const slotDate = day + "_" + month + "_" + year;
      // const { data } = await axios.post(
      //   backendUrl + "/api/user/book-appointment",
      //   { docId, slotDate, slotTime },
      //   { headers: { token } }
      // );

      // Find the actual selected time slot object based on slotTime
      const selectedSlot = doctorsSlot[slotIndex].find(
        (slot) => slot.time === slotTime
      );
      if (!selectedSlot) {
        toast.error("Invalid time slot selected");
        return;
      }

      const date = selectedSlot.dateTime;
      let day = date.getDate();
      let month = date.getMonth() + 1;
      let year = date.getFullYear();

      const slotDate = day + "_" + month + "_" + year;

      console.log("Sending appointment data:", { docId, slotDate, slotTime });

      const { data } = await axios.post(
        backendUrl + "/api/user/book-appointment",
        { docId, slotDate, slotTime },
        { headers: { token } }
      );

      if (data.success) {
        toast.success(data.message);
        getDoctorsData();
        navigate("/my-appointments");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(
        error.response?.data?.message || "Failed to book appointment"
      );
    }
  };

  useEffect(() => {
    fetchDocInfo();
    fetchDocReviews();
  }, [doctors, docId]);

  useEffect(() => {
    getAvailableSlot();
  }, [docInfo]);

  useEffect(() => {
    console.log(doctorsSlot);
  }, [doctorsSlot]);

  return (
    docInfo && (
      <div>
        {/* Doctor Details  */}
        <div className=" flex flex-col sm:flex-row gap-4">
          <div>
            <img
              src={docInfo.image}
              alt="Doctor's Image"
              className=" bg-primary w-full sm:max-w-72 rounded-lg"
            />
          </div>
          <div className=" flex-1 border border-gray-400 rounded-lg p-8 py-7 bg-white mx-2 sm:mx-0 mt-[-80px] sm:mt-0">
            {/* Doc Info  */}
            <p className=" flex items-center gap-2 text-2xl font-medium text-gray-900">
              {docInfo.name}{" "}
              <img
                src={assets.verified_icon}
                alt="verified_icon"
                className=" w-5"
              />
            </p>
            {totalReviews > 0 && (
              <div className="flex items-center gap-1 text-sm mt-0.5">
                <span className="text-amber-400 font-semibold">★ {averageRating}</span>
                <span className="text-zinc-400 text-xs">({totalReviews} {totalReviews === 1 ? 'review' : 'reviews'})</span>
              </div>
            )}
            <div className=" flex items-center gap-2 text-sm mt-1 text-gray-600">
              <p>
                {docInfo.degree} - {docInfo.speciality}{" "}
              </p>
              <button className=" py-0.5 px-2 border text-xs rounded-full">
                {docInfo.experience}
              </button>
            </div>

            {/* Doc About  */}
            <div>
              <p className=" flex items-center gap-1 text-sm font-medium text-gray-900 mt-3">
                About <img src={assets.info_icon} alt="info_icon" />
              </p>
              <p className=" text-sm text-gray-500 max-w-[700px] mt-1">
                {docInfo.about}
              </p>
            </div>
            <p className=" text-gray-500 font-medium mt-4">
              Appointment fee:{" "}
              <span className=" text-gray-600">
                {docInfo.fees}
                {currencySymbol}
              </span>
            </p>
          </div>
        </div>
        {/* Booking Slot  */}
        <div className="sm:ml-72 sm:pl-4 mt-4 font-medium text-gray-700">
          <p>Booking Slots</p>
          <div className=" flex gap-3 items-center w-full overflow-x-scroll mt-4">
            {doctorsSlot.length &&
              doctorsSlot.map((item, index) => (
                <div
                  onClick={() => setSlotIndex(index)}
                  key={index}
                  className={` text-center py-6 min-w-16 rounded-full cursor-pointer ${
                    slotIndex === index
                      ? "bg-primary text-white"
                      : "border border-gray-200"
                  }`}
                >
                  <p>{item[0] && daysOfWeek[item[0].dateTime.getDay()]}</p>
                  <p>{item[0] && item[0].dateTime.getDate()}</p>
                </div>
              ))}
          </div>
          <div className=" flex items-center gap-3 w-full overflow-x-scroll mt-4">
            {doctorsSlot.length &&
              doctorsSlot[slotIndex].map((item, index) => (
                <p
                  onClick={() => setSlotTime(item.time)}
                  className={` text-sm font-light shrink-0 px-5 py-2 rounded-full cursor-pointer ${
                    item.time === slotTime
                      ? "bg-primary text-white"
                      : " text-gray-400 border border-gray-300"
                  }`}
                  key={index}
                >
                  {item.time.toLowerCase()}
                </p>
              ))}
          </div>
          <button
            className=" bg-primary text-white text-sm font-light px-14 py-3 rounded-full my-6"
            onClick={bookAppointment}
          >
            Book an appointment
          </button>
        </div>
        {/* Reviews Section */}
        <div className="mt-12 bg-white rounded-2xl p-6 md:p-8 border border-zinc-100 shadow-sm max-w-4xl">
          <h3 className="text-xl font-bold text-zinc-800 mb-6 flex items-center gap-2">
            Reviews & Feedback
            {totalReviews > 0 && (
              <span className="text-sm font-medium bg-amber-50/60 text-amber-600 px-2.5 py-0.5 rounded-full border border-amber-100 flex items-center gap-1">
                ★ {averageRating} ({totalReviews} {totalReviews === 1 ? 'review' : 'reviews'})
              </span>
            )}
          </h3>

          {reviews.length === 0 ? (
            <p className="text-zinc-400 text-sm italic">No reviews yet for this doctor.</p>
          ) : (
            <div className="flex flex-col gap-6 max-h-[500px] overflow-y-auto pr-2">
              {reviews.map((rev, idx) => (
                <div key={idx} className="border-b border-zinc-100 pb-5 last:border-b-0 last:pb-0">
                  <div className="flex items-center gap-3 mb-2">
                    <img
                      src={rev.userImage || "https://cdn-icons-png.flaticon.com/512/149/149071.png"} 
                      alt={rev.userName}
                      className="w-10 h-10 rounded-full object-cover border border-zinc-100 bg-zinc-50"
                    />
                    <div>
                      <p className="text-sm font-bold text-zinc-800">{rev.userName}</p>
                      <div className="flex items-center gap-1 text-xs">
                        <span className="text-amber-400 font-semibold">{"★".repeat(rev.rating)}{"☆".repeat(5 - rev.rating)}</span>
                        <span className="text-zinc-300">|</span>
                        <span className="text-zinc-400">{new Date(rev.date).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}</span>
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-zinc-600 pl-13 leading-relaxed font-normal">{rev.review}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Listing Related Doctors  */}
        <Relateddoctors docId={docId} speciality={docInfo.speciality} />
      </div>
    )
  );
};

export default Appointment;
