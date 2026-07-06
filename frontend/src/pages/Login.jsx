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
          toast.success("Account created successfully!");
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
          toast.success("Logged in successfully!");
        } else {
          toast.error(data.message);
        }
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || error.message);
    }
  };

  const handleGoogleCallback = async (response) => {
    try {
      const { credential } = response;
      const { data } = await axios.post(backendUrl + "/api/user/google-auth", { credential });
      if (data.success) {
        localStorage.setItem("token", data.token);
        setToken(data.token);
        toast.success("Authenticated with Google successfully!");
        navigate("/");
      } else {
        toast.error(data.message || "Google Authentication failed");
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Google Authentication failed");
    }
  };

  useEffect(() => {
    if (token) {
      navigate("/");
    }
  }, [token]);

  useEffect(() => {
    /* global google */
    if (window.google) {
      try {
        window.google.accounts.id.initialize({
          client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID || "1016834168051-5o9g4m297lh1f1e944m44qgflb8.apps.googleusercontent.com",
          callback: handleGoogleCallback,
        });
        window.google.accounts.id.renderButton(
          document.getElementById("googleSignInButton"),
          { theme: "outline", size: "large", width: "100%", text: state === "Sign Up" ? "signup_with" : "signin_with" }
        );
      } catch (err) {
        console.error("Error rendering Google Sign-In button:", err);
      }
    }
  }, [state]);

  return (
    <form
      className=" min-h-[80vh] flex items-center"
      onSubmit={onSubmitHandler}
    >
      <div className=" flex flex-col gap-3 m-auto items-start p-8 min-w-[340px] sm:min-w-96 border border-zinc-100 rounded-xl text-zinc-600 text-sm shadow-lg bg-white">
        <p className=" text-2xl font-semibold text-zinc-800">
          {state === "Sign Up" ? "Create Account" : "Login"}
        </p>
        <p className="text-zinc-500">
          Please {state === "Sign Up" ? "Create Account" : "Login"} to book
          appointment
        </p>
        {state === "Sign Up" && (
          <div className=" w-full">
            <p className="font-medium text-zinc-700">Full Name</p>
            <input
              className=" border border-zinc-300 rounded w-full p-2 mt-1 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition"
              required
              type="text"
              placeholder=""
              onChange={(e) => setName(e.target.value)}
              value={name}
            />
          </div>
        )}

        <div className=" w-full">
          <p className="font-medium text-zinc-700">Email</p>
          <input
            className=" border border-zinc-300 rounded w-full p-2 mt-1 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition"
            required
            type="email"
            placeholder=""
            onChange={(e) => setEmail(e.target.value)}
            value={email}
          />
        </div>
        <div className=" w-full">
          <p className="font-medium text-zinc-700">Password</p>
          <input
            className=" border border-zinc-300 rounded w-full p-2 mt-1 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition"
            required
            type="password"
            placeholder=""
            onChange={(e) => setPassword(e.target.value)}
            value={password}
          />
        </div>
        <button
          type="submit"
          className=" bg-primary text-white w-full py-2.5 rounded-md text-base font-semibold hover:bg-opacity-90 active:scale-95 transition-all cursor-pointer shadow-md mt-2"
        >
          {state === "Sign Up" ? "Create Account" : "Login"}
        </button>

        <div className="flex items-center my-1 w-full gap-2">
          <div className="flex-grow border-t border-zinc-200"></div>
          <span className="text-zinc-400 text-xs uppercase">or</span>
          <div className="flex-grow border-t border-zinc-200"></div>
        </div>

        <div id="googleSignInButton" className="w-full flex justify-center py-1"></div>

        {state === "Sign Up" ? (
          <p className="text-zinc-500 mt-2">
            Already have an account?{" "}
            <span
              onClick={() => setState("Login")}
              className=" text-primary underline cursor-pointer font-medium"
            >
              Login here
            </span>
          </p>
        ) : (
          <p className="text-zinc-500 mt-2">
            Create a new account?{" "}
            <span
              onClick={() => setState("Sign Up")}
              className=" text-primary underline cursor-pointer font-medium"
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
