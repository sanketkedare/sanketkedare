import React from "react";
import "./Footer.scss";
import { LinkedInImage, githubImage } from "../images";

const Footer = () => {
  return (
    <div className="footer h-[20vh] m-auto bg-inherit flex justify-center items-center">
      <div className="bg-inherit">
      <p> All rights reserved &copy; 2024 Sanket Kedare</p>
      <p className="flex item-center justify-center lg:gap-5 gap-2">
        Connect with me:
        <a
          href="https://www.linkedin.com/in/sanket-kedare-5820401bb/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center"
        >
          <img src={LinkedInImage} className="w-[20px] mx-2" alt="linkedin" />
          LinkedIn
        </a>
        |
        <a
          href="https://github.com/sanketkedare"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center"
        >
          <img src={githubImage} className="w-[20px] mx-2" alt="git" />
          GitHub
        </a>
      </p>
      </div>
    </div>
  );
};

export default Footer;
