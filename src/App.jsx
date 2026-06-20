import { useState, useCallback, useEffect } from 'react';
import './App.css';
import BookConfigModal from './components/BookConfigModal';
import ThemeSelection from './components/ThemeSelection';
import PhotoUploadStep from './components/PhotoUploadStep';
import PrimarySidebar from './components/PrimarySidebar';
import SecondaryPanel from './components/SecondaryPanel';
import BottomTimeline from './components/BottomTimeline';
import PageCanvas from './components/PageCanvas';
import BookPreview from './components/BookPreview';
import { BookOpen, Download } from 'lucide-react';

function App() {
  const [currentStep, setCurrentStep] = useState('size'); // 'size', 'theme', 'upload', 'editor'
  const [bookConfig, setBookConfig] = useState(null);
  const [bookTheme, setBookTheme] = useState(null);
  
  const [pages, setPages] = useState([{ id: crypto.randomUUID(), layout: 'full', slots: [{ image: null, croppedImage: null }], text: { title: { text: '', x: 0, y: 0 }, subtitle: { text: '', x: 0, y: 0 }, body: { text: '', x: 0, y: 0 } } }]);
  const [activePageId, setActivePageId] = useState(pages[0].id);
  const [showPreview, setShowPreview] = useState(false);
  
  // Canva-style workspace state
  const [activeTab, setActiveTab] = useState('uploads');
  const [uploadedImages, setUploadedImages] = useState([]);
  const [isPanelOpen, setIsPanelOpen] = useState(true);

  // Initialize panel state on mount based on screen width
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsPanelOpen(window.innerWidth > 768);
    }
  }, []);

  const handleSelectBookSize = (size) => {
    setBookConfig(size);
    setCurrentStep('theme');
  };

  const handleSelectTheme = (theme) => {
    setBookTheme(theme);
    // Apply theme defaults to the first page
    const newPage = { 
      id: pages[0].id, 
      layout: theme.defaultLayout, 
      slots: Array.from({ length: getSlotsForLayout(theme.defaultLayout) }, () => ({ image: null, croppedImage: null })),
      text: { title: { text: '', x: 0, y: 0 }, subtitle: { text: '', x: 0, y: 0 }, body: { text: '', x: 0, y: 0 } },
      backSlots: Array.from({ length: 4 }, () => ({ image: null, croppedImage: null })),
      backText: { title: { text: '', x: 0, y: 0 }, subtitle: { text: '2026', x: 0, y: 0 } }
    };
    setPages([newPage]);
    setCurrentStep('upload');
  };

  const getSlotsForLayout = (layout) => {
    if (layout === 'moodboard') return 14;
    if (layout === 'grid-4') return 4;
    if (layout === 'grid-3') return 3;
    if (layout === 'grid-2' || layout === 'asym-2') return 2;
    if (layout === 'map-page') return 0;
    if (layout === 'y2k-sticker-cover') return 2;
    if (layout === 'comic-pop-cover') return 2;
    if (layout === 'city-pop-cover') return 1;
    if (layout === 'retro-groovy-cover') return 1;
    return 1; // full, polaroid, cover, magazine-cover, polaroid-tape
  };

  const handleAddPage = () => {
    const newPage = { id: crypto.randomUUID(), layout: 'full', slots: [{ image: null, croppedImage: null }], text: { title: { text: '', x: 0, y: 0 }, subtitle: { text: '', x: 0, y: 0 }, body: { text: '', x: 0, y: 0 } } };
    setPages([...pages, newPage]);
    setActivePageId(newPage.id);
  };

  const handleRemovePage = (id) => {
    if (pages.length === 1) return;
    const updatedPages = pages.filter(p => p.id !== id);
    setPages(updatedPages);
    if (activePageId === id) {
      setActivePageId(updatedPages[0].id);
    }
  };

  const handleUpdatePage = useCallback((id, updates) => {
    setPages(prevPages => 
      prevPages.map(p => {
        if (p.id === id) {
          const newPage = { ...p, ...updates };
          
            // Adjust slots if layout changes
          if (updates.layout && updates.layout !== p.layout) {
            let requiredSlots = getSlotsForLayout(updates.layout);
            
            const newSlots = [...newPage.slots];
            // Truncate or pad with empty slots
            if (newSlots.length > requiredSlots) {
              newSlots.length = requiredSlots;
            } else {
              while (newSlots.length < requiredSlots) {
                newSlots.push({ image: null, croppedImage: null });
              }
            }
            newPage.slots = newSlots;
          }
          
          return newPage;
        }
        return p;
      })
    );
  }, []);

  const handleImagesUpload = useCallback((newImages) => {
    setUploadedImages(prev => [...newImages, ...prev]);
  }, []);

  const handleImageFromLibrary = useCallback((imgUrl) => {
    setPages(prevPages => prevPages.map(p => {
      if (p.id === activePageId) {
        // Find the first empty slot to apply the image
        const emptySlotIndex = p.slots.findIndex(slot => !slot.image);
        const slotIndexToUpdate = emptySlotIndex !== -1 ? emptySlotIndex : 0; // If all full, overwrite first
        
        const newSlots = [...p.slots];
        newSlots[slotIndexToUpdate] = { image: imgUrl, croppedImage: null };
        return { ...p, slots: newSlots };
      }
      return p;
    }));
  }, [activePageId]);

  const handleAddSticker = useCallback((stickerType) => {
    setPages(prevPages => prevPages.map(p => {
      if (p.id === activePageId) {
        const newSticker = {
          id: crypto.randomUUID(),
          type: stickerType,
          x: 100, // Initial x coordinates
          y: 100, // Initial y coordinates
          scale: 1.0,
          rotation: 0
        };
        return {
          ...p,
          stickers: [...(p.stickers || []), newSticker]
        };
      }
      return p;
    }));
  }, [activePageId]);

  const handleUpdateSticker = useCallback((pageId, stickerId, updates) => {
    setPages(prevPages => prevPages.map(p => {
      if (p.id === pageId) {
        return {
          ...p,
          stickers: (p.stickers || []).map(s => {
            if (s.id === stickerId) {
              return { ...s, ...updates };
            }
            return s;
          })
        };
      }
      return p;
    }));
  }, []);

  const handleRemoveSticker = useCallback((pageId, stickerId) => {
    setPages(prevPages => prevPages.map(p => {
      if (p.id === pageId) {
        return {
          ...p,
          stickers: (p.stickers || []).filter(s => s.id !== stickerId)
        };
      }
      return p;
    }));
  }, []);

  const handleAutofill = useCallback((imagesToFill) => {
    const images = imagesToFill || uploadedImages;
    if (images.length === 0) return;
    
    const finalPages = [];
    const coverLayout = bookTheme ? bookTheme.defaultLayout : 'magazine-cover';
    const insideLayout = bookTheme && !bookTheme.defaultLayout.includes('cover') ? bookTheme.defaultLayout : 'full';
    const slotsPerPage = getSlotsForLayout(insideLayout);
    const coverSlotsCount = getSlotsForLayout(coverLayout);
    
    let backCoverSlots, coverSlots, remainingImagesIndex;
    if (images.length >= 5) {
      backCoverSlots = Array.from({ length: 4 }, (_, idx) => ({
        image: images[idx] || null,
        croppedImage: null
      }));
      coverSlots = Array.from({ length: coverSlotsCount }, (_, idx) => ({
        image: images[4 + idx] || null,
        croppedImage: null
      }));
      remainingImagesIndex = 4 + coverSlotsCount;
    } else {
      coverSlots = Array.from({ length: coverSlotsCount }, (_, idx) => ({
        image: images[idx] || null,
        croppedImage: null
      }));
      backCoverSlots = Array.from({ length: 4 }, (_, idx) => ({
        image: images[coverSlotsCount + idx] || null,
        croppedImage: null
      }));
      remainingImagesIndex = coverSlotsCount + 4;
    }

    let coverText = { 
      title: { text: 'PARIS', x: 0, y: 0 }, 
      subtitle: { text: 'THE FEBRUARY 2026 EDIT', x: 0, y: 0 }, 
      body: { text: "Your Name's\nPARIS Chapter\n\nThis chapter was created during my time spent in Paris...", x: 0, y: 0 },
      extra: { text: 'Curated\nMOMENTS', x: 0, y: 0 }
    };
    
    if (coverLayout === 'city-pop-cover') {
      coverText = {
        title: { text: 'AMSTERDAM', x: 0, y: 0 },
        subtitle: { text: 'NETHERLANDS', x: 0, y: 0 },
        body: { text: 'AMSTERDAM 2026', x: 0, y: 0 },
        extra: { text: 'EXPLORING THE CANALS & CYCLING AROUND THE CITY', x: 0, y: 0 }
      };
    } else if (coverLayout === 'y2k-sticker-cover') {
      coverText = {
        title: { text: 'MEMORIES', x: 0, y: 0 },
        subtitle: { text: 'COOL VIBES ONLY', x: 0, y: 0 },
        body: { text: 'EST. 2026', x: 0, y: 0 },
        extra: { text: 'BEST DAYS', x: 0, y: 0 }
      };
    } else if (coverLayout === 'retro-groovy-cover') {
      coverText = {
        title: { text: 'GOOD VIBES', x: 0, y: 0 },
        subtitle: { text: 'GOLDEN DAYS', x: 0, y: 0 },
        body: { text: 'SINCE 2026', x: 0, y: 0 },
        extra: { text: '🌻 FLOWER POWER 🌻', x: 0, y: 0 }
      };
    } else if (coverLayout === 'comic-pop-cover') {
      coverText = {
        title: { text: 'OMG!', x: 0, y: 0 },
        subtitle: { text: 'BEST TRIP EVER!', x: 0, y: 0 },
        body: { text: 'TO BE CONTINUED...', x: 0, y: 0 },
        extra: { text: 'WHAM! POW!', x: 0, y: 0 }
      };
    }

    finalPages.push({
      id: crypto.randomUUID(),
      layout: coverLayout,
      slots: coverSlots,
      text: coverText,
      backSlots: backCoverSlots,
      backText: {
        title: { text: coverText.title?.text || '', x: 0, y: 0 },
        subtitle: { text: '2026', x: 0, y: 0 }
      }
    });
    
    // Use the rest of the images for the inside pages
    const remainingImages = images.slice(remainingImagesIndex);
    let imgIdx = 0;
    
    // Available layouts categorized by number of slots
    const layoutsBySlots = {
      1: ['full', 'polaroid', 'polaroid-tape'],
      2: ['grid-2', 'asym-2'],
      3: ['grid-3'],
      4: ['grid-4']
    };
    
    while (imgIdx < remainingImages.length) {
      const remainingCount = remainingImages.length - imgIdx;
      let slotsCount = 1;
      
      // Determine next page slot size based on remaining count
      if (remainingCount >= 4) {
        // Mix of single-image (25%), double-image (35%), triple-image (20%), and quad-image (20%)
        const rand = Math.random();
        if (rand < 0.25) slotsCount = 1;
        else if (rand < 0.60) slotsCount = 2;
        else if (rand < 0.80) slotsCount = 3;
        else slotsCount = 4;
      } else if (remainingCount === 3) {
        const rand = Math.random();
        if (rand < 0.3) slotsCount = 1;
        else if (rand < 0.7) slotsCount = 2;
        else slotsCount = 3;
      } else if (remainingCount === 2) {
        const rand = Math.random();
        if (rand < 0.4) slotsCount = 1;
        else slotsCount = 2;
      } else {
        slotsCount = 1;
      }
      
      const availableLayouts = layoutsBySlots[slotsCount] || ['full'];
      const selectedLayout = availableLayouts[Math.floor(Math.random() * availableLayouts.length)];
      
      const pageImages = remainingImages.slice(imgIdx, imgIdx + slotsCount);
      const slots = pageImages.map(imgUrl => ({
        image: imgUrl,
        croppedImage: null
      }));
      
      while (slots.length < slotsCount) {
        slots.push({ image: null, croppedImage: null });
      }
      
      finalPages.push({
        id: crypto.randomUUID(),
        layout: selectedLayout,
        slots: slots,
        text: { title: { text: '', x: 0, y: 0 }, subtitle: { text: '', x: 0, y: 0 }, body: { text: '', x: 0, y: 0 } }
      });
      
      imgIdx += slotsCount;
    }
    
    setPages(finalPages);
    setActivePageId(finalPages[0].id);
  }, [uploadedImages, bookTheme]);

  const handleUploadComplete = (images) => {
    setUploadedImages(images);
    handleAutofill(images);
    setCurrentStep('editor');
  };

  const handleTabSelect = useCallback((tabId) => {
    if (activeTab === tabId) {
      setIsPanelOpen(prev => !prev);
    } else {
      setActiveTab(tabId);
      setIsPanelOpen(true);
    }
  }, [activeTab]);

  const activePage = pages.find(p => p.id === activePageId);

  return (
    <div className="app-container" style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      {currentStep === 'size' && <BookConfigModal onSelect={handleSelectBookSize} />}
      {currentStep === 'theme' && <ThemeSelection onSelect={handleSelectTheme} />}
      {currentStep === 'upload' && <PhotoUploadStep onComplete={handleUploadComplete} />}
      
      {currentStep === 'editor' && bookConfig && (
        <>
          <header className="app-header">
            <div className="app-title">Photo Book Design</div>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button className="btn btn-secondary" onClick={() => setShowPreview(true)} title="Preview Book">
                <BookOpen size={18} /> <span className="btn-text">Preview</span>
              </button>
              <button className="btn btn-primary" title="Export Book">
                <Download size={18} /> <span className="btn-text">Export</span>
              </button>
            </div>
          </header>

          <div className="main-workspace">
            <PrimarySidebar activeTab={activeTab} onTabSelect={handleTabSelect} />
            <SecondaryPanel 
              activeTab={activeTab} 
              uploadedImages={uploadedImages} 
              onImagesUpload={handleImagesUpload} 
              onImageSelect={handleImageFromLibrary}
              onAutofill={handleAutofill}
              onUpdatePage={handleUpdatePage}
              activePage={activePage}
              onAddSticker={handleAddSticker}
              onClosePanel={() => setIsPanelOpen(false)}
              isCollapsed={!isPanelOpen}
            />
            
            <div className="canvas-area">
              <PageCanvas 
                page={activePage}
                pages={pages}
                activePageId={activePageId}
                onSelectPage={setActivePageId}
                bookConfig={bookConfig}
                bookTheme={bookTheme}
                onUpdatePage={handleUpdatePage}
                onUpdateSticker={handleUpdateSticker}
                onRemoveSticker={handleRemoveSticker}
              />
              <BottomTimeline 
                pages={pages}
                activePageId={activePageId}
                onAddPage={handleAddPage}
                onSelectPage={setActivePageId}
                onRemovePage={handleRemovePage}
                bookConfig={bookConfig}
              />
            </div>
          </div>
        </>
      )}

      {showPreview && bookConfig && (
        <BookPreview 
          pages={pages} 
          bookConfig={bookConfig} 
          bookTheme={bookTheme}
          onClose={() => setShowPreview(false)} 
        />
      )}
    </div>
  );
}

export default App;
