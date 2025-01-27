import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { toast } from "react-toastify";

const UpdateLead = () => {
  const navigate = useNavigate();
  const { userId } = useParams();
  
  const [formValues, setFormvalues] = useState({
    name: "",
    company: "",
    phone: "",
    email: "",
  });

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API}/getSingleCoustomer/${userId}`
        );
        const data = await response.json();
        
        setFormvalues({
          name: data.coustomer.name || "",
          phone: data.coustomer.phone ,
          company: data.coustomer.company || "",
          email: data.coustomer.email || "",
        });
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
    fetchUser();
  }, [userId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormvalues((prev) => ({
      ...prev,
      [name]: value,
    }));
    console.log("Updated Form Values:", { ...formValues, [name]: value });
  };

  const handlereturnhome = () => {
    navigate("/home");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${import.meta.env.VITE_API}/updateCoustomerData/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formValues),
      });
      if (!response.ok) {
        toast.error("Failed to update lead data");
      }
      const updatedData = await response.json();
      console.log("updatedData", updatedData);
      toast.success(updatedData.message);
      navigate("/home");
    } catch (error) {
      console.error("Error updating user data:", error);
    }
  };

  return (
    <div
      className="flex justify-center items-center w-screen h-screen max-sm:p-5"
      style={{ fontFamily: "sans-serif" }}
    >
      <div className="shadow-2xs w-[30%] max-sm:w-[100%] h-130 rounded-xl border-1 border-gray-300 flex flex-col justify-start items-start p-7">
        <h1 className="font-bold text-xl">Update Lead</h1>
        <p className="text-gray-400">Add your new lead in one-click.</p>
        <form className="flex flex-col mt-5 w-[100%]" onSubmit={handleSubmit}>
          <label className="font-semibold">Name</label>
          <input
            type="text"
            name="name"
            value={formValues.name}
            onChange={handleInputChange}
            placeholder="Name of lead"
            className="p-2 border-1 border-gray-300 rounded outline-gray-500 mt-1"
          />
          <label className="font-semibold mt-4">Company</label>
          <input
            type="text"
            name="company"
            value={formValues.company}
            onChange={handleInputChange}
            required
            placeholder="Name of Company"
            className="p-2 border-1 border-gray-300 rounded outline-gray-500 mt-1"
          />
          <label className="font-semibold mt-4">Phone</label>
          <input
            type="num"
            name="phone"
            value={formValues.phone}
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
            value={formValues.email}
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
              Update
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateLead;
