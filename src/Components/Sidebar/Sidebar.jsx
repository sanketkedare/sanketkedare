import { IoMenu, IoClose } from "react-icons/io5";
import { useState } from "react";
import { motion } from "framer-motion";
import { textVariants } from "./sidebarAnimations";
import SidebarFoot from "./SidebarFoot";

const Sidebar = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const sidebarContents = [ "Home", "About", "Skills", "Projects", "Resume", "Contact Me"];

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div>
      {!sidebarOpen && (
        <motion.button
          className="closed-sidebar fixed z-30 mt-20 mr-4 right-3 bg-white rounded-full text-black p-4 hover:bg-slate-300"
          onClick={toggleSidebar}
          variants={textVariants}
          initial="initial"
          animate="animate"
        >
          <IoMenu />
        </motion.button>
      )}

      {sidebarOpen && (
        <motion.div
          className="z-30 relative opened-sidebar inset-0 bg-gray-800 w-auto"
          variants={textVariants}
          initial="initial1"
          animate="animate1"
        >
          <div className="w-64 h-full fixed right-0 top-0 shadow-lg rounded-l-3xl bg-inherit">
            <button
              className="flex justify-end items-start p-4"
              onClick={toggleSidebar}
            >
              <IoClose className="text-black w-6 h-6 rounded-full" />
            </button>

            <ul className="py-4 px-2 bg-opacity-40 bg-inherit gap-4">
              {sidebarContents.map((item, index) => (
                <motion.li
                  key={index}
                  className="bg-transparent"
                  variants={textVariants}
                  initial="initial2"
                  animate="animate2"
                >
                  <a
                    href={`#${item.toLowerCase().replace(" ", "")}`}
                    className="block text-xl border-2 my-4 text-center font-bold hover:text-black text-white py-2 hover:bg-sky-100 bg-inherit rounded-2xl"
                    onClick={toggleSidebar}
                  >
                    {item}
                  </a>
                </motion.li>
              ))}
            </ul>


           <SidebarFoot/>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default Sidebar;
