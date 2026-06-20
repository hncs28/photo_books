import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { UploadCloud } from 'lucide-react';
import { STICKER_ASSETS } from '../utils/stickers';

export default function SecondaryPanel({ activeTab, uploadedImages, onImagesUpload, onImageSelect, onAutofill, onUpdatePage, activePage, onAddSticker, onClosePanel, isCollapsed }) {
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
    <div className={`secondary-panel ${isCollapsed ? 'collapsed' : ''}`}>
      {activeTab === 'uploads' && (
        <>
          <div className="panel-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>Upload Media</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              {uploadedImages.length > 0 && (
                <button 
                  className="btn btn-primary" 
                  style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem' }}
                  onClick={onAutofill}
                >
                  Autofill
                </button>
              )}
              <button 
                onClick={onClosePanel} 
                style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', fontSize: '1rem', padding: '0.25rem', display: 'flex', alignItems: 'center' }}
                title="Collapse Panel"
              >
                ✕
              </button>
            </div>
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
          <div className="panel-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>Layouts</span>
            <button 
              onClick={onClosePanel} 
              style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', fontSize: '1rem', padding: '0.25rem', display: 'flex', alignItems: 'center' }}
              title="Collapse Panel"
            >
              ✕
            </button>
          </div>
          <div className="panel-content">
            {/* Advanced Layouts */}
            <div style={{ padding: '0.5rem 0', fontWeight: 'bold', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Editorial Covers</div>
            
            <div 
              style={{ padding: '1rem', border: `2px solid ${activePage?.layout === 'magazine-cover' ? 'var(--primary-color)' : 'var(--border-color)'}`, borderRadius: 'var(--radius-md)', cursor: 'pointer', marginBottom: '1rem' }}
              onClick={() => activePage && onUpdatePage(activePage.id, { layout: 'magazine-cover' })}
            >
              <div style={{ width: '100%', height: '80px', background: '#ccc', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', border: '4px solid white' }}>
                <span style={{ fontSize: '1rem', fontWeight: 800 }}>PARIS</span>
              </div>
              <p style={{ marginTop: '0.5rem', textAlign: 'center', fontSize: '0.875rem' }}>Magazine Cover</p>
            </div>

            <div 
              style={{ padding: '1rem', border: `2px solid ${activePage?.layout === 'cover' ? 'var(--primary-color)' : 'var(--border-color)'}`, borderRadius: 'var(--radius-md)', cursor: 'pointer', marginBottom: '1rem' }}
              onClick={() => activePage && onUpdatePage(activePage.id, { layout: 'cover' })}
            >
              <div style={{ width: '100%', height: '80px', background: '#ccc', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 600 }}>TITLE</span>
              </div>
              <p style={{ marginTop: '0.5rem', textAlign: 'center', fontSize: '0.875rem' }}>Basic Cover</p>
            </div>

            {/* Teen & Playful Covers */}
            <div style={{ padding: '0.5rem 0', fontWeight: 'bold', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Teen & Playful Covers</div>
            
            <div 
              style={{ padding: '1rem', border: `2px solid ${activePage?.layout === 'city-pop-cover' ? 'var(--primary-color)' : 'var(--border-color)'}`, borderRadius: 'var(--radius-md)', cursor: 'pointer', marginBottom: '1rem' }}
              onClick={() => activePage && onUpdatePage(activePage.id, { layout: 'city-pop-cover' })}
            >
              <div style={{ width: '100%', height: '80px', background: 'linear-gradient(to bottom, #7dd3fc, #bae6fd)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden', borderRadius: '4px' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 800, fontFamily: 'Fredoka', color: '#0f172a', zIndex: 10 }}>CITY POP</span>
                <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '25px', display: 'flex', gap: '2px', alignItems: 'flex-end', justifyContent: 'center', zIndex: 5 }}>
                  <div style={{ width: '12px', height: '18px', background: '#fb7185', borderRadius: '2px 2px 0 0' }}></div>
                  <div style={{ width: '14px', height: '25px', background: '#f59e0b', borderRadius: '2px 2px 0 0' }}></div>
                  <div style={{ width: '12px', height: '15px', background: '#10b981', borderRadius: '2px 2px 0 0' }}></div>
                  <div style={{ width: '15px', height: '22px', background: '#3b82f6', borderRadius: '2px 2px 0 0' }}></div>
                </div>
              </div>
              <p style={{ marginTop: '0.5rem', textAlign: 'center', fontSize: '0.875rem' }}>City Pop Cover</p>
            </div>

            <div 
              style={{ padding: '1rem', border: `2px solid ${activePage?.layout === 'y2k-sticker-cover' ? 'var(--primary-color)' : 'var(--border-color)'}`, borderRadius: 'var(--radius-md)', cursor: 'pointer', marginBottom: '1rem' }}
              onClick={() => activePage && onUpdatePage(activePage.id, { layout: 'y2k-sticker-cover' })}
            >
              <div className="y2k-checkered-bg" style={{ width: '100%', height: '80px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', position: 'relative', borderRadius: '4px' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 800, fontFamily: 'Syne', color: '#5b21b6' }}>Y2K POP</span>
                <span style={{ position: 'absolute', top: '5px', left: '10px', fontSize: '10px' }}>🌸</span>
                <span style={{ position: 'absolute', bottom: '5px', right: '10px', fontSize: '10px' }}>⭐</span>
              </div>
              <p style={{ marginTop: '0.5rem', textAlign: 'center', fontSize: '0.875rem' }}>Y2K Sticker Cover</p>
            </div>

            <div 
              style={{ padding: '1rem', border: `2px solid ${activePage?.layout === 'retro-groovy-cover' ? 'var(--primary-color)' : 'var(--border-color)'}`, borderRadius: 'var(--radius-md)', cursor: 'pointer', marginBottom: '1rem' }}
              onClick={() => activePage && onUpdatePage(activePage.id, { layout: 'retro-groovy-cover' })}
            >
              <div style={{ width: '100%', height: '80px', background: 'linear-gradient(135deg, #ff7e5f, #ffe066)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', position: 'relative', borderRadius: '4px' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 800, fontFamily: 'Chewy', color: '#7c2d12' }}>GROOVY</span>
                <span style={{ position: 'absolute', bottom: '5px', left: '15px', fontSize: '12px' }}>🌻</span>
              </div>
              <p style={{ marginTop: '0.5rem', textAlign: 'center', fontSize: '0.875rem' }}>Groovy 70s Cover</p>
            </div>

            <div 
              style={{ padding: '1rem', border: `2px solid ${activePage?.layout === 'comic-pop-cover' ? 'var(--primary-color)' : 'var(--border-color)'}`, borderRadius: 'var(--radius-md)', cursor: 'pointer', marginBottom: '1rem' }}
              onClick={() => activePage && onUpdatePage(activePage.id, { layout: 'comic-pop-cover' })}
            >
              <div className="comic-pop-bg" style={{ width: '100%', height: '80px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', border: '3px solid black', boxSizing: 'border-box', borderRadius: '4px' }}>
                <span style={{ fontSize: '1rem', fontWeight: 900, fontFamily: 'Bungee', color: '#000000', WebkitTextStroke: '1px white' }}>POW!</span>
              </div>
              <p style={{ marginTop: '0.5rem', textAlign: 'center', fontSize: '0.875rem' }}>Comic Book Cover</p>
            </div>

            <div style={{ padding: '0.5rem 0', fontWeight: 'bold', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Collages & Maps</div>

            <div 
              style={{ padding: '1rem', border: `2px solid ${activePage?.layout === 'moodboard' ? 'var(--primary-color)' : 'var(--border-color)'}`, borderRadius: 'var(--radius-md)', cursor: 'pointer', marginBottom: '1rem' }}
              onClick={() => activePage && onUpdatePage(activePage.id, { layout: 'moodboard' })}
            >
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gridTemplateRows: 'repeat(4, 1fr)', gap: '2px', width: '100%', height: '80px' }}>
                {Array.from({length: 12}).map((_, i) => <div key={i} style={{ background: '#ccc' }}></div>)}
              </div>
              <p style={{ marginTop: '0.5rem', textAlign: 'center', fontSize: '0.875rem' }}>Moodboard (14 pics)</p>
            </div>

            <div 
              style={{ padding: '1rem', border: `2px solid ${activePage?.layout === 'map-page' ? 'var(--primary-color)' : 'var(--border-color)'}`, borderRadius: 'var(--radius-md)', cursor: 'pointer', marginBottom: '1rem' }}
              onClick={() => activePage && onUpdatePage(activePage.id, { layout: 'map-page' })}
            >
              <div style={{ width: '100%', height: '80px', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontSize: '1.5rem' }}>🗺️</span>
              </div>
              <p style={{ marginTop: '0.5rem', textAlign: 'center', fontSize: '0.875rem' }}>Trip Map</p>
            </div>

            <div style={{ padding: '0.5rem 0', fontWeight: 'bold', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Standard Grids</div>

            <div 
              style={{ padding: '1rem', border: `2px solid ${activePage?.layout === 'full' ? 'var(--primary-color)' : 'var(--border-color)'}`, borderRadius: 'var(--radius-md)', cursor: 'pointer', marginBottom: '1rem' }}
              onClick={() => activePage && onUpdatePage(activePage.id, { layout: 'full' })}
            >
              <div style={{ width: '100%', height: '80px', background: '#ccc' }}></div>
              <p style={{ marginTop: '0.5rem', textAlign: 'center', fontSize: '0.875rem' }}>Full Page</p>
            </div>
            
            <div 
              style={{ padding: '1rem', border: `2px solid ${activePage?.layout === 'polaroid' ? 'var(--primary-color)' : 'var(--border-color)'}`, borderRadius: 'var(--radius-md)', cursor: 'pointer', marginBottom: '1rem' }}
              onClick={() => activePage && onUpdatePage(activePage.id, { layout: 'polaroid' })}
            >
              <div style={{ width: '100%', height: '80px', background: 'white', padding: '4px 4px 16px 4px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                <div style={{ width: '100%', height: '100%', background: '#ccc' }}></div>
              </div>
              <p style={{ marginTop: '0.5rem', textAlign: 'center', fontSize: '0.875rem' }}>Polaroid</p>
            </div>

            <div 
              style={{ padding: '1rem', border: `2px solid ${activePage?.layout === 'polaroid-tape' ? 'var(--primary-color)' : 'var(--border-color)'}`, borderRadius: 'var(--radius-md)', cursor: 'pointer', marginBottom: '1rem', position: 'relative' }}
              onClick={() => activePage && onUpdatePage(activePage.id, { layout: 'polaroid-tape' })}
            >
              <div style={{ width: '100%', height: '80px', background: 'white', padding: '4px 4px 16px 4px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                <div style={{ width: '100%', height: '100%', background: '#ccc' }}></div>
              </div>
              <div style={{ position: 'absolute', top: '10px', right: '10px', width: '20px', height: '10px', background: 'rgba(255,255,255,0.8)', transform: 'rotate(45deg)' }}></div>
              <p style={{ marginTop: '0.5rem', textAlign: 'center', fontSize: '0.875rem' }}>Polaroid (Taped)</p>
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
              style={{ padding: '1rem', border: `2px solid ${activePage?.layout === 'grid-3' ? 'var(--primary-color)' : 'var(--border-color)'}`, borderRadius: 'var(--radius-md)', cursor: 'pointer', marginBottom: '1rem' }}
              onClick={() => activePage && onUpdatePage(activePage.id, { layout: 'grid-3' })}
            >
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gridTemplateRows: '2fr 1fr', gap: '4px', width: '100%', height: '80px' }}>
                <div style={{ background: '#ccc', gridColumn: '1 / span 2' }}></div>
                <div style={{ background: '#ccc' }}></div>
                <div style={{ background: '#ccc' }}></div>
              </div>
              <p style={{ marginTop: '0.5rem', textAlign: 'center', fontSize: '0.875rem' }}>3 Images (Focus)</p>
            </div>

            <div 
              style={{ padding: '1rem', border: `2px solid ${activePage?.layout === 'asym-2' ? 'var(--primary-color)' : 'var(--border-color)'}`, borderRadius: 'var(--radius-md)', cursor: 'pointer', marginBottom: '1rem' }}
              onClick={() => activePage && onUpdatePage(activePage.id, { layout: 'asym-2' })}
            >
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '4px', width: '100%', height: '80px' }}>
                <div style={{ background: '#ccc' }}></div>
                <div style={{ background: '#ccc' }}></div>
              </div>
              <p style={{ marginTop: '0.5rem', textAlign: 'center', fontSize: '0.875rem' }}>2 Images (Asymmetric)</p>
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
          <div className="panel-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>Backgrounds</span>
            <button 
              onClick={onClosePanel} 
              style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', fontSize: '1rem', padding: '0.25rem', display: 'flex', alignItems: 'center' }}
              title="Collapse Panel"
            >
              ✕
            </button>
          </div>
          <div className="panel-content">
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Select a page background color or texture. (Coming Soon)</p>
          </div>
        </>
      )}

      {activeTab === 'text' && (
        <>
          <div className="panel-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>Text & Captions</span>
            <button 
              onClick={onClosePanel} 
              style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', fontSize: '1rem', padding: '0.25rem', display: 'flex', alignItems: 'center' }}
              title="Collapse Panel"
            >
              ✕
            </button>
          </div>
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

      {activeTab === 'stickers' && (
        <>
          <div className="panel-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>Stickers</span>
            <button 
              onClick={onClosePanel} 
              style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', fontSize: '1rem', padding: '0.25rem', display: 'flex', alignItems: 'center' }}
              title="Collapse Panel"
            >
              ✕
            </button>
          </div>
          <div className="panel-content">
            <div className="sticker-grid">
              {Object.entries(STICKER_ASSETS).map(([id, sticker]) => {
                const StickerSvg = sticker.render;
                return (
                  <div 
                    key={id} 
                    className="sticker-card" 
                    onClick={() => onAddSticker && onAddSticker(id)}
                    title={sticker.name}
                  >
                    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <StickerSvg />
                    </div>
                  </div>
                );
              })}
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginTop: '1rem', textAlign: 'center' }}>
              Click a sticker to add it to the active page.
            </p>
          </div>
        </>
      )}
    </div>
  );
}
