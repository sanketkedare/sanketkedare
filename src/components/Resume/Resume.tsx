import DownloadResumeButton from './DownloadResumeButton';

const resumeInfo = `Results-driven professional with a proven track record in project management and strategic planning. 
Skilled in team leadership, communication, and problem-solving. 
Recognized for achieving operational efficiency and exceeding targets. 
Adaptable and detail-oriented, with a commitment to delivering high-quality results. 
Seeking to contribute expertise in a dynamic and growth-oriented environment.`;

export default function Resume() {
  return (
    <section id="resume" className="relative w-full lg:w-[80%] mx-auto px-6 lg:px-0 min-h-screen flex items-center justify-center overflow-hidden py-24 bg-slate-50 dark:bg-[#050511]">
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-64 h-64 bg-cyan-600/5 rounded-full blur-[100px] pointer-events-none -z-10" />
      <div className="absolute bottom-0 right-0 w-64 h-64 bg-amber-600/5 rounded-full blur-[100px] pointer-events-none -z-10" />

      <div className="relative w-full mx-auto bg-white dark:bg-[#0a0a1a] border border-slate-200 dark:border-white/10 rounded-3xl p-6 md:p-8 shadow-lg dark:shadow-2xl flex flex-col items-center gap-6 text-center overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10">
          <h2 className="text-[1.75rem] md:text-4xl lg:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-slate-900 to-slate-500 dark:from-white dark:to-slate-400 mb-4 leading-tight tracking-tight md:tracking-normal">
            Ready to build <br/> something <span className="text-cyan-600 dark:text-cyan-400">great?</span>
          </h2>
          <p className="text-xs md:text-sm text-slate-600 dark:text-slate-400 leading-relaxed max-w-xl mx-auto opacity-80">
            {resumeInfo}
          </p>
        </div>

        <DownloadResumeButton />

      </div>
    </section>
  );
}
