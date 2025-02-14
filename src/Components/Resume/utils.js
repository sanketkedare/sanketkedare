const RESUME_PDF = "/Sanket_Kedare_WD_AlmaBetter.pdf";

export const downloadResumeUrl = () => {
  const aTag = document.createElement("a");
  aTag.href = RESUME_PDF;
  aTag.setAttribute("download", "Sanket_Kedare_WD_AlmaBetter");
  document.body.appendChild(aTag);
  aTag.click();
  aTag.remove();
};

export const resumeInfo = `Results-driven professional with a proven track record in project
              management and strategic planning. Skilled in team leadership,
              communication, and problem-solving. Recognized for achieving
              operational efficiency and exceeding targets. Adaptable and
              detail-oriented, with a commitment to delivering high-quality
              results. Seeking to contribute expertise in a dynamic and
              growth-oriented environment.`;
