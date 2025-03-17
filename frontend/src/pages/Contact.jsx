import { assets } from "../assets/assets_frontend/assets";

const Contact = () => {
  return (
    <div>
      <div className=" text-center text-2xl pt-10 text-gray-500">
        <p>
          CONTACT <span className=" text-gray-700 font-semibold">US</span>
        </p>
      </div>
      <div className=" my-10 flex flex-col justify-center md:flex-row gap-10 mb-28 text-sm">
        <img
          src={assets.contact_image}
          alt="contact_image"
          className=" w-full max-w-[360px]"
        />
        <div className=" flex flex-col justify-center items-start gap-6">
          <p className=" font-semibold text-lg text-gray-600">OUR OFFICE</p>
          <p className=" text-gray-500">
            54709 Willms Station <br /> Suite 350, Washington, USA
          </p>
          <p className="  text-primary">
            Get connected to developer <br />
            <a
              href="https://niloykm.vercel.app/"
              target="_blank"
              className=" text-primary"
            >
              Click for Portfolio: niloykumarmohonta@gmail.com
            </a>
          </p>

          <p className=" font-semibold text-lg text-gray-600">
            CAREER AT NewCare
          </p>
          <p className=" text-gray-500">
            Learn more about our teams and job openings.
          </p>
          <button className=" border border-black px-8 py-4 text-sm hover:bg-black hover:text-white transition-all duration-500">
            Explore Jobs
          </button>
        </div>
      </div>
    </div>
  );
};

export default Contact;
