import React from 'react';

const DriverRadar = () => {
    return (
        <div className="relative flex items-center justify-center w-40 h-40 bg-slate-900 rounded-full shadow-[inset_0_0_20px_rgba(0,0,0,0.5)] border border-slate-700 overflow-hidden">
            {/* Radar Grid Background */}
            <div className="absolute inset-0 opacity-30" 
                style={{ 
                    backgroundImage: 'radial-gradient(circle, #4c8479 1px, transparent 1px)', 
                    backgroundSize: '20px 20px' 
                }} 
            />
            
            {/* Concentric Rings */}
            <div className="absolute inset-0 border border-[#4c8479]/20 rounded-full" />
            <div className="absolute inset-4 border border-[#4c8479]/20 rounded-full" />
            <div className="absolute inset-8 border border-[#4c8479]/20 rounded-full" />

            {/* Pulsing Circles */}
            <div className="absolute w-full h-full bg-[#4c8479]/5 rounded-full animate-ping" />
            <div className="absolute w-2/3 h-2/3 bg-[#4c8479]/10 rounded-full animate-ping delay-75" />
            
            {/* Center Dot */}
            <div className="relative z-10 w-3 h-3 bg-[#4c8479] rounded-full shadow-[0_0_10px_#4c8479] animate-pulse" />
            
            {/* Scanning Line (Radar Sweep) */}
            <div className="absolute inset-0 animate-[spin_3s_linear_infinite]">
                <div className="w-1/2 h-1/2 bg-gradient-to-l from-[#4c8479]/40 to-transparent transform translate-x-full translate-y-full origin-top-left rounded-tl-full" />
            </div>
        </div>
    );
};

export default DriverRadar;
