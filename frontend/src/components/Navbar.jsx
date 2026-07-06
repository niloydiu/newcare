import React, { useContext, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { assets } from "../assets/assets_frontend/assets";
import { Appcontext } from "../context/Appcontext";

const Navbar = () => {
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const { token, setToken, userData } = useContext(Appcontext);

  const logOut = () => {
    setToken(false);
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="sticky top-0 z-40 glass-nav py-3.5 px-4 md:px-6 rounded-2xl border border-zinc-150/80 shadow-sm flex items-center justify-between text-sm mt-4 mb-8">
      <NavLink to={"/"} className="flex items-center gap-2">
        <img src={assets.newCare} alt="NewCare Logo" className="w-36 md:w-40 cursor-pointer object-contain" />
      </NavLink>

      {/* Desktop Links */}
      <ul className="hidden md:flex items-center gap-7 font-semibold text-zinc-600">
        <NavLink to={"/"} className="hover:text-primary transition-colors py-1 relative group">
          Home
          <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full"></span>
        </NavLink>
        <NavLink to={"/doctors"} className="hover:text-primary transition-colors py-1 relative group">
          All Doctors
          <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full"></span>
        </NavLink>
        <NavLink to={"/about"} className="hover:text-primary transition-colors py-1 relative group">
          About
          <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full"></span>
        </NavLink>
        <NavLink to={"/contact"} className="hover:text-primary transition-colors py-1 relative group">
          Contact
          <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full"></span>
        </NavLink>
      </ul>

      {/* Right Controls */}
      <div className="flex items-center gap-4">
        {token && userData ? (
          <div className="relative flex items-center gap-2 cursor-pointer group">
            <div 
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex items-center gap-1.5 p-1 rounded-full hover:bg-zinc-100/80 transition-all border border-transparent hover:border-zinc-200/50"
            >
              <img
                src={userData.image || "https://cdn-icons-png.flaticon.com/512/149/149071.png"}
                alt="User profile"
                className="w-8 h-8 rounded-full object-cover border border-zinc-200 bg-white"
              />
              <img
                className={`w-2.5 transition-transform duration-200 ${showProfileMenu ? "rotate-180" : ""}`}
                src={assets.dropdown_icon}
                alt="dropdown_icon"
              />
            </div>
            
            {/* Profile Dropdown Menu */}
            <div
              className={`absolute right-0 top-full mt-2 w-48 bg-white border border-zinc-100 rounded-xl shadow-lg py-2 z-50 transition-all duration-200 ${
                showProfileMenu ? "opacity-100 translate-y-0 visible" : "opacity-0 -translate-y-2 invisible"
              } md:group-hover:opacity-100 md:group-hover:translate-y-0 md:group-hover:visible`}
            >
              <p
                onClick={() => {
                  navigate("/my-profile");
                  setShowProfileMenu(false);
                }}
                className="px-4 py-2 hover:bg-zinc-50 text-zinc-700 font-medium hover:text-primary cursor-pointer flex items-center gap-2"
              >
                👤 My Profile
              </p>
              <p
                onClick={() => {
                  navigate("/my-appointments");
                  setShowProfileMenu(false);
                }}
                className="px-4 py-2 hover:bg-zinc-50 text-zinc-700 font-medium hover:text-primary cursor-pointer flex items-center gap-2"
              >
                📅 My Appointments
              </p>
              <hr className="border-zinc-100 my-1" />
              <p
                onClick={() => {
                  logOut();
                  setShowProfileMenu(false);
                }}
                className="px-4 py-2 hover:bg-red-50 text-red-500 font-semibold cursor-pointer flex items-center gap-2"
              >
                🚪 Logout
              </p>
            </div>
          </div>
        ) : (
          <button
            onClick={() => navigate("/login")}
            className="bg-primary text-white px-6 py-2.5 rounded-full font-bold text-sm shadow-md shadow-primary/20 hover:bg-opacity-95 active:scale-95 transition-all cursor-pointer"
          >
            Sign In
          </button>
        )}

        <img
          onClick={() => setShowMenu(true)}
          className="w-6 md:hidden cursor-pointer active:scale-90 transition-all"
          src={assets.menu_icon}
          alt="menu_icon"
        />

        {/* Mobile menu Drawer */}
        <div
          className={`fixed inset-0 z-50 bg-black/30 backdrop-blur-sm transition-opacity duration-300 md:hidden ${
            showMenu ? "opacity-100 visible" : "opacity-0 invisible pointer-events-none"
          }`}
          onClick={() => setShowMenu(false)}
        >
          <div
            className={`absolute right-0 top-0 bottom-0 w-64 bg-white shadow-2xl p-6 flex flex-col gap-6 transition-transform duration-300 ${
              showMenu ? "translate-x-0" : "translate-x-full"
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-zinc-100 pb-4">
              <img src={assets.newCare} alt="newCare" className="w-32" />
              <button
                onClick={() => setShowMenu(false)}
                className="w-8 h-8 rounded-full hover:bg-zinc-100 flex items-center justify-center text-zinc-400 hover:text-zinc-600"
              >
                ✕
              </button>
            </div>

            <ul className="flex flex-col gap-3 font-semibold text-zinc-700 text-base">
              <NavLink
                to="/"
                onClick={() => setShowMenu(false)}
                className={({ isActive }) => `px-4 py-2.5 rounded-xl hover:bg-zinc-50 hover:text-primary ${isActive ? "bg-primary/5 text-primary" : ""}`}
              >
                Home
              </NavLink>
              <NavLink
                to="/doctors"
                onClick={() => setShowMenu(false)}
                className={({ isActive }) => `px-4 py-2.5 rounded-xl hover:bg-zinc-50 hover:text-primary ${isActive ? "bg-primary/5 text-primary" : ""}`}
              >
                All Doctors
              </NavLink>
              <NavLink
                to="/about"
                onClick={() => setShowMenu(false)}
                className={({ isActive }) => `px-4 py-2.5 rounded-xl hover:bg-zinc-50 hover:text-primary ${isActive ? "bg-primary/5 text-primary" : ""}`}
              >
                About
              </NavLink>
              <NavLink
                to="/contact"
                onClick={() => setShowMenu(false)}
                className={({ isActive }) => `px-4 py-2.5 rounded-xl hover:bg-zinc-50 hover:text-primary ${isActive ? "bg-primary/5 text-primary" : ""}`}
              >
                Contact
              </NavLink>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
