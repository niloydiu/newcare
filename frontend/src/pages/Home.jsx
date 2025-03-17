import Banner from "../components/Banner";
import Header from "../components/Header";
import Specialitymenu from "../components/Specialitymenu";
import Topdoctors from "../components/Topdoctors";

const Home = () => {
  return (
    <div>
      <Header />
      <Specialitymenu />
      <Topdoctors />
      <Banner />
    </div>
  );
};

export default Home;
