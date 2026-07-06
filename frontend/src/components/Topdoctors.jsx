import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Appcontext } from "../context/Appcontext";

const Topdoctors = () => {
  const navigate = useNavigate();
  const { doctors } = useContext(Appcontext);

  return (
    <div className="flex flex-col items-center gap-4 my-20 text-zinc-800 md:mx-10 px-4 animate-slide-up">
      <h1 className="text-3xl md:text-4xl font-bold text-center">Top Doctors to Book</h1>
      <p className="sm:w-1/2 text-center text-zinc-500 text-sm leading-relaxed">
        Simply browse through our extensive list of trusted doctors, and book your consultation in minutes.
      </p>
      
      <div className="w-full grid grid-cols-auto gap-6 pt-8 px-3 sm:px-0">
        {doctors.slice(0, 10).map((item, index) => (
          <div
            onClick={() => {
              navigate(`/appointment/${item._id}`);
              window.scrollTo(0, 0);
            }}
            className="bg-white border border-zinc-100 hover-card-premium rounded-2xl overflow-hidden cursor-pointer flex flex-col h-full animate-fade-in"
            key={index}
          >
            <div className="aspect-[4/3] bg-indigo-50/40 relative overflow-hidden flex items-center justify-center">
              <img
                className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                src={item.image}
                alt={item.name}
              />
              <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-xs px-2.5 py-1 rounded-full border border-zinc-100 flex items-center gap-1.5 shadow-xs">
                <span
                  className={`w-2 h-2 ${
                    item.available ? "bg-green-500 animate-pulse" : "bg-zinc-400"
                  } rounded-full`}
                ></span>
                <span className={`text-[10px] font-bold uppercase tracking-wider ${item.available ? "text-green-600" : "text-zinc-500"}`}>
                  {item.available ? "Online" : "Away"}
                </span>
              </div>
            </div>
            
            <div className="p-4 flex-1 flex flex-col justify-between">
              <div>
                <p className="text-zinc-800 font-bold text-base hover:text-primary transition-colors">
                  {item.name}
                </p>
                <p className="text-zinc-400 text-xs mt-0.5">{item.speciality}</p>
              </div>
              
              <div className="mt-4 pt-3 border-t border-zinc-50 flex items-center justify-between text-xs">
                <span className="text-zinc-400 font-medium">Consultation Fee</span>
                <span className="text-zinc-800 font-bold text-sm">${item.fees}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <button
        className="bg-primary/5 hover:bg-primary hover:text-white border border-transparent hover:border-primary text-primary font-bold px-12 py-3 rounded-full mt-12 transition-all cursor-pointer shadow-sm hover:shadow-md"
        onClick={() => {
          navigate("/doctors");
          window.scrollTo(0, 0);
        }}
      >
        View More Doctors
      </button>
    </div>
  );
};

export default Topdoctors;
