import {
  bootstrap,
  css,
  dsa,
  expressjs,
  githubImage,
  html,
  java,
  js,
  mariadb,
  mongoDb,
  mysql,
  nextjs,
  nodejs,
  postman,
  reactImage,
  springboot,
  tailwind,
} from "../images";
import "./Skills.scss";

const Skills = () => {
  return (
    <div className="skills w-[100%] border-t-2 border-white bg-gradient-to-t from-blue-400 via-red-300 to-yellow-300 h-[100%]">
      <h1 className="text-center mt-3 font-bold text-black text-2xl p-1 bg-transparent">
        Skill Set
      </h1>
      <hr className="border-b-4 rounded-3xl border-black mx-auto w-[20vw]" />

      <div className="lg:w-[80%] lg:mx-auto  lg:mt-8 mt-6 bg-transparent px-2">

        <div className="programming lg:mb-8 mb-10 m-auto p-4 py-7 rounded-3xl">
          <span className=" lg:w-[80%] lg:m-auto lg:text-center border-2 border-red-200 bg-green-300 text-black px-4 p-1 font-bold lg:rounded-3xl rounded-r-3xl">
            Programming Skills and more
          </span>

          <div
            className="lg:flex lg:justify-center lg:gap-6 p-2
                          grid grid-cols-4 gap-7"
          >
            <div className="lg:w-[80px] w-[50px] lg:h-[80px] h-[50px] mx-2  m-auto">
              <img src={js} className="h-[100%] m-auto bg-transparent p-2" />
              <h1 className="text-center text-sm bg-transparent font-bold">
                JavaScript
              </h1>
            </div>

            <div className="lg:w-[80px] w-[50px] lg:h-[80px] h-[50px] mx-2  m-auto">
              <img src={java} className="h-[100%] m-auto bg-transparent p-2" />
              <h1 className="text-center text-sm bg-transparent font-bold">
                Java
              </h1>
            </div>

            <div className="lg:w-[80px] w-[50px] lg:h-[80px] h-[50px] mx-2  m-auto">
              <img src={dsa} className="h-[100%] m-auto bg-transparent p-2" />
              <h1 className="text-center text-sm bg-transparent font-bold">
                DSA
              </h1>
            </div>
            <div className="lg:w-[80px] w-[50px] lg:h-[80px] h-[50px] mx-2  m-auto">
              <img
                src={githubImage}
                className="h-[100%] m-auto bg-transparent p-2"
              />
              <h1 className="text-center text-sm bg-transparent font-bold">
                Github
              </h1>
            </div>
          </div>
        </div>

        <div className="programming lg:mb-8 mb-10 m-auto p-4 py-7 rounded-3xl">
        <span className=" lg:w-[80%] lg:m-auto lg:text-center border-2 border-red-200 bg-green-300 text-black px-4 p-1 font-bold lg:rounded-3xl rounded-r-3xl">
            Frontend Skills
          </span>

          <div
            className="lg:flex lg:justify-center lg:gap-6 p-2
                          grid grid-cols-4 gap-7"
          >
            <div className="lg:w-[80px] w-[50px] lg:h-[80px] h-[50px] mx-2  m-auto ">
              <img src={html} className="h-[100%]m-auto bg-transparent p-2" />
              <h1 className="text-center text-sm bg-transparent font-bold">
                HTML
              </h1>
            </div>

            <div className="lg:w-[80px] w-[50px] lg:h-[80px] h-[50px] mx-2  m-auto">
              <img src={css} className="h-[100%]m-auto bg-transparent p-2" />
              <h1 className="text-center text-sm bg-transparent font-bold">
                CSS
              </h1>
            </div>

            <div className="lg:w-[80px] w-[50px] lg:h-[80px] h-[50px] mx-2  m-auto">
              <img
                src={reactImage}
                className="h-[100%]m-auto bg-transparent p-2"
              />
              <h1 className="text-center text-sm bg-transparent font-bold">
                ReactJS
              </h1>
            </div>

            <div className="lg:w-[80px] w-[50px] lg:h-[80px] h-[50px] mx-2  m-auto">
              <img
                src={nextjs}
                className="h-[100%] m-auto bg-transparent p-2"
              />
              <h1 className="text-center text-sm bg-transparent font-bold">
                NextJS
              </h1>
            </div>

            <div className="lg:w-[80px] w-[50px] lg:h-[80px] h-[50px] mx-2  m-auto">
              <img
                src={tailwind}
                className="h-[100%] m-auto bg-transparent p-2"
              />
              <h1 className="text-center text-sm bg-transparent font-bold">
                Tailwind
              </h1>
            </div>
            <div className="lg:w-[80px] w-[50px] lg:h-[80px] h-[50px] mx-2  m-auto">
              <img
                src={bootstrap}
                className="h-[100%] m-auto bg-transparent p-2"
              />
              <h1 className="text-center text-sm bg-transparent font-bold">
                BootStrap
              </h1>
            </div>
          </div>
        </div>

        <div className="programming lg:mb-5 mb-10 m-auto p-4 py-7 rounded-3xl">
        <span className=" lg:w-[80%] lg:m-auto lg:text-center border-2 border-red-200 bg-green-300 text-black px-4 p-1 font-bold lg:rounded-3xl rounded-r-3xl">
            Backend & Database
          </span>

          <div
            className="lg:flex lg:justify-center lg:gap-6 p-2
                          grid grid-cols-4 gap-7"
          >
            {" "}
            <div className="lg:w-[80px] w-[50px] lg:h-[80px] h-[50px] mx-2  m-auto">
              <img
                src={nodejs}
                className="h-[100%] m-auto bg-transparent  rounded-xl p-2"
              />
              <h1 className="text-center text-sm bg-transparent font-bold">
                NodeJS
              </h1>
            </div>
            <div className="lg:w-[80px] w-[50px] lg:h-[80px] h-[50px] mx-2  m-auto">
              <img
                src={expressjs}
                className="h-[100%] m-auto bg-transparent p-3"
              />
              <h1 className="text-center text-sm bg-transparent font-bold">
                ExpressJS
              </h1>
            </div>
            <div className="lg:w-[80px] w-[50px] lg:h-[80px] h-[50px] mx-2  m-auto">
              <img
                src={postman}
                className="h-[100%] m-auto bg-transparent p-3"
              />
              <h1 className="text-center text-sm bg-transparent font-bold">
                Postman
              </h1>
            </div>
            <div className="lg:w-[80px] w-[50px] lg:h-[80px] h-[50px] mx-2  m-auto">
              <img
                src={mongoDb}
                className="h-[100%] m-auto bg-transparent p-2"
              />
              <h1 className="text-center text-sm bg-transparent font-bold">
                MongoDB
              </h1>
            </div>
            <div className="lg:w-[80px] w-[50px] lg:h-[80px] h-[50px] mx-2  m-auto">
              <img src={mysql} className="h-[100%] m-auto bg-transparent p-2" />
              <h1 className="text-center text-sm bg-transparent font-bold">
                MySQL
              </h1>
            </div>
            <div className="lg:w-[80px] w-[50px] lg:h-[80px] h-[50px] mx-2  m-auto">
              <img
                src={mariadb}
                className="h-[100%] m-auto bg-transparent p-2"
              />
              <h1 className="text-center text-sm bg-transparent font-bold">
                MariaDB
              </h1>
            </div>
            <div className="lg:w-[80px] w-[50px] lg:h-[80px] h-[50px] mx-2  m-auto">
              <img
                src={springboot}
                className="h-[100%] m-auto bg-transparent p-2"
              />
              <h1 className="text-center text-sm bg-transparent font-bold">
                SpringBoot
              </h1>
            </div>
          </div>
        </div>

        {/* <hr className="mt-3 lg:border-4 rounded-3xl border-green-200"/> */}
      </div>
    </div>
  );
};

export default Skills;
