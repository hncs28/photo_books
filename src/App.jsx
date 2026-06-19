import { useState, useCallback } from 'react';
import './App.css';
import BookConfigModal from './components/BookConfigModal';
import PrimarySidebar from './components/PrimarySidebar';
import SecondaryPanel from './components/SecondaryPanel';
import BottomTimeline from './components/BottomTimeline';
import PageCanvas from './components/PageCanvas';
import BookPreview from './components/BookPreview';
import { BookOpen, Download } from 'lucide-react';

function App() {
  const [bookConfig, setBookConfig] = useState(null);
  const [pages, setPages] = useState([{ id: crypto.randomUUID(), layout: 'full', slots: [{ image: null, croppedImage: null }], text: '' }]);
  const [activePageId, setActivePageId] = useState(pages[0].id);
  const [showPreview, setShowPreview] = useState(false);
  
  // Canva-style workspace state
  const [activeTab, setActiveTab] = useState('uploads');
  const [uploadedImages, setUploadedImages] = useState([]);

  const handleSelectBookSize = (size) => {
    setBookConfig(size);
  };

  const handleAddPage = () => {
    const newPage = { id: crypto.randomUUID(), layout: 'full', slots: [{ image: null, croppedImage: null }], text: '' };
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
            let requiredSlots = 1;
            if (updates.layout === 'grid-2') requiredSlots = 2;
            if (updates.layout === 'grid-4') requiredSlots = 4;
            
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

  const handleAutofill = useCallback(() => {
    if (uploadedImages.length === 0) return;
    
    // For simplicity, we create a full new book, assigning 1 image per slot, using 'full' layout.
    // If we wanted to keep layouts, we'd need more complex logic. 
    // Let's create single-slot pages for all autofill images to be safe.
    const finalPages = uploadedImages.map(imgUrl => ({ 
      id: crypto.randomUUID(), 
      layout: 'full', 
      slots: [{ image: imgUrl, croppedImage: null }], 
      text: '' 
    }));
    
    setPages(finalPages);
    setActivePageId(finalPages[0].id);
  }, [uploadedImages, pages]);

  const activePage = pages.find(p => p.id === activePageId);

  return (
    <div className="app-container" style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      {!bookConfig && <BookConfigModal onSelect={handleSelectBookSize} />}
      
      {bookConfig && (
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
          onClose={() => setShowPreview(false)} 
        />
      )}
    </div>
  );
}

export default App;
