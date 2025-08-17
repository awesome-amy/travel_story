import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';

interface HomeScreenProps {
  onNavigate: (screen: 'create' | 'places' | 'map' | 'drafts' | 'trash') => void;
  draftCount: number;
  trashedCount?: number;
}

export function HomeScreen({ onNavigate, draftCount, trashedCount = 0 }: HomeScreenProps) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Travel Stories</Text>
        <Text style={styles.subtitle}>Capture your journeys</Text>
      </View>

      <View>
        <Pressable style={styles.card} onPress={() => onNavigate('create')}>
          <View style={[styles.iconCircle, styles.primary]}>
            <Feather name="edit-3" size={24} color="#fff" />
          </View>
          <View style={styles.cardText}>
            <Text style={styles.cardTitle}>Create New Entry</Text>
            <Text style={styles.cardSubtitle}>Start a new blog, album, or video</Text>
          </View>
        </Pressable>

        <Pressable style={styles.card} onPress={() => onNavigate('places')}>
          <View style={[styles.iconCircle, styles.secondary]}>
            <Feather name="map-pin" size={24} color="#fff" />
          </View>
          <View style={styles.cardText}>
            <Text style={styles.cardTitle}>See All Places</Text>
            <Text style={styles.cardSubtitle}>Browse your travel destinations</Text>
          </View>
        </Pressable>

        <Pressable style={styles.card} onPress={() => onNavigate('map')}>
          <View style={[styles.iconCircle, styles.accent]}>
            <Feather name="map" size={24} color="#fff" />
          </View>
          <View style={styles.cardText}>
            <Text style={styles.cardTitle}>See All Places on Map</Text>
            <Text style={styles.cardSubtitle}>Explore destinations visually</Text>
          </View>
        </Pressable>

        {draftCount > 0 && (
          <Pressable style={styles.card} onPress={() => onNavigate('drafts')}>
            <View style={[styles.iconCircle, styles.muted]}>
              <Feather name="file-text" size={24} color="#666" />
            </View>
            <View style={styles.cardText}>
              <Text style={styles.cardTitle}>Drafts</Text>
              <Text style={styles.cardSubtitle}>Continue writing your stories</Text>
            </View>
            <View style={[styles.badge, styles.badgeSecondary]}>
              <Text style={styles.badgeText}>{draftCount}</Text>
            </View>
          </Pressable>
        )}

        {trashedCount > 0 && (
          <Pressable style={styles.card} onPress={() => onNavigate('trash')}>
            <View style={[styles.iconCircle, styles.destructive]}>
              <Feather name="trash-2" size={24} color="#d00" />
            </View>
            <View style={styles.cardText}>
              <Text style={styles.cardTitle}>Trash</Text>
              <Text style={styles.cardSubtitle}>Recently deleted entries</Text>
            </View>
            <View style={[styles.badge, styles.badgeDestructive]}>
              <Text style={styles.badgeText}>{trashedCount}</Text>
            </View>
          </Pressable>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: '#fff',
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  subtitle: {
    color: '#666',
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    marginBottom: 12,
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  primary: {
    backgroundColor: '#007AFF',
  },
  secondary: {
    backgroundColor: '#6c757d',
  },
  accent: {
    backgroundColor: '#28a745',
  },
  muted: {
    backgroundColor: '#e9ecef',
  },
  destructive: {
    backgroundColor: '#f8d7da',
  },
  cardText: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '500',
  },
  cardSubtitle: {
    color: '#666',
  },
  badge: {
    marginLeft: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  badgeSecondary: {
    backgroundColor: '#e0e0e0',
  },
  badgeDestructive: {
    backgroundColor: '#fdd',
  },
  badgeText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
});

