import React from "react";
import "./Footer.scss";
import { LinkedInImage, githubImage } from "../images";

const Footer = () => {
  return (
    <div className="footer my-4">
      <p> All rights reserved &copy; 2024 Sanket Kedare</p>
      <p className="flex item-center justify-center lg:gap-5 gap-2">
        Connect with me:
        <a
          href="https://www.linkedin.com/in/yourname"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center"
        >
          <img src={LinkedInImage} className="w-[20px] mx-2" alt="linkedin" />
          LinkedIn
        </a>
        |
        <a
          href="https://github.com/yourusername"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center"
        >
          <img src={githubImage} className="w-[20px] mx-2" alt="git" />
          GitHub
        </a>
      </p>
    </div>
  );
};

export default Footer;
