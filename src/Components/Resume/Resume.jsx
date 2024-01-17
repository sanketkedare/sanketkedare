import React from "react";
import { motion } from "framer-motion";

const Resume = () => 
{
  const RESUME_PDF = "/Resume.pdf";
    const downloadResumeUrl =(url)=>
    {
        const aTag = document.createElement('a');
        aTag.href = url;
        aTag.setAttribute('download','Resume');

        document.body.appendChild(aTag);
        aTag.click();
        aTag.remove();


    }
  return (
    <motion.div className="resume h-[100%] flex justify-center items-center">
      <div
        className="w-[90%] h-[90%] my-auto  rounded-2xl shadow-2xl
                      lg:flex grid grid-cols-1 lg:justify-between justify-center items-center"
      >
        <div className="information flex justify-center item-center lg:w-3/1  text-center p-4 h-full">
          <div className="wrapper bg-transparent  gap-4 h-full">
            <h1 className="bg-transparent lg:text-[60px] text-[20px] my-3 hover:text-sky-500 font-medium">
              Hey wait..!! Here is a <span className="bg-transparent text-yellow-400 rounded-3xl hover:shadow-2xl">Resume</span><br/> Check it out...
            </h1>
            <p className="bg-transparent text-justify w-[80%] m-auto my-10 text-gray-500">
            Results-driven professional with a proven track record in project management and strategic planning. Skilled in team leadership, communication, and problem-solving. Recognized for achieving operational efficiency and exceeding targets. Adaptable and detail-oriented, with a commitment to delivering high-quality results. Seeking to contribute expertise in a dynamic and growth-oriented environment.            </p>

            <button className="bg-yellow-500 hover:bg-sky-500 border-2 hover:border-black p-4 my-7 text-black px-7 font-bold rounded-3xl"
                    onClick={()=>{downloadResumeUrl(RESUME_PDF)}}>
                Download Resume 
            </button>
          </div>
          
        </div>

       
      </div>
    </motion.div>
  );
};

export default Resume;
