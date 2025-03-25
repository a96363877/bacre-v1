const Hero = () => {
  return (
    <div className="bg-gradient-to-r from-[#146394] to-[#1a7ab8] h-[40rem] text-white p-20 relative overflow-hidden">
      <img
        src="/right-shapes.png"
        alt="decorative shapes"
        className="absolute right-20 top-40 w-auto h-auto object-contain opacity-20 z-0"
      />

      <img
        src="/left-shapes.png"
        alt="decorative shapes"
        className="absolute left-20 top-40 w-auto h-auto  object-contain opacity-70 z-0"
      />

      <div className="container mx-auto px-6 h-full flex flex-col justify-center items-center text-center relative z-10">
        <div className="space-y-6">
          <h1 className="text-6xl font-extrabold mb-6 tracking-wide leading-tight drop-shadow-lg animate-fadeIn">
            قارن ,أمن ,استلم وثيقتك
          </h1>
          <p className="text-2xl mb-8 font-light leading-relaxed opacity-90 max-w-3xl mx-auto">
            مكان واحد وفّر عليك البحث بين أكثر من 20 شركة تأمين!
          </p>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 w-full overflow-hidden">
        <svg
          viewBox="0 0 1440 320"
          className="w-full h-32 text-white"
          preserveAspectRatio="none"
        >
          <path
            fill="currentColor"
            d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,112C672,96,768,96,864,112C960,128,1056,160,1152,160C1248,160,1344,128,1392,112L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
          />
        </svg>
      </div>
    </div>
  );
};

export default Hero;
