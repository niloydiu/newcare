import axios from "axios";
import React, { useContext, useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AdminContext } from "../context/AdminContext";
import { DoctorContext } from "../context/DoctorContext";

const Login = () => {
  const [state, setState] = useState("Admin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { setAToken, backendUrl } = useContext(AdminContext);
  const { setDToken, dToken } = useContext(DoctorContext);
  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      if (state === "Admin") {
        const { data } = await axios.post(backendUrl + "/api/admin/login", {
          email,
          password,
        });
        if (data.success) {
          localStorage.setItem("aToken", data.token);
          setAToken(data.token);
        } else {
          toast.error(data.message || "Login failed");
        }
      } else {
        // Doctor login logic here
        const { data } = await axios.post(backendUrl + "/api/doctor/login", {
          email,
          password,
        });
        if (data.success) {
          localStorage.setItem("dToken", data.token);
          setDToken(data.token);
        } else {
          toast.error(data.message || "Login failed");
        }
      }
    } catch (error) {
      console.log(error);
      // Add this code to show toast notifications for errors
      if (error.response) {
        // Server responded with an error status (400, 401, 404, 500, etc.)
        toast.error(error.response.data.message || "Login failed");
      } else if (error.request) {
        // Request was made but no response received
        toast.error("No response from server. Please try again.");
      } else {
        // Something else caused the error
        toast.error("An error occurred. Please try again.");
      }
    }
  };
  return (
    <form
      className=" min-h-[80vh] flex items-center"
      onSubmit={onSubmitHandler}
    >
      <div className=" flex flex-col gap-3 m-auto items-start p-8 min-w-[340px] sm:min-w-96 rounded-xl text-[#5e5e5e] text-sm shadow-lg border border-gray-100">
        <p className=" text-2xl font-semibold m-auto">
          <span className=" text-primary">{state}</span> Login
        </p>
        <div className=" w-full">
          <p>Email</p>
          <input
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            type="email"
            required
            className=" border border-[#DADADA] rounded w-full p-2 mt-1"
          />
        </div>
        <div className=" w-full">
          <p>Password</p>
          <input
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            type="password"
            required
            className=" border border-[#DADADA] rounded w-full p-2 mt-1"
          />
        </div>
        <button className=" bg-primary text-white w-full py-2 rounded-md text-base">
          Login
        </button>
        {state === "Admin" ? (
          <p>
            Doctor Login?
            <span
              className=" text-primary underline cursor-pointer ml-1"
              onClick={() => setState("Doctor")}
            >
              Click here
            </span>
          </p>
        ) : (
          <p>
            Admin Login?
            <span
              className=" text-primary underline cursor-pointer ml-1"
              onClick={() => setState("Admin")}
            >
              Click here
            </span>
          </p>
        )}
      </div>
    </form>
  );
};

export default Login;
