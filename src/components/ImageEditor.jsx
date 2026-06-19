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
    <div style={{ position: 'absolute', inset: 0, zIndex: 10, background: '#000' }}>
      <Cropper
        image={image}
        crop={crop}
        zoom={zoom}
        aspect={aspectRatio}
        onCropChange={setCrop}
        onCropComplete={onCropComplete}
        onZoomChange={setZoom}
      />
      
      <div className="editor-controls animate-fade-in">
        <button className="editor-btn" onClick={() => setZoom(Math.max(1, zoom - 0.1))}>
          <ZoomOut size={20} />
        </button>
        
        <input
          type="range"
          value={zoom}
          min={1}
          max={3}
          step={0.1}
          aria-label="Zoom"
          className="zoom-slider"
          onChange={(e) => setZoom(Number(e.target.value))}
        />
        
        <button className="editor-btn" onClick={() => setZoom(Math.min(3, zoom + 0.1))}>
          <ZoomIn size={20} />
        </button>

        <div style={{ width: '1px', height: '24px', background: 'rgba(255,255,255,0.2)', margin: '0 0.5rem' }} />

        <button className="editor-btn" onClick={onCancel} title="Cancel">
          <X size={20} />
        </button>
        
        <button className="editor-btn primary" onClick={handleSave} title="Apply">
          <Check size={20} />
        </button>
      </div>
    </div>
  );
}
