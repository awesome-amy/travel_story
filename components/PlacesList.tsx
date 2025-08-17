import React, { useState, useMemo } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Place } from '../types';

interface PlacesListProps {
  places: Place[];
  onBack: () => void;
  onPlaceSelect: (place: Place) => void;
}

export const PlacesList: React.FC<PlacesListProps> = ({ places, onBack, onPlaceSelect }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortMode, setSortMode] = useState<'recent' | 'alphabet' | 'mostEntries'>('recent');

  const filtered = useMemo(() => {
    const q = searchQuery.toLowerCase();
    let arr = places.filter(
      p =>
        p.name.toLowerCase().includes(q) ||
        p.adminArea.toLowerCase().includes(q) ||
        p.countryCode.toLowerCase().includes(q)
    );
    switch (sortMode) {
      case 'alphabet':
        return [...arr].sort((a, b) => a.name.localeCompare(b.name));
      case 'mostEntries':
        return [...arr].sort((a, b) => b.entryCount - a.entryCount);
      default:
        return arr;
    }
  }, [places, searchQuery, sortMode]);

  const renderItem = ({ item }: { item: Place }) => (
    <TouchableOpacity style={styles.placeCard} onPress={() => onPlaceSelect(item)}>
      <View style={styles.thumbnail} />
      <View style={{ flex: 1, padding: 12 }}>
        <Text style={styles.placeName}>{item.name}</Text>
        <Text style={styles.placeArea}>{item.adminArea}</Text>
        <View style={{ flexDirection: 'row', marginTop: 4 }}>
          <Text style={styles.badge}>{item.entryCount} entries</Text>
          {item.draftCount > 0 && (
            <Text style={[styles.badge, { marginLeft: 8 }]}>{item.draftCount} drafts</Text>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={{ padding: 8 }}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Places</Text>
      </View>

      <View style={styles.searchRow}>
        <Ionicons name="search" size={20} color="#9ca3af" style={styles.searchIcon} />
        <TextInput
          placeholder="Search places..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          style={styles.searchInput}
        />
      </View>

      <View style={styles.sortRow}>
        <TouchableOpacity
          onPress={() => setSortMode('recent')}
          style={[styles.sortButton, sortMode === 'recent' && styles.sortButtonActive]}
        >
          <Text style={styles.sortButtonText}>Recent</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setSortMode('alphabet')}
          style={[styles.sortButton, sortMode === 'alphabet' && styles.sortButtonActive]}
        >
          <Text style={styles.sortButtonText}>Alphabet</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setSortMode('mostEntries')}
          style={[styles.sortButton, sortMode === 'mostEntries' && styles.sortButtonActive]}
        >
          <Text style={styles.sortButtonText}>Most Entries</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 24 }}
      />

      {filtered.length === 0 && (
        <View style={{ marginTop: 20, alignItems: 'center' }}>
          <Text style={{ color: '#9ca3af' }}>No places found matching your search.</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9fafb' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  headerTitle: { fontSize: 20, fontWeight: 'bold', marginLeft: 8 },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 8,
  },
  searchIcon: { marginRight: 4 },
  searchInput: { flex: 1, padding: 8 },
  sortRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginHorizontal: 16,
    marginBottom: 8,
  },
  sortButton: { padding: 8 },
  sortButtonActive: { borderBottomWidth: 2, borderBottomColor: '#4f46e5' },
  sortButtonText: { color: '#4f46e5', fontWeight: '500' },
  placeCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 8,
    marginHorizontal: 16,
    marginBottom: 12,
    overflow: 'hidden',
    elevation: 1,
  },
  thumbnail: { width: 96, height: 96, backgroundColor: '#e5e7eb' },
  placeName: { fontSize: 16, fontWeight: '600' },
  placeArea: { color: '#6b7280' },
  badge: {
    backgroundColor: '#e5e7eb',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    fontSize: 12,
    color: '#374151',
  },
});

export default PlacesList;
