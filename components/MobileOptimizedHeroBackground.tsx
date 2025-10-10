"use client";

import React, { useState, useEffect, useMemo } from 'react';

interface MobileOptimizedHeroBackgroundProps {
  className?: string;
}

export default function MobileOptimizedHeroBackground({ className }: MobileOptimizedHeroBackgroundProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
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

  // Optimized images for different device types
  const backgroundImages = useMemo(() => {
    const mobileImages = [
      {
        url: "https://images.unsplash.com/photo-1639322537228-fefdecd107f2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
        description: "Abstract blockchain network",
        filter: "brightness(0.35) contrast(1.2) saturate(0.9) hue-rotate(10deg)"
      },
      {
        url: "https://images.unsplash.com/photo-1620283474009-31272191111d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
        description: "Digital currency concept",
        filter: "brightness(0.28) contrast(1.3) saturate(0.8) hue-rotate(20deg)"
      }
    ];

    const tabletImages = [
      {
        url: "https://images.unsplash.com/photo-1593508512951-e72292807861?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80",
        description: "Data visualization network",
        filter: "brightness(0.3) contrast(1.1) saturate(0.7) hue-rotate(30deg)"
      },
      {
        url: "https://images.unsplash.com/photo-1579567761406-46369d97d60e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80",
        description: "Blockchain visualization",
        filter: "brightness(0.28) contrast(1.2) saturate(0.8) hue-rotate(5deg)"
      }
    ];

    const desktopImages = [
      {
        url: "https://images.unsplash.com/photo-1639322537228-fefdecd107f2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1920&q=80",
        description: "Abstract blockchain network",
        filter: "brightness(0.35) contrast(1.2) saturate(0.9) hue-rotate(10deg)"
      },
      {
        url: "https://images.unsplash.com/photo-1620283474009-31272191111d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1920&q=80",
        description: "Digital currency concept",
        filter: "brightness(0.28) contrast(1.3) saturate(0.8) hue-rotate(20deg)"
      },
      {
        url: "https://images.unsplash.com/photo-1593508512951-e72292807861?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1920&q=80",
        description: "Data visualization network",
        filter: "brightness(0.3) contrast(1.1) saturate(0.7) hue-rotate(30deg)"
      },
      {
        url: "https://images.unsplash.com/photo-1579567761406-46369d97d60e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1920&q=80",
        description: "Blockchain visualization",
        filter: "brightness(0.28) contrast(1.2) saturate(0.8) hue-rotate(5deg)"
      }
    ];

    if (isMobile) return mobileImages;
    if (isTablet) return tabletImages;
    return desktopImages;
  }, [isMobile, isTablet]);

  useEffect(() => {
    const imagePromises = backgroundImages.map((image) => {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(image.url);
        img.onerror = () => reject(new Error(`Failed to load ${image.url}`));
        img.src = image.url;
      });
    });

    Promise.all(imagePromises)
      .then(() => {
        setIsLoading(false);
      })
      .catch((error) => {
        console.warn('Some background images failed to load:', error);
        setIsLoading(false);
      });

    // Different cycle times based on device type
    const cycleTime = isMobile ? 20000 : isTablet ? 35000 : 45000;
    
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % backgroundImages.length);
    }, cycleTime);

    return () => clearInterval(interval);
  }, [backgroundImages, isMobile, isTablet]);

  const currentImage = backgroundImages[currentImageIndex];

  return (
    <div className={`absolute inset-0 ${className}`}>
      {/* Base Gradient - Optimized for mobile */}
      <div className={`absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900 ${
        isMobile ? 'opacity-95' : 'opacity-90'
      }`} />

      {/* Dynamic Image Layer */}
      {!isLoading && currentImage && (
        <div
          key={currentImage.url}
          className={`absolute inset-0 bg-cover bg-center transition-opacity duration-3000 ease-in-out ${
            isMobile ? 'opacity-25' : isTablet ? 'opacity-28' : 'opacity-30'
          }`}
          style={{
            backgroundImage: `url(${currentImage.url})`,
            filter: currentImage.filter,
            backgroundPosition: isMobile ? 'center center' : 'center top',
          }}
        />
      )}

      {/* Mesh Gradient Overlay - Simplified for mobile */}
      {!isMobile && (
        <div className={`absolute inset-0 ${isTablet ? 'opacity-30' : 'opacity-40'}`}>
          <div className={`absolute bg-blue-500 rounded-full mix-blend-multiply filter blur-xl ${
            isTablet ? 'w-64 h-64 opacity-25' : 'w-96 h-96 opacity-30'
          } animate-blob top-1/4 left-1/4`} style={{ animationDelay: '0s' }}></div>
          <div className={`absolute bg-purple-500 rounded-full mix-blend-multiply filter blur-xl ${
            isTablet ? 'w-64 h-64 opacity-25' : 'w-96 h-96 opacity-30'
          } animate-blob top-1/2 right-1/4`} style={{ animationDelay: '5s' }}></div>
          <div className={`absolute bg-cyan-500 rounded-full mix-blend-multiply filter blur-xl ${
            isTablet ? 'w-64 h-64 opacity-25' : 'w-96 h-96 opacity-30'
          } animate-blob bottom-1/4 left-1/2`} style={{ animationDelay: '10s' }}></div>
        </div>
      )}

      {/* Grid Overlay - Simplified for mobile */}
      <div className={`absolute inset-0 ${
        isMobile 
          ? 'bg-grid-small-white/[0.05]' 
          : isTablet 
          ? 'bg-grid-small-white/[0.08]' 
          : 'bg-grid-small-white/[0.1]'
      } [mask-image:linear-gradient(to_bottom,white,transparent)]`} />

      {/* Mobile-specific gradient overlay for better text readability */}
      {isMobile && (
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-slate-900/60" />
      )}

      {/* Loading indicator for mobile */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
        </div>
      )}
    </div>
  );
}
