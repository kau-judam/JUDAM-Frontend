import { Battery, Signal, Wifi } from "lucide-react";
import { useEffect, useState } from "react";
import bgImage from "figma:asset/5923f7b494ad282b1ed43b17230bf4627841b458.png";

export function MobileStatusBar() {
  const [currentTime, setCurrentTime] = useState("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = now.getHours().toString().padStart(2, "0");
      const minutes = now.getMinutes().toString().padStart(2, "0");
      setCurrentTime(`${hours}:${minutes}`);
    };

    updateTime();
    const interval = setInterval(updateTime, 60000); // 1분마다 업데이트

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed top-0 left-0 right-0 h-11 z-50 overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src={bgImage}
          alt=""
          className="w-full h-full object-cover opacity-40"
          style={{
            objectPosition: "center 20%",
          }}
        />
      </div>
      
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/80 to-white/60 backdrop-blur-sm" />
      
      {/* Content */}
      <div className="relative h-full px-6 flex items-center justify-between text-sm">
        {/* Left side - Time */}
        <div className="flex items-center font-semibold text-gray-800">
          <span>{currentTime}</span>
        </div>

        {/* Right side - Status Icons */}
        <div className="flex items-center gap-1.5 text-gray-800">
          <Signal className="w-4 h-4" />
          <Wifi className="w-4 h-4" />
          <Battery className="w-4 h-4" />
        </div>
      </div>
    </div>
  );
}