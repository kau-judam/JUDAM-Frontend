import { useEffect, useState } from "react";
import statusBarImage from "figma:asset/4dcc3552c565ba4d7f8f3034cbcc0a537c1c9b6d.png";

export function StatusBar() {
  return (
    <div className="fixed top-0 left-0 right-0 z-50 h-[44px]">
      <img 
        src={statusBarImage} 
        alt="Status Bar" 
        className="w-full h-full object-cover"
      />
    </div>
  );
}