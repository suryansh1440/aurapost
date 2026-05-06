import React, { useEffect, useRef } from 'react';

const FullScreenSplash = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    let animationFrameId;
    let t = 0;
    const size = 54;

    const drawSwirl = (canvas, size, t) => {
      const ctx = canvas.getContext('2d');
      const cx = size / 2, cy = size / 2;
      ctx.clearRect(0, 0, size, size);

      const r = size * 0.28;
      const trailCount = 3;
      const spokeW = 2.5;

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

      const cg = ctx.createRadialGradient(cx, cy, 0, cx, cy, 6);
      cg.addColorStop(0, 'rgba(255,255,255,0.95)');
      cg.addColorStop(0.4, 'rgba(180,175,240,0.7)');
      cg.addColorStop(1, 'rgba(45,203,150,0)');
      ctx.beginPath();
      ctx.arc(cx, cy, 6, 0, Math.PI * 2);
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
  }, []);

  return (
    <div className="fixed inset-0 z-[999] flex flex-col items-center justify-center bg-[#000000]">
      <div className="w-full max-w-[360px] h-[260px] bg-[#06060A] rounded-[20px] border border-[#1A1826] flex flex-col items-center justify-center gap-[24px] relative overflow-hidden">
        
        {/* Glow */}
        <div className="absolute w-[200px] h-[200px] rounded-full top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
             style={{ 
               background: 'radial-gradient(circle, rgba(127,119,221,.18) 0%, rgba(45,203,150,.08) 50%, transparent 70%)',
               animation: 'glowPulse 2.5s ease-in-out infinite' 
             }}>
        </div>

        {/* Canvas */}
        <canvas ref={canvasRef} width={54} height={54} className="w-[54px] h-[54px] relative" />

        {/* Text */}
        <div className="flex flex-col items-center gap-[6px] relative">
          <div className="font-sans text-[22px] font-medium tracking-[-0.02em] text-[#F0EEF8]">
            <span style={{ background: 'linear-gradient(90deg, #7F77DD, #2DCB96)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Aura</span>Post
          </div>
          <div className="font-sans text-[11px] text-[#4A4760] tracking-[0.1em] uppercase">
            Authenticating
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-[140px] h-[2px] bg-[#1A1826] rounded-[4px] overflow-hidden relative">
          <div className="absolute inset-0 rounded-[4px]"
               style={{ 
                 background: 'linear-gradient(90deg, #7F77DD, #2DCB96, #7F77DD)', 
                 backgroundSize: '300% 100%',
                 animation: 'barShift 1.8s ease-in-out infinite' 
               }}>
          </div>
        </div>

      </div>

      <style>{`
        @keyframes glowPulse {
          0%, 100% { opacity: 0.6; transform: translate(-50%, -50%) scale(1); }
          50% { opacity: 1; transform: translate(-50%, -50%) scale(1.15); }
        }
        @keyframes barShift {
          0% { background-position: 100% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>
    </div>
  );
};

export default FullScreenSplash;
