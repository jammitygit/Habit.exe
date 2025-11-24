import React from 'react';

const CRTOverlay: React.FC = () => {
  return (
    <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden h-full w-full">
      {/* Subtle Scanline Grid */}
      <div 
        className="absolute inset-0 w-full h-full opacity-15"
        style={{
          backgroundImage: `
            linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.4) 50%),
            linear-gradient(90deg, rgba(255, 0, 0, 0.06), rgba(0, 255, 0, 0.02), rgba(0, 0, 255, 0.06))
          `,
          backgroundSize: '100% 3px, 4px 100%',
        }}
      />
      
      {/* Screen Curvature & Vignette Simulation 
          Uses a heavy inset shadow and radial gradient to simulate the curved glass of a CRT 
      */}
      <div 
        className="absolute inset-0 w-full h-full"
        style={{
          background: 'radial-gradient(circle at center, transparent 50%, rgba(0,0,0,0.4) 90%, rgba(0,0,0,0.8) 100%)',
          boxShadow: 'inset 0 0 80px rgba(0,0,0,0.5)', 
        }}
      />

      {/* Subtle Phosphor Flicker 
          Fixed: Removed bg-white and opacity utility conflict which caused full white flashing.
          Using rgba with very low alpha (0.002) reduces intensity to ~10% of the original design intent.
      */}
      <div 
        className="absolute inset-0 w-full h-full animate-pulse pointer-events-none mix-blend-overlay"
        style={{ backgroundColor: 'rgba(255, 255, 255, 0.002)' }}
      />
    </div>
  );
};

export default CRTOverlay;