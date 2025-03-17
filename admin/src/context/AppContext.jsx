import { createContext } from "react";

export const AppContext = createContext();

const AppContextProvider = (props) => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const currency = "$";
  // const calculateAge = (dob) => {
  //   const today = new Date();
  //   const birthDate = new Date(dob);
  //   let age = today.getFullYear() - birthDate.getFullYear();
  //   return age;
  // };
  const calculateAge = (dob) => {
    // Handle "Not selected" or other invalid values
    if (!dob || dob === "Not selected") return "Not set";

    try {
      const today = new Date();
      const birthDate = new Date(dob);

      // Validate date
      if (isNaN(birthDate.getTime())) {
        return "Invalid";
      }

      let age = today.getFullYear() - birthDate.getFullYear();

      // Adjust for birth month/day
      const monthDiff = today.getMonth() - birthDate.getMonth();
      if (
        monthDiff < 0 ||
        (monthDiff === 0 && today.getDate() < birthDate.getDate())
      ) {
        age--;
      }

      return age;
    } catch (error) {
      console.error("Error calculating age:", error);
      return "Error";
    }
  };
  const months = [
    "",
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const slotDateFormat = (slotDate) => {
    const dateArray = slotDate.split("_");
    return (
      dateArray[0] + " " + months[Number(dateArray[1])] + " " + dateArray[2]
    );
  };
  const value = {
    backendUrl,
    calculateAge,
    slotDateFormat,
    currency,
  };
  return (
    <AppContext.Provider value={value}>{props.children}</AppContext.Provider>
  );
};

export default AppContextProvider;
