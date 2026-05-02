import bgImage from "figma:asset/5923f7b494ad282b1ed43b17230bf4627841b458.png";

export function MobileHomeIndicator() {
  return (
    <div className="fixed bottom-0 left-0 right-0 h-8 z-50 overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src={bgImage}
          alt=""
          className="w-full h-full object-cover opacity-40"
          style={{
            objectPosition: "center 80%",
          }}
        />
      </div>
      
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-white/80 to-white/60 backdrop-blur-sm" />
      
      {/* Home Indicator Bar */}
      <div className="relative h-full flex items-center justify-center">
        <div className="w-36 h-1.5 bg-gray-800/30 rounded-full" />
      </div>
    </div>
  );
}