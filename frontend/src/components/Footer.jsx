import React from "react";
import { NavLink } from "react-router-dom";
import { assets } from "../assets/assets_frontend/assets";

const Footer = () => {
  return (
    <div className=" md:mx-10">
      <div className=" flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 my-10 mt-40 text-sm">
        {/* Left */}
        <div>
          <NavLink to={"/"} onClick={() => scrollTo(0, 0)}>
            <img src={assets.newCare} alt="newCare" className=" mb-5 w-40" />
          </NavLink>
          <p className=" w-full md:w-2/3 text-gray-600 leading-6">
            NewCare is your trusted partner for online doctor appointments. Our
            platform connects you with experienced healthcare professionals from
            the comfort of your home. Whether you need a routine check-up,
            specialist consultation, or follow-up care, NewCare makes it easy
            and convenient to access quality healthcare services. Our mission is
            to provide accessible and affordable healthcare to everyone,
            anytime, anywhere.
          </p>
        </div>
        {/* Center  */}
        <div>
          <p className=" text-xl font-medium mb-5">COMPANY</p>
          <ul className=" flex flex-col gap-2 text-gray-600">
            <li>Home</li>
            <li>About Us</li>
            <li>Contact Us</li>
            <li>Privacy Policy</li>
          </ul>
        </div>
        {/* Right  */}
        <div>
          <p className=" text-xl font-medium mb-5">GET IN TOUCH</p>
          <ul className=" flex flex-col gap-2 text-gray-600">
            <li>+8801234567890</li>
            <li>niloykumarmohonta@gmail.com</li>
          </ul>
        </div>
      </div>
      {/* Copyright  */}
      <div>
        <hr />
        <p className=" py-5 text-sm text-center">
          Copyright 2025 &copy;NewCare - All rights reserved
        </p>
      </div>
    </div>
  );
};

export default Footer;
