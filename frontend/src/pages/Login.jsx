import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Appcontext } from "../context/Appcontext";

const Login = () => {
  const { backendUrl, token, setToken } = useContext(Appcontext);
  const [state, setState] = useState("Sign Up");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const navigate = useNavigate();
  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      if (state === "Sign Up") {
        const { data } = await axios.post(backendUrl + "/api/user/register", {
          name,
          email,
          password,
        });
        if (data.success) {
          localStorage.setItem("token", data.token);
          setToken(data.token);
        } else {
          console.log(data.message);
          toast.error(data.message);
        }
      } else {
        const { data } = await axios.post(backendUrl + "/api/user/login", {
          email,
          password,
        });
        if (data.success) {
          localStorage.setItem("token", data.token);
          setToken(data.token);
        } else {
          toast.error(data.message);
        }
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };
  useEffect(() => {
    if (token) {
      navigate("/");
    }
  }, [token]);

  return (
    <form
      className=" min-h-[80vh] flex items-center"
      onSubmit={onSubmitHandler}
    >
      <div className=" flex flex-col gap-3 m-auto items-start p-8 min-w-[340px] sm:min-w-96 border border-zinc-100 rounded-xl text-zinc-600 text-sm shadow-lg">
        <p className=" text-2xl font-semibold">
          {state === "Sign Up" ? "Create Account" : "Login"}
        </p>
        <p>
          Please {state === "Sign Up" ? "Create Account" : "Login"} to book
          appointment
        </p>
        {state === "Sign Up" && (
          <div className=" w-full">
            <p>Full Name</p>
            <input
              className=" border border-zinc-300 rounded w-full p-2 mt-1"
              required
              type="text"
              placeholder=""
              onChange={(e) => setName(e.target.value)}
              value={name}
            />
          </div>
        )}

        <div className=" w-full">
          <p>Email</p>
          <input
            className=" border border-zinc-300 rounded w-full p-2 mt-1"
            required
            type="text"
            placeholder=""
            onChange={(e) => setEmail(e.target.value)}
            value={email}
          />
        </div>
        <div className=" w-full">
          <p>Password</p>
          <input
            className=" border border-zinc-300 rounded w-full p-2 mt-1"
            required
            type="text"
            placeholder=""
            onChange={(e) => setPassword(e.target.value)}
            value={password}
          />
        </div>
        <button
          type="submit"
          className=" bg-primary text-white w-full py-2 rounded-md text-base"
        >
          {state === "Sign Up" ? "Create Account" : "Login"}
        </button>
        {state === "Sign Up" ? (
          <p>
            Already have an account?{" "}
            <span
              onClick={() => setState("Login")}
              className=" text-primary underline cursor-pointer"
            >
              Login here
            </span>
          </p>
        ) : (
          <p>
            Create a new account?{" "}
            <span
              onClick={() => setState("Sign Up")}
              className=" text-primary underline cursor-pointer"
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
