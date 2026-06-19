import React, { forwardRef } from 'react';
import HTMLFlipBook from 'react-pageflip';
import { X } from 'lucide-react';

const Page = forwardRef(({ page, index, bookTheme }, ref) => {
  // Determine grid CSS based on layout
  let gridStyle = { width: '100%', height: '100%', position: 'relative', background: bookTheme ? bookTheme.bgColor : 'white' };
  const isPolaroid = page.layout === 'polaroid';
  
  if (page.layout === 'magazine-cover') {
    gridStyle = { ...gridStyle, padding: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' };
  } else if (page.layout === 'cover') {
    gridStyle = { ...gridStyle, padding: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' };
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
        <div style={gridStyle}>
          {page.slots.map((slot, idx) => {
            const isGrid3First = page.layout === 'grid-3' && idx === 0;
            const isCover = page.layout === 'cover';
            const isMagazineCover = page.layout === 'magazine-cover';
            return (
              <div key={idx} style={
                isGrid3First ? { width: '100%', height: '100%', background: '#f1f5f9', overflow: 'hidden', gridColumn: '1 / span 2' } : 
                isCover ? { width: '80%', aspectRatio: '1', margin: '0 auto', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', borderRadius: '4px', overflow: 'hidden', background: '#f1f5f9' } : 
                isMagazineCover ? { width: '85%', height: '85%', margin: '0 auto', border: '10px solid white', overflow: 'hidden', zIndex: 10, position: 'relative' } :
                page.layout === 'moodboard' ? { width: '100%', height: '100%', background: '#f1f5f9', overflow: 'hidden', borderRadius: '8px' } :
                { width: '100%', height: '100%', background: '#f1f5f9', overflow: 'hidden' }
              }>
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
        </div>
      </div>
    </div>
  );
});

export default function BookPreview({ pages, bookConfig, bookTheme, onClose }) {
  const height = 600;
  const width = height * bookConfig.aspectRatio;

  const previewPages = [...pages];
  if (previewPages.length % 2 !== 0) {
    previewPages.push({ id: 'dummy-end', slots: [{ image: null }], layout: 'full' });
  }

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 100, background: 'rgba(0,0,0,0.9)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
      <button 
        className="btn btn-secondary" 
        style={{ position: 'absolute', top: '2rem', right: '2rem' }}
        onClick={onClose}
      >
        <X size={20} /> Close Preview
      </button>

      <div className="book-preview-container animate-fade-in">
        <HTMLFlipBook 
          width={width} 
          height={height}
          size="fixed"
          minWidth={300}
          maxWidth={width}
          minHeight={400}
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

      <div style={{ color: 'white', marginTop: '2rem', opacity: 0.7 }}>
        Drag page corners or click to flip pages
      </div>
    </div>
  );
}
