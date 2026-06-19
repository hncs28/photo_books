import { useState, useCallback } from 'react';
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
      text: { title: { text: '', x: 0, y: 0 }, subtitle: { text: '', x: 0, y: 0 }, body: { text: '', x: 0, y: 0 } }
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

  const handleAutofill = useCallback((imagesToFill) => {
    const images = imagesToFill || uploadedImages;
    if (images.length === 0) return;
    
    const layout = bookTheme ? bookTheme.defaultLayout : 'full';
    const slotsPerPage = getSlotsForLayout(layout);
    
    const finalPages = [];
    
    // Always create a Cover Page first
    finalPages.push({
      id: crypto.randomUUID(),
      layout: 'magazine-cover',
      slots: [{ image: images[0] || null, croppedImage: null }],
      text: { 
        title: { text: 'PARIS', x: 0, y: 0 }, 
        subtitle: { text: 'THE FEBRUARY 2026 EDIT', x: 0, y: 0 }, 
        body: { text: "Your Name's\nPARIS Chapter\n\nThis chapter was created during my time spent in Paris...", x: 0, y: 0 },
        extra: { text: 'Curated\nMOMENTS', x: 0, y: 0 }
      }
    });
    
    // Use the rest of the images for the inside pages
    const remainingImages = images.slice(1);
    
    for (let i = 0; i < remainingImages.length; i += slotsPerPage) {
      const pageImages = remainingImages.slice(i, i + slotsPerPage);
      const slots = Array.from({ length: slotsPerPage }, (_, idx) => ({
        image: pageImages[idx] || null,
        croppedImage: null
      }));
      
      finalPages.push({
        id: crypto.randomUUID(),
        layout: layout,
        slots: slots,
        text: { title: { text: '', x: 0, y: 0 }, subtitle: { text: '', x: 0, y: 0 }, body: { text: '', x: 0, y: 0 } }
      });
    }
    
    setPages(finalPages);
    setActivePageId(finalPages[0].id);
  }, [uploadedImages, bookTheme]);

  const handleUploadComplete = (images) => {
    setUploadedImages(images);
    handleAutofill(images);
    setCurrentStep('editor');
  };

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
            <div style={{ display: 'flex', gap: '1rem' }}>
              <button className="btn btn-secondary" onClick={() => setShowPreview(true)}>
                <BookOpen size={18} /> Preview
              </button>
              <button className="btn btn-primary">
                <Download size={18} /> Export
              </button>
            </div>
          </header>

          <div className="main-workspace">
            <PrimarySidebar activeTab={activeTab} onTabSelect={setActiveTab} />
            <SecondaryPanel 
              activeTab={activeTab} 
              uploadedImages={uploadedImages} 
              onImagesUpload={handleImagesUpload} 
              onImageSelect={handleImageFromLibrary}
              onAutofill={handleAutofill}
              onUpdatePage={handleUpdatePage}
              activePage={activePage}
            />
            
            <div className="canvas-area">
              <PageCanvas 
                page={activePage}
                bookConfig={bookConfig}
                bookTheme={bookTheme}
                onUpdatePage={handleUpdatePage}
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
