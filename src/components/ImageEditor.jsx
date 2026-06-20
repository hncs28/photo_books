import React, { useState, useCallback } from 'react';
import Cropper from 'react-easy-crop';
import { Check, X, ZoomIn, ZoomOut } from 'lucide-react';
import getCroppedImg from '../utils/cropImage';

export default function ImageEditor({ image, aspectRatio, onSave, onCancel }) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleSave = async () => {
    try {
      const croppedImage = await getCroppedImg(image, croppedAreaPixels, 0);
      onSave(croppedImage, { crop, zoom });
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div style={{ 
      position: 'fixed', 
      inset: 0, 
      zIndex: 1000, 
      background: 'rgba(15, 23, 42, 0.8)', 
      backdropFilter: 'blur(8px)',
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      padding: '1rem',
      pointerEvents: 'auto'
    }}>
      <div style={{ 
        position: 'relative', 
        width: '90%', 
        maxWidth: '560px', 
        height: '80vh', 
        maxHeight: '650px', 
        background: '#1e293b', 
        borderRadius: 'var(--radius-lg)', 
        border: '1px solid rgba(255, 255, 255, 0.15)',
        overflow: 'hidden',
        boxShadow: 'var(--shadow-2xl)',
        display: 'flex',
        flexDirection: 'column'
      }}>
        {/* Header */}
        <div style={{ 
          padding: '1rem 1.5rem', 
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)', 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          color: 'white',
          fontWeight: '600'
        }}>
          <span style={{ fontSize: '1rem', fontFamily: 'var(--font-sans)' }}>Crop & Adjust Photo</span>
          <button 
            onClick={onCancel} 
            style={{ background: 'transparent', border: 'none', color: 'rgba(255, 255, 255, 0.6)', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Cropper Container */}
        <div style={{ 
          position: 'relative', 
          flex: 1, 
          background: '#090d16' 
        }}>
          <Cropper
            image={image}
            crop={crop}
            zoom={zoom}
            aspect={aspectRatio}
            onCropChange={setCrop}
            onCropComplete={onCropComplete}
            onZoomChange={setZoom}
          />
        </div>

        {/* Footer controls */}
        <div style={{ 
          padding: '1.25rem 1.5rem', 
          background: '#0f172a',
          borderTop: '1px solid rgba(255, 255, 255, 0.1)',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
          alignItems: 'center'
        }}>
          {/* Zoom Slider Row */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', width: '100%', color: 'white' }}>
            <button 
              className="editor-btn"
              onClick={() => setZoom(Math.max(1, zoom - 0.1))}
              style={{ padding: '0.25rem' }}
            >
              <ZoomOut size={18} />
            </button>
            <input
              type="range"
              value={zoom}
              min={1}
              max={3}
              step={0.1}
              aria-label="Zoom"
              className="zoom-slider"
              style={{ flex: 1, height: '4px', accentColor: 'var(--primary-color)' }}
              onChange={(e) => setZoom(Number(e.target.value))}
            />
            <button 
              className="editor-btn"
              onClick={() => setZoom(Math.min(3, zoom + 0.1))}
              style={{ padding: '0.25rem' }}
            >
              <ZoomIn size={18} />
            </button>
          </div>

          {/* Action Buttons Row */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', width: '100%' }}>
            <button 
              className="btn btn-secondary" 
              style={{ padding: '0.5rem 1.25rem', fontSize: '0.875rem', color: 'white', borderColor: 'rgba(255,255,255,0.2)' }} 
              onClick={onCancel}
            >
              Cancel
            </button>
            <button 
              className="btn btn-primary" 
              style={{ padding: '0.5rem 1.5rem', fontSize: '0.875rem' }} 
              onClick={handleSave}
            >
              Apply Crop
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
