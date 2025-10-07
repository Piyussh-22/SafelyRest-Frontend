import { useState, useEffect } from "react";
import { RotateCw } from "lucide-react";

const ProfileCard = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [flipped, setFlipped] = useState(false);

  const name = "Piyush Raj";
  const role = "Full Stack Developer";

  const skills = {
    Languages: ["JavaScript", "Java", "SQL"],
    Databases: ["MongoDB", "MySQL"],
    Frontend: ["React", "Tailwind CSS", "Redux"],
    Backend: ["Node.js", "Express.js"],
    Tools: ["Git", "GitHub", "Postman", "REST API"],
  };

  // Detect mobile/tablet
  useEffect(() => {
    const checkDevice = () => setIsMobile(window.innerWidth <= 1024);
    checkDevice();
    window.addEventListener("resize", checkDevice);
    return () => window.removeEventListener("resize", checkDevice);
  }, []);

  return (
    <div className="w-72 h-96 perspective relative">
      <div
        className={`relative w-full h-full transition-transform duration-500 transform-style preserve-3d ${
          isMobile && flipped ? "rotate-y-180" : "hover:rotate-y-180"
        } 
        ${
          !isMobile ? "hover:scale-105" : flipped ? "scale-105" : "scale-100"
        } transition-transform duration-300`}
      >
        {/* Front Side */}
        <div
          className={`absolute w-full h-full backface-hidden rounded-xl overflow-hidden shadow-lg transition-all duration-300 ${
            isMobile && flipped ? "filter blur-sm" : ""
          }`}
        >
          <img
            src="/piyush.webp"
            alt={name}
            className="w-full h-full object-cover"
          />
          {isMobile && !flipped && (
            <button
              onClick={() => setFlipped(true)}
              aria-label="Flip card"
              className="absolute top-2 right-2 bg-black/60 dark:bg-gray-800 text-white p-1 rounded hover:bg-black/70 shadow-lg animate-pulse"
            >
              <RotateCw size={16} />
            </button>
          )}
        </div>

        {/* Back Side */}
        <div className="absolute w-full h-full backface-hidden rounded-xl bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 p-4 rotate-y-180 flex flex-col justify-center items-center shadow-lg overflow-y-auto">
          {isMobile && flipped && (
            <button
              onClick={() => setFlipped(false)}
              aria-label="Flip card back"
              className="absolute top-2 right-2 bg-black/60 dark:bg-gray-800 text-white p-1 rounded hover:bg-black/70 shadow-lg animate-pulse"
            >
              <RotateCw size={16} />
            </button>
          )}

          <h2 className="text-xl font-bold mb-2">{name}</h2>
          <p className="text-sm mb-2">{role}</p>

          <div className="space-y-2 text-center">
            {Object.entries(skills).map(([category, items]) => (
              <div key={category}>
                <h3 className="text-sm font-semibold">{category}</h3>
                <div className="flex flex-wrap justify-center gap-1 mt-1">
                  {items.map((item) => (
                    <span
                      key={item}
                      className="text-xs px-2 py-1 rounded-full bg-blue-200 dark:bg-blue-700 text-blue-800 dark:text-blue-200"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        .perspective { perspective: 1000px; }
        .backface-hidden { backface-visibility: hidden; -webkit-backface-visibility: hidden; }
        .transform-style { transform-style: preserve-3d; }
        .rotate-y-180 { transform: rotateY(180deg); }
      `}</style>
    </div>
  );
};

export default ProfileCard;
