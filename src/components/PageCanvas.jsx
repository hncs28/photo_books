import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { ImagePlus, Edit3 } from 'lucide-react';
import ImageEditor from './ImageEditor';

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

export default function PageCanvas({ page, bookConfig, onUpdatePage }) {
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
  let gridStyle = { width: '100%', height: '100%', position: 'relative' };
  if (page.layout === 'polaroid') {
    gridStyle = { ...gridStyle, background: 'white', padding: '1rem 1rem 4rem 1rem' };
  } else if (page.layout === 'grid-2') {
    gridStyle = { ...gridStyle, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px', background: 'white', padding: '4px' };
  } else if (page.layout === 'grid-4') {
    gridStyle = { ...gridStyle, display: 'grid', gridTemplateColumns: '1fr 1fr', gridTemplateRows: '1fr 1fr', gap: '4px', background: 'white', padding: '4px' };
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
          {page.slots.map((slot, idx) => (
            <ImageSlot 
              key={idx} 
              slot={slot} 
              index={idx} 
              pageId={page.id} 
              layout={page.layout} 
              bookConfig={bookConfig} 
              onUpdateSlot={handleUpdateSlot} 
            />
          ))}
          
          {page.text && (
            <textarea
              value={page.text}
              onChange={(e) => onUpdatePage(page.id, { text: e.target.value })}
              style={{
                position: 'absolute',
                bottom: page.layout === 'polaroid' ? '0.5rem' : '2rem',
                left: '1rem',
                right: '1rem',
                textAlign: 'center',
                background: 'transparent',
                border: 'none',
                outline: 'none',
                resize: 'none',
                fontFamily: 'var(--font-serif)',
                fontSize: '1.25rem',
                color: page.layout === 'polaroid' ? 'var(--text-primary)' : 'white',
                textShadow: page.layout === 'polaroid' ? 'none' : '0 2px 4px rgba(0,0,0,0.5)',
                overflow: 'hidden',
                zIndex: 40
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
}
