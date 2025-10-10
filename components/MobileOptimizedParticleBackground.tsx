"use client";

import React, { useEffect, useRef, useState, useCallback } from 'react';

interface MobileOptimizedParticleBackgroundProps {
  className?: string;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
  color: string;
}

export default function MobileOptimizedParticleBackground({ className }: MobileOptimizedParticleBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | undefined>(undefined);
  const particlesRef = useRef<Particle[]>([]);
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);

  // Detect device type
  useEffect(() => {
    const checkDevice = () => {
      const width = window.innerWidth;
      setIsMobile(width < 768);
      setIsTablet(width >= 768 && width < 1024);
    };

    checkDevice();
    window.addEventListener('resize', checkDevice);
    return () => window.removeEventListener('resize', checkDevice);
  }, []);

  // Initialize particles based on device type
  const initializeParticles = useCallback((canvas: HTMLCanvasElement) => {
    const particles: Particle[] = [];
    const particleCount = isMobile ? 30 : isTablet ? 50 : 80;
    
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * (isMobile ? 0.5 : isTablet ? 0.8 : 1),
        vy: (Math.random() - 0.5) * (isMobile ? 0.5 : isTablet ? 0.8 : 1),
        size: Math.random() * (isMobile ? 2 : isTablet ? 3 : 4) + 1,
        opacity: Math.random() * 0.5 + 0.1,
        color: Math.random() > 0.5 ? '#3b82f6' : '#8b5cf6'
      });
    }
    
    particlesRef.current = particles;
  }, [isMobile, isTablet]);

  // Animation loop
  const animate = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Update and draw particles
    particlesRef.current.forEach((particle, index) => {
      // Update position
      particle.x += particle.vx;
      particle.y += particle.vy;

      // Wrap around screen
      if (particle.x < 0) particle.x = canvas.width;
      if (particle.x > canvas.width) particle.x = 0;
      if (particle.y < 0) particle.y = canvas.height;
      if (particle.y > canvas.height) particle.y = 0;

      // Draw particle
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      ctx.fillStyle = `${particle.color}${Math.floor(particle.opacity * 255).toString(16).padStart(2, '0')}`;
      ctx.fill();

      // Draw connections (only on desktop for performance)
      if (!isMobile && !isTablet) {
        particlesRef.current.slice(index + 1).forEach(otherParticle => {
          const dx = particle.x - otherParticle.x;
          const dy = particle.y - otherParticle.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < 100) {
            ctx.beginPath();
            ctx.moveTo(particle.x, particle.y);
            ctx.lineTo(otherParticle.x, otherParticle.y);
            ctx.strokeStyle = `rgba(59, 130, 246, ${0.1 * (1 - distance / 100)})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        });
      }
    });

    animationRef.current = requestAnimationFrame(animate);
  }, [isMobile, isTablet]);

  // Setup canvas and start animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initializeParticles(canvas);
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Start animation
    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isMobile, isTablet, animate, initializeParticles]);

  // Reduce animation on mobile for battery saving
  useEffect(() => {
    if (isMobile) {
      // Reduce animation frame rate on mobile
      const interval = setInterval(() => {
        if (animationRef.current) {
          cancelAnimationFrame(animationRef.current);
        }
        animate();
      }, 1000 / 30); // 30 FPS instead of 60

      return () => clearInterval(interval);
    }
  }, [isMobile, animate]);

  return (
    <canvas
      ref={canvasRef}
      className={`fixed inset-0 pointer-events-none z-0 ${
        isMobile ? 'opacity-30' : isTablet ? 'opacity-40' : 'opacity-50'
      } ${className || ''}`}
      style={{
        background: 'transparent'
      }}
    />
  );
}
