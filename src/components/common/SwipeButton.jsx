import React, { useState, useEffect, useRef } from 'react';
import { ChevronRight } from 'lucide-react';

const SwipeButton = ({ onConfirm, label = 'Deslizar para confirmar', color = '#5DCA68' }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [currentX, setCurrentX] = useState(0);
  const [confirmed, setConfirmed] = useState(false);
  const containerRef = useRef(null);
  const sliderWidth = containerRef.current ? containerRef.current.offsetWidth - 56 : 250; // 56 is button width

  const handleStart = (clientX) => {
    if (confirmed) return;
    setIsDragging(true);
    setStartX(clientX);
  };

  const handleMove = (clientX) => {
    if (!isDragging || confirmed) return;
    const diff = clientX - startX;
    const newX = Math.max(0, Math.min(diff, sliderWidth));
    setCurrentX(newX);
  };

  const handleEnd = () => {
    if (!isDragging || confirmed) return;
    setIsDragging(false);
    if (currentX >= sliderWidth * 0.9) {
      setConfirmed(true);
      setCurrentX(sliderWidth);
      onConfirm();
    } else {
      setCurrentX(0);
    }
  };

  // Mouse events
  const onMouseDown = (e) => handleStart(e.clientX);
  const onMouseMove = (e) => handleMove(e.clientX);
  const onMouseUp = handleEnd;
  const onMouseLeave = handleEnd;

  // Touch events
  const onTouchStart = (e) => handleStart(e.touches[0].clientX);
  const onTouchMove = (e) => handleMove(e.touches[0].clientX);
  const onTouchEnd = handleEnd;

  return (
    <div 
      ref={containerRef}
      className={`relative h-14 rounded-full overflow-hidden select-none transition-colors duration-300 ${confirmed ? 'bg-green-500' : 'bg-slate-200'}`}
    >
      {/* Background Text */}
      <div className={`absolute inset-0 flex items-center justify-center text-sm font-bold uppercase tracking-wider transition-opacity duration-300 ${confirmed ? 'text-white opacity-100' : 'text-slate-400 opacity-100'} ${isDragging ? 'opacity-50' : ''}`}>
        {confirmed ? '¡Confirmado!' : label}
      </div>

      {/* Slider Button */}
      <div
        className="absolute top-1 bottom-1 w-12 bg-white rounded-full shadow-md flex items-center justify-center cursor-grab active:cursor-grabbing z-10"
        style={{ left: 4, transform: `translateX(${currentX}px)`, transition: isDragging ? 'none' : 'transform 0.3s ease' }}
        onMouseDown={onMouseDown}
        onTouchStart={onTouchStart}
      >
        {confirmed ? (
           <div className="w-3 h-3 bg-green-500 rounded-full"></div>
        ) : (
           <ChevronRight size={24} className="text-slate-400" />
        )}
      </div>

      {/* Fill Overlay */}
      <div 
        className="absolute top-0 bottom-0 left-0 bg-green-500 opacity-20 pointer-events-none"
        style={{ width: currentX + 28 }} // + half button width
      ></div>
      
      {/* Global listeners for drag outside */}
      {isDragging && (
        <div 
            className="fixed inset-0 z-50 cursor-grabbing"
            onMouseMove={onMouseMove}
            onMouseUp={onMouseUp}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
        ></div>
      )}
    </div>
  );
};

export default SwipeButton;
