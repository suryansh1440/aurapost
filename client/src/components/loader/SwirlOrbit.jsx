import React, { useEffect, useRef } from 'react';

const SwirlOrbit = ({ size = 80 }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    let animationFrameId;
    let t = 0;

    const drawSwirl = (canvas, size, t) => {
      const ctx = canvas.getContext('2d');
      const cx = size / 2, cy = size / 2;
      ctx.clearRect(0, 0, size, size);

      const r = size * 0.3;
      const trailCount = 3;
      const spokeW = 3;

      for (let s = 0; s < trailCount; s++) {
        const offset = (s / trailCount) * Math.PI * 2;
        const steps = 48;
        for (let i = 0; i < steps; i++) {
          const frac = i / steps;
          const angle = offset + t * 3.5 + frac * Math.PI * 2;
          const spiralR = r * (0.3 + frac * 0.7);
          const x = cx + Math.cos(angle) * spiralR;
          const y = cy + Math.sin(angle) * spiralR;
          const alpha = frac * (s === 0 ? 0.9 : 0.5);
          const violet = [127, 119, 221];
          const teal = [45, 203, 150];
          const mix = frac;
          const rc = Math.round(violet[0] * (1 - mix) + teal[0] * mix);
          const gc = Math.round(violet[1] * (1 - mix) + teal[1] * mix);
          const bc = Math.round(violet[2] * (1 - mix) + teal[2] * mix);
          ctx.beginPath();
          ctx.arc(x, y, spokeW * frac, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${rc},${gc},${bc},${alpha})`;
          ctx.fill();
        }
      }

      const cg = ctx.createRadialGradient(cx, cy, 0, cx, cy, 8);
      cg.addColorStop(0, 'rgba(255,255,255,0.95)');
      cg.addColorStop(0.4, 'rgba(180,175,240,0.7)');
      cg.addColorStop(1, 'rgba(45,203,150,0)');
      ctx.beginPath();
      ctx.arc(cx, cy, 8, 0, Math.PI * 2);
      ctx.fillStyle = cg;
      ctx.fill();
    };

    const render = () => {
      t += 0.022;
      drawSwirl(canvas, size, t);
      animationFrameId = requestAnimationFrame(render);
    };
    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [size]);

  return (
    <div style={{ position: 'relative', width: size, height: size }}>
      <canvas 
        ref={canvasRef} 
        width={size} 
        height={size} 
        style={{ position: 'absolute', top: 0, left: 0, width: size, height: size }} 
      />
    </div>
  );
};

export default SwirlOrbit;
