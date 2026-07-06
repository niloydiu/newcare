import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Appcontext } from "../context/Appcontext";

const Doctors = () => {
  const { doctors } = useContext(Appcontext);
  const [filterDoc, setFilterDoc] = useState([]);
  const [showFilter, setShowFilter] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const { speciality } = useParams();

  const applyFilter = () => {
    let temp = doctors;
    if (speciality) {
      temp = temp.filter((doc) => doc.speciality === speciality);
    }
    if (searchQuery.trim() !== "") {
      const query = searchQuery.toLowerCase();
      temp = temp.filter(
        (doc) =>
          doc.name.toLowerCase().includes(query) ||
          doc.speciality.toLowerCase().includes(query) ||
          (doc.degree && doc.degree.toLowerCase().includes(query))
      );
    }
    setFilterDoc(temp);
  };

  useEffect(() => {
    applyFilter();
  }, [doctors, speciality, searchQuery]);

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-zinc-800">Find Trusted Doctors</h2>
        <p className="text-zinc-500 text-sm mt-1">Browse by specialty or search by name</p>
      </div>

      {/* Search Bar & Mobile Filter Trigger */}
      <div className="flex flex-col sm:flex-row items-center gap-4 mb-6 w-full justify-between">
        <input
          type="text"
          placeholder="🔍 Search doctors by name, specialty, or degree..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full sm:max-w-md border border-zinc-200 rounded-xl px-4 py-2.5 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none shadow-sm transition bg-white"
        />
        <button
          className={`w-full sm:w-auto py-2.5 px-5 border border-zinc-200 rounded-xl text-sm font-semibold transition-all sm:hidden cursor-pointer ${
            showFilter ? "bg-primary text-white border-primary" : "bg-white text-zinc-700"
          }`}
          onClick={() => setShowFilter((prev) => !prev)}
        >
          {showFilter ? "Hide Filters" : "Show Specialties"}
        </button>
      </div>

      <div className="flex flex-col sm:flex-row items-start gap-6">
        {/* Sidebar Specialties Filter */}
        <div
          className={`w-full sm:w-60 flex-shrink-0 flex-col gap-2.5 text-sm font-medium ${
            showFilter ? "flex" : "hidden sm:flex"
          }`}
        >
          <span className="text-xs uppercase tracking-wider text-zinc-400 font-bold mb-1 hidden sm:block">Specialties</span>
          {[
            "General physician",
            "Gynecologist",
            "Dermatologist",
            "Pediatricians",
            "Neurologist",
            "Gastroenterologist"
          ].map((spec) => {
            const isSelected = speciality === spec;
            return (
              <div
                key={spec}
                className={`w-full pl-4 py-3 border rounded-xl cursor-pointer transition-all hover:bg-zinc-50 font-semibold ${
                  isSelected
                    ? "bg-primary/5 border-primary text-primary"
                    : "border-zinc-200 text-zinc-600 bg-white"
                }`}
                onClick={() =>
                  isSelected ? navigate("/doctors") : navigate(`/doctors/${spec}`)
                }
              >
                {spec}
              </div>
            );
          })}
        </div>

        {/* Doctor Cards Grid */}
        <div className="w-full">
          {filterDoc.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl border border-zinc-100 shadow-sm">
              <p className="text-zinc-400 text-base">No doctors found matching the filter criteria.</p>
            </div>
          ) : (
            <div className="grid grid-cols-auto gap-5 w-full">
              {filterDoc.map((item, index) => (
                <div
                  onClick={() => navigate(`/appointment/${item._id}`)}
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
          )}
        </div>
      </div>
    </div>
  );
};

export default Doctors;
