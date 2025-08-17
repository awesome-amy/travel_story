import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Entry, Place } from '../types';

interface TrashScreenProps {
  trashedEntries: Entry[];
  places: Place[];
  onBack: () => void;
  onRestore: (entry: Entry) => void;
  onPermanentDelete: (entry: Entry) => void;
}

export const TrashScreen: React.FC<TrashScreenProps> = ({
  trashedEntries,
  places,
  onBack,
  onRestore,
  onPermanentDelete,
}) => {
  const renderItem = ({ item }: { item: Entry }) => {
    const place = places.find((p) => p.id === item.placeId);
    return (
      <View style={styles.card}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.subtitle}>{place?.name || 'Unknown location'}</Text>
        <View style={styles.actions}>
          <TouchableOpacity onPress={() => onRestore(item)} style={styles.actionButton}>
            <Text style={styles.actionText}>Restore</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => onPermanentDelete(item)}
            style={[styles.actionButton, { backgroundColor: '#fee2e2' }]}
          >
            <Text style={[styles.actionText, { color: '#dc2626' }]}>Delete</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={{ padding: 8 }}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Trash</Text>
      </View>
      <FlatList
        data={trashedEntries}
        keyExtractor={(e) => e.id}
        renderItem={renderItem}
        contentContainerStyle={{ padding: 16 }}
      />
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
  card: { backgroundColor: '#fff', padding: 12, borderRadius: 8, marginBottom: 12 },
  title: { fontSize: 16, fontWeight: '600' },
  subtitle: { color: '#6b7280', marginBottom: 8 },
  actions: { flexDirection: 'row' },
  actionButton: {
    backgroundColor: '#e5e7eb',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
    marginRight: 8,
  },
  actionText: { color: '#000' },
});

export default TrashScreen;
