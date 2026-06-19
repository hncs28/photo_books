import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { ImagePlus, Edit3 } from 'lucide-react';
import { motion } from 'framer-motion';
import ImageEditor from './ImageEditor';

const DraggableText = ({ page, fieldKey, placeholder, defaultStyle, onUpdatePage }) => {
  // Gracefully handle if text is just a string (fallback)
  const isString = typeof page.text === 'string';
  const textObj = !isString && page.text && page.text[fieldKey] ? page.text[fieldKey] : { text: isString ? page.text : '', x: 0, y: 0 };
  
  return (
    <motion.div
      drag
      dragMomentum={false}
      animate={{ x: textObj.x || 0, y: textObj.y || 0 }}
      onDragEnd={(event, info) => {
        if (isString) return; // Don't save position if it's legacy string
        onUpdatePage(page.id, {
          text: {
            ...page.text,
            [fieldKey]: { ...textObj, x: (textObj.x || 0) + info.offset.x, y: (textObj.y || 0) + info.offset.y }
          }
        });
      }}
      style={{
        position: 'absolute',
        pointerEvents: 'auto',
        zIndex: 50,
        ...defaultStyle
      }}
    >
      <textarea
        value={textObj.text || ''}
        onChange={(e) => {
          if (isString) {
            onUpdatePage(page.id, { text: e.target.value });
          } else {
            onUpdatePage(page.id, { text: { ...page.text, [fieldKey]: { ...textObj, text: e.target.value } } });
          }
        }}
        placeholder={placeholder}
        style={{
          width: '100%',
          height: '100%',
          background: 'transparent',
          border: '1px dashed transparent',
          outline: 'none',
          resize: 'none',
          fontFamily: defaultStyle.fontFamily || 'inherit',
          fontSize: defaultStyle.fontSize || 'inherit',
          fontWeight: defaultStyle.fontWeight || 'inherit',
          color: defaultStyle.color || 'inherit',
          textAlign: defaultStyle.textAlign || 'left',
          opacity: defaultStyle.opacity || 1,
          whiteSpace: 'pre-wrap'
        }}
        onFocus={(e) => e.target.style.border = '1px dashed #cbd5e1'}
        onBlur={(e) => e.target.style.border = '1px dashed transparent'}
      />
    </motion.div>
  );
};

function ImageSlot({ slot, index, pageId, layout, bookConfig, onUpdateSlot }) {
  const [isEditing, setIsEditing] = useState(false);

  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles && acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      const imageUrl = URL.createObjectURL(file);
      onUpdateSlot(index, { image: imageUrl, croppedImage: null });
      setIsEditing(true);
    }
  }, [index, onUpdateSlot]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': [] },
    multiple: false
  });

  // Calculate target aspect ratio based on layout
  let targetRatio = bookConfig.aspectRatio;
  if (layout === 'polaroid') targetRatio = 1;
  if (layout === 'grid-2') targetRatio = bookConfig.aspectRatio * 2; // Approximate if stacked or side-by-side
  if (layout === 'grid-4') targetRatio = bookConfig.aspectRatio; // 2x2 grid has same ratio

  if (isEditing && slot.image) {
    return (
      <div style={{ width: '100%', height: '100%', position: 'relative', zIndex: 50, background: 'white' }}>
        <ImageEditor
          image={slot.image}
          aspectRatio={targetRatio}
          onSave={(croppedImage, cropData) => {
            onUpdateSlot(index, { croppedImage, ...cropData });
            setIsEditing(false);
          }}
          onCancel={() => setIsEditing(false)}
        />
      </div>
    );
  }

  if (slot.croppedImage || slot.image) {
    return (
      <div style={{ width: '100%', height: '100%', position: 'relative', overflow: 'hidden' }}>
        <img 
          src={slot.croppedImage || slot.image} 
          alt="Slot content" 
          style={{ objectFit: 'cover', width: '100%', height: '100%', display: 'block' }}
        />
        <button 
          className="btn btn-secondary"
          style={{
            position: 'absolute',
            top: '8px',
            right: '8px',
            background: 'rgba(30, 30, 30, 0.7)',
            color: 'white',
            backdropFilter: 'blur(4px)',
            padding: '4px 8px',
            fontSize: '12px'
          }}
          onClick={(e) => {
            e.stopPropagation();
            setIsEditing(true);
          }}
        >
          <Edit3 size={12} /> Edit
        </button>
      </div>
    );
  }

  return (
    <div 
      {...getRootProps()} 
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: isDragActive ? '#f1f5f9' : '#f8fafc',
        border: '1px dashed #cbd5e1',
        color: isDragActive ? 'var(--primary-color)' : '#94a3b8',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        padding: '1rem',
        textAlign: 'center'
      }}
    >
      <input {...getInputProps()} />
      <ImagePlus size={32} style={{ marginBottom: '8px', color: 'inherit' }} />
      <span style={{ fontSize: '12px', fontWeight: 500 }}>
        {isDragActive ? 'Drop here' : 'Add Image'}
      </span>
    </div>
  );
}

