import { assets } from "../assets/assets_frontend/assets";

const Header = () => {
  return (
    <div className="flex flex-col md:flex-row flex-wrap bg-gradient-to-br from-primary via-[#5764f2] to-indigo-600 rounded-3xl px-6 md:px-10 lg:px-20 relative overflow-hidden shadow-lg border border-primary/10 animate-fade-in">
      {/* Background Decorative Blob */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-white/5 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full blur-2xl -ml-20 -mb-20 pointer-events-none"></div>

      {/* Left Side */}
      <div className="md:w-1/2 flex flex-col items-start justify-center gap-5 py-12 md:py-[8vw] md:mb-[-10px] z-10 animate-slide-up">
        <p className="text-3xl md:text-4xl lg:text-5xl text-white font-bold leading-tight md:leading-tight lg:leading-tight">
          Book Appointment <br /> With Trusted Doctors
        </p>
        
        <div className="flex flex-col sm:flex-row items-center gap-3.5 text-white/90 text-sm font-medium">
          <img
            src={assets.group_profiles}
            alt="group_profiles"
            className="w-24 drop-shadow-md"
          />
          <p className="text-center sm:text-left leading-relaxed">
            Simply browse through our extensive list of trusted doctors,{" "}
            <br className="hidden sm:block" />
            and schedule your appointment hassle-free.
          </p>
        </div>

        <a
          href="#speaciality"
          className="flex items-center gap-2.5 bg-white text-primary font-bold px-8 py-3.5 rounded-full text-sm hover:scale-105 active:scale-95 shadow-md shadow-black/10 hover:shadow-lg transition-all duration-300 mt-2 cursor-pointer"
        >
          Book appointment{" "}
          <img className="w-3" src={assets.arrow_icon} alt="arrow_icon" />
        </a>
      </div>

      {/* Right Side */}
      <div className="md:w-1/2 relative flex items-end justify-center min-h-[300px] md:min-h-0">
        <img
          src={assets.header_img}
          alt="header_img"
          className="w-full md:absolute bottom-0 h-auto rounded-lg object-contain max-h-[105%] drop-shadow-2xl transition-transform duration-500 hover:scale-102"
        />
      </div>
    </div>
  );
};

export default Header;
