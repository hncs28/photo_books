import React from 'react';

const THEMES = [
  {
    id: 'minimalist',
    name: 'Minimalist Light',
    description: 'Clean, white background with full-bleed elegant layouts.',
    bgColor: '#ffffff',
    textColor: '#1a1a1a',
    defaultLayout: 'full',
    preview: 'linear-gradient(135deg, #fdfbfb 0%, #ebedee 100%)'
  },
  {
    id: 'vintage',
    name: 'Vintage Polaroid',
    description: 'Off-white textured background with classic polaroid framing.',
    bgColor: '#f5f4f0',
    textColor: '#333333',
    defaultLayout: 'polaroid',
    preview: '#f5f4f0'
  },
  {
    id: 'modern',
    name: 'Modern Grid',
    description: 'Dark slate background with structured 4-image grids.',
    bgColor: '#1e293b',
    textColor: '#f8fafc',
    defaultLayout: 'grid-4',
    preview: '#1e293b'
  },
  {
    id: 'sunset',
    name: 'Sunset Glow',
    description: 'Vibrant orange and pink gradient, perfect for summer.',
    bgColor: 'linear-gradient(to bottom right, #f97316, #ec4899)',
    textColor: '#ffffff',
    defaultLayout: 'grid-3',
    preview: 'linear-gradient(to bottom right, #f97316, #ec4899)'
  },
  {
    id: 'ocean',
    name: 'Deep Ocean',
    description: 'Rich teal and blue tones for a calming aesthetic.',
    bgColor: 'linear-gradient(to right, #0f172a, #0d9488)',
    textColor: '#ffffff',
    defaultLayout: 'asym-2',
    preview: 'linear-gradient(to right, #0f172a, #0d9488)'
  },
  {
    id: 'candy',
    name: 'Candy Pop',
    description: 'Bright pastel pink and yellow for fun memories.',
    bgColor: 'linear-gradient(to right, #fdf4ff, #fef08a)',
    textColor: '#1e1e1e',
    defaultLayout: 'grid-4',
    preview: 'linear-gradient(to right, #fdf4ff, #fef08a)'
  },
  {
    id: 'city-pop',
    name: 'City Pop Blue',
    description: 'Sky blue gradient with cute Amsterdam houses illustration.',
    bgColor: 'linear-gradient(to bottom, #7dd3fc, #e0f2fe)',
    textColor: '#0f172a',
    defaultLayout: 'city-pop-cover',
    preview: 'linear-gradient(to bottom, #7dd3fc, #e0f2fe)'
  },
  {
    id: 'y2k-pastel',
    name: 'Y2K Pastel',
    description: 'Vibrant lavender/pink checkerboard with daisy sticker design.',
    bgColor: '#faf5ff', // Handled via class inside component, fallback to solid purple
    textColor: '#5b21b6',
    defaultLayout: 'y2k-sticker-cover',
    preview: 'linear-gradient(135deg, #fae8ff 25%, #faf5ff 25%, #faf5ff 50%, #fae8ff 50%, #fae8ff 75%, #faf5ff 75%)'
  },
  {
    id: 'groovy-70s',
    name: 'Groovy 70s',
    description: 'Warm 70s gradient with waves and fun flower power styling.',
    bgColor: 'linear-gradient(135deg, #ff7e5f, #ffe066)',
    textColor: '#7c2d12',
    defaultLayout: 'retro-groovy-cover',
    preview: 'linear-gradient(135deg, #ff7e5f, #ffe066)'
  },
  {
    id: 'comic-punch',
    name: 'Comic Punch',
    description: 'Bright yellow halftone background with pop art styling.',
    bgColor: '#fef08a',
    textColor: '#000000',
    defaultLayout: 'comic-pop-cover',
    preview: 'radial-gradient(#fb7185 20%, #fef08a 20%)'
  }
];

export default function ThemeSelection({ onSelect }) {
  return (
    <div className="modal-overlay">
      <div className="modal-content animate-fade-in" style={{ maxWidth: '800px' }}>
        <h2 style={{ textAlign: 'center', fontFamily: 'var(--font-serif)', fontSize: '2rem' }}>Choose a Theme</h2>
        <p style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>
          This will set the default background, layout, and text colors for your entire book. You can still customize individual pages later.
        </p>
        
        <div className="size-options" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem', marginTop: '1rem' }}>
          {THEMES.map(theme => (
            <div 
              key={theme.id} 
              className="size-card"
              onClick={() => onSelect(theme)}
              style={{ display: 'flex', flexDirection: 'column', gap: '1rem', padding: '1.5rem', background: 'var(--surface-color)' }}
            >
              <div style={{ 
                width: '100%', 
                height: '150px', 
                background: theme.preview,
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-sm)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: theme.textColor,
                fontFamily: 'var(--font-serif)',
                fontSize: '1.25rem'
              }}>
                Aa
              </div>
              <div>
                <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>{theme.name}</h3>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>{theme.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
