"use client";

import React, { useState, useEffect, useMemo, useCallback } from 'react';

interface HeroBackgroundProps {
  className?: string;
}

interface Particle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
}

export default function HeroBackground({ className }: HeroBackgroundProps) {
  const [particles, setParticles] = useState<Particle[]>([]);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [isMounted, setIsMounted] = useState(false);

  // Handle window resize
  const handleResize = useCallback(() => {
    setDimensions({
      width: window.innerWidth,
      height: window.innerHeight
    });
  }, []);

  // Initialize particles
  const initParticles = useCallback((width: number, height: number) => {
    const particleCount = Math.min(50, Math.floor((width * height) / 15000));
    const newParticles: Particle[] = [];

    for (let i = 0; i < particleCount; i++) {
      newParticles.push({
        id: i,
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        size: Math.random() * 2 + 1,
        opacity: Math.random() * 0.5 + 0.1
      });
    }

    setParticles(newParticles);
  }, []);

  // Animation loop for particles
  useEffect(() => {
    if (!isMounted || dimensions.width === 0) return;

    const animateParticles = () => {
      setParticles(prevParticles =>
        prevParticles.map(particle => {
          let newX = particle.x + particle.vx;
          let newY = particle.y + particle.vy;

          // Wrap around edges
          if (newX > dimensions.width) newX = 0;
          if (newX < 0) newX = dimensions.width;
          if (newY > dimensions.height) newY = 0;
          if (newY < 0) newY = dimensions.height;

          return {
            ...particle,
            x: newX,
            y: newY
          };
        })
      );
    };

    const interval = setInterval(animateParticles, 50);
    return () => clearInterval(interval);
  }, [dimensions, isMounted]);

  // Setup effect
  useEffect(() => {
    setIsMounted(true);
    handleResize();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [handleResize]);

  // Initialize particles when dimensions change
  useEffect(() => {
    if (dimensions.width > 0 && dimensions.height > 0) {
      initParticles(dimensions.width, dimensions.height);
    }
  }, [dimensions, initParticles]);

  const gradientOverlays = useMemo(() => [
    'bg-gradient-to-br from-blue-500/10 via-transparent to-purple-500/10',
    'bg-gradient-to-tl from-cyan-500/5 via-transparent to-pink-500/5',
    'bg-gradient-to-tr from-indigo-500/8 via-transparent to-emerald-500/8'
  ], []);

  if (!isMounted) {
    return (
      <div className={`fixed inset-0 -z-10 bg-gradient-to-r from-[#0A0C14] via-[#1A1F2C] to-[#0A0C14] ${className || ''}`} />
    );
  }

  return (
    <div className={`fixed inset-0 -z-10 overflow-hidden ${className || ''}`}>
      {/* Base gradient background */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#0A0C14] via-[#1A1F2C] to-[#0A0C14]" />

      {/* Secondary gradient layers for depth */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#1A1F2C]/30 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#0A0C14]/50 via-transparent to-[#0A0C14]/50" />

      {/* Animated gradient overlays */}
      {gradientOverlays.map((gradient, index) => (
        <div
          key={index}
          className={`absolute inset-0 ${gradient} animate-pulse`}
          style={{
            animationDelay: `${index * 2}s`,
            animationDuration: `${6 + index * 2}s`
          }}
        />
      ))}

      {/* Particles container */}
      <div className="absolute inset-0">
        {particles.map(particle => (
          <div
            key={particle.id}
            className="absolute rounded-full bg-gradient-to-r from-blue-400/60 to-purple-400/60 blur-[0.5px]"
            style={{
              left: `${particle.x}px`,
              top: `${particle.y}px`,
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              opacity: particle.opacity,
              transform: 'translate(-50%, -50%)'
            }}
          />
        ))}
      </div>

      {/* Subtle grid pattern overlay */}
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px'
        }}
      />

      {/* Radial gradient for center focus */}
      <div className="absolute inset-0 bg-gradient-radial from-transparent via-transparent to-[#0A0C14]/40" />

      {/* Top and bottom fade */}
      <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-[#0A0C14] to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#0A0C14] to-transparent" />
    </div>
  );
}
