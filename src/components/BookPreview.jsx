import React, { forwardRef } from 'react';
import HTMLFlipBook from 'react-pageflip';
import { X } from 'lucide-react';

const Page = forwardRef(({ page, index, isCover }, ref) => {
  if (isCover || !page.slots) {
    // Basic cover logic (just first image of first slot)
    const coverImage = page.slots?.[0]?.croppedImage || page.slots?.[0]?.image;
    return (
      <div className="page" ref={ref}>
        <div className="page-content" style={{ padding: 0 }}>
          {coverImage ? (
            <img 
              src={coverImage} 
              alt={`Cover`} 
              style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
            />
          ) : (
            <div style={{ width: '100%', height: '100%', background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ color: '#94a3b8' }}>Cover</span>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Determine grid CSS based on layout
  let gridStyle = { width: '100%', height: '100%', position: 'relative' };
  const isPolaroid = page.layout === 'polaroid';
  
  if (isPolaroid) {
    gridStyle = { ...gridStyle, background: 'white', padding: '1rem 1rem 4rem 1rem' };
  } else if (page.layout === 'grid-2') {
    gridStyle = { ...gridStyle, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px', background: 'white', padding: '4px' };
  } else if (page.layout === 'grid-4') {
    gridStyle = { ...gridStyle, display: 'grid', gridTemplateColumns: '1fr 1fr', gridTemplateRows: '1fr 1fr', gap: '4px', background: 'white', padding: '4px' };
  }

  return (
    <div className="page" ref={ref}>
      <div className="page-content" style={{ position: 'relative', width: '100%', height: '100%' }}>
        <div style={gridStyle}>
          {page.slots.map((slot, idx) => (
            <div key={idx} style={{ width: '100%', height: '100%', background: '#f1f5f9', overflow: 'hidden' }}>
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
          ))}

          {page.text && (
            <div style={{
              position: 'absolute',
              bottom: isPolaroid ? '1rem' : '2rem',
              left: '1rem',
              right: '1rem',
              textAlign: 'center',
              fontFamily: 'var(--font-serif)',
              fontSize: '1.25rem',
              color: isPolaroid ? 'var(--text-primary)' : 'white',
              textShadow: isPolaroid ? 'none' : '0 2px 4px rgba(0,0,0,0.5)',
              zIndex: 10
            }}>
              {page.text}
            </div>
          )}
        </div>
      </div>
    </div>
  );
});

export default function BookPreview({ pages, bookConfig, onClose }) {
  const height = 600;
  const width = height * bookConfig.aspectRatio;

  const previewPages = [...pages];
  if (previewPages.length % 2 !== 0 && previewPages.length > 1) {
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
            <Page key={page.id} page={page} index={index + 1} isCover={index === 0 || index === previewPages.length - 1} />
          ))}
        </HTMLFlipBook>
      </div>

      <div style={{ color: 'white', marginTop: '2rem', opacity: 0.7 }}>
        Drag page corners or click to flip pages
      </div>
    </div>
  );
}
