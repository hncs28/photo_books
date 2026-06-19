import React from 'react';
import { Book, Layout, Square } from 'lucide-react';

const SIZES = [
  { id: 'landscape', label: 'Landscape 11x8.5', aspectRatio: 11 / 8.5, icon: Layout },
  { id: 'square', label: 'Square 8x8', aspectRatio: 1, icon: Square },
  { id: 'portrait', label: 'Portrait 8x10', aspectRatio: 8 / 10, icon: Book },
];

export default function BookConfigModal({ onSelect }) {
  return (
    <div className="modal-overlay">
      <div className="modal-content glass-panel animate-fade-in">
        <div style={{ textAlign: 'center' }}>
          <h2>Choose Book Size</h2>
          <p style={{ marginTop: '0.5rem' }}>Select the format for your photo book.</p>
        </div>
        
        <div className="size-options">
          {SIZES.map((size) => {
            const Icon = size.icon;
            return (
              <div 
                key={size.id} 
                className="size-card"
                onClick={() => onSelect(size)}
              >
                <Icon size={48} style={{ color: 'var(--primary-color)', marginBottom: '1rem' }} />
                <h3>{size.label}</h3>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
