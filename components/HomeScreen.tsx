import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface HomeScreenProps {
  onNavigate: (screen: 'create' | 'places' | 'map' | 'drafts' | 'trash') => void;
  draftCount: number;
  trashedCount?: number;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({ onNavigate, draftCount, trashedCount = 0 }) => {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Travel Stories</Text>
        <Text style={styles.subtitle}>Capture your journeys</Text>
      </View>

      <TouchableOpacity style={styles.card} onPress={() => onNavigate('create')}>
        <View style={[styles.iconCircle, { backgroundColor: '#4f46e5' }]}>
          <Ionicons name="create-outline" size={24} color="#fff" />
        </View>
        <View style={styles.cardText}>
          <Text style={styles.cardTitle}>Create New Entry</Text>
          <Text style={styles.cardSubtitle}>Start a new blog, album, or video</Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity style={styles.card} onPress={() => onNavigate('places')}>
        <View style={[styles.iconCircle, { backgroundColor: '#14b8a6' }]}>
          <Ionicons name="location-outline" size={24} color="#fff" />
        </View>
        <View style={styles.cardText}>
          <Text style={styles.cardTitle}>See All Places</Text>
          <Text style={styles.cardSubtitle}>Browse your travel destinations</Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity style={styles.card} onPress={() => onNavigate('map')}>
        <View style={[styles.iconCircle, { backgroundColor: '#f59e0b' }]}>
          <Ionicons name="map-outline" size={24} color="#fff" />
        </View>
        <View style={styles.cardText}>
          <Text style={styles.cardTitle}>See All Places on Map</Text>
          <Text style={styles.cardSubtitle}>Explore destinations visually</Text>
        </View>
      </TouchableOpacity>

      {draftCount > 0 && (
        <TouchableOpacity style={styles.card} onPress={() => onNavigate('drafts')}>
          <View style={[styles.iconCircle, { backgroundColor: '#e5e7eb' }]}>
            <Ionicons name="document-text-outline" size={24} color="#374151" />
          </View>
          <View style={styles.cardText}>
            <Text style={styles.cardTitle}>Drafts ({draftCount})</Text>
            <Text style={styles.cardSubtitle}>Continue writing your stories</Text>
          </View>
        </TouchableOpacity>
      )}

      {trashedCount > 0 && (
        <TouchableOpacity style={styles.card} onPress={() => onNavigate('trash')}>
          <View style={[styles.iconCircle, { backgroundColor: '#fee2e2' }]}>
            <Ionicons name="trash-outline" size={24} color="#dc2626" />
          </View>
          <View style={styles.cardText}>
            <Text style={styles.cardTitle}>Trash ({trashedCount})</Text>
            <Text style={styles.cardSubtitle}>Recently deleted entries</Text>
          </View>
        </TouchableOpacity>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { padding: 24 },
  header: { alignItems: 'center', marginBottom: 24 },
  title: { fontSize: 24, fontWeight: 'bold' },
  subtitle: { color: '#6b7280' },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    elevation: 1
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16
  },
  cardText: { flex: 1 },
  cardTitle: { fontSize: 16, fontWeight: '600', marginBottom: 4 },
  cardSubtitle: { color: '#6b7280' }
});

export default HomeScreen;