export default function PageCanvas({ page, bookConfig, bookTheme, onUpdatePage }) {
  if (!page) {
    return (
      <div className="canvas-container">
        <div style={{ color: 'var(--text-secondary)' }}>Select or create a page to begin</div>
      </div>
    );
  }

  const maxHeight = 600;
  const maxWidth = 800;
  let height = maxHeight;
  let width = height * bookConfig.aspectRatio;

  if (width > maxWidth) {
    width = maxWidth;
    height = width / bookConfig.aspectRatio;
  }

  const handleUpdateSlot = (index, updates) => {
    const newSlots = [...page.slots];
    newSlots[index] = { ...newSlots[index], ...updates };
    onUpdatePage(page.id, { slots: newSlots });
  };

  // Determine grid CSS based on layout
  let gridStyle = { width: '100%', height: '100%', position: 'relative', background: bookTheme ? bookTheme.bgColor : 'white' };
  
  if (page.layout === 'magazine-cover') {
    gridStyle = { ...gridStyle, padding: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' };
  } else if (page.layout === 'cover') {
    gridStyle = { ...gridStyle, padding: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' };
  } else if (page.layout === 'polaroid' || page.layout === 'polaroid-tape') {
    // Polaroid is a white frame on top of the theme background
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
  } else {
    // full
    gridStyle = { ...gridStyle, padding: 0 };
  }

  return (
    <div className="canvas-container">
      <div 
        className="book-page-wrapper" 
        style={{ width: `${width}px`, height: `${height}px` }}
      >
        <div style={gridStyle}>
          {page.slots.map((slot, idx) => {
            const isGrid3First = page.layout === 'grid-3' && idx === 0;
            const isCover = page.layout === 'cover';
            const isMagazineCover = page.layout === 'magazine-cover';
            
            // Moodboard slots might span differently if we wanted to get fancy, but a 3x5 grid handles 15 slots. We return 14, so one is empty or we just map them all normally.
            
            return (
              <div key={idx} style={
                isGrid3First ? { gridColumn: '1 / span 2' } : 
                isCover ? { width: '80%', aspectRatio: '1', margin: '0 auto', boxShadow: 'var(--shadow-md)', borderRadius: 'var(--radius-sm)', overflow: 'hidden' } : 
                isMagazineCover ? { width: '85%', height: '85%', margin: '0 auto', border: '10px solid white', overflow: 'hidden', zIndex: 10, position: 'relative' } :
                page.layout === 'moodboard' ? { borderRadius: '8px', overflow: 'hidden' } :
                {}
              }>
                <ImageSlot 
                  slot={slot} 
                  index={idx} 
                  pageId={page.id} 
                  layout={page.layout} 
                  bookConfig={bookConfig} 
                  onUpdateSlot={handleUpdateSlot} 
                />
              </div>
            );
          })}
          
          {page.text && (
            <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 40 }}>
              {/* Complex Text Areas for Advanced Layouts */}
              {(page.layout === 'magazine-cover' || page.layout === 'cover') && typeof page.text === 'object' && (
                <>
                  <DraggableText
                    page={page}
                    fieldKey="title"
                    placeholder="TITLE"
                    onUpdatePage={onUpdatePage}
                    defaultStyle={{
                      top: '10%', left: '0', right: '0', height: '100px',
                      fontFamily: 'var(--font-serif)', fontSize: '3.5rem', fontWeight: 'bold', 
                      color: bookTheme ? bookTheme.textColor : 'inherit', textAlign: 'center', letterSpacing: '4px'
                    }}
                  />
                  <DraggableText
                    page={page}
                    fieldKey="subtitle"
                    placeholder="Subtitle"
                    onUpdatePage={onUpdatePage}
                    defaultStyle={{
                      top: '25%', left: '0', right: '0', height: '40px',
                      fontFamily: 'var(--font-sans)', fontSize: '1.25rem', 
                      color: bookTheme ? bookTheme.textColor : 'inherit', textAlign: 'center', letterSpacing: '2px', opacity: 0.9
                    }}
                  />
                  <DraggableText
                    page={page}
                    fieldKey="body"
                    placeholder="Body Text"
                    onUpdatePage={onUpdatePage}
                    defaultStyle={{
                      top: '40%', left: '10%', width: '40%', height: '150px',
                      fontFamily: 'var(--font-serif)', fontSize: '1.1rem', 
                      color: bookTheme ? bookTheme.textColor : 'inherit', textAlign: 'left', opacity: 0.8
                    }}
                  />
                  <DraggableText
                    page={page}
                    fieldKey="extra"
                    placeholder="Extra Text"
                    onUpdatePage={onUpdatePage}
                    defaultStyle={{
                      bottom: '25%', right: '10%', width: '30%', height: '80px',
                      fontFamily: 'var(--font-serif)', fontSize: '1.25rem', 
                      color: bookTheme ? bookTheme.textColor : 'inherit', textAlign: 'right', opacity: 0.9
                    }}
                  />
                  
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
                    <path d="M45,10 C55,5 65,15 70,25 C75,35 70,50 80,60 C90,70 85,85 70,90 C50,95 30,85 20,70 C10,50 15,30 25,20 C35,10 40,15 45,10 Z" /> {/* Abstract France-ish shape */}
                    <circle cx="65" cy="35" r="3" fill={bookTheme ? bookTheme.textColor : 'black'} /> {/* Pin */}
                  </svg>
                  
                  <DraggableText
                    page={page}
                    fieldKey="title"
                    placeholder="Title"
                    onUpdatePage={onUpdatePage}
                    defaultStyle={{
                      top: '10%', left: '10%', width: '60%', height: '100px',
                      fontFamily: 'var(--font-serif)', fontSize: '2.5rem', 
                      color: bookTheme ? bookTheme.textColor : 'inherit', textAlign: 'left', lineHeight: '1.2'
                    }}
                  />
                  <DraggableText
                    page={page}
                    fieldKey="body"
                    placeholder="Trip Details (e.g. Dates, Locations)"
                    onUpdatePage={onUpdatePage}
                    defaultStyle={{
                      bottom: '10%', left: '10%', width: '50%', height: '150px',
                      fontFamily: 'var(--font-sans)', fontSize: '0.875rem', 
                      color: bookTheme ? bookTheme.textColor : 'inherit', textAlign: 'left', opacity: 0.8, letterSpacing: '1px'
                    }}
                  />
                </>
              )}
            </div>
          )}
          
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
}
