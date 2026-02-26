import React, { useEffect, useState } from 'react';
import { useNavigate } from '@tanstack/react-router';

export default function SplashScreen() {
  const navigate = useNavigate();
  const [fadingOut, setFadingOut] = useState(false);

  useEffect(() => {
    const fadeTimer = setTimeout(() => setFadingOut(true), 2000);
    const navTimer = setTimeout(() => navigate({ to: '/home' }), 2600);
    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(navTimer);
    };
  }, [navigate]);

  return (
    <div
      className={`fixed inset-0 flex flex-col items-center justify-center z-[100] transition-opacity duration-600 ${
        fadingOut ? 'opacity-0' : 'opacity-100'
      }`}
      style={{
        background: 'linear-gradient(160deg, oklch(0.28 0.1 22) 0%, oklch(0.18 0.06 22) 60%, oklch(0.14 0.04 30) 100%)',
      }}
    >
      {/* Decorative ring */}
      <div className="relative mb-6 splash-fade-in">
        <div className="absolute inset-0 rounded-full border-4 border-gold/30 scale-110 animate-pulse" />
        <img
          src="/assets/generated/swad-logo.dim_256x256.png"
          alt="The Swad Restaurant"
          className="w-32 h-32 rounded-full object-cover border-4 border-gold/60 shadow-2xl"
        />
      </div>

      <div className="text-center tagline-slide-up">
        <h1 className="font-display text-4xl font-bold text-gold mb-2 tracking-wide">
          The Swad
        </h1>
        <p className="font-display text-xl text-cream/80 mb-1">Restaurant</p>
        <div className="ornament-divider w-48 mx-auto my-3">
          <span className="text-gold text-lg">✦</span>
        </div>
        <p className="font-body text-cream/70 text-sm tracking-widest uppercase">
          Experience the True Taste of Swad
        </p>
      </div>

      {/* Loading dots */}
      <div className="flex gap-2 mt-10">
        {[0, 1, 2].map(i => (
          <div
            key={i}
            className="w-2 h-2 rounded-full bg-gold/60 animate-bounce"
            style={{ animationDelay: `${i * 0.2}s` }}
          />
        ))}
      </div>
    </div>
  );
}
