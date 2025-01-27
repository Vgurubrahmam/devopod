import { FiLogOut } from "react-icons/fi";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { LiaUserEditSolid } from "react-icons/lia";
import { AiOutlineUserDelete } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import { RiUserAddLine } from "react-icons/ri";
import { toast } from "react-toastify";
import Cookies from "js-cookie";
const Home = () => {
  const navigate = useNavigate();
  const [usersData, setuserData] = useState([]);
  const [searchInput,setSearchInput]=useState("")
  // console.log(usersData);
  const handleSearch=(e)=>{
    setSearchInput(e.target.value)
  }
  const filterleads=usersData.filter((eachUser)=>eachUser.name.toLowerCase().includes(searchInput.toLowerCase()))

  // logut
  const handleLogout=()=>{
   
    const userConfimed=window.confirm("Are you sure you want to logout")
    if(userConfimed){

    
    Cookies.remove('jwt_token')
    toast.success("Logout Successfully")
    navigate('/login', {replace: true})
    
    }
  }
  useEffect(() => {
    fetchUserdata();
  }, []);
  const fetchUserdata = async () => {
    const usersData = await fetch("http://localhost:3000/coustomerTable");
    const data = await usersData.json();
    setuserData(data.data);
  };
  const handleAddLead = () => {
    navigate("/addPost");
  };
  // delete lead
  const handleDelete = async (eachUser) => {
    const userConfirmed = window.confirm("Are you sure you want to Delete");
    if (!userConfirmed) {
      return; 
    }

    const data = await fetch(
      `http://localhost:3000/deleteCoustomer/${eachUser.id}`,
      {
        method: "DELETE",
      }
    )
      .then(() => {
        fetchUserdata();
      })
      .catch((error) => {
        console.error("Error deleting post", error);
      });
  };
  // update lead 
  const handleUpdateLead = (userId) => {
    navigate(`/updatelead/${userId}`);
  };
  
  return (
    <>
      <div className=" w-full h-20 bg-white shadow font-sans px-30 py-5 max-sm:px-4 max-sm:py-2 flex justify-between items-center">
        <img
          src="https://i.ibb.co/h96GL1X/Screenshot-2025-01-25-212619.png"
          className="w-32"
        />
        <div className="flex justify-center items-center gap-6 max-sm:gap-0">
          <button
            className="font-bold max-sm:hidden bg-gray-200 py-2 px-4 rounded-full cursor-pointer text-sm"
            onClick={handleAddLead}
          >
            Add Lead
          </button>
          <RiUserAddLine className="hidden max-sm:block" onClick={handleAddLead} />

          <button className="font-bold text-sm bg-gray-400 py-2 px-4 rounded-full hover:bg-gray-300 cursor-pointer max-sm:hidden" onClick={handleLogout}>
            Logout
          </button>
        </div>
        <FiLogOut className="font-bold mr-5 hidden max-sm:block " onClick={handleLogout} />
      </div>
      {/* <Button>Click me</Button> */}
      <div className="mx-10 mt-10">
        <input type="search" className=" p-2 border-1 shadow border-gray-300 rounded-md outline-gray-500  w-[25%] max-sm:w-[100%]" placeholder="Search lead name.." value={searchInput} onChange={handleSearch}/>
      </div> 
      <ul className="flex flex-wrap justify-center items-center h-[100%] w-[100%] p-10 gap-5">
        {filterleads.length > 0 ? (
          filterleads.map((eachUser, index) => (
            <li key={index} className="list-none">
              <div className="h-70 w-70 border-1 border-gray-300  rounded-xl shadow-md flex flex-col justify-center">
                <div className="w-10 h-10 text-center font-bold mt-8 ml-5 bg-gray-800 text-white px-3 py-2 rounded-full">
                  <p className="">{eachUser?.name?.[0]?.toUpperCase()}</p>
                </div>

                <div className="gap-3 text-start font-semibold px-5">
                  <h1 className="font-bold text-2xl text-gray-700">
                    {eachUser?.name}
                  </h1>
                  <div className="gap-3">
                    <h1 className="font-semibold  text-lg  text-gray-400">
                      {eachUser?.company}
                    </h1>
                    <h1 className=" text-gray-400">{eachUser?.phone}</h1>
                    <h1 className="text-sm  text-gray-400">
                      {eachUser?.email}
                    </h1>
                  </div>
                </div>
                <div className="flex justify-between  items-center w-full p-0 mt-6">
                  <div className=" text-xs font-sans font-bold pl-5 text-gray-400">
                    <p>{new Date(eachUser?.created_at).toLocaleDateString()}</p>
                    <p>{new Date(eachUser?.updated_at).toLocaleDateString()}</p>
                  </div>
                  <div className="px-5 py-4 flex  gap-1">
                    <button title="Edit">
                      <Button className="cursor-pointer" onClick={() => handleUpdateLead(eachUser.id)}>
                        <LiaUserEditSolid  />
                      </Button>
                    </button>
                    <button title="Delete">
                      <Button
                        className="cursor-pointer"
                        onClick={() => handleDelete(eachUser)}
                      >
                        <AiOutlineUserDelete />
                      </Button>
                    </button>
                  </div>
                </div>
              </div>
            </li>
          ))
        ) : (
          <div className="flex justify-center items-center self-center ">
            <h1 className="font-bold text-5xl">Please Add user</h1>
          </div>
        )}
      </ul>
    </>
  );
};
export default Home;
