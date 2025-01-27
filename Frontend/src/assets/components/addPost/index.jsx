import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const AddPost = () => {
  const navigate = useNavigate();
  const [createLead, setCreateLead] = useState({
    name: "",
    company: "",
    phone: "",
    email: "",
  });

  const handlereturnhome = () => {
    navigate("/home");
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCreateLead((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // add lead
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:3000/addLeaddata", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(createLead),
      });

      if (!response.ok) {
        console.log(response);
        throw new Error("Failed to create lead");
      }

      setCreateLead({
        name: "",
        company: "",
        phone: "",
        email: "",
      });

      navigate("/home");
    } catch (error) {
      console.error("handleSubmit error:", error);
    }
  };

  return (
    <div
      className="flex justify-center items-center w-screen h-screen  max-sm:p-5"
      style={{ fontFamily: "sans-serif" }}
    >
      <div className="shadow-2xs w-[30%] max-sm:w-[100%] h-130 rounded-xl border-1 border-gray-300  flex flex-col justify-start items-start p-7">
        <h1 className="font-bold text-xl">Create Lead</h1>
        <p className="text-gray-400">Add your new lead in one-click.</p>
        <form className="flex flex-col mt-5 w-[100%]" onSubmit={handleSubmit}>
          <label className="font-semibold">Name</label>
          <input
            type="text"
            name="name"
            value={createLead.name}
            onChange={handleInputChange}
            placeholder="Name of lead"
            required
            className="p-2 border-1 border-gray-300 rounded outline-gray-500 mt-1"
          />
          <label className="font-semibold mt-4">Company</label>
          <input
            type="text"
            name="company"
            value={createLead.company}
            onChange={handleInputChange}
            required
            placeholder="Name of Company"
            className="p-2 border-1 border-gray-300 rounded outline-gray-500 mt-1"
          />
          <label className="font-semibold mt-4">Phone</label>
          <input
            type="num"
            name="phone"
            value={createLead.phone}
            required
            onChange={handleInputChange}
            placeholder="Phone of lead"
            className="p-2 border-1 border-gray-300 rounded outline-gray-500 mt-1"
          />
          <label className="font-semibold mt-4">Email</label>
          <input
            type="email"
            name="email"
            required
            value={createLead.email}
            onChange={handleInputChange}
            placeholder="Email of lead"
            className="p-2 border-1 border-gray-300 rounded outline-gray-500 mt-1"
          />
          <div className="flex justify-between mt-10">
            <Button
              className="cursor-pointer outline-1 outline-gray-200"
              onClick={handlereturnhome}
            >
              Cancel
            </Button>
            <Button className="cursor-pointer bg-black text-white font-semibold">
              Create
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddPost;
