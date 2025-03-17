import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AppContext } from "../../context/AppContext";
import { DoctorContext } from "../../context/DoctorContext";

const DoctorProfile = () => {
  const { dToken, getProfileData, profileData, setProfileData, backendUrl } =
    useContext(DoctorContext);
  const { currency } = useContext(AppContext);
  const [isEdit, setIsEdit] = useState(false);

  const updateProfile = async () => {
    try {
      const updateData = {
        address: profileData.address,
        fees: profileData.fees,
        available: profileData.available,
      };
      const { data } = await axios.post(
        backendUrl + "/api/doctor/update-profile",
        updateData,
        {
          headers: { dToken },
        }
      );
      if (data.success) {
        toast.success(data.message);
        getProfileData();
        setIsEdit(false);
      } else {
        console.log(data.message);
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong!");
    }
  };
  useEffect(() => {
    if (dToken) {
      getProfileData();
    }
  }, [dToken]);

  return (
    profileData && (
      <div>
        <div className=" flex flex-col gap-4 m-5">
          <div>
            <img
              src={profileData.image}
              alt=""
              className=" bg-primary/80 w-full sm:max-w-64 rounded-lg"
            />
          </div>
          <div className=" flex-1 border border-stone-100 rounded-lg p-8 py-7">
            {/* Doc infor: name, degree, experience  */}
            <p className=" flex items-center gap-2 text-3xl font-medium text-gray-700">
              {profileData.name}
            </p>
            <div className=" flex items-center gap-2 mt-1 text-gray-600">
              <p>
                {profileData.degree} - {profileData.speciality}
              </p>
              <button className=" py-0.5 px-2 border border-gray-300 text-xs rounded-full">
                {profileData.experience > 1
                  ? `${profileData.experience} years`
                  : `${profileData.experience} year`}
              </button>
            </div>

            {/* Doc About Information  */}
            <div>
              <p className=" flex items-center gap-1 text-sm font-medium text-neutral-800 mt-3">
                About:{" "}
              </p>
              <p className=" text-sm text-gray-600 max-w-[700px] mt-1">
                {profileData.about}
              </p>
            </div>

            <p className=" text-gray-600 font-medium mt-4 ">
              Appointment fee:{" "}
              <span className=" text-gray-800 ">
                {currency}
                {isEdit ? (
                  <input
                    type="number"
                    placeholder={profileData.fees}
                    value={profileData.fees}
                    name=""
                    onChange={(e) => {
                      setProfileData((prev) => ({
                        ...prev,
                        fees: e.target.value,
                      }));
                    }}
                    id=""
                  />
                ) : (
                  profileData.fees
                )}
              </span>
            </p>
            <div className=" flex gap-2 py-2">
              <p>Address: </p>
              <p className=" text-sm">
                {isEdit ? (
                  <input
                    placeholder={profileData.address.line1}
                    value={profileData.address.line1}
                    type="text"
                    onChange={(e) =>
                      setProfileData((prev) => ({
                        ...prev,
                        address: { ...prev, line1: e.target.value },
                      }))
                    }
                  />
                ) : (
                  profileData.address.line1
                )}
                <br />
                {isEdit ? (
                  <input
                    placeholder={profileData.address.line2}
                    value={profileData.address.line2}
                    type="text"
                    onChange={(e) =>
                      setProfileData((prev) => ({
                        ...prev,
                        address: { ...prev, line2: e.target.value },
                      }))
                    }
                  />
                ) : (
                  profileData.address.line2
                )}
              </p>
            </div>
            <div className=" flex gap-1 pt-2">
              <input
                checked={profileData.available}
                type="checkbox"
                onChange={() =>
                  isEdit &&
                  setProfileData((prev) => ({
                    ...prev,
                    available: !prev.available,
                  }))
                }
              />{" "}
              <label htmlFor="">Available</label>
            </div>
            {isEdit ? (
              <button
                onClick={updateProfile}
                className=" px-4 py-1 border border-primary text-sm rounded-full mt-5 hover:bg-primary hover:text-white transition-all duration-200"
              >
                Save
              </button>
            ) : (
              <button
                onClick={() => setIsEdit(true)}
                className=" px-4 py-1 border border-primary text-sm rounded-full mt-5 hover:bg-primary hover:text-white transition-all duration-200"
              >
                Edit
              </button>
            )}
          </div>
        </div>
      </div>
    )
  );
};

export default DoctorProfile;
