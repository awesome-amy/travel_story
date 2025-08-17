import React, { useState, useMemo } from 'react';
import { BubbleNavigation } from './components/BubbleNavigation';
import { HomeScreen } from './components/HomeScreen';
import { PlacesList } from './components/PlacesList';
import { MapView } from './components/MapView';
import { PlaceDetail } from './components/PlaceDetail';
import { EntryEditor } from './components/EntryEditor';
import { DraftsList } from './components/DraftsList';
import { EntryDetail } from './components/EntryDetail';
import { TrashScreen } from './components/TrashScreen';
import { mockPlaces, mockEntries } from './data/mockData';
import { Place, Entry } from './types';
import { toast, Toaster } from 'sonner@2.0.3';

type Screen = 'home' | 'places' | 'map' | 'place-detail' | 'entry-editor' | 'drafts' | 'entry-detail' | 'trash';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('home');
  const [places, setPlaces] = useState<Place[]>(recalcPlaceCounts(mockPlaces, mockEntries));
  const [entries, setEntries] = useState<Entry[]>(mockEntries);
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);
  const [selectedEntry, setSelectedEntry] = useState<Entry | null>(null);
  const [editingEntry, setEditingEntry] = useState<Entry | null>(null);

  const recalcPlaceCounts = (placesList: Place[], entriesList: Entry[]) =>
    placesList.map(p => {
      const published = entriesList.filter(e => e.placeId === p.id && e.status === 'published').length;
      const drafts = entriesList.filter(e => e.placeId === p.id && e.status === 'draft').length;
      return { ...p, entryCount: published, draftCount: drafts };
    });

  // Computed values
  const draftEntries = useMemo(() => 
    entries.filter(e => e.status === 'draft'), [entries]
  );
  
  const trashedEntries = useMemo(() => 
    entries.filter(e => e.status === 'trashed'), [entries]
  );

  const totalDraftCount = useMemo(() => draftEntries.length, [draftEntries]);
  const totalTrashedCount = useMemo(() => trashedEntries.length, [trashedEntries]);

  const getPlaceEntries = (placeId: string) => 
    entries.filter(e => e.placeId === placeId && e.status !== 'trashed');

  // Navigation handlers
  const handleNavigate = (screen: 'home' | 'places' | 'map') => {
    setCurrentScreen(screen);
    setSelectedPlace(null);
    setSelectedEntry(null);
    setEditingEntry(null);
  };

  const handleCreateEntry = (placeId?: string) => {
    setEditingEntry(null);
    if (placeId && places.find(p => p.id === placeId)) {
      // Pre-select place if provided
      setCurrentScreen('entry-editor');
    } else {
      setCurrentScreen('entry-editor');
    }
  };

  const handlePlaceSelect = (place: Place) => {
    setSelectedPlace(place);
    setCurrentScreen('place-detail');
  };

  const handleEntryEdit = (entry: Entry) => {
    setEditingEntry(entry);
    setCurrentScreen('entry-editor');
  };

  const handleEntryView = (entry: Entry) => {
    setSelectedEntry(entry);
    setCurrentScreen('entry-detail');
  };

  const handleEntryDelete = (entry: Entry) => {
    if (window.confirm('Are you sure you want to delete this entry? It will be moved to trash.')) {
      const updatedEntries = entries.map(e =>
        e.id === entry.id
          ? { ...e, status: 'trashed' as const, deletedAt: new Date() }
          : e
      );
      const updatedPlaces = recalcPlaceCounts(places, updatedEntries);
      setEntries(updatedEntries);
      setPlaces(updatedPlaces);
      toast.success('Entry moved to trash');

      const place = updatedPlaces.find(p => p.id === entry.placeId);
      if (place) {
        setSelectedPlace(place);
        setSelectedEntry(null);
        setCurrentScreen('place-detail');
      } else {
        setSelectedPlace(null);
        setSelectedEntry(null);
        setCurrentScreen('home');
      }
    }
  };

  const handleEntrySave = (entryData: Partial<Entry>) => {
    let updatedPlaces = [...places];

    let placeId = entryData.placeId;
    if (!placeId && entryData.location && entryData.country) {
      const existing = updatedPlaces.find(
        p => p.name === entryData.location && p.adminArea === entryData.country
      );
      if (existing) {
        placeId = existing.id;
      } else {
        const newPlace: Place = {
          id: Date.now().toString(),
          name: entryData.location,
          countryCode: entryData.country,
          adminArea: entryData.country,
          locality: entryData.location,
          lat: 0,
          lon: 0,
          entryCount: 0,
          draftCount: 0,
        };
        updatedPlaces = [...updatedPlaces, newPlace];
        placeId = newPlace.id;
      }
    }

    const baseEntry = editingEntry
      ? { ...editingEntry }
      : { id: Date.now().toString(), createdAt: new Date() };

    const entryToSave: Entry = {
      ...baseEntry,
      ...entryData,
      placeId,
      updatedAt: new Date(),
    } as Entry;

    let updatedEntries: Entry[];
    if (editingEntry) {
      updatedEntries = entries.map(e => (e.id === editingEntry.id ? entryToSave : e));
    } else {
      updatedEntries = [...entries, entryToSave];
    }

    updatedPlaces = recalcPlaceCounts(updatedPlaces, updatedEntries);

    setEntries(updatedEntries);
    setPlaces(updatedPlaces);

    toast.success(entryToSave.status === 'published' ? 'Entry published' : editingEntry ? 'Entry updated' : 'Draft saved');

    setEditingEntry(null);

    if (entryToSave.status === 'published') {
      setSelectedEntry(entryToSave);
      const place = updatedPlaces.find(p => p.id === entryToSave.placeId) || null;
      setSelectedPlace(place);
      setCurrentScreen('entry-detail');
    } else if (entryToSave.placeId) {
      const place = updatedPlaces.find(p => p.id === entryToSave.placeId) || null;
      setSelectedPlace(place);
      setCurrentScreen('place-detail');
    } else {
      setCurrentScreen('home');
    }
  };

  const handleDraftEdit = (draft: Entry) => {
    setEditingEntry(draft);
    setCurrentScreen('entry-editor');
  };

  const handleEntryRestore = (entry: Entry) => {
    const updatedEntries = entries.map(e =>
      e.id === entry.id
        ? { ...e, status: 'draft' as const, deletedAt: undefined }
        : e
    );
    const updatedPlaces = recalcPlaceCounts(places, updatedEntries);
    setEntries(updatedEntries);
    setPlaces(updatedPlaces);
    toast.success('Entry restored to drafts');
  };

  const handleEntryPermanentDelete = (entry: Entry) => {
    if (window.confirm('Are you sure? This will permanently delete the entry and cannot be undone.')) {
      const updatedEntries = entries.filter(e => e.id !== entry.id);
      const updatedPlaces = recalcPlaceCounts(places, updatedEntries);
      setEntries(updatedEntries);
      setPlaces(updatedPlaces);
      toast.success('Entry permanently deleted');
    }
  };

  const handleBack = () => {
    switch (currentScreen) {
      case 'places':
      case 'map':
      case 'drafts':
      case 'trash':
        setCurrentScreen('home');
        break;
      case 'place-detail':
        setCurrentScreen('places');
        setSelectedPlace(null);
        break;
      case 'entry-editor':
        if (selectedPlace) {
          setCurrentScreen('place-detail');
        } else {
          setCurrentScreen('home');
        }
        setEditingEntry(null);
        break;
      case 'entry-detail':
        if (selectedPlace) {
          setCurrentScreen('place-detail');
        } else {
          setCurrentScreen('home');
        }
        setSelectedEntry(null);
        break;
      default:
        setCurrentScreen('home');
    }
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case 'home':
        return (
          <HomeScreen 
            onNavigate={(screen) => {
              if (screen === 'create') handleCreateEntry();
              else if (screen === 'places') setCurrentScreen('places');
              else if (screen === 'map') setCurrentScreen('map');
              else if (screen === 'drafts') setCurrentScreen('drafts');
              else if (screen === 'trash') setCurrentScreen('trash');
            }}
            draftCount={totalDraftCount}
            trashedCount={totalTrashedCount}
          />
        );
      
      case 'places':
        return (
          <PlacesList 
            places={places}
            onBack={handleBack}
            onPlaceSelect={handlePlaceSelect}
          />
        );
      
      case 'map':
        return (
          <MapView 
            places={places}
            onBack={handleBack}
            onPlaceSelect={handlePlaceSelect}
          />
        );
      
      case 'place-detail':
        return selectedPlace ? (
          <PlaceDetail 
            place={selectedPlace}
            entries={getPlaceEntries(selectedPlace.id)}
            onBack={handleBack}
            onCreateEntry={handleCreateEntry}
            onEditEntry={handleEntryEdit}
            onDeleteEntry={handleEntryDelete}
            onViewEntry={handleEntryView}
          />
        ) : null;
      
      case 'entry-editor':
        return (
          <EntryEditor 
            entry={editingEntry || undefined}
            places={places}
            onBack={handleBack}
            onSave={handleEntrySave}
          />
        );
      
      case 'drafts':
        return (
          <DraftsList 
            drafts={draftEntries}
            places={places}
            onBack={handleBack}
            onEditDraft={handleDraftEdit}
          />
        );
      
      case 'entry-detail':
        return selectedEntry ? (
          <EntryDetail 
            entry={selectedEntry}
            place={places.find(p => p.id === selectedEntry.placeId)}
            onBack={handleBack}
            onEdit={() => handleEntryEdit(selectedEntry)}
            onDelete={() => handleEntryDelete(selectedEntry)}
          />
        ) : null;
      
      case 'trash':
        return (
          <TrashScreen 
            trashedEntries={trashedEntries}
            places={places}
            onBack={handleBack}
            onRestore={handleEntryRestore}
            onPermanentDelete={handleEntryPermanentDelete}
          />
        );
      
      default:
        return (
          <HomeScreen 
            onNavigate={(screen) => {
              if (screen === 'create') handleCreateEntry();
              else if (screen === 'places') setCurrentScreen('places');
              else if (screen === 'map') setCurrentScreen('map');
              else if (screen === 'drafts') setCurrentScreen('drafts');
              else if (screen === 'trash') setCurrentScreen('trash');
            }}
            draftCount={totalDraftCount}
            trashedCount={totalTrashedCount}
          />
        );
    }
  };

  return (
    <div className="size-full">
      {renderScreen()}
      
      {/* Bubble Navigation - only show on main screens */}
      {!['entry-editor', 'entry-detail'].includes(currentScreen) && (
        <BubbleNavigation 
          onNavigate={handleNavigate}
          onCreateEntry={() => handleCreateEntry()}
        />
      )}
      
      {/* Toast notifications */}
      <Toaster position="bottom-center" />
    </div>
  );
}