import React, { useEffect, useRef } from 'react';

const MatrixBackground = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    // Ustaw rozmiar canvas
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Funkcja rysująca
    function draw() {
      ctx.fillStyle = 'black';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = 'green';
      ctx.font = '16px monospace';
      ctx.fillText('TEST', 100, 100);
    }

    // Uruchom natychmiast
    draw();
  }, []);

  return (
    <canvas 
      ref={canvasRef} 
      style={{ 
        position: 'fixed', 
        top: 0, 
        left: 0, 
        width: '100%', 
        height: '100%', 
        zIndex: -1,
        pointerEvents: 'none'
      }} 
    />
  );
};

export default MatrixBackground;