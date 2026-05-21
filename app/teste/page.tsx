'use client';

import React, { useState } from 'react';

export default function TestPage() {
  const [activeSquare, setActiveSquare] = useState<number | null>(null);

  // Generates 8 squares
  const squares = Array.from({ length: 8 });

  return (
    <div style={{
      minHeight: '100vh',
      width: '100vw',
      backgroundColor: '#000000',
      color: '#ffffff',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'var(--font-outfit), sans-serif',
      padding: '2rem',
      boxSizing: 'border-box',
      overflow: 'hidden',
      position: 'relative'
    }}>
      {/* Background Star effect */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.04) 1px, transparent 1px)',
        backgroundSize: '24px 24px',
        pointerEvents: 'none'
      }} />

      <header style={{ textAlign: 'center', marginBottom: '3rem', zIndex: 1 }}>
        <h1 style={{
          fontSize: '2.2rem',
          fontWeight: 700,
          letterSpacing: '-1px',
          marginBottom: '0.5rem',
          textTransform: 'uppercase'
        }}>
          Next.js Test
        </h1>
        <p style={{
          fontSize: '0.95rem',
          color: 'rgba(255, 255, 255, 0.5)',
          fontFamily: 'var(--font-inter), sans-serif'
        }}>
          Black screen with interactive white squares. Click on any box to animate!
        </p>
      </header>

      {/* Grid of interactive white squares */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '1.5rem',
        width: '100%',
        maxWidth: '500px',
        zIndex: 1
      }}>
        {squares.map((_, index) => {
          const isActive = activeSquare === index;
          return (
            <div
              key={index}
              onClick={() => setActiveSquare(isActive ? null : index)}
              style={{
                aspectRatio: '1',
                backgroundColor: isActive ? '#ffffff' : 'rgba(255, 255, 255, 0.95)',
                borderRadius: isActive ? '20px' : '6px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.5rem',
                color: '#000000',
                transition: 'all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
                transform: isActive ? 'scale(1.15) rotate(45deg)' : 'scale(1)',
                boxShadow: isActive 
                  ? '0 0 30px rgba(255, 255, 255, 0.8), 0 0 60px rgba(255, 255, 255, 0.4)' 
                  : '0 4px 10px rgba(0, 0, 0, 0.5)',
              }}
            >
              <span style={{
                transform: isActive ? 'rotate(-45deg)' : 'none',
                transition: 'transform 0.4s ease',
                opacity: isActive ? 1 : 0.2,
                fontWeight: 700
              }}>
                ✦
              </span>
            </div>
          );
        })}
      </div>

      <footer style={{ marginTop: '4rem', zIndex: 1 }}>
        <a 
          href="/" 
          style={{
            color: 'rgba(255, 255, 255, 0.6)',
            textDecoration: 'none',
            fontSize: '0.85rem',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            padding: '0.5rem 1.2rem',
            borderRadius: '20px',
            backgroundColor: 'rgba(255, 255, 255, 0.02)',
            transition: 'all 0.2s ease',
            fontFamily: 'var(--font-inter), sans-serif'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = '#ffffff';
            e.currentTarget.style.color = '#ffffff';
            e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.08)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)';
            e.currentTarget.style.color = 'rgba(255, 255, 255, 0.6)';
            e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.02)';
          }}
        >
          ← Voltar para Home
        </a>
      </footer>
    </div>
  );
}
