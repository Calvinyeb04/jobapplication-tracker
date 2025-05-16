'use client';

import { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface Particle {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  color: string;
  alpha: number;
  blinking: boolean;
  blinkSpeed: number;
}

export function AnimatedBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particles = useRef<Particle[]>([]);
  const animationFrameId = useRef<number | undefined>(undefined);
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initParticles();
    };
    
    const initParticles = () => {
      particles.current = [];
      // More particles for a denser star field
      const numParticles = Math.floor(window.innerWidth * window.innerHeight / 8000);
      
      // Star colors
      const colors = [
        'rgba(255, 255, 255, 0.8)', // Bright white
        'rgba(155, 176, 255, 0.7)', // Blue-ish
        'rgba(255, 211, 218, 0.7)', // Pink-ish
        'rgba(222, 245, 229, 0.7)', // Cyan-ish
        'rgba(255, 238, 173, 0.7)', // Yellow-ish
      ];
      
      for (let i = 0; i < numParticles; i++) {
        const size = Math.random() < 0.1 
          ? Math.random() * 2 + 1.5 // Some slightly larger stars
          : Math.random() * 1 + 0.5; // Most stars are tiny
          
        particles.current.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size,
          speedX: 0, // Stars don't move horizontally
          speedY: Math.random() * 0.05, // Very slow vertical drift
          color: colors[Math.floor(Math.random() * colors.length)],
          alpha: Math.random() * 0.8 + 0.2, // Random brightness
          blinking: Math.random() < 0.3, // Only some stars blink
          blinkSpeed: Math.random() * 0.02 + 0.005, // Random blink speed
        });
      }
    };
    
    const drawParticles = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Add a very subtle cosmic background gradient
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      gradient.addColorStop(0, 'rgba(10, 10, 50, 0.03)'); // Very dark blue with low opacity
      gradient.addColorStop(0.5, 'rgba(40, 10, 60, 0.03)'); // Dark purple with low opacity
      gradient.addColorStop(1, 'rgba(10, 30, 70, 0.03)'); // Dark blue with low opacity
      
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      particles.current.forEach((particle) => {
        // Update alpha for blinking stars
        if (particle.blinking) {
          particle.alpha += particle.blinkSpeed;
          if (particle.alpha > 0.9 || particle.alpha < 0.3) {
            particle.blinkSpeed = -particle.blinkSpeed;
          }
        }
        
        // Draw the star
        ctx.save();
        ctx.globalAlpha = particle.alpha;
        ctx.fillStyle = particle.color;
        
        // Draw a more realistic star (circle with glow)
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fill();
        
        // Add a subtle glow for larger stars
        if (particle.size > 1.2) {
          const glow = ctx.createRadialGradient(
            particle.x, particle.y, 0,
            particle.x, particle.y, particle.size * 3
          );
          glow.addColorStop(0, particle.color);
          glow.addColorStop(1, 'rgba(0,0,0,0)');
          
          ctx.globalAlpha = particle.alpha * 0.3;
          ctx.fillStyle = glow;
          ctx.beginPath();
          ctx.arc(particle.x, particle.y, particle.size * 3, 0, Math.PI * 2);
          ctx.fill();
        }
        
        ctx.restore();
        
        // Update position (very slow drift)
        particle.y += particle.speedY;
        
        // Wrap around the screen
        if (particle.y > canvas.height) {
          particle.y = 0;
          particle.x = Math.random() * canvas.width;
        }
      });
      
      animationFrameId.current = requestAnimationFrame(drawParticles);
    };
    
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
    drawParticles();
    
    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [mounted]);
  
  if (!mounted) return null;
  
  return (
    <motion.div 
      className="fixed inset-0 -z-10 overflow-hidden" 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.5 }}
    >
      <canvas 
        ref={canvasRef} 
        className="absolute inset-0"
      />
      
      {/* Subtle cosmic gradients that slowly move */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/5 via-transparent to-purple-900/5 animate-gradient-shift" />
      <div className="absolute inset-0 bg-gradient-to-tr from-purple-900/5 via-transparent to-blue-900/5 animate-gradient-shift-reverse" />
      
      {/* Add a very subtle noise texture */}
      <div className="absolute inset-0 bg-noise opacity-20" />
    </motion.div>
  );
} 