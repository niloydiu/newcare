import { useContext, useEffect, useState } from "react";
import { AdminContext } from "../../context/AdminContext";

const DoctorList = () => {
  const {
    doctors,
    getAllDoctors,
    aToken,
    changeAvailability,
    deleteDoctor,
    updateDoctor,
  } = useContext(AdminContext);

  const [editDoc, setEditDoc] = useState(null);
  const [docImage, setDocImage] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [speciality, setSpeciality] = useState("General physician");
  const [degree, setDegree] = useState("");
  const [experience, setExperience] = useState(1);
  const [fees, setFees] = useState("");
  const [about, setAbout] = useState("");
  const [address1, setAddress1] = useState("");
  const [address2, setAddress2] = useState("");
  const [available, setAvailable] = useState(true);

  useEffect(() => {
    if (aToken) {
      getAllDoctors();
    }
  }, [aToken]);

  const handleDelete = (docId, docName) => {
    if (window.confirm(`Are you sure you want to delete doctor "${docName}"?`)) {
      deleteDoctor(docId);
    }
  };

  const openEditModal = (doc) => {
    setEditDoc(doc._id);
    setName(doc.name);
    setEmail(doc.email);
    setSpeciality(doc.speciality || "General physician");
    setDegree(doc.degree || "");
    setExperience(doc.experience || 1);
    setFees(doc.fees || "");
    setAbout(doc.about || "");
    setAddress1(doc.address?.line1 || "");
    setAddress2(doc.address?.line2 || "");
    setAvailable(doc.available ?? true);
    setDocImage(false);
  };

  const closeEditModal = () => {
    setEditDoc(null);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("docId", editDoc);
    formData.append("name", name);
    formData.append("email", email);
    formData.append("speciality", speciality);
    formData.append("degree", degree);
    formData.append("experience", Number(experience));
    formData.append("fees", Number(fees));
    formData.append("about", about);
    formData.append("address", JSON.stringify({ line1: address1, line2: address2 }));
    formData.append("available", available);
    
    if (docImage) {
      formData.append("image", docImage);
    }

    const success = await updateDoctor(formData);
    if (success) {
      closeEditModal();
    }
  };

  return (
    <div className="m-6 w-full max-w-6xl animate-fade-in relative">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-zinc-800">All Doctors</h2>
        <p className="text-zinc-500 text-sm mt-1">Manage doctor accounts, edits, and availability</p>
      </div>

      {doctors.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-zinc-100 shadow-sm">
          <p className="text-zinc-400 text-base">No doctors added yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {doctors.map((item, index) => (
            <div
              className="bg-white border border-zinc-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col justify-between"
              key={index}
            >
              <div className="aspect-[4/3] bg-indigo-50/30 overflow-hidden relative flex items-center justify-center">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                />
              </div>

              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <h4 className="text-zinc-800 font-bold text-base truncate" title={item.name}>
                    {item.name}
                  </h4>
                  <p className="text-zinc-400 text-xs mt-0.5">{item.speciality}</p>
                  
                  <div className="mt-3 flex items-center gap-2">
                    <input
                      type="checkbox"
                      id={`avail-${item._id}`}
                      checked={item.available}
                      onChange={() => changeAvailability(item._id)}
                      className="w-4 h-4 rounded text-primary focus:ring-primary border-zinc-300 cursor-pointer"
                    />
                    <label
                      htmlFor={`avail-${item._id}`}
                      className="text-xs text-zinc-600 font-semibold cursor-pointer"
                    >
                      Available
                    </label>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-zinc-50 flex items-center justify-between">
                  <span className="text-zinc-800 font-bold text-sm">${item.fees}</span>
                  
                  <div className="flex gap-2">
                    {/* Edit button */}
                    <button
                      onClick={() => openEditModal(item)}
                      className="p-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-primary border border-indigo-100 transition-colors cursor-pointer"
                      title="Edit Doctor"
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
                          d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                        />
                      </svg>
                    </button>

                    {/* Delete button */}
                    <button
                      onClick={() => handleDelete(item._id, item.name)}
                      className="p-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 border border-red-100 transition-colors cursor-pointer"
                      title="Delete Doctor"
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
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit Doctor Modal overlay */}
      {editDoc && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in overflow-y-auto">
          <div className="bg-white rounded-3xl w-full max-w-2xl shadow-xl overflow-hidden animate-slide-up my-8 max-h-[90vh] flex flex-col">
            <div className="px-6 py-4 border-b border-zinc-100 flex items-center justify-between">
              <h3 className="text-lg font-bold text-zinc-800">Edit Doctor Profile</h3>
              <button
                onClick={closeEditModal}
                className="p-1.5 hover:bg-zinc-100 rounded-full transition-colors cursor-pointer"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-zinc-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <form onSubmit={handleUpdate} className="p-6 overflow-y-auto flex-1 space-y-4">
              {/* Image upload preview */}
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-zinc-50 border border-zinc-200 overflow-hidden flex items-center justify-center">
                  <img
                    src={
                      docImage
                        ? URL.createObjectURL(docImage)
                        : doctors.find((d) => d._id === editDoc)?.image
                    }
                    className="w-full h-full object-cover"
                    alt="Doctor Avatar"
                  />
                </div>
                <label className="cursor-pointer bg-primary/5 hover:bg-primary/10 text-primary border border-primary/20 text-xs font-semibold px-4 py-2 rounded-xl transition-all">
                  Change Photo
                  <input
                    type="file"
                    onChange={(e) => setDocImage(e.target.files[0])}
                    className="hidden"
                    accept="image/*"
                  />
                </label>
              </div>

              {/* Grid fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-zinc-500 uppercase mb-1">Doctor Name</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full border border-zinc-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-primary transition"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-zinc-500 uppercase mb-1">Doctor Email</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full border border-zinc-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-primary transition"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-zinc-500 uppercase mb-1">Speciality</label>
                  <select
                    value={speciality}
                    onChange={(e) => setSpeciality(e.target.value)}
                    className="w-full border border-zinc-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-primary transition bg-white"
                  >
                    {[
                      "General physician",
                      "Gynecologist",
                      "Dermatologist",
                      "Pediatricians",
                      "Neurologist",
                      "Gastroenterologist",
                    ].map((spec) => (
                      <option key={spec} value={spec}>
                        {spec}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-zinc-500 uppercase mb-1">Degree</label>
                  <input
                    type="text"
                    required
                    value={degree}
                    onChange={(e) => setDegree(e.target.value)}
                    className="w-full border border-zinc-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-primary transition"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-zinc-500 uppercase mb-1">Experience (Years)</label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={experience}
                    onChange={(e) => setExperience(e.target.value)}
                    className="w-full border border-zinc-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-primary transition"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-zinc-500 uppercase mb-1">Fees ($)</label>
                  <input
                    type="number"
                    required
                    min={0}
                    value={fees}
                    onChange={(e) => setFees(e.target.value)}
                    className="w-full border border-zinc-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-primary transition"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-zinc-500 uppercase mb-1">Address Line 1</label>
                  <input
                    type="text"
                    required
                    value={address1}
                    onChange={(e) => setAddress1(e.target.value)}
                    className="w-full border border-zinc-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-primary transition"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-zinc-500 uppercase mb-1">Address Line 2</label>
                  <input
                    type="text"
                    required
                    value={address2}
                    onChange={(e) => setAddress2(e.target.value)}
                    className="w-full border border-zinc-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-primary transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-500 uppercase mb-1">About Doctor</label>
                <textarea
                  required
                  rows={3}
                  value={about}
                  onChange={(e) => setAbout(e.target.value)}
                  className="w-full border border-zinc-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-primary transition resize-none"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="modal-available"
                  checked={available}
                  onChange={(e) => setAvailable(e.target.checked)}
                  className="w-4 h-4 rounded text-primary focus:ring-primary border-zinc-300 cursor-pointer"
                />
                <label
                  htmlFor="modal-available"
                  className="text-xs text-zinc-600 font-semibold cursor-pointer"
                >
                  Doctor is currently Available for Bookings
                </label>
              </div>

              <div className="pt-4 border-t border-zinc-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={closeEditModal}
                  className="px-5 py-2.5 rounded-xl border border-zinc-200 text-zinc-600 font-bold text-sm hover:bg-zinc-50 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-primary text-white font-bold text-sm hover:opacity-95 shadow-md shadow-primary/10 transition cursor-pointer"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DoctorList;
