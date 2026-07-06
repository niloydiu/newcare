import React, { useContext, useEffect, useState } from "react";
import { AdminContext } from "../../context/AdminContext";

const AllPatients = () => {
  const { aToken, patients, getAllPatients, deletePatient } =
    useContext(AdminContext);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (aToken) {
      getAllPatients();
    }
  }, [aToken]);

  const handleDelete = (userId, name) => {
    if (window.confirm(`Are you sure you want to delete patient "${name}"? This will also cancel all their appointments.`)) {
      deletePatient(userId);
    }
  };

  const filteredPatients = patients.filter(
    (patient) =>
      patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      patient.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="m-6 w-full max-w-6xl animate-fade-in">
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-zinc-800">Patients Directory</h2>
          <p className="text-zinc-500 text-sm mt-1">Manage and view registered patient accounts</p>
        </div>
        
        <input
          type="text"
          placeholder="🔍 Search patients by name or email..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full sm:max-w-md border border-zinc-200 rounded-xl px-4 py-2.5 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none shadow-sm transition bg-white"
        />
      </div>

      {filteredPatients.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-zinc-100 shadow-sm">
          <p className="text-zinc-400 text-base">No patients found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredPatients.map((patient) => (
            <div
              key={patient._id}
              className="bg-white border border-zinc-100 rounded-2xl p-5 hover:shadow-lg transition-all duration-300 flex flex-col justify-between"
            >
              <div className="flex items-start gap-4">
                <img
                  src={patient.image || "https://cdn-icons-png.flaticon.com/512/149/149071.png"}
                  alt={patient.name}
                  className="w-14 h-14 rounded-full object-cover border border-zinc-100 bg-zinc-50"
                />
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-zinc-800 text-base truncate" title={patient.name}>
                    {patient.name}
                  </h4>
                  <p className="text-zinc-400 text-xs truncate" title={patient.email}>
                    {patient.email}
                  </p>
                  <p className="text-zinc-500 text-xs font-semibold mt-1">
                    Phone: {patient.phone || "Not provided"}
                  </p>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-zinc-50 flex items-center justify-between">
                <div className="text-xs text-zinc-500 flex flex-col gap-0.5">
                  <span>Gender: <strong className="text-zinc-700">{patient.gender || "N/A"}</strong></span>
                  <span>DOB: <strong className="text-zinc-700">{patient.dob || "N/A"}</strong></span>
                </div>

                <button
                  onClick={() => handleDelete(patient._id, patient.name)}
                  className="flex items-center justify-center p-2 rounded-xl bg-red-50 hover:bg-red-100 border border-red-100 hover:border-red-200 transition-colors text-red-600 font-bold text-xs cursor-pointer gap-1"
                  title="Delete Patient Account"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AllPatients;
