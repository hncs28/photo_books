import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { UploadCloud } from 'lucide-react';

export default function SecondaryPanel({ activeTab, uploadedImages, onImagesUpload, onImageSelect, onAutofill, onUpdatePage, activePage }) {
  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles && acceptedFiles.length > 0) {
      const newImages = acceptedFiles.map(file => URL.createObjectURL(file));
      onImagesUpload(newImages);
    }
  }, [onImagesUpload]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': [] }
  });

  return (
    <div className="secondary-panel">
      {activeTab === 'uploads' && (
        <>
          <div className="panel-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>Upload Media</span>
            {uploadedImages.length > 0 && (
              <button 
                className="btn btn-primary" 
                style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem' }}
                onClick={onAutofill}
              >
                Autofill Book
              </button>
            )}
          </div>
          <div className="panel-content">
            <div 
              {...getRootProps()} 
              style={{
                background: isDragActive ? 'rgba(139, 92, 246, 0.1)' : 'var(--surface-light)',
                border: `2px dashed ${isDragActive ? 'var(--primary-color)' : 'var(--border-color)'}`,
                borderRadius: 'var(--radius-md)',
                padding: '2rem 1rem',
                textAlign: 'center',
                cursor: 'pointer',
                color: 'var(--text-secondary)'
              }}
            >
              <input {...getInputProps()} />
              <UploadCloud size={32} style={{ marginBottom: '0.5rem', color: 'var(--primary-color)' }} />
              <p style={{ fontSize: '0.875rem' }}>Drag & drop images here, or click to browse</p>
            </div>

            <div className="image-grid">
              {uploadedImages.map((imgUrl, idx) => (
                <div key={idx} className="image-thumbnail" onClick={() => onImageSelect(imgUrl)}>
                  <img src={imgUrl} alt={`Uploaded ${idx}`} />
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {activeTab === 'layouts' && (
        <>
          <div className="panel-header">Layouts</div>
          <div className="panel-content">
            <div 
              style={{ padding: '1rem', border: `2px solid ${activePage?.layout === 'full' ? 'var(--primary-color)' : 'var(--border-color)'}`, borderRadius: 'var(--radius-md)', cursor: 'pointer', marginBottom: '1rem' }}
              onClick={() => activePage && onUpdatePage(activePage.id, { layout: 'full' })}
            >
              <div style={{ width: '100%', height: '80px', background: '#ccc' }}></div>
              <p style={{ marginTop: '0.5rem', textAlign: 'center', fontSize: '0.875rem' }}>Full Bleed</p>
            </div>
            
            <div 
              style={{ padding: '1rem', border: `2px solid ${activePage?.layout === 'polaroid' ? 'var(--primary-color)' : 'var(--border-color)'}`, borderRadius: 'var(--radius-md)', cursor: 'pointer', marginBottom: '1rem' }}
              onClick={() => activePage && onUpdatePage(activePage.id, { layout: 'polaroid' })}
            >
              <div style={{ width: '100%', height: '80px', background: 'white', border: '1px solid #ccc', padding: '10px 10px 20px 10px' }}>
                <div style={{ width: '100%', height: '100%', background: '#ccc' }}></div>
              </div>
              <p style={{ marginTop: '0.5rem', textAlign: 'center', fontSize: '0.875rem' }}>Polaroid Style</p>
            </div>
            
            <div 
              style={{ padding: '1rem', border: `2px solid ${activePage?.layout === 'grid-2' ? 'var(--primary-color)' : 'var(--border-color)'}`, borderRadius: 'var(--radius-md)', cursor: 'pointer', marginBottom: '1rem' }}
              onClick={() => activePage && onUpdatePage(activePage.id, { layout: 'grid-2' })}
            >
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px', width: '100%', height: '80px' }}>
                <div style={{ background: '#ccc' }}></div>
                <div style={{ background: '#ccc' }}></div>
              </div>
              <p style={{ marginTop: '0.5rem', textAlign: 'center', fontSize: '0.875rem' }}>2 Images (Split)</p>
            </div>
            
            <div 
              style={{ padding: '1rem', border: `2px solid ${activePage?.layout === 'grid-4' ? 'var(--primary-color)' : 'var(--border-color)'}`, borderRadius: 'var(--radius-md)', cursor: 'pointer' }}
              onClick={() => activePage && onUpdatePage(activePage.id, { layout: 'grid-4' })}
            >
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gridTemplateRows: '1fr 1fr', gap: '4px', width: '100%', height: '80px' }}>
                <div style={{ background: '#ccc' }}></div>
                <div style={{ background: '#ccc' }}></div>
                <div style={{ background: '#ccc' }}></div>
                <div style={{ background: '#ccc' }}></div>
              </div>
              <p style={{ marginTop: '0.5rem', textAlign: 'center', fontSize: '0.875rem' }}>4 Images (Grid)</p>
            </div>
          </div>
        </>
      )}

      {activeTab === 'backgrounds' && (
        <>
          <div className="panel-header">Backgrounds</div>
          <div className="panel-content">
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Select a page background color or texture. (Coming Soon)</p>
          </div>
        </>
      )}

      {activeTab === 'text' && (
        <>
          <div className="panel-header">Text & Captions</div>
          <div className="panel-content">
            <button 
              className="btn btn-secondary" 
              style={{ width: '100%', padding: '1rem', border: '1px solid var(--border-color)', fontFamily: 'var(--font-serif)', fontSize: '1.25rem' }}
              onClick={() => activePage && onUpdatePage(activePage.id, { text: 'Your travel memory...' })}
            >
              Add a Caption
            </button>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginTop: '1rem' }}>Click to add a caption to the active page. You can edit the text directly on the canvas.</p>
          </div>
        </>
      )}
    </div>
  );
}
