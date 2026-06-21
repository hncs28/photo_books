import React from 'react';
import { Plus, Trash2 } from 'lucide-react';

export default function BottomTimeline({ pages, activePageId, onAddPage, onSelectPage, onRemovePage, bookConfig }) {
  const renderThumbnail = (page) => {
    let gridStyle = { width: '100%', height: '100%', position: 'relative' };
    if (page.layout === 'polaroid') {
      gridStyle = { ...gridStyle, background: 'white', padding: '4px 4px 12px 4px' };
    } else if (page.layout === 'grid-2') {
      gridStyle = { ...gridStyle, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2px', background: 'white', padding: '2px' };
    } else if (page.layout === 'asym-2') {
      gridStyle = { ...gridStyle, display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2px', background: 'white', padding: '2px' };
    } else if (page.layout === 'grid-3') {
      gridStyle = { ...gridStyle, display: 'grid', gridTemplateColumns: '1fr 1fr', gridTemplateRows: '2fr 1fr', gap: '2px', background: 'white', padding: '2px' };
    } else if (page.layout === 'grid-4') {
      gridStyle = { ...gridStyle, display: 'grid', gridTemplateColumns: '1fr 1fr', gridTemplateRows: '1fr 1fr', gap: '2px', background: 'white', padding: '2px' };
    } else if (page.layout === 'filmstrip') {
      gridStyle = { ...gridStyle, background: '#111', display: 'flex', alignItems: 'center', gap: '2px', padding: '8px 3px' };
    } else if (page.layout === 'circle-focus') {
      gridStyle = { ...gridStyle, background: 'linear-gradient(135deg, #e0e7ff, #fce7f3, #fef3c7)', display: 'flex', alignItems: 'center', justifyContent: 'center' };
    } else if (page.layout === 'scrapbook') {
      gridStyle = { ...gridStyle, background: '#faf8f5' };
    } else if (page.layout === 'panoramic') {
      gridStyle = { ...gridStyle, background: '#1a1a2e', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' };
    } else if (page.layout === 'overlap-duo') {
      gridStyle = { ...gridStyle, background: 'linear-gradient(135deg, #f5f0eb, #e8e0d8)' };
    }

    return (
      <div style={gridStyle}>
        {page.slots.map((slot, idx) => {
          const isGrid3First = page.layout === 'grid-3' && idx === 0;
          return (
            <div key={idx} style={{ width: '100%', height: '100%', background: '#e2e8f0', overflow: 'hidden', gridColumn: isGrid3First ? '1 / span 2' : 'auto' }}>
              {(slot.croppedImage || slot.image) ? (
                <img 
                  src={slot.croppedImage || slot.image} 
                  alt={`Slot ${idx}`} 
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                />
              ) : null}
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="bottom-timeline">
      {pages.map((page, index) => (
        <div 
          key={page.id} 
          className={`timeline-page ${activePageId === page.id ? 'active' : ''}`}
          style={{ aspectRatio: bookConfig?.aspectRatio || 1 }}
          onClick={() => onSelectPage(page.id)}
        >
          {renderThumbnail(page)}
          
          <button 
            className="editor-btn" 
            style={{ position: 'absolute', top: 2, right: 2, padding: '0.2rem', background: 'rgba(0,0,0,0.5)', zIndex: 10 }}
            onClick={(e) => {
              e.stopPropagation();
              onRemovePage(page.id);
            }}
          >
            <Trash2 size={12} />
          </button>
        </div>
      ))}
      
      <button className="timeline-add-btn" onClick={onAddPage} title="Add Page">
        <Plus size={24} />
      </button>
    </div>
  );
}
