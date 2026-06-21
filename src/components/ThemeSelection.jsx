import React, { useState } from 'react';

const CATEGORIES = [
  { id: 'Color', name: 'Color', icon: '🎨' },
  { id: 'Countries', name: 'Countries', icon: '✈️' },
  { id: 'Hobbies', name: 'Hobbies', icon: '🏂' },
  { id: 'Retro & Pop', name: 'Retro & Pop', icon: '⚡' }
];

const THEMES = [
  // --- COLOR CATEGORY ---
  {
    id: 'minimalist',
    name: 'Minimalist Light',
    category: 'Color',
    description: 'Clean, white background with full-bleed elegant layouts.',
    bgColor: '#ffffff',
    textColor: '#1a1a1a',
    defaultLayout: 'full',
    preview: 'linear-gradient(135deg, #fdfbfb 0%, #ebedee 100%)'
  },
  {
    id: 'vintage',
    name: 'Vintage Polaroid',
    category: 'Color',
    description: 'Off-white textured background with classic polaroid framing.',
    bgColor: '#f5f4f0',
    textColor: '#333333',
    defaultLayout: 'polaroid',
    preview: '#f5f4f0'
  },
  {
    id: 'modern',
    name: 'Modern Grid',
    category: 'Color',
    description: 'Dark slate background with structured 4-image grids.',
    bgColor: '#1e293b',
    textColor: '#f8fafc',
    defaultLayout: 'grid-4',
    preview: '#1e293b'
  },
  {
    id: 'sunset',
    name: 'Sunset Glow',
    category: 'Color',
    description: 'Vibrant orange and pink gradient, perfect for summer.',
    bgColor: 'linear-gradient(to bottom right, #f97316, #ec4899)',
    textColor: '#ffffff',
    defaultLayout: 'grid-3',
    preview: 'linear-gradient(to bottom right, #f97316, #ec4899)'
  },
  {
    id: 'ocean',
    name: 'Deep Ocean',
    category: 'Color',
    description: 'Rich teal and blue tones for a calming aesthetic.',
    bgColor: 'linear-gradient(to right, #0f172a, #0d9488)',
    textColor: '#ffffff',
    defaultLayout: 'asym-2',
    preview: 'linear-gradient(to right, #0f172a, #0d9488)'
  },
  {
    id: 'candy',
    name: 'Candy Pop',
    category: 'Color',
    description: 'Bright pastel pink and yellow for fun memories.',
    bgColor: 'linear-gradient(to right, #fdf4ff, #fef08a)',
    textColor: '#1e1e1e',
    defaultLayout: 'grid-4',
    preview: 'linear-gradient(to right, #fdf4ff, #fef08a)'
  },
  {
    id: 'botanical',
    name: 'Botanical Garden',
    category: 'Color',
    description: 'Soft sage green with earthy tones for nature lovers.',
    bgColor: '#f0f5f0',
    textColor: '#2d4a3e',
    defaultLayout: 'magazine-cover',
    preview: 'linear-gradient(135deg, #d4e8d0 0%, #f0f5f0 50%, #e8f0e4 100%)'
  },
  {
    id: 'midnight-rose',
    name: 'Midnight Rose',
    category: 'Color',
    description: 'Deep navy paired with soft blush for a romantic feel.',
    bgColor: '#1a1a2e',
    textColor: '#f8e8ee',
    defaultLayout: 'magazine-cover',
    preview: 'linear-gradient(135deg, #1a1a2e 0%, #3d2040 50%, #5c2848 100%)'
  },
  {
    id: 'peach-dream',
    name: 'Peach Dream',
    category: 'Color',
    description: 'Warm peach and coral gradient, soft and dreamy.',
    bgColor: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
    textColor: '#5a3e36',
    defaultLayout: 'cover',
    preview: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)'
  },
  {
    id: 'arctic',
    name: 'Arctic Frost',
    category: 'Color',
    description: 'Cool icy blue with clean white for a crisp modern look.',
    bgColor: 'linear-gradient(135deg, #e0f0ff 0%, #cce5ff 100%)',
    textColor: '#1e3a5f',
    defaultLayout: 'full',
    preview: 'linear-gradient(135deg, #e0f0ff 0%, #a8d8f0 100%)'
  },
  {
    id: 'golden-hour',
    name: 'Golden Hour',
    category: 'Color',
    description: 'Warm amber and gold tones evoking sunset warmth.',
    bgColor: 'linear-gradient(135deg, #fff8e1 0%, #ffe0b2 100%)',
    textColor: '#5d4037',
    defaultLayout: 'polaroid',
    preview: 'linear-gradient(135deg, #fff8e1 0%, #ffcc80 50%, #ffab40 100%)'
  },
  {
    id: 'lavender',
    name: 'Lavender Mist',
    category: 'Color',
    description: 'Delicate purple and lilac tones for an elegant touch.',
    bgColor: 'linear-gradient(135deg, #f3e8ff 0%, #e9d5ff 100%)',
    textColor: '#4a1d96',
    defaultLayout: 'grid-3',
    preview: 'linear-gradient(135deg, #f3e8ff 0%, #d8b4fe 50%, #c084fc 100%)'
  },
  {
    id: 'mocha',
    name: 'Mocha Latte',
    category: 'Color',
    description: 'Rich coffee and cream tones for a cozy vintage feel.',
    bgColor: '#f5ebe0',
    textColor: '#3e2723',
    defaultLayout: 'polaroid-tape',
    preview: 'linear-gradient(135deg, #f5ebe0 0%, #d7ccc8 50%, #bcaaa4 100%)'
  },
  {
    id: 'coral-reef',
    name: 'Coral Reef',
    category: 'Color',
    description: 'Vibrant coral to teal gradient inspired by tropical seas.',
    bgColor: 'linear-gradient(135deg, #ff9a9e 0%, #a18cd1 50%, #84fab0 100%)',
    textColor: '#ffffff',
    defaultLayout: 'asym-2',
    preview: 'linear-gradient(135deg, #ff9a9e 0%, #a18cd1 50%, #84fab0 100%)'
  },

  // --- RETRO & POP CATEGORY ---
  {
    id: 'city-pop',
    name: 'City Pop Blue',
    category: 'Retro & Pop',
    description: 'Sky blue gradient with cute Amsterdam houses illustration.',
    bgColor: 'linear-gradient(to bottom, #7dd3fc, #e0f2fe)',
    textColor: '#0f172a',
    defaultLayout: 'city-pop-cover',
    preview: 'linear-gradient(to bottom, #7dd3fc, #e0f2fe)'
  },
  {
    id: 'y2k-pastel',
    name: 'Y2K Pastel',
    category: 'Retro & Pop',
    description: 'Vibrant lavender/pink checkerboard with daisy sticker design.',
    bgColor: '#faf5ff',
    textColor: '#5b21b6',
    defaultLayout: 'y2k-sticker-cover',
    preview: 'linear-gradient(135deg, #fae8ff 25%, #faf5ff 25%, #faf5ff 50%, #fae8ff 50%, #fae8ff 75%, #faf5ff 75%)'
  },
  {
    id: 'groovy-70s',
    name: 'Groovy 70s',
    category: 'Retro & Pop',
    description: 'Warm 70s gradient with waves and fun flower power styling.',
    bgColor: 'linear-gradient(135deg, #ff7e5f, #ffe066)',
    textColor: '#7c2d12',
    defaultLayout: 'retro-groovy-cover',
    preview: 'linear-gradient(135deg, #ff7e5f, #ffe066)'
  },
  {
    id: 'comic-punch',
    name: 'Comic Punch',
    category: 'Retro & Pop',
    description: 'Bright yellow halftone background with pop art styling.',
    bgColor: '#fef08a',
    textColor: '#000000',
    defaultLayout: 'comic-pop-cover',
    preview: 'radial-gradient(#fb7185 20%, #fef08a 20%)'
  },

  // --- COUNTRIES CATEGORY ---
  {
    id: 'japan-sakura',
    name: 'Japan Sakura',
    category: 'Countries',
    description: 'Soft pink & cream background inspired by cherry blossom season.',
    bgColor: 'linear-gradient(135deg, #fff5f5 0%, #ffe3e3 100%)',
    textColor: '#862e2e',
    defaultLayout: 'circle-focus',
    preview: 'linear-gradient(135deg, #fff5f5 0%, #ffb6c1 50%, #ffe3e3 100%)'
  },
  {
    id: 'french-elegance',
    name: 'French Elegance',
    category: 'Countries',
    description: 'Elegant linen cream background with refined navy accents.',
    bgColor: '#fbf8f3',
    textColor: '#1e293b',
    defaultLayout: 'magazine-cover',
    preview: 'linear-gradient(135deg, #fbf8f3 0%, #e5e0d8 100%)'
  },
  {
    id: 'italy-terracotta',
    name: 'Italian Terracotta',
    category: 'Countries',
    description: 'Warm earth tones of terracotta walls and olive branches.',
    bgColor: '#fcf6f0',
    textColor: '#8a4f3e',
    defaultLayout: 'polaroid-tape',
    preview: 'linear-gradient(135deg, #fcf6f0 0%, #d4a373 100%)'
  },
  {
    id: 'swiss-alps',
    name: 'Swiss Alps',
    category: 'Countries',
    description: 'Cool snow white with majestic ice-blue details.',
    bgColor: 'linear-gradient(135deg, #f0f8ff 0%, #e0f2fe 100%)',
    textColor: '#0f4c81',
    defaultLayout: 'panoramic',
    preview: 'linear-gradient(135deg, #f0f8ff 0%, #bae6fd 100%)'
  },

  // --- HOBBIES CATEGORY ---
  {
    id: 'travel-explorer',
    name: 'Travel Explorer',
    category: 'Hobbies',
    description: 'Earthy khaki and map-sand tones for logging outdoor adventure.',
    bgColor: '#faf6f0',
    textColor: '#3e2723',
    defaultLayout: 'filmstrip',
    preview: 'linear-gradient(135deg, #faf6f0 0%, #ebdccb 100%)'
  },
  {
    id: 'foodie-journal',
    name: 'Foodie Journal',
    category: 'Hobbies',
    description: 'Delicious warm honey and dark chocolate styling for food lovers.',
    bgColor: 'linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%)',
    textColor: '#451a03',
    defaultLayout: 'scrapbook',
    preview: 'linear-gradient(135deg, #fffbeb 0%, #fde68a 100%)'
  },
  {
    id: 'music-vibes',
    name: 'Music Vibes',
    category: 'Hobbies',
    description: 'Moody vinyl dark background with electric green accents.',
    bgColor: '#121212',
    textColor: '#1db954',
    defaultLayout: 'overlap-duo',
    preview: 'linear-gradient(135deg, #121212 0%, #1e1e1e 50%, #1db954 100%)'
  },
  {
    id: 'sports-energy',
    name: 'Sports Energy',
    category: 'Hobbies',
    description: 'Bold athletic dark carbon grey with vibrant orange text.',
    bgColor: '#1e2022',
    textColor: '#ff6b35',
    defaultLayout: 'grid-4',
    preview: 'linear-gradient(135deg, #1e2022 0%, #ff6b35 100%)'
  }
];

