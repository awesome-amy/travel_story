import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Place, Entry } from '../types';

interface PlaceDetailProps {
  place: Place;
  entries: Entry[];
  onBack: () => void;
  onCreateEntry: (placeId?: string) => void;
  onEditEntry: (entry: Entry) => void;
  onDeleteEntry: (entry: Entry) => void;
  onViewEntry: (entry: Entry) => void;
}

export const PlaceDetail: React.FC<PlaceDetailProps> = ({
  place,
  entries,
  onBack,
  onCreateEntry,
  onEditEntry,
  onDeleteEntry,
  onViewEntry,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={{ padding: 8 }}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{place.name}</Text>
      </View>
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <Text style={styles.infoText}>
          {place.adminArea}, {place.countryCode}
        </Text>
        <TouchableOpacity style={styles.addButton} onPress={() => onCreateEntry(place.id)}>
          <Ionicons name="add" size={20} color="#fff" />
          <Text style={{ color: '#fff', marginLeft: 4 }}>Add Entry</Text>
        </TouchableOpacity>
        {entries.map((e) => (
          <TouchableOpacity key={e.id} style={styles.entryCard} onPress={() => onViewEntry(e)}>
            <Text style={styles.entryTitle}>{e.title}</Text>
            <View style={styles.entryActions}>
              <TouchableOpacity onPress={() => onEditEntry(e)} style={{ marginRight: 8 }}>
                <Ionicons name="create-outline" size={20} color="#4f46e5" />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => onDeleteEntry(e)}>
                <Ionicons name="trash-outline" size={20} color="#dc2626" />
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  headerTitle: { fontSize: 20, fontWeight: 'bold', marginLeft: 8 },
  infoText: { marginBottom: 16, color: '#6b7280' },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4f46e5',
    padding: 8,
    borderRadius: 4,
    alignSelf: 'flex-start',
    marginBottom: 16,
  },
  entryCard: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  entryTitle: { fontSize: 16, fontWeight: '500' },
  entryActions: { flexDirection: 'row' },
});

export default PlaceDetail;
