import React, { forwardRef, useState, useEffect } from 'react';
import HTMLFlipBook from 'react-pageflip';
import { X } from 'lucide-react';
import { STICKER_ASSETS } from '../utils/stickers';

const Page = forwardRef(({ page, index, bookTheme }, ref) => {
  // Determine grid CSS based on layout
  let gridStyle = { width: '100%', height: '100%', position: 'relative', background: bookTheme ? bookTheme.bgColor : 'white' };
  const isPolaroid = page.layout === 'polaroid';
  let containerClassName = '';
  
  if (page.layout === 'magazine-cover') {
    gridStyle = { ...gridStyle, padding: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' };
  } else if (page.layout === 'cover') {
    gridStyle = { ...gridStyle, padding: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' };
  } else if (page.layout === 'city-pop-cover') {
    gridStyle = { ...gridStyle, padding: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(to bottom, #7dd3fc 0%, #bae6fd 60%, #e0f2fe 100%)' };
    containerClassName = 'city-pop-bg';
  } else if (page.layout === 'y2k-sticker-cover') {
    gridStyle = { ...gridStyle, padding: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' };
    containerClassName = 'y2k-checkered-bg';
  } else if (page.layout === 'retro-groovy-cover') {
    gridStyle = { ...gridStyle, padding: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #ff7e5f 0%, #feb47b 50%, #ffe066 100%)' };
    containerClassName = 'groovy-waves-bg';
  } else if (page.layout === 'comic-pop-cover') {
    gridStyle = { ...gridStyle, padding: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' };
    containerClassName = 'comic-pop-bg';
  } else if (isPolaroid || page.layout === 'polaroid-tape') {
    gridStyle = { ...gridStyle, padding: '1rem 1rem 4rem 1rem' };
  } else if (page.layout === 'moodboard') {
    gridStyle = { ...gridStyle, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gridTemplateRows: 'repeat(5, 1fr)', gap: '6px', padding: '12px' };
  } else if (page.layout === 'map-page') {
    gridStyle = { ...gridStyle, padding: '2rem' };
  } else if (page.layout === 'grid-2') {
    gridStyle = { ...gridStyle, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px', padding: '4px' };
  } else if (page.layout === 'asym-2') {
    gridStyle = { ...gridStyle, display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '4px', padding: '4px' };
  } else if (page.layout === 'grid-3') {
    gridStyle = { ...gridStyle, display: 'grid', gridTemplateColumns: '1fr 1fr', gridTemplateRows: '2fr 1fr', gap: '4px', padding: '4px' };
  } else if (page.layout === 'grid-4') {
    gridStyle = { ...gridStyle, display: 'grid', gridTemplateColumns: '1fr 1fr', gridTemplateRows: '1fr 1fr', gap: '4px', padding: '4px' };
  }

  return (
    <div className="page" ref={ref}>
      <div className="page-content" style={{ position: 'relative', width: '100%', height: '100%' }}>
        <div style={gridStyle} className={containerClassName}>
          {page.slots.map((slot, idx) => {
            const isGrid3First = page.layout === 'grid-3' && idx === 0;
            const isCover = page.layout === 'cover';
            const isMagazineCover = page.layout === 'magazine-cover';
            const isCityPop = page.layout === 'city-pop-cover';
            const isY2K = page.layout === 'y2k-sticker-cover';
            const isGroovy = page.layout === 'retro-groovy-cover';
            const isComic = page.layout === 'comic-pop-cover';

            let slotStyle = {};
            if (isGrid3First) {
              slotStyle = { width: '100%', height: '100%', background: '#f1f5f9', overflow: 'hidden', gridColumn: '1 / span 2' };
            } else if (isCover) {
              slotStyle = { width: '80%', aspectRatio: '1', margin: '0 auto', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', borderRadius: '4px', overflow: 'hidden', background: '#f1f5f9' };
            } else if (isMagazineCover) {
              slotStyle = { width: '85%', height: '85%', margin: '0 auto', border: '10px solid white', overflow: 'hidden', zIndex: 10, position: 'relative' };
            } else if (page.layout === 'moodboard') {
              slotStyle = { width: '100%', height: '100%', background: '#f1f5f9', overflow: 'hidden', borderRadius: '8px' };
            } else if (isCityPop) {
              slotStyle = { width: '60%', height: '52%', margin: '-30px auto 0 auto', border: '8px solid white', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', transform: 'rotate(-4deg)', zIndex: 10, position: 'relative', overflow: 'hidden' };
            } else if (isY2K) {
              if (idx === 0) {
                slotStyle = { width: '42%', height: '42%', position: 'absolute', top: '35%', left: '8%', border: '6px solid white', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', transform: 'rotate(-8deg)', zIndex: 10, overflow: 'hidden' };
              } else {
                slotStyle = { width: '42%', height: '42%', position: 'absolute', bottom: '15%', right: '8%', border: '6px solid white', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', transform: 'rotate(6deg)', zIndex: 10, overflow: 'hidden' };
              }
            } else if (isGroovy) {
              slotStyle = { width: '58%', height: '54%', margin: '-20px auto 0 auto', border: '8px solid #fffdf5', borderRadius: '120px 120px 0px 0px', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', overflow: 'hidden', zIndex: 10, position: 'relative' };
            } else if (isComic) {
              if (idx === 0) {
                slotStyle = { width: '45%', height: '45%', position: 'absolute', top: '32%', left: '6%', border: '4px solid black', boxShadow: '6px 6px 0px black', transform: 'skewX(-3deg) rotate(-2deg)', zIndex: 10, overflow: 'hidden' };
              } else {
                slotStyle = { width: '45%', height: '45%', position: 'absolute', bottom: '12%', right: '6%', border: '4px solid black', boxShadow: '6px 6px 0px black', transform: 'skewX(3deg) rotate(3deg)', zIndex: 10, overflow: 'hidden' };
              }
            } else {
              slotStyle = { width: '100%', height: '100%', background: '#f1f5f9', overflow: 'hidden' };
            }

            return (
              <div key={idx} style={slotStyle}>
                {(slot.croppedImage || slot.image) && (
                  <img 
                    src={slot.croppedImage || slot.image} 
                    alt={`Slot ${idx}`} 
                    style={{ 
                      width: '100%', 
                      height: '100%', 
                      objectFit: 'cover',
                      boxShadow: isPolaroid ? 'none' : 'inset 0 0 10px rgba(0,0,0,0.1)'
                    }} 
                  />
                )}
              </div>
            );
          })}

          <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 40 }}>
            {/* Fallback for old string text or standard simple text */}
            {page.text && (typeof page.text === 'string' || (!page.layout.includes('cover') && !page.layout.includes('map'))) && (
              <div style={{
                position: 'absolute',
                bottom: isPolaroid ? '1rem' : '2rem',
                left: '1rem',
                right: '1rem',
                textAlign: 'center',
                fontFamily: 'var(--font-serif)',
                fontSize: '1.25rem',
                color: isPolaroid ? 'var(--text-primary)' : 'inherit',
                textShadow: isPolaroid ? 'none' : '0 2px 4px rgba(0,0,0,0.5)',
                zIndex: 10
              }}>
                {typeof page.text === 'string' ? page.text : page.text.title?.text}
              </div>
            )}

            {/* Complex Text Areas for Advanced Layouts */}
            {(page.layout === 'magazine-cover' || page.layout === 'cover') && typeof page.text === 'object' && (
              <>
                {['title', 'subtitle', 'body', 'extra'].map(field => {
                  const textObj = page.text[field];
                  if (!textObj) return null;
                  
                  let defaultStyle = {};
                  if (field === 'title') defaultStyle = { top: '10%', left: '0', right: '0', height: '100px', fontFamily: 'var(--font-serif)', fontSize: '3.5rem', fontWeight: 'bold', textAlign: 'center', letterSpacing: '4px' };
                  if (field === 'subtitle') defaultStyle = { top: '25%', left: '0', right: '0', height: '40px', fontFamily: 'var(--font-sans)', fontSize: '1.25rem', textAlign: 'center', letterSpacing: '2px', opacity: 0.9 };
                  if (field === 'body') defaultStyle = { top: '40%', left: '10%', width: '40%', height: '150px', fontFamily: 'var(--font-serif)', fontSize: '1.1rem', textAlign: 'left', opacity: 0.8 };
                  if (field === 'extra') defaultStyle = { bottom: '25%', right: '10%', width: '30%', height: '80px', fontFamily: 'var(--font-serif)', fontSize: '1.25rem', textAlign: 'right', opacity: 0.9 };

                  return (
                    <div key={field} style={{
                      position: 'absolute',
                      transform: `translate(${textObj.x || 0}px, ${textObj.y || 0}px)`,
                      color: bookTheme ? bookTheme.textColor : 'inherit',
                      whiteSpace: 'pre-wrap',
                      ...defaultStyle
                    }}>
                      {textObj.text}
                    </div>
                  );
                })}
                
                {/* Decorative Elements */}
                <div style={{ position: 'absolute', bottom: '2rem', right: '15%', width: '60px', height: '30px', background: `repeating-linear-gradient(to right, ${bookTheme ? bookTheme.textColor : 'black'}, ${bookTheme ? bookTheme.textColor : 'black'} 2px, transparent 2px, transparent 4px, ${bookTheme ? bookTheme.textColor : 'black'} 4px, ${bookTheme ? bookTheme.textColor : 'black'} 5px, transparent 5px, transparent 8px)` }}></div>
                
                {/* Circular Stamp */}
                {page.layout === 'magazine-cover' && (
                  <div style={{ position: 'absolute', top: '15%', right: '15%', width: '80px', height: '80px', borderRadius: '50%', border: `2px dashed ${bookTheme ? bookTheme.textColor : 'black'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0.6, transform: 'rotate(-15deg)', pointerEvents: 'none' }}>
                    <span style={{ fontFamily: 'var(--font-sans)', fontSize: '0.6rem', textAlign: 'center', color: bookTheme ? bookTheme.textColor : 'black', textTransform: 'uppercase', letterSpacing: '1px' }}>Paris<br/>France</span>
                  </div>
                )}
                
                {/* Bottom Center Text (Fixed) */}
                <div style={{ position: 'absolute', bottom: '5%', left: '0', right: '0', textAlign: 'center', fontFamily: 'var(--font-serif)', fontSize: '1rem', letterSpacing: '2px', color: bookTheme ? bookTheme.textColor : 'inherit', pointerEvents: 'none' }}>
                  PARIS 2026
                </div>
              </>
            )}

            {/* City Pop Cover Layout */}
            {page.layout === 'city-pop-cover' && typeof page.text === 'object' && (
              <>
                {['title', 'subtitle', 'body', 'extra'].map(field => {
                  const textObj = page.text[field];
                  if (!textObj) return null;

                  let defaultStyle = {};
                  if (field === 'title') defaultStyle = { top: '8%', left: '0', right: '0', height: '90px', fontFamily: 'var(--font-rounded)', fontSize: '3.2rem', fontWeight: '800', color: '#0f172a', textAlign: 'center', letterSpacing: '2px' };
                  if (field === 'subtitle') defaultStyle = { top: '21%', left: '0', right: '0', height: '35px', fontFamily: 'var(--font-rounded)', fontSize: '1.2rem', fontWeight: '700', color: '#3b82f6', textAlign: 'center', letterSpacing: '4px' };
                  if (field === 'body') defaultStyle = { top: '82%', left: '0', right: '0', height: '30px', fontFamily: 'var(--font-rounded)', fontSize: '1rem', fontWeight: '700', color: '#0f172a', textAlign: 'center' };
                  if (field === 'extra') defaultStyle = { top: '88%', left: '0', right: '0', height: '30px', fontFamily: 'var(--font-rounded)', fontSize: '0.8rem', fontWeight: '600', color: '#64748b', textAlign: 'center', opacity: 0.9, letterSpacing: '1px' };

                  return (
                    <div key={field} style={{
                      position: 'absolute',
                      transform: `translate(${textObj.x || 0}px, ${textObj.y || 0}px)`,
                      whiteSpace: 'pre-wrap',
                      ...defaultStyle
                    }}>
                      {textObj.text}
                    </div>
                  );
                })}

                {/* Amsterdam Skyline SVG */}
                <svg style={{ position: 'absolute', bottom: 0, left: 0, right: 0, width: '100%', height: '140px', zIndex: 5, pointerEvents: 'none' }} viewBox="0 0 800 140" preserveAspectRatio="none">
                  <path d="M 20 140 A 50 50 0 0 1 120 140 M 300 140 A 70 70 0 0 1 440 140 M 640 140 A 40 40 0 0 1 720 140" fill="#bae6fd" opacity="0.4" />
                  
                  {/* House 1 */}
                  <path d="M 20 140 L 20 50 L 30 50 L 30 40 L 40 40 L 40 30 L 55 30 L 70 30 L 70 40 L 80 40 L 80 50 L 90 50 L 90 140 Z" fill="#fb7185" />
                  <rect x="35" y="60" width="10" height="15" fill="#fef08a" rx="1" />
                  <rect x="63" y="60" width="10" height="15" fill="#fef08a" rx="1" />
                  <rect x="35" y="85" width="10" height="15" fill="#fef08a" rx="1" />
                  <rect x="63" y="85" width="10" height="15" fill="#fef08a" rx="1" />
                  <rect x="45" y="112" width="18" height="28" fill="#475569" rx="1" />
                  
                  {/* House 2 */}
                  <path d="M 90 140 L 90 35 C 90 25 110 20 120 20 C 130 20 150 25 150 35 L 150 140 Z" fill="#f97316" />
                  <rect x="105" y="45" width="10" height="15" fill="#fff" rx="1" />
                  <rect x="123" y="45" width="10" height="15" fill="#fff" rx="1" />
                  <rect x="105" y="70" width="10" height="15" fill="#fff" rx="1" />
                  <rect x="123" y="70" width="10" height="15" fill="#fff" rx="1" />
                  <rect x="105" y="95" width="10" height="15" fill="#fff" rx="1" />
                  <rect x="123" y="95" width="10" height="15" fill="#fff" rx="1" />
                  <rect x="111" y="120" width="16" height="20" fill="#1e293b" />

                  {/* House 3 */}
                  <path d="M 150 140 L 150 70 L 180 20 L 210 70 L 210 140 Z" fill="#facc15" />
                  <line x1="180" y1="20" x2="180" y2="5" stroke="#facc15" strokeWidth="4" />
                  <circle cx="180" cy="5" r="3" fill="#f59e0b" />
                  <circle cx="180" cy="42" r="7" fill="#fff" stroke="#d97706" strokeWidth="2" />
                  <rect x="160" y="75" width="12" height="16" fill="#1e293b" rx="1" />
                  <rect x="186" y="75" width="12" height="16" fill="#1e293b" rx="1" />
                  <rect x="160" y="100" width="12" height="16" fill="#1e293b" rx="1" />
                  <rect x="186" y="100" width="12" height="16" fill="#1e293b" rx="1" />
                  <rect x="170" y="122" width="18" height="18" fill="#fff" />

                  {/* House 4 */}
                  <path d="M 210 140 L 210 40 L 220 40 L 220 30 L 235 30 L 235 15 L 255 15 L 255 30 L 270 30 L 270 40 L 280 40 L 280 140 Z" fill="#10b981" />
                  <rect x="225" y="55" width="10" height="15" fill="#fef08a" rx="1" />
                  <rect x="253" y="55" width="10" height="15" fill="#fef08a" rx="1" />
                  <rect x="225" y="80" width="10" height="15" fill="#fef08a" rx="1" />
                  <rect x="253" y="80" width="10" height="15" fill="#fef08a" rx="1" />
                  <rect x="237" y="112" width="14" height="28" fill="#64748b" rx="1" />

                  {/* House 5 */}
                  <path d="M 280 140 L 280 50 C 280 40 300 35 310 35 C 320 35 340 40 340 50 L 340 140 Z" fill="#3b82f6" />
                  <rect x="292" y="65" width="12" height="18" fill="#fff" rx="1" />
                  <rect x="314" y="65" width="12" height="18" fill="#fff" rx="1" />
                  <rect x="292" y="90" width="12" height="18" fill="#fff" rx="1" />
                  <rect x="314" y="90" width="12" height="18" fill="#fff" rx="1" />
                  <rect x="303" y="118" width="14" height="22" fill="#0f172a" rx="1" />

                  {/* Continued Skyline Facades */}
                  <path d="M 340 140 L 340 45 L 355 45 L 355 30 L 385 30 L 385 45 L 400 45 L 400 140 Z" fill="#8b5cf6" />
                  <rect x="350" y="55" width="12" height="18" fill="#fef08a" />
                  <rect x="376" y="55" width="12" height="18" fill="#fef08a" />
                  <rect x="350" y="80" width="12" height="18" fill="#fef08a" />
                  <rect x="376" y="80" width="12" height="18" fill="#fef08a" />

                  <path d="M 400 140 L 400 30 C 400 20 425 15 440 15 C 455 15 480 20 480 30 L 480 140 Z" fill="#06b6d4" />
                  <rect x="415" y="45" width="12" height="20" fill="#fff" />
                  <rect x="445" y="45" width="12" height="20" fill="#fff" />
                  <rect x="415" y="80" width="12" height="20" fill="#fff" />
                  <rect x="445" y="80" width="12" height="20" fill="#fff" />

                  <path d="M 480 140 L 480 60 L 515 15 L 550 60 L 550 140 Z" fill="#ec4899" />
                  <rect x="495" y="75" width="12" height="18" fill="#fff" />
                  <rect x="520" y="75" width="12" height="18" fill="#fff" />
                  <rect x="495" y="100" width="12" height="18" fill="#fff" />
                  <rect x="520" y="100" width="12" height="18" fill="#fff" />

                  <path d="M 550 140 L 550 45 L 565 45 L 565 30 L 595 30 L 595 45 L 610 45 L 610 140 Z" fill="#14b8a6" />
                  <rect x="560" y="55" width="12" height="18" fill="#fff" rx="1" />
                  <rect x="584" y="55" width="12" height="18" fill="#fff" rx="1" />
                  <rect x="560" y="80" width="12" height="18" fill="#fff" rx="1" />
                  <rect x="584" y="80" width="12" height="18" fill="#fff" rx="1" />

                  <path d="M 610 140 L 610 35 C 610 25 635 20 650 20 C 665 20 690 25 690 35 L 690 140 Z" fill="#f43f5e" />
                  <rect x="622" y="50" width="12" height="18" fill="#fef08a" />
                  <rect x="654" y="50" width="12" height="18" fill="#fef08a" />
                  <rect x="622" y="80" width="12" height="18" fill="#fef08a" />
                  <rect x="654" y="80" width="12" height="18" fill="#fef08a" />

                  <path d="M 690 140 L 690 70 L 720 20 L 750 70 L 750 140 Z" fill="#eab308" />
                  <rect x="702" y="80" width="10" height="15" fill="#1e293b" rx="1" />
                  <rect x="724" y="80" width="10" height="15" fill="#1e293b" rx="1" />

                  <path d="M 750 140 L 750 40 L 790 40 L 790 140 Z" fill="#6366f1" />
                  <rect x="760" y="60" width="18" height="25" fill="#fff" rx="1" />
                </svg>
              </>
            )}

            {/* Y2K Sticker Cover Layout */}
            {page.layout === 'y2k-sticker-cover' && typeof page.text === 'object' && (
              <>
                {['title', 'subtitle', 'body', 'extra'].map(field => {
                  const textObj = page.text[field];
                  if (!textObj) return null;

                  let defaultStyle = {};
                  if (field === 'title') defaultStyle = { top: '8%', left: '0', right: '0', height: '90px', fontFamily: 'var(--font-wavy)', fontSize: '3rem', fontWeight: '800', color: '#5b21b6', textAlign: 'center', textShadow: '2px 2px 0px #f472b6' };
                  if (field === 'subtitle') defaultStyle = { top: '21%', left: '0', right: '0', height: '35px', fontFamily: 'var(--font-chunky)', fontSize: '1.2rem', color: '#db2777', textAlign: 'center' };
                  if (field === 'body') defaultStyle = { bottom: '5%', left: '10%', width: '40%', height: '35px', fontFamily: 'var(--font-rounded)', fontSize: '0.9rem', fontWeight: '700', color: '#7c3aed', textAlign: 'left' };
                  if (field === 'extra') defaultStyle = { bottom: '5%', right: '10%', width: '40%', height: '35px', fontFamily: 'var(--font-rounded)', fontSize: '0.9rem', fontWeight: '700', color: '#7c3aed', textAlign: 'right' };

                  return (
                    <div key={field} style={{
                      position: 'absolute',
                      transform: `translate(${textObj.x || 0}px, ${textObj.y || 0}px)`,
                      whiteSpace: 'pre-wrap',
                      ...defaultStyle
                    }}>
                      {textObj.text}
                    </div>
                  );
                })}

                {/* Daisy Sticker Top-Right */}
                <div className="sticker-float-slow" style={{ position: 'absolute', top: '12%', right: '8%', zIndex: 30, width: '45px', height: '45px', pointerEvents: 'none' }}>
                  <svg viewBox="0 0 100 100" style={{ width: '100%', height: '100%', filter: 'drop-shadow(2px 3px 0px rgba(0,0,0,0.15))' }}>
                    <g fill="#fff">
                      <circle cx="50" cy="20" r="15" /><circle cx="50" cy="80" r="15" />
                      <circle cx="20" cy="50" r="15" /><circle cx="80" cy="50" r="15" />
                      <circle cx="28" cy="28" r="15" /><circle cx="72" cy="72" r="15" />
                      <circle cx="72" cy="28" r="15" /><circle cx="28" cy="72" r="15" />
                    </g>
                    <circle cx="50" cy="50" r="18" fill="#facc15" />
                  </svg>
                </div>
                {/* Smiley Sticker Mid-Left */}
                <div className="sticker-float-medium" style={{ position: 'absolute', top: '48%', left: '4%', zIndex: 30, width: '40px', height: '40px', pointerEvents: 'none' }}>
                  <svg viewBox="0 0 100 100" style={{ width: '100%', height: '100%', filter: 'drop-shadow(2px 3px 0px rgba(0,0,0,0.15))' }}>
                    <circle cx="50" cy="50" r="48" fill="#a7f3d0" stroke="#047857" strokeWidth="4" />
                    <circle cx="35" cy="40" r="6" fill="#047857" /><circle cx="65" cy="40" r="6" fill="#047857" />
                    <path d="M 30 60 Q 50 80 70 60" fill="none" stroke="#047857" strokeWidth="6" strokeLinecap="round" />
                  </svg>
                </div>
                {/* Sparkle Stickers */}
                <div className="sticker-float-slow" style={{ position: 'absolute', bottom: '15%', left: '8%', zIndex: 30, width: '30px', height: '30px', pointerEvents: 'none' }}>
                  <svg viewBox="0 0 100 100" style={{ width: '100%', height: '100%', fill: '#67e8f9' }}>
                    <path d="M 50 0 Q 50 50 0 50 Q 50 50 50 100 Q 50 50 100 50 Q 50 50 50 0 Z" />
                  </svg>
                </div>
                <div className="sticker-float-medium" style={{ position: 'absolute', top: '25%', left: '12%', zIndex: 30, width: '22px', height: '22px', pointerEvents: 'none' }}>
                  <svg viewBox="0 0 100 100" style={{ width: '100%', height: '100%', fill: '#f472b6' }}>
                    <path d="M 50 0 Q 50 50 0 50 Q 50 50 50 100 Q 50 50 100 50 Q 50 50 50 0 Z" />
                  </svg>
                </div>
              </>
            )}

            {/* Retro Groovy Cover Layout */}
            {page.layout === 'retro-groovy-cover' && typeof page.text === 'object' && (
              <>
                {['title', 'subtitle', 'body', 'extra'].map(field => {
                  const textObj = page.text[field];
                  if (!textObj) return null;

                  let defaultStyle = {};
                  if (field === 'title') defaultStyle = { top: '7%', left: '0', right: '0', height: '90px', fontFamily: 'var(--font-chunky)', fontSize: '3.3rem', color: '#7c2d12', textAlign: 'center', textShadow: '2px 2px 0px #fcd34d' };
                  if (field === 'subtitle') defaultStyle = { top: '20%', left: '0', right: '0', height: '35px', fontFamily: 'var(--font-rounded)', fontSize: '1.2rem', fontWeight: '700', color: '#b45309', textAlign: 'center' };
                  if (field === 'body') defaultStyle = { bottom: '5%', left: '0', right: '0', height: '30px', fontFamily: 'var(--font-rounded)', fontSize: '0.95rem', fontWeight: '700', color: '#7c2d12', textAlign: 'center' };
                  if (field === 'extra') defaultStyle = { bottom: '10%', left: '0', right: '0', height: '30px', fontFamily: 'var(--font-rounded)', fontSize: '0.85rem', fontWeight: '600', color: '#9a3412', textAlign: 'center' };

                  return (
                    <div key={field} style={{
                      position: 'absolute',
                      transform: `translate(${textObj.x || 0}px, ${textObj.y || 0}px)`,
                      whiteSpace: 'pre-wrap',
                      ...defaultStyle
                    }}>
                      {textObj.text}
                    </div>
                  );
                })}

                {/* Sun Rays Background SVG */}
                <div style={{ position: 'absolute', top: '22%', left: '50%', transform: 'translate(-50%, -50%)', width: '220px', height: '220px', opacity: 0.15, pointerEvents: 'none' }}>
                  <svg viewBox="0 0 100 100" style={{ width: '100%', height: '100%', fill: 'none', stroke: '#fffdf5', strokeWidth: '3' }}>
                    <circle cx="50" cy="50" r="22" />
                    {Array.from({ length: 12 }).map((_, i) => {
                      const angle = (i * 30 * Math.PI) / 180;
                      const x1 = 50 + 26 * Math.cos(angle);
                      const y1 = 50 + 26 * Math.sin(angle);
                      const x2 = 50 + 38 * Math.cos(angle);
                      const y2 = 50 + 38 * Math.sin(angle);
                      return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} strokeLinecap="round" />;
                    })}
                  </svg>
                </div>

                {/* Groovy Flower Top-Right */}
                <div className="sticker-float-slow" style={{ position: 'absolute', top: '12%', right: '8%', zIndex: 30, width: '45px', height: '45px', pointerEvents: 'none' }}>
                  <svg viewBox="0 0 100 100" style={{ width: '100%', height: '100%' }}>
                    <g fill="#f59e0b">
                      <circle cx="50" cy="20" r="18" /><circle cx="50" cy="80" r="18" />
                      <circle cx="20" cy="50" r="18" /><circle cx="80" cy="50" r="18" />
                    </g>
                    <circle cx="50" cy="50" r="20" fill="#7c2d12" />
                    <circle cx="50" cy="50" r="10" fill="#fff" />
                  </svg>
                </div>
                {/* Groovy Flower Bottom-Left */}
                <div className="sticker-float-medium" style={{ position: 'absolute', bottom: '15%', left: '8%', zIndex: 30, width: '35px', height: '35px', pointerEvents: 'none' }}>
                  <svg viewBox="0 0 100 100" style={{ width: '100%', height: '100%' }}>
                    <g fill="#ec4899">
                      <circle cx="50" cy="20" r="18" /><circle cx="50" cy="80" r="18" />
                      <circle cx="20" cy="50" r="18" /><circle cx="80" cy="50" r="18" />
                    </g>
                    <circle cx="50" cy="50" r="20" fill="#fff" />
                  </svg>
                </div>
              </>
            )}

            {/* Comic Book Cover Layout */}
            {page.layout === 'comic-pop-cover' && typeof page.text === 'object' && (
              <>
                {['title', 'subtitle', 'body'].map(field => {
                  const textObj = page.text[field];
                  if (!textObj) return null;

                  let defaultStyle = {};
                  if (field === 'title') defaultStyle = { top: '6%', left: '0', right: '0', height: '80px', fontFamily: 'var(--font-display)', fontSize: '3.4rem', color: '#000000', textAlign: 'center', WebkitTextStroke: '2px white', textShadow: '4px 4px 0px #000000' };
                  if (field === 'subtitle') defaultStyle = { bottom: '5%', left: '10%', width: '40%', height: '35px', fontFamily: 'var(--font-rounded)', fontSize: '1rem', fontWeight: '800', color: '#000000', textAlign: 'left' };
                  if (field === 'body') defaultStyle = { bottom: '5%', right: '10%', width: '40%', height: '35px', fontFamily: 'var(--font-display)', fontSize: '0.85rem', color: '#e11d48', textAlign: 'right' };

                  return (
                    <div key={field} style={{
                      position: 'absolute',
                      transform: `translate(${textObj.x || 0}px, ${textObj.y || 0}px)`,
                      whiteSpace: 'pre-wrap',
                      ...defaultStyle
                    }}>
                      {textObj.text}
                    </div>
                  );
                })}

                {/* Comic Speech Bubble */}
                {page.text.extra && (
                  <div className="sticker-float-medium" style={{ position: 'absolute', top: '15%', right: '10%', zIndex: 30, pointerEvents: 'none' }}>
                    <div className="comic-speech-bubble" style={{ position: 'relative', width: '80px', height: '30px', fontFamily: 'var(--font-display)', fontSize: '0.85rem', color: '#000', textAlign: 'center', transform: `translate(${page.text.extra.x || 0}px, ${page.text.extra.y || 0}px)` }}>
                      {page.text.extra.text}
                    </div>
                  </div>
                )}

                {/* Accent Starburst background */}
                <div style={{ position: 'absolute', top: '15%', left: '5%', zIndex: 5, width: '100px', height: '100px', opacity: 0.9, transform: 'rotate(15deg)', pointerEvents: 'none' }}>
                  <svg viewBox="0 0 100 100" style={{ width: '100%', height: '100%', fill: '#06b6d4', filter: 'drop-shadow(3px 3px 0px #000)' }}>
                    <polygon points="50,0 60,35 95,20 70,50 100,65 65,70 80,100 50,80 20,100 35,70 0,65 30,50 5,20 40,35" />
                  </svg>
                </div>
              </>
            )}

            {page.layout === 'map-page' && typeof page.text === 'object' && (
              <>
                <svg style={{ position: 'absolute', top: '10%', right: '5%', width: '80%', height: '80%', opacity: 0.15, fill: bookTheme ? bookTheme.textColor : 'black', pointerEvents: 'none' }} viewBox="0 0 100 100">
                  <path d="M45,10 C55,5 65,15 70,25 C75,35 70,50 80,60 C90,70 85,85 70,90 C50,95 30,85 20,70 C10,50 15,30 25,20 C35,10 40,15 45,10 Z" />
                  <circle cx="65" cy="35" r="3" fill={bookTheme ? bookTheme.textColor : 'black'} />
                </svg>
                
                {['title', 'body'].map(field => {
                  const textObj = page.text[field];
                  if (!textObj) return null;
                  
                  let defaultStyle = {};
                  if (field === 'title') defaultStyle = { top: '10%', left: '10%', width: '60%', height: '100px', fontFamily: 'var(--font-serif)', fontSize: '2.5rem', textAlign: 'left', lineHeight: '1.2' };
                  if (field === 'body') defaultStyle = { bottom: '10%', left: '10%', width: '50%', height: '150px', fontFamily: 'var(--font-sans)', fontSize: '0.875rem', textAlign: 'left', opacity: 0.8, letterSpacing: '1px' };

                  return (
                    <div key={field} style={{
                      position: 'absolute',
                      transform: `translate(${textObj.x || 0}px, ${textObj.y || 0}px)`,
                      color: bookTheme ? bookTheme.textColor : 'inherit',
                      whiteSpace: 'pre-wrap',
                      ...defaultStyle
                    }}>
                      {textObj.text}
                    </div>
                  );
                })}
              </>
            )}
          </div>
          
          {/* Decorative Tape for polaroid-tape */}
          {page.layout === 'polaroid-tape' && (
            <>
              <div style={{ position: 'absolute', top: '-10px', right: '-10px', width: '80px', height: '25px', background: 'rgba(255,255,255,0.7)', transform: 'rotate(45deg)', zIndex: 60, boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}></div>
              <div style={{ position: 'absolute', bottom: '30px', left: '-20px', width: '100px', height: '30px', background: 'rgba(255,255,255,0.7)', transform: 'rotate(-15deg)', zIndex: 60, boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}></div>
            </>
          )}

          {/* Static Stickers for flipbook preview */}
          {(page.stickers || []).map((sticker) => {
            const StickerInfo = STICKER_ASSETS[sticker.type];
            if (!StickerInfo) return null;
            const StickerSvg = StickerInfo.render;
            const stickerScale = sticker.scale || 1.0;
            const stickerRotation = sticker.rotation || 0;
            const baseSize = 80;

            return (
              <div
                key={sticker.id}
                style={{
                  position: 'absolute',
                  left: 0,
                  top: 0,
                  width: `${baseSize}px`,
                  height: `${baseSize}px`,
                  transform: `translate(${sticker.x}px, ${sticker.y}px) scale(${stickerScale}) rotate(${stickerRotation}deg)`,
                  transformOrigin: 'center center',
                  pointerEvents: 'none',
                  zIndex: 45
                }}
              >
                <StickerSvg />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
});

export default function BookPreview({ pages, bookConfig, bookTheme, onClose }) {
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 1000,
    height: typeof window !== 'undefined' ? window.innerHeight : 800
  });

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isMobile = windowSize.width <= 768;
  const maxPreviewHeight = isMobile ? windowSize.height * 0.55 : windowSize.height * 0.75;
  let height = Math.min(600, maxPreviewHeight);
  let width = height * bookConfig.aspectRatio;

  // Ensure double-page spread fits screen width
  const maxDoublePageWidth = windowSize.width * 0.9;
  if (width * 2 > maxDoublePageWidth) {
    width = maxDoublePageWidth / 2;
    height = width / bookConfig.aspectRatio;
  }

  const previewPages = [...pages];
  if (previewPages.length % 2 !== 0) {
    previewPages.push({ id: 'dummy-end', slots: [{ image: null }], layout: 'full' });
  }

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 100, background: 'rgba(0,0,0,0.9)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
      <button 
        className="btn btn-secondary" 
        style={{ position: 'absolute', top: isMobile ? '1rem' : '2rem', right: isMobile ? '1rem' : '2rem' }}
        onClick={onClose}
      >
        <X size={20} /> Close Preview
      </button>

      <div className="book-preview-container animate-fade-in" style={{ padding: isMobile ? '0 1rem' : '0' }}>
        <HTMLFlipBook 
          width={width} 
          height={height}
          size="fixed"
          minWidth={150}
          maxWidth={width}
          minHeight={200}
          maxHeight={height}
          maxShadowOpacity={0.5}
          showCover={true}
          mobileScrollSupport={true}
          className="flip-book"
        >
          {previewPages.map((page, index) => (
            <Page key={page.id} page={page} index={index + 1} bookTheme={bookTheme} />
          ))}
        </HTMLFlipBook>
      </div>

      <div style={{ color: 'white', marginTop: isMobile ? '1rem' : '2rem', opacity: 0.7, fontSize: isMobile ? '0.8rem' : '1rem' }}>
        Drag page corners or click to flip pages
      </div>
    </div>
  );
}
