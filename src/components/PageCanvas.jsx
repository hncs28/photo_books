import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { ImagePlus, Edit3 } from 'lucide-react';
import { motion } from 'framer-motion';
import ImageEditor from './ImageEditor';
import { STICKER_ASSETS } from '../utils/stickers';

const DraggableText = ({ page, fieldKey, placeholder, defaultStyle, onUpdatePage, isBackCover = false }) => {
  // Gracefully handle if text is just a string (fallback)
  const isString = typeof page.text === 'string';
  const textObj = isBackCover
    ? (page.backText && page.backText[fieldKey] ? page.backText[fieldKey] : { text: '', x: 0, y: 0 })
    : (!isString && page.text && page.text[fieldKey] ? page.text[fieldKey] : { text: isString ? page.text : '', x: 0, y: 0 });
  
  return (
    <motion.div
      drag
      dragMomentum={false}
      animate={{ x: textObj.x || 0, y: textObj.y || 0 }}
      onDragEnd={(event, info) => {
        if (isString) return; // Don't save position if it's legacy string
        if (isBackCover) {
          onUpdatePage(page.id, {
            backText: {
              ...page.backText,
              [fieldKey]: { ...textObj, x: (textObj.x || 0) + info.offset.x, y: (textObj.y || 0) + info.offset.y }
            }
          });
        } else {
          onUpdatePage(page.id, {
            text: {
              ...page.text,
              [fieldKey]: { ...textObj, x: (textObj.x || 0) + info.offset.x, y: (textObj.y || 0) + info.offset.y }
            }
          });
        }
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
          } else if (isBackCover) {
            onUpdatePage(page.id, { backText: { ...page.backText, [fieldKey]: { ...textObj, text: e.target.value } } });
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
          whiteSpace: 'pre-wrap',
          textShadow: defaultStyle.textShadow || 'none',
          WebkitTextStroke: defaultStyle.WebkitTextStroke || 'none',
          WebkitTextFillColor: defaultStyle.WebkitTextFillColor || defaultStyle.color || 'inherit'
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
  if (layout === 'grid-2') targetRatio = bookConfig.aspectRatio * 2;
  if (layout === 'grid-4') targetRatio = bookConfig.aspectRatio;

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

export default function PageCanvas({ page, pages, activePageId, onSelectPage, bookConfig, bookTheme, onUpdatePage, onUpdateSticker, onRemoveSticker }) {
  if (!page) {
    return (
      <div className="canvas-container">
        <div style={{ color: 'var(--text-secondary)' }}>Select or create a page to begin</div>
      </div>
    );
  }

  // Calculate sizes for spreads side-by-side
  const maxHeight = 480;
  const maxWidth = 960;
  let height = maxHeight;
  let width = height * bookConfig.aspectRatio; // single page width

  // We need to fit 2 pages + Spine (24px for Cover, 12px for Gutter inside)
  const separatorWidth = page.id === pages[0]?.id ? 24 : 12;
  
  if (width * 2 + separatorWidth > maxWidth) {
    width = (maxWidth - separatorWidth) / 2;
    height = width / bookConfig.aspectRatio;
  }
  if (height > maxHeight) {
    height = maxHeight;
    width = height * bookConfig.aspectRatio;
  }

  const activeIndex = pages.findIndex(p => p.id === activePageId);

  const renderTextsAndDecorations = (p) => {
    if (!p.text) return null;

    return (
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 40 }}>
        {/* Cover layouts */}
        {(p.layout === 'magazine-cover' || p.layout === 'cover') && typeof p.text === 'object' && (
          <>
            <DraggableText page={p} fieldKey="title" placeholder="TITLE" onUpdatePage={onUpdatePage} defaultStyle={{ top: '10%', left: '0', right: '0', height: '80px', fontFamily: 'var(--font-serif)', fontSize: '2.5rem', fontWeight: 'bold', color: bookTheme ? bookTheme.textColor : 'inherit', textAlign: 'center', letterSpacing: '2px' }} />
            <DraggableText page={p} fieldKey="subtitle" placeholder="Subtitle" onUpdatePage={onUpdatePage} defaultStyle={{ top: '25%', left: '0', right: '0', height: '35px', fontFamily: 'var(--font-sans)', fontSize: '1rem', color: bookTheme ? bookTheme.textColor : 'inherit', textAlign: 'center', letterSpacing: '1px', opacity: 0.9 }} />
            <DraggableText page={p} fieldKey="body" placeholder="Body Text" onUpdatePage={onUpdatePage} defaultStyle={{ top: '40%', left: '10%', width: '40%', height: '120px', fontFamily: 'var(--font-serif)', fontSize: '0.85rem', color: bookTheme ? bookTheme.textColor : 'inherit', textAlign: 'left', opacity: 0.8 }} />
            <DraggableText page={p} fieldKey="extra" placeholder="Extra Text" onUpdatePage={onUpdatePage} defaultStyle={{ bottom: '25%', right: '10%', width: '30%', height: '60px', fontFamily: 'var(--font-serif)', fontSize: '1rem', color: bookTheme ? bookTheme.textColor : 'inherit', textAlign: 'right', opacity: 0.9 }} />
            <div style={{ position: 'absolute', bottom: '2rem', right: '15%', width: '60px', height: '30px', background: `repeating-linear-gradient(to right, ${bookTheme ? bookTheme.textColor : 'black'}, ${bookTheme ? bookTheme.textColor : 'black'} 2px, transparent 2px, transparent 4px, ${bookTheme ? bookTheme.textColor : 'black'} 4px, ${bookTheme ? bookTheme.textColor : 'black'} 5px, transparent 5px, transparent 8px)` }}></div>
            {p.layout === 'magazine-cover' && (
              <div style={{ position: 'absolute', top: '15%', right: '15%', width: '70px', height: '70px', borderRadius: '50%', border: `2px dashed ${bookTheme ? bookTheme.textColor : 'black'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0.6, transform: 'rotate(-15deg)', pointerEvents: 'none' }}>
                <span style={{ fontFamily: 'var(--font-sans)', fontSize: '0.55rem', textAlign: 'center', color: bookTheme ? bookTheme.textColor : 'black', textTransform: 'uppercase', letterSpacing: '1px' }}>Paris<br/>France</span>
              </div>
            )}
            <div style={{ position: 'absolute', bottom: '5%', left: '0', right: '0', textAlign: 'center', fontFamily: 'var(--font-serif)', fontSize: '0.85rem', letterSpacing: '2px', color: bookTheme ? bookTheme.textColor : 'inherit', pointerEvents: 'none' }}>
              PARIS 2026
            </div>
          </>
        )}

        {/* City Pop Cover */}
        {p.layout === 'city-pop-cover' && typeof p.text === 'object' && (
          <>
            <DraggableText page={p} fieldKey="title" placeholder="AMSTERDAM" onUpdatePage={onUpdatePage} defaultStyle={{ top: '8%', left: '0', right: '0', height: '70px', fontFamily: 'var(--font-rounded)', fontSize: '2.5rem', fontWeight: '800', color: '#0f172a', textAlign: 'center', letterSpacing: '1px' }} />
            <DraggableText page={p} fieldKey="subtitle" placeholder="NETHERLANDS" onUpdatePage={onUpdatePage} defaultStyle={{ top: '21%', left: '0', right: '0', height: '30px', fontFamily: 'var(--font-rounded)', fontSize: '1rem', fontWeight: '700', color: '#3b82f6', textAlign: 'center', letterSpacing: '3px' }} />
            <DraggableText page={p} fieldKey="body" placeholder="AMSTERDAM 2026" onUpdatePage={onUpdatePage} defaultStyle={{ top: '82%', left: '0', right: '0', height: '25px', fontFamily: 'var(--font-rounded)', fontSize: '0.85rem', fontWeight: '700', color: '#0f172a', textAlign: 'center' }} />
            <DraggableText page={p} fieldKey="extra" placeholder="EXPLORING THE CANALS" onUpdatePage={onUpdatePage} defaultStyle={{ top: '88%', left: '0', right: '0', height: '25px', fontFamily: 'var(--font-rounded)', fontSize: '0.7rem', fontWeight: '600', color: '#64748b', textAlign: 'center', opacity: 0.9, letterSpacing: '1px' }} />
            
            {/* Amsterdam Skyline SVG */}
            <svg style={{ position: 'absolute', bottom: 0, left: 0, right: 0, width: '100%', height: '110px', zIndex: 5, pointerEvents: 'none' }} viewBox="0 0 800 140" preserveAspectRatio="none">
              <path d="M 20 140 A 50 50 0 0 1 120 140 M 300 140 A 70 70 0 0 1 440 140 M 640 140 A 40 40 0 0 1 720 140" fill="#bae6fd" opacity="0.4" />
              <path d="M 20 140 L 20 50 L 30 50 L 30 40 L 40 40 L 40 30 L 55 30 L 70 30 L 70 40 L 80 40 L 80 50 L 90 50 L 90 140 Z" fill="#fb7185" />
              <rect x="35" y="60" width="10" height="15" fill="#fef08a" rx="1" />
              <rect x="63" y="60" width="10" height="15" fill="#fef08a" rx="1" />
              <rect x="35" y="85" width="10" height="15" fill="#fef08a" rx="1" />
              <rect x="63" y="85" width="10" height="15" fill="#fef08a" rx="1" />
              <rect x="45" y="112" width="18" height="28" fill="#475569" rx="1" />
              <path d="M 90 140 L 90 35 C 90 25 110 20 120 20 C 130 20 150 25 150 35 L 150 140 Z" fill="#f97316" />
              <rect x="105" y="45" width="10" height="15" fill="#fff" rx="1" />
              <rect x="123" y="45" width="10" height="15" fill="#fff" rx="1" />
              <rect x="105" y="70" width="10" height="15" fill="#fff" rx="1" />
              <rect x="123" y="70" width="10" height="15" fill="#fff" rx="1" />
              <rect x="105" y="95" width="10" height="15" fill="#fff" rx="1" />
              <rect x="123" y="95" width="10" height="15" fill="#fff" rx="1" />
              <rect x="111" y="120" width="16" height="20" fill="#1e293b" />
              <path d="M 150 140 L 150 70 L 180 20 L 210 70 L 210 140 Z" fill="#facc15" />
              <line x1="180" y1="20" x2="180" y2="5" stroke="#facc15" strokeWidth="4" />
              <circle cx="180" cy="5" r="3" fill="#f59e0b" />
              <circle cx="180" cy="42" r="7" fill="#fff" stroke="#d97706" strokeWidth="2" />
              <rect x="160" y="75" width="12" height="16" fill="#1e293b" rx="1" />
              <rect x="186" y="75" width="12" height="16" fill="#1e293b" rx="1" />
              <rect x="160" y="100" width="12" height="16" fill="#1e293b" rx="1" />
              <rect x="186" y="100" width="12" height="16" fill="#1e293b" rx="1" />
              <rect x="170" y="122" width="18" height="18" fill="#fff" />
              <path d="M 210 140 L 210 40 L 220 40 L 220 30 L 235 30 L 235 15 L 255 15 L 255 30 L 270 30 L 270 40 L 280 40 L 280 140 Z" fill="#10b981" />
              <rect x="225" y="55" width="10" height="15" fill="#fef08a" rx="1" />
              <rect x="253" y="55" width="10" height="15" fill="#fef08a" rx="1" />
              <rect x="225" y="80" width="10" height="15" fill="#fef08a" rx="1" />
              <rect x="253" y="80" width="10" height="15" fill="#fef08a" rx="1" />
              <rect x="237" y="112" width="14" height="28" fill="#64748b" rx="1" />
              <path d="M 280 140 L 280 50 C 280 40 300 35 310 35 C 320 35 340 40 340 50 L 340 140 Z" fill="#3b82f6" />
              <rect x="292" y="65" width="12" height="18" fill="#fff" rx="1" />
              <rect x="314" y="65" width="12" height="18" fill="#fff" rx="1" />
              <rect x="292" y="90" width="12" height="18" fill="#fff" rx="1" />
              <rect x="314" y="90" width="12" height="18" fill="#fff" rx="1" />
              <rect x="303" y="118" width="14" height="22" fill="#0f172a" rx="1" />
              <path d="M 340 140 L 340 45 L 355 45 L 355 30 L 385 30 L 385 45 L 400 45 L 400 140 Z" fill="#8b5cf6" />
              <rect x="350" y="55" width="12" height="18" fill="#fef08a" />
              <rect x="376" y="55" width="12" height="18" fill="#fef08a" />
              <path d="M 400 140 L 400 30 C 400 20 425 15 440 15 C 455 15 480 20 480 30 L 480 140 Z" fill="#06b6d4" />
              <rect x="415" y="45" width="12" height="20" fill="#fff" />
              <rect x="445" y="45" width="12" height="20" fill="#fff" />
              <path d="M 480 140 L 480 60 L 515 15 L 550 60 L 550 140 Z" fill="#ec4899" />
              <rect x="495" y="75" width="12" height="18" fill="#fff" />
              <rect x="520" y="75" width="12" height="18" fill="#fff" />
              <path d="M 550 140 L 550 45 L 565 45 L 565 30 L 595 30 L 595 45 L 610 45 L 610 140 Z" fill="#14b8a6" />
              <rect x="560" y="55" width="12" height="18" fill="#fff" rx="1" />
              <rect x="584" y="55" width="12" height="18" fill="#fff" rx="1" />
              <path d="M 610 140 L 610 35 C 610 25 635 20 650 20 C 665 20 690 25 690 35 L 690 140 Z" fill="#f43f5e" />
              <path d="M 695 140 L 695 80 L 725 30 L 755 80 L 755 160 Z" fill="#eab308" />
              <path d="M 750 140 L 750 40 L 790 40 L 790 140 Z" fill="#6366f1" />
            </svg>
          </>
        )}

        {/* Y2K Sticker Cover */}
        {p.layout === 'y2k-sticker-cover' && typeof p.text === 'object' && (
          <>
            <DraggableText page={p} fieldKey="title" placeholder="MEMORIES" onUpdatePage={onUpdatePage} defaultStyle={{ top: '8%', left: '0', right: '0', height: '80px', fontFamily: 'var(--font-wavy)', fontSize: '2.5rem', fontWeight: '800', color: '#5b21b6', textAlign: 'center', textShadow: '2px 2px 0px #f472b6' }} />
            <DraggableText page={p} fieldKey="subtitle" placeholder="COOL VIBES ONLY" onUpdatePage={onUpdatePage} defaultStyle={{ top: '21%', left: '0', right: '0', height: '30px', fontFamily: 'var(--font-chunky)', fontSize: '1rem', color: '#db2777', textAlign: 'center' }} />
            <DraggableText page={p} fieldKey="body" placeholder="EST. 2026" onUpdatePage={onUpdatePage} defaultStyle={{ bottom: '5%', left: '10%', width: '40%', height: '30px', fontFamily: 'var(--font-rounded)', fontSize: '0.8rem', fontWeight: '700', color: '#7c3aed', textAlign: 'left' }} />
            <DraggableText page={p} fieldKey="extra" placeholder="BEST DAYS" onUpdatePage={onUpdatePage} defaultStyle={{ bottom: '5%', right: '10%', width: '40%', height: '30px', fontFamily: 'var(--font-rounded)', fontSize: '0.8rem', fontWeight: '700', color: '#7c3aed', textAlign: 'right' }} />
            
            <div className="sticker-float-slow" style={{ position: 'absolute', top: '12%', right: '8%', zIndex: 30, width: '40px', height: '40px', pointerEvents: 'none' }}>
              <svg viewBox="0 0 100 100" style={{ width: '100%', height: '100%', filter: 'drop-shadow(2px 3px 0px rgba(0,0,0,0.15))' }}>
                <g fill="#fff">
                  <circle cx="50" cy="20" r="15" /><circle cx="50" cy="80" r="15" /><circle cx="20" cy="50" r="15" /><circle cx="80" cy="50" r="15" />
                  <circle cx="28" cy="28" r="15" /><circle cx="72" cy="72" r="15" /><circle cx="72" cy="28" r="15" /><circle cx="28" cy="72" r="15" />
                </g>
                <circle cx="50" cy="50" r="18" fill="#facc15" />
              </svg>
            </div>
            <div className="sticker-float-medium" style={{ position: 'absolute', top: '48%', left: '4%', zIndex: 30, width: '35px', height: '35px', pointerEvents: 'none' }}>
              <svg viewBox="0 0 100 100" style={{ width: '100%', height: '100%', filter: 'drop-shadow(2px 3px 0px rgba(0,0,0,0.15))' }}>
                <circle cx="50" cy="50" r="48" fill="#a7f3d0" stroke="#047857" strokeWidth="4" />
                <circle cx="35" cy="40" r="6" fill="#047857" /><circle cx="65" cy="40" r="6" fill="#047857" />
                <path d="M 30 60 Q 50 80 70 60" fill="none" stroke="#047857" strokeWidth="6" strokeLinecap="round" />
              </svg>
            </div>
            <div className="sticker-float-slow" style={{ position: 'absolute', bottom: '15%', left: '8%', zIndex: 30, width: '25px', height: '25px', pointerEvents: 'none' }}>
              <svg viewBox="0 0 100 100" style={{ width: '100%', height: '100%', fill: '#67e8f9' }}>
                <path d="M 50 0 Q 50 50 0 50 Q 50 50 50 100 Q 50 50 100 50 Q 50 50 50 0 Z" />
              </svg>
            </div>
          </>
        )}

        {/* Retro Groovy Cover */}
        {p.layout === 'retro-groovy-cover' && typeof p.text === 'object' && (
          <>
            <DraggableText page={p} fieldKey="title" placeholder="GOOD VIBES" onUpdatePage={onUpdatePage} defaultStyle={{ top: '7%', left: '0', right: '0', height: '80px', fontFamily: 'var(--font-chunky)', fontSize: '2.8rem', color: '#7c2d12', textAlign: 'center', textShadow: '2px 2px 0px #fcd34d' }} />
            <DraggableText page={p} fieldKey="subtitle" placeholder="GOLDEN DAYS" onUpdatePage={onUpdatePage} defaultStyle={{ top: '20%', left: '0', right: '0', height: '30px', fontFamily: 'var(--font-rounded)', fontSize: '1rem', fontWeight: '700', color: '#b45309', textAlign: 'center' }} />
            <DraggableText page={p} fieldKey="body" placeholder="SINCE 2026" onUpdatePage={onUpdatePage} defaultStyle={{ bottom: '5%', left: '0', right: '0', height: '25px', fontFamily: 'var(--font-rounded)', fontSize: '0.85rem', fontWeight: '700', color: '#7c2d12', textAlign: 'center' }} />
            <DraggableText page={p} fieldKey="extra" placeholder="🌻 FLOWER POWER 🌻" onUpdatePage={onUpdatePage} defaultStyle={{ bottom: '10%', left: '0', right: '0', height: '25px', fontFamily: 'var(--font-rounded)', fontSize: '0.75rem', fontWeight: '600', color: '#9a3412', textAlign: 'center' }} />
            
            <div style={{ position: 'absolute', top: '22%', left: '50%', transform: 'translate(-50%, -50%)', width: '180px', height: '180px', opacity: 0.15, pointerEvents: 'none' }}>
              <svg viewBox="0 0 100 100" style={{ width: '100%', height: '100%', fill: 'none', stroke: '#fffdf5', strokeWidth: '3' }}>
                <circle cx="50" cy="50" r="22" />
                {Array.from({ length: 12 }).map((_, i) => {
                  const angle = (i * 30 * Math.PI) / 180;
                  return <line key={i} x1={50 + 26 * Math.cos(angle)} y1={50 + 26 * Math.sin(angle)} x2={50 + 38 * Math.cos(angle)} y2={50 + 38 * Math.sin(angle)} strokeLinecap="round" />;
                })}
              </svg>
            </div>
            <div className="sticker-float-slow" style={{ position: 'absolute', top: '12%', right: '8%', zIndex: 30, width: '40px', height: '40px', pointerEvents: 'none' }}>
              <svg viewBox="0 0 100 100" style={{ width: '100%', height: '100%' }}>
                <g fill="#f59e0b">
                  <circle cx="50" cy="20" r="18" /><circle cx="50" cy="80" r="18" /><circle cx="20" cy="50" r="18" /><circle cx="80" cy="50" r="18" />
                </g>
                <circle cx="50" cy="50" r="20" fill="#7c2d12" /><circle cx="50" cy="50" r="10" fill="#fff" />
              </svg>
            </div>
          </>
        )}

        {/* Comic Book Cover */}
        {p.layout === 'comic-pop-cover' && typeof p.text === 'object' && (
          <>
            <DraggableText page={p} fieldKey="title" placeholder="OMG!" onUpdatePage={onUpdatePage} defaultStyle={{ top: '6%', left: '0', right: '0', height: '70px', fontFamily: 'var(--font-display)', fontSize: '2.8rem', color: '#000000', textAlign: 'center', WebkitTextStroke: '2px white', textShadow: '3px 3px 0px #000000' }} />
            <DraggableText page={p} fieldKey="subtitle" placeholder="BEST TRIP EVER!" onUpdatePage={onUpdatePage} defaultStyle={{ bottom: '5%', left: '10%', width: '40%', height: '30px', fontFamily: 'var(--font-rounded)', fontSize: '0.85rem', fontWeight: '800', color: '#000000', textAlign: 'left' }} />
            <DraggableText page={p} fieldKey="body" placeholder="TO BE CONTINUED..." onUpdatePage={onUpdatePage} defaultStyle={{ bottom: '5%', right: '10%', width: '40%', height: '30px', fontFamily: 'var(--font-display)', fontSize: '0.75rem', color: '#e11d48', textAlign: 'right' }} />
            
            <div className="sticker-float-medium" style={{ position: 'absolute', top: '15%', right: '10%', zIndex: 30, pointerEvents: 'none' }}>
              <div className="comic-speech-bubble">
                <DraggableText page={p} fieldKey="extra" placeholder="POW!" onUpdatePage={onUpdatePage} defaultStyle={{ position: 'relative', width: '60px', height: '25px', fontFamily: 'var(--font-display)', fontSize: '0.75rem', color: '#000', textAlign: 'center' }} />
              </div>
            </div>
            <div style={{ position: 'absolute', top: '15%', left: '5%', zIndex: 5, width: '80px', height: '80px', opacity: 0.9, transform: 'rotate(15deg)', pointerEvents: 'none' }}>
              <svg viewBox="0 0 100 100" style={{ width: '100%', height: '100%', fill: '#06b6d4', filter: 'drop-shadow(3px 3px 0px #000)' }}>
                <polygon points="50,0 60,35 95,20 70,50 100,65 65,70 80,100 50,80 20,100 35,70 0,65 30,50 5,20 40,35" />
              </svg>
            </div>
          </>
        )}

        {/* Map Page */}
        {p.layout === 'map-page' && typeof p.text === 'object' && (
          <>
            <svg style={{ position: 'absolute', top: '10%', right: '5%', width: '80%', height: '80%', opacity: 0.15, fill: bookTheme ? bookTheme.textColor : 'black', pointerEvents: 'none' }} viewBox="0 0 100 100">
              <path d="M45,10 C55,5 65,15 70,25 C75,35 70,50 80,60 C90,70 85,85 70,90 C50,95 30,85 20,70 C10,50 15,30 25,20 C35,10 40,15 45,10 Z" />
              <circle cx="65" cy="35" r="3" fill={bookTheme ? bookTheme.textColor : 'black'} />
            </svg>
            <DraggableText page={p} fieldKey="title" placeholder="Title" onUpdatePage={onUpdatePage} defaultStyle={{ top: '10%', left: '10%', width: '60%', height: '80px', fontFamily: 'var(--font-serif)', fontSize: '2rem', color: bookTheme ? bookTheme.textColor : 'inherit', textAlign: 'left', lineHeight: '1.2' }} />
            <DraggableText page={p} fieldKey="body" placeholder="Trip Details (e.g. Dates, Locations)" onUpdatePage={onUpdatePage} defaultStyle={{ bottom: '10%', left: '10%', width: '50%', height: '100px', fontFamily: 'var(--font-sans)', fontSize: '0.8rem', color: bookTheme ? bookTheme.textColor : 'inherit', textAlign: 'left', opacity: 0.8, letterSpacing: '1px' }} />
          </>
        )}
      </div>
    );
  };

  const renderSinglePage = (p, isActive) => {
    if (!p) {
      return (
        <div className="spread-page-half" style={{ width: `${width}px`, height: `${height}px`, background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ color: '#cbd5e1', fontSize: '0.875rem' }}>Blank Page</span>
        </div>
      );
    }

    let gridStyle = { width: `${width}px`, height: `${height}px`, position: 'relative', background: bookTheme ? bookTheme.bgColor : 'white' };
    let containerClassName = '';
    
    if (p.layout === 'magazine-cover' || p.layout === 'cover') {
      gridStyle = { ...gridStyle, padding: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' };
    } else if (p.layout === 'city-pop-cover') {
      gridStyle = { ...gridStyle, padding: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(to bottom, #7dd3fc 0%, #bae6fd 60%, #e0f2fe 100%)' };
      containerClassName = 'city-pop-bg';
    } else if (p.layout === 'y2k-sticker-cover') {
      gridStyle = { ...gridStyle, padding: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' };
      containerClassName = 'y2k-checkered-bg';
    } else if (p.layout === 'retro-groovy-cover') {
      gridStyle = { ...gridStyle, padding: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #ff7e5f 0%, #feb47b 50%, #ffe066 100%)' };
      containerClassName = 'groovy-waves-bg';
    } else if (p.layout === 'comic-pop-cover') {
      gridStyle = { ...gridStyle, padding: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' };
      containerClassName = 'comic-pop-bg';
    } else if (p.layout === 'polaroid' || p.layout === 'polaroid-tape') {
      gridStyle = { ...gridStyle, padding: '1rem 1rem 4rem 1rem' };
    } else if (p.layout === 'moodboard') {
      gridStyle = { ...gridStyle, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gridTemplateRows: 'repeat(5, 1fr)', gap: '6px', padding: '12px' };
    } else if (p.layout === 'map-page') {
      gridStyle = { ...gridStyle, padding: '2rem' };
    } else if (p.layout === 'grid-2') {
      gridStyle = { ...gridStyle, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px', padding: '4px' };
    } else if (p.layout === 'asym-2') {
      gridStyle = { ...gridStyle, display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '4px', padding: '4px' };
    } else if (p.layout === 'grid-3') {
      gridStyle = { ...gridStyle, display: 'grid', gridTemplateColumns: '1fr 1fr', gridTemplateRows: '2fr 1fr', gap: '4px', padding: '4px' };
    } else if (p.layout === 'grid-4') {
      gridStyle = { ...gridStyle, display: 'grid', gridTemplateColumns: '1fr 1fr', gridTemplateRows: '1fr 1fr', gap: '4px', padding: '4px' };
    } else {
      gridStyle = { ...gridStyle, padding: 0 };
    }

    return (
      <div 
        className={`spread-page-half ${containerClassName} ${isActive ? 'active-page' : ''}`}
        style={gridStyle}
        onClick={(e) => {
          if (!isActive) {
            onSelectPage(p.id);
          }
        }}
      >
        {p.slots.map((slot, idx) => {
          const isGrid3First = p.layout === 'grid-3' && idx === 0;
          const isCover = p.layout === 'cover';
          const isMagazineCover = p.layout === 'magazine-cover';
          const isCityPop = p.layout === 'city-pop-cover';
          const isY2K = p.layout === 'y2k-sticker-cover';
          const isGroovy = p.layout === 'retro-groovy-cover';
          const isComic = p.layout === 'comic-pop-cover';

          let wrapperStyle = {};
          if (isGrid3First) {
            wrapperStyle = { gridColumn: '1 / span 2' };
          } else if (isCover) {
            wrapperStyle = { width: '80%', aspectRatio: '1', margin: '0 auto', boxShadow: 'var(--shadow-md)', borderRadius: 'var(--radius-sm)', overflow: 'hidden' };
          } else if (isMagazineCover) {
            wrapperStyle = { width: '85%', height: '85%', margin: '0 auto', border: '10px solid white', overflow: 'hidden', zIndex: 10, position: 'relative' };
          } else if (p.layout === 'moodboard') {
            wrapperStyle = { borderRadius: '8px', overflow: 'hidden' };
          } else if (isCityPop) {
            wrapperStyle = { width: '60%', height: '52%', margin: '-30px auto 0 auto', border: '8px solid white', boxShadow: 'var(--shadow-lg)', transform: 'rotate(-4deg)', zIndex: 10, position: 'relative', overflow: 'hidden' };
          } else if (isY2K) {
            if (idx === 0) {
              wrapperStyle = { width: '42%', height: '42%', position: 'absolute', top: '35%', left: '8%', border: '6px solid white', boxShadow: 'var(--shadow-md)', transform: 'rotate(-8deg)', zIndex: 10, overflow: 'hidden' };
            } else {
              wrapperStyle = { width: '42%', height: '42%', position: 'absolute', bottom: '15%', right: '8%', border: '6px solid white', boxShadow: 'var(--shadow-md)', transform: 'rotate(6deg)', zIndex: 10, overflow: 'hidden' };
            }
          } else if (isGroovy) {
            wrapperStyle = { width: '58%', height: '54%', margin: '-20px auto 0 auto', border: '8px solid #fffdf5', borderRadius: '120px 120px 0px 0px', boxShadow: 'var(--shadow-lg)', overflow: 'hidden', zIndex: 10, position: 'relative' };
          } else if (isComic) {
            if (idx === 0) {
              wrapperStyle = { width: '45%', height: '45%', position: 'absolute', top: '32%', left: '6%', border: '4px solid black', boxShadow: '6px 6px 0px black', transform: 'skewX(-3deg) rotate(-2deg)', zIndex: 10, overflow: 'hidden' };
            } else {
              wrapperStyle = { width: '45%', height: '45%', position: 'absolute', bottom: '12%', right: '6%', border: '4px solid black', boxShadow: '6px 6px 0px black', transform: 'skewX(3deg) rotate(3deg)', zIndex: 10, overflow: 'hidden' };
            }
          }

          return (
            <div key={idx} style={wrapperStyle}>
              <ImageSlot 
                slot={slot} 
                index={idx} 
                pageId={p.id} 
                layout={p.layout} 
                bookConfig={bookConfig} 
                onUpdateSlot={(slotIndex, slotUpdates) => {
                  const newSlots = [...p.slots];
                  newSlots[slotIndex] = { ...newSlots[slotIndex], ...slotUpdates };
                  onUpdatePage(p.id, { slots: newSlots });
                }} 
              />
            </div>
          );
        })}

        {/* Decorative Tape for polaroid-tape */}
        {p.layout === 'polaroid-tape' && (
          <>
            <div style={{ position: 'absolute', top: '-10px', right: '-10px', width: '80px', height: '25px', background: 'rgba(255,255,255,0.7)', transform: 'rotate(45deg)', zIndex: 60, boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}></div>
            <div style={{ position: 'absolute', bottom: '30px', left: '-20px', width: '100px', height: '30px', background: 'rgba(255,255,255,0.7)', transform: 'rotate(-15deg)', zIndex: 60, boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}></div>
          </>
        )}

        {/* Draggable texts and custom vector graphics for the page */}
        {renderTextsAndDecorations(p)}

        {/* Interactive / Draggable Stickers */}
        {(p.stickers || []).map((sticker) => {
          const StickerInfo = STICKER_ASSETS[sticker.type];
          if (!StickerInfo) return null;
          const StickerSvg = StickerInfo.render;
          const stickerScale = sticker.scale || 1.0;
          const stickerRotation = sticker.rotation || 0;
          const baseSize = 80;

          return (
            <motion.div
              key={sticker.id}
              className="canvas-sticker-wrapper"
              drag={isActive}
              dragMomentum={false}
              animate={{ x: sticker.x, y: sticker.y }}
              onDragEnd={(event, info) => {
                if (onUpdateSticker) {
                  onUpdateSticker(p.id, sticker.id, {
                    x: sticker.x + info.offset.x,
                    y: sticker.y + info.offset.y
                  });
                }
              }}
              style={{
                left: 0,
                top: 0,
                width: `${baseSize}px`,
                height: `${baseSize}px`,
                transform: `scale(${stickerScale}) rotate(${stickerRotation}deg)`,
                transformOrigin: 'center center',
                cursor: isActive ? 'move' : 'default'
              }}
            >
              <div style={{ width: '100%', height: '100%', pointerEvents: 'none' }}>
                <StickerSvg />
              </div>
              
              {isActive && (
                <>
                  {/* Rotate Button */}
                  <button 
                    className="sticker-control-btn sticker-rotate-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (onUpdateSticker) {
                        onUpdateSticker(p.id, sticker.id, { rotation: (stickerRotation + 15) % 360 });
                      }
                    }}
                    title="Rotate Sticker"
                  >
                    ⟳
                  </button>

                  {/* Delete Button */}
                  <button 
                    className="sticker-control-btn sticker-delete-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (onRemoveSticker) onRemoveSticker(p.id, sticker.id);
                    }}
                    title="Delete Sticker"
                  >
                    ✕
                  </button>

                  {/* Scale Up Button */}
                  <button 
                    className="sticker-control-btn sticker-scale-up-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (onUpdateSticker) {
                        onUpdateSticker(p.id, sticker.id, { scale: Math.min(3.0, stickerScale + 0.1) });
                      }
                    }}
                    title="Scale Up"
                  >
                    ＋
                  </button>

                  {/* Scale Down Button */}
                  <button 
                    className="sticker-control-btn sticker-scale-down-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (onUpdateSticker) {
                        onUpdateSticker(p.id, sticker.id, { scale: Math.max(0.3, stickerScale - 0.1) });
                      }
                    }}
                    title="Scale Down"
                  >
                    －
                  </button>
                </>
              )}
            </motion.div>
          );
        })}
      </div>
    );
  };

  const handleUpdateBackSlot = (slotIdx, updates) => {
    const newBackSlots = [...page.backSlots];
    newBackSlots[slotIdx] = { ...newBackSlots[slotIdx], ...updates };
    onUpdatePage(page.id, { backSlots: newBackSlots });
  };

  // COVER SPREAD MODE
  if (activeIndex === 0) {
    let containerClassName = '';
    if (page.layout === 'y2k-sticker-cover') {
      containerClassName = 'y2k-checkered-bg';
    } else if (page.layout === 'comic-pop-cover') {
      containerClassName = 'comic-pop-bg';
    } else if (page.layout === 'city-pop-cover') {
      containerClassName = 'city-pop-bg';
    } else if (page.layout === 'retro-groovy-cover') {
      containerClassName = 'groovy-waves-bg';
    }

    return (
      <div className="canvas-container">
        <div className="cover-spread-container" style={{ width: `${width * 2 + 24}px`, height: `${height}px` }}>
          {/* Back Cover (Left Side) */}
          <div 
            className={`spread-page-half ${containerClassName}`} 
            style={{ width: `${width}px`, height: `${height}px`, position: 'relative', borderRight: '1px solid rgba(0,0,0,0.05)' }}
          >
            {/* 4 Photo Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gridTemplateRows: '1fr 1fr', gap: '8px', width: '80%', height: '62%', margin: '2rem auto 0 auto', zIndex: 10, position: 'relative' }}>
              {(page.backSlots || []).map((slot, idx) => (
                <div key={idx} style={{ width: '100%', height: '100%', border: '4px solid white', boxShadow: 'var(--shadow-md)', overflow: 'hidden' }}>
                  <ImageSlot 
                    slot={slot} 
                    index={idx} 
                    pageId={page.id} 
                    layout="grid-4" 
                    bookConfig={bookConfig} 
                    onUpdateSlot={handleUpdateBackSlot} 
                  />
                </div>
              ))}
            </div>

            {/* Back Cover Typography */}
            {page.backText && (
              <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 40 }}>
                <DraggableText
                  page={page}
                  fieldKey="title"
                  placeholder="AMSTERDAM"
                  isBackCover={true}
                  onUpdatePage={onUpdatePage}
                  defaultStyle={{
                    bottom: '12%', left: '0', right: '0', height: '40px',
                    fontFamily: page.layout.includes('city') ? 'var(--font-rounded)' :
                                page.layout.includes('y2k') ? 'var(--font-wavy)' :
                                page.layout.includes('groovy') ? 'var(--font-chunky)' :
                                page.layout.includes('comic') ? 'var(--font-display)' : 'var(--font-serif)',
                    fontSize: '2rem', fontWeight: '800', 
                    color: bookTheme ? bookTheme.textColor : 'inherit', textAlign: 'center'
                  }}
                />
                <DraggableText
                  page={page}
                  fieldKey="subtitle"
                  placeholder="2026"
                  isBackCover={true}
                  onUpdatePage={onUpdatePage}
                  defaultStyle={{
                    bottom: '5%', left: '0', right: '0', height: '30px',
                    fontFamily: 'var(--font-rounded)',
                    fontSize: '1rem', fontWeight: '700', 
                    color: bookTheme ? bookTheme.textColor : 'inherit', textAlign: 'center', opacity: 0.95
                  }}
                />
              </div>
            )}
          </div>

          {/* Spine (Middle Divider) */}
          <div 
            className="book-spine" 
            style={{ 
              background: bookTheme ? bookTheme.bgColor : 'white', 
              color: bookTheme ? bookTheme.textColor : 'black',
              height: `${height}px`
            }}
          >
            <div className="book-spine-text">
              {page.text?.title?.text || ''} {page.text?.subtitle?.text || ''}
            </div>
          </div>

          {/* Front Cover (Right Side) */}
          {renderSinglePage(page, true)}
        </div>
      </div>
    );
  }

  // INSIDE PAGES SPREAD MODE
  // Odd indices (1, 3, 5) are Left pages; Even indices (2, 4, 6) are Right pages
  const isOdd = activeIndex % 2 !== 0;
  const leftPage = isOdd ? pages[activeIndex] : pages[activeIndex - 1];
  const rightPage = isOdd ? pages[activeIndex + 1] : pages[activeIndex];

  return (
    <div className="canvas-container">
      <div className="book-spread-container" style={{ width: `${width * 2 + 12}px`, height: `${height}px` }}>
        {/* Left Inside Page */}
        {renderSinglePage(leftPage, activePageId === leftPage?.id)}

        {/* Central Gutter / Binding Separator */}
        <div className="book-gutter" style={{ height: `${height}px` }} />

        {/* Right Inside Page */}
        {renderSinglePage(rightPage, activePageId === rightPage?.id)}
      </div>
    </div>
  );
}
