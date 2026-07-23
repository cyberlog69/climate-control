import React, { useEffect, useRef } from "react";

export default function WeatherParticles({ weatherCode, isDay }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let animationFrameId;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    // Particle count and properties based on weather condition
    const particles = [];
    const isRain = [51, 53, 55, 61, 63, 65, 80, 81, 82, 95, 96, 99].includes(weatherCode);
    const isSnow = [71, 73, 75, 85, 86].includes(weatherCode);
    const particleCount = isRain ? 120 : isSnow ? 80 : 45;

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: isSnow ? Math.random() * 3 + 1 : Math.random() * 1.5 + 0.5,
        length: isRain ? Math.random() * 15 + 10 : 0,
        speedY: isRain ? Math.random() * 12 + 8 : isSnow ? Math.random() * 1.5 + 0.5 : Math.random() * 0.4 + 0.1,
        speedX: isRain ? Math.random() * 1 - 0.5 : isSnow ? Math.random() * 1 - 0.5 : Math.random() * 0.2 - 0.1,
        opacity: Math.random() * 0.5 + 0.2
      });
    }

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      particles.forEach((p) => {
        ctx.beginPath();
        if (isRain) {
          ctx.strokeStyle = `rgba(56, 189, 248, ${p.opacity})`;
          ctx.lineWidth = p.radius;
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p.x + p.speedX * 2, p.y + p.length);
          ctx.stroke();
        } else if (isSnow) {
          ctx.fillStyle = `rgba(255, 255, 255, ${p.opacity})`;
          ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
          ctx.fill();
        } else {
          // Floating atmospheric climate dust / aura particle
          ctx.fillStyle = `rgba(6, 182, 212, ${p.opacity * 0.6})`;
          ctx.arc(p.x, p.y, p.radius * 1.5, 0, Math.PI * 2);
          ctx.fill();
        }

        // Move particle
        p.y += p.speedY;
        p.x += p.speedX;

        // Reset if out of bounds
        if (p.y > height) {
          p.y = -20;
          p.x = Math.random() * width;
        }
        if (p.x > width) p.x = 0;
        if (p.x < 0) p.x = width;
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [weatherCode, isDay]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        pointerEvents: "none",
        zIndex: 0,
        opacity: 0.65
      }}
    />
  );
}
