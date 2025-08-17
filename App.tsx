import 'react-native-gesture-handler';
import 'react-native-get-random-values';
import React, { useState, useMemo } from 'react';
import { Alert } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
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

// Screen type
export type Screen =
  | 'home'
  | 'places'
  | 'map'
  | 'place-detail'
  | 'entry-editor'
  | 'drafts'
  | 'entry-detail'
  | 'trash';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('home');
  const [places, setPlaces] = useState<Place[]>(mockPlaces);
  const [entries, setEntries] = useState<Entry[]>(mockEntries);
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);
  const [selectedEntry, setSelectedEntry] = useState<Entry | null>(null);
  const [editingEntry, setEditingEntry] = useState<Entry | null>(null);

  // Computed values
  const draftEntries = useMemo(() => entries.filter(e => e.status === 'draft'), [entries]);
  const trashedEntries = useMemo(() => entries.filter(e => e.status === 'trashed'), [entries]);
  const totalDraftCount = draftEntries.length;
  const totalTrashedCount = trashedEntries.length;

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
      setSelectedPlace(places.find(p => p.id === placeId) || null);
    }
    setCurrentScreen('entry-editor');
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
    Alert.alert('Delete entry', 'Are you sure you want to delete this entry?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => {
          setEntries(prev =>
            prev.map(e =>
              e.id === entry.id
                ? { ...e, status: 'trashed' as const, deletedAt: new Date() }
                : e
            )
          );
        },
      },
    ]);
  };

  const handleEntrySave = (entryData: Partial<Entry>) => {
    if (editingEntry) {
      setEntries(prev =>
        prev.map(e => (e.id === editingEntry.id ? { ...e, ...entryData } : e))
      );
    } else {
      const newEntry: Entry = {
        id: Date.now().toString(),
        createdAt: new Date(),
        updatedAt: new Date(),
        ...entryData,
      } as Entry;
      setEntries(prev => [...prev, newEntry]);
    }
    setCurrentScreen('home');
    setEditingEntry(null);
  };

  const handleDraftEdit = (draft: Entry) => {
    setEditingEntry(draft);
    setCurrentScreen('entry-editor');
  };

  const handleEntryRestore = (entry: Entry) => {
    setEntries(prev =>
      prev.map(e =>
        e.id === entry.id
          ? { ...e, status: 'draft' as const, deletedAt: undefined }
          : e
      )
    );
  };

  const handleEntryPermanentDelete = (entry: Entry) => {
    Alert.alert('Delete permanently', 'This cannot be undone.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => setEntries(prev => prev.filter(e => e.id !== entry.id)),
      },
    ]);
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
          <PlacesList places={places} onBack={handleBack} onPlaceSelect={handlePlaceSelect} />
        );
      case 'map':
        return (
          <MapView places={places} onBack={handleBack} onPlaceSelect={handlePlaceSelect} />
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
        return null;
    }
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      {renderScreen()}
      {!['entry-editor', 'entry-detail'].includes(currentScreen) && (
        <BubbleNavigation
          onNavigate={handleNavigate}
          onCreateEntry={() => handleCreateEntry()}
        />
      )}
    </GestureHandlerRootView>
  );
}
