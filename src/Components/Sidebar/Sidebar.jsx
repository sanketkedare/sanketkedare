import { IoMenu } from "react-icons/io5";
import { IoClose } from "react-icons/io5";
import { useState } from "react";
import {reactImage} from "../images" 

const Sidebar = () => 
{
  
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = ()=>{
    setSidebarOpen(!sidebarOpen)
  }

  return (
    <div>
      {!sidebarOpen && (
        <button
          className="closed-sidebar fixed z-30 mt-20 mr-4 right-3 bg-white rounded-full text-black p-4 opacity-[0.8]"
          onClick={toggleSidebar}
        >
          <IoMenu />
        </button>
      )}

      {sidebarOpen && (
        <div className="z-30 relative opened-sidebarfixed inset-0 bg-gray-800 bg-opacity-50">
          <div className="bg-white  w-64 h-full fixed right-0 top-0 shadow-lg rounded-xl">
            <button
              className="flex justify-end items-start p-4"
              onClick={toggleSidebar}
            >
              <IoClose className="text-black w-6 h-6 rounded-full" />
            </button>

            <ul className=" py-4 px-2 bg-white bg-opacity-40" >
              <img
                src={reactImage}
                className="w-full bg-white bg-opacity-40 shadow-inner shadow-sky-500 p-4 rounded-full"
                alt="react"
              />
              <li>
                <a
                  href={`/`}
                  className="block text-xl border-y-2 my-4 text-center font-bold text-black bg-white py-2 hover:bg-sky-100"
                  onClick={toggleSidebar}
                >
                  Home
                </a>
              </li>
              <li>
                <a
                  href={`#about`}
                  className="block text-xl border-y-2 my-4  text-center font-bold text-black bg-white py-2 hover:bg-sky-100"
                  onClick={toggleSidebar}
                >
                  About
                </a>
              </li>
              
              <li>
                <a
                  href={`#projects`}
                  className="block text-xl border-y-2 my-4  text-center font-bold text-black bg-white py-2 hover:bg-sky-100"
                  onClick={toggleSidebar}
                >
                  Projects
                </a>
              </li>

              <li>
                <a
                  href={`#skills`}
                  className="block text-xl border-y-2 my-4 text-center font-bold text-black bg-white py-2 hover:bg-sky-100"
                  onClick={toggleSidebar}
                >
                  Skills
                </a>
              </li>
              
              <li>
                <a
                  href={`#resume`}
                  className="block text-xl border-y-2 my-4  text-center font-bold text-black bg-white py-2 hover:bg-sky-100"
                  onClick={toggleSidebar}
                >
                  Resume
                </a>
              </li>

              <li>
                <a
                  href={`#contact`}
                  className="block text-xl border-y-2 my-4  text-center font-bold text-black bg-white py-2 hover:bg-sky-100"
                  onClick={toggleSidebar}
                >
                  Contact Me
                </a>
              </li>
              
              
            </ul>
            <h1 className="bg-white text-gray-600 text-center my-7 ">
              Copyrite@2023
            </h1>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