export default function ThemeSelection({ onSelect }) {
  const [activeTab, setActiveTab] = useState('Color');

  const filteredThemes = THEMES.filter(theme => theme.category === activeTab);

  return (
    <div className="modal-overlay">
      <div className="modal-content animate-fade-in" style={{ maxWidth: '850px', maxHeight: '90vh', display: 'flex', flexDirection: 'column' }}>
        <div style={{ flexShrink: 0 }}>
          <h2 style={{ textAlign: 'center', fontFamily: 'var(--font-serif)', fontSize: '2rem', marginBottom: '0.5rem' }}>Choose a Theme</h2>
          <p style={{ textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.95rem', maxWidth: '600px', margin: '0 auto 1.5rem' }}>
            This will set the default background, layout, and text colors for your entire book. You can still customize individual pages later.
          </p>

          {/* Theme Category Tabs */}
          <div className="theme-tabs-container">
            {CATEGORIES.map(cat => (
              <button
                key={cat.id}
                className={`theme-tab-btn ${activeTab === cat.id ? 'active' : ''}`}
                onClick={() => setActiveTab(cat.id)}
              >
                <span>{cat.icon}</span>
                <span>{cat.name}</span>
              </button>
            ))}
          </div>
        </div>
        
        {/* Themes Grid scrollable container */}
        <div style={{ overflowY: 'auto', flexGrow: 1, paddingRight: '0.25rem', marginTop: '0.5rem' }}>
          <div className="themes-grid">
            {filteredThemes.map(theme => (
              <div 
                key={theme.id} 
                className="size-card"
                onClick={() => onSelect(theme)}
                style={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  gap: '1rem', 
                  padding: '1.25rem', 
                  background: 'var(--surface-color)',
                  textAlign: 'left'
                }}
              >
                <div style={{ 
                  width: '100%', 
                  height: '130px', 
                  background: theme.preview,
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-sm)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: theme.textColor,
                  fontFamily: 'var(--font-serif)',
                  fontSize: '1.5rem',
                  fontWeight: 'bold',
                  boxShadow: 'inset 0 0 10px rgba(0,0,0,0.05)'
                }}>
                  Aa
                </div>
                <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <h3 style={{ fontSize: '1.05rem', fontWeight: '600', marginBottom: '0.35rem', color: 'var(--text-primary)' }}>{theme.name}</h3>
                    <p style={{ fontSize: '0.825rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>{theme.description}</p>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.75rem' }}>
                    <span style={{ 
                      fontSize: '0.7rem', 
                      background: 'rgba(139, 92, 246, 0.1)', 
                      color: 'var(--primary-color)', 
                      padding: '0.2rem 0.5rem', 
                      borderRadius: '4px',
                      textTransform: 'uppercase',
                      fontWeight: 'bold',
                      letterSpacing: '0.5px'
                    }}>
                      {theme.defaultLayout}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
