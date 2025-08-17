import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Place } from '../types';

interface MapViewProps {
  places: Place[];
  onBack: () => void;
  onPlaceSelect: (place: Place) => void;
}

export const MapView: React.FC<MapViewProps> = ({ places, onBack, onPlaceSelect }) => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={{ padding: 8 }}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Map</Text>
      </View>
      <ScrollView contentContainerStyle={styles.mapArea}>
        {places.map((p) => (
          <TouchableOpacity key={p.id} style={styles.pin} onPress={() => onPlaceSelect(p)}>
            <Ionicons name="location-sharp" size={32} color="#ef4444" />
            <Text>{p.name}</Text>
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
  mapArea: { alignItems: 'center', padding: 24 },
  pin: { alignItems: 'center', marginBottom: 16 },
});

export default MapView;
