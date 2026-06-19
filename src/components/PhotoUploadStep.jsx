import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { UploadCloud, ArrowRight, Image as ImageIcon } from 'lucide-react';

export default function PhotoUploadStep({ onComplete }) {
  const [uploadedImages, setUploadedImages] = useState([]);

  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles && acceptedFiles.length > 0) {
      const newImages = acceptedFiles.map(file => URL.createObjectURL(file));
      setUploadedImages(prev => [...prev, ...newImages]);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': [] }
  });

  return (
    <div className="modal-overlay">
      <div className="modal-content animate-fade-in" style={{ maxWidth: '800px', height: '80vh', display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem' }}>Upload your memories</h2>
            <p style={{ color: 'var(--text-secondary)' }}>Select all the photos you want in your book. We'll automatically arrange them for you.</p>
          </div>
          <button 
            className="btn btn-primary" 
            style={{ padding: '0.75rem 1.5rem', fontSize: '1.1rem', display: 'flex', gap: '0.5rem', opacity: uploadedImages.length > 0 ? 1 : 0.5 }}
            disabled={uploadedImages.length === 0}
            onClick={() => onComplete(uploadedImages)}
          >
            Auto-Generate Book <ArrowRight size={20} />
          </button>
        </div>

        <div 
          {...getRootProps()} 
          style={{
            flexGrow: 1,
            background: isDragActive ? 'rgba(139, 92, 246, 0.05)' : 'var(--surface-light)',
            border: `2px dashed ${isDragActive ? 'var(--primary-color)' : 'var(--border-color)'}`,
            borderRadius: 'var(--radius-md)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            transition: 'all 0.2s',
            marginTop: '1.5rem'
          }}
        >
          <input {...getInputProps()} />
          
          {uploadedImages.length === 0 ? (
            <div style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>
              <UploadCloud size={64} style={{ marginBottom: '1rem', color: 'var(--primary-color)', opacity: 0.8 }} />
              <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', color: 'var(--text-primary)' }}>Drag & Drop photos here</h3>
              <p>or click to browse your files</p>
            </div>
          ) : (
            <div style={{ width: '100%', height: '100%', padding: '2rem', overflowY: 'auto' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <span style={{ fontWeight: 600 }}>{uploadedImages.length} photos selected</span>
                <span style={{ color: 'var(--text-secondary)' }}>Click or drag more to add</span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: '1rem' }}>
                {uploadedImages.map((img, i) => (
                  <div key={i} style={{ aspectRatio: 1, borderRadius: 'var(--radius-sm)', overflow: 'hidden', boxShadow: 'var(--shadow-sm)' }}>
                    <img src={img} alt={`Upload ${i}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
