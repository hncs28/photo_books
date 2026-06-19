import React from 'react';
import { Plus, Trash2 } from 'lucide-react';

export default function PageSidebar({ pages, activePageId, onAddPage, onSelectPage, onRemovePage, bookConfig }) {
  return (
    <div className="sidebar">
      <div className="app-header">
        <div className="app-title">
          Photo Book
        </div>
        <button className="btn btn-primary" onClick={onAddPage} title="Add Page">
          <Plus size={18} />
        </button>
      </div>
      
      <div className="page-manager">
        {pages.map((page, index) => (
          <div 
            key={page.id} 
            className={`page-item ${activePageId === page.id ? 'active' : ''}`}
            onClick={() => onSelectPage(page.id)}
          >
            <div className="page-thumbnail" style={{ aspectRatio: bookConfig?.aspectRatio || 1 }}>
              {page.croppedImage ? (
                <img src={page.croppedImage} alt={`Page ${index + 1}`} />
              ) : page.image ? (
                <img src={page.image} alt={`Page ${index + 1}`} />
              ) : (
                <span style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>Empty</span>
              )}
            </div>
            <div className="page-actions">
              <span style={{ fontSize: '0.875rem', fontWeight: 500 }}>Page {index + 1}</span>
              <button 
                className="editor-btn" 
                style={{ color: 'var(--text-secondary)', padding: '0.25rem' }}
                onClick={(e) => {
                  e.stopPropagation();
                  onRemovePage(page.id);
                }}
              >
                <Trash2 size={16} className="hover-danger" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
