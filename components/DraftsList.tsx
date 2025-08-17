import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Entry, Place } from '../types';

interface DraftsListProps {
  drafts: Entry[];
  places: Place[];
  onBack: () => void;
  onEditDraft: (entry: Entry) => void;
}

export const DraftsList: React.FC<DraftsListProps> = ({ drafts, places, onBack, onEditDraft }) => {
  const renderItem = ({ item }: { item: Entry }) => {
    const place = places.find((p) => p.id === item.placeId);
    return (
      <TouchableOpacity style={styles.card} onPress={() => onEditDraft(item)}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.subtitle}>{place?.name || 'Unknown location'}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={{ padding: 8 }}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Drafts</Text>
      </View>
      <FlatList
        data={drafts}
        keyExtractor={(d) => d.id}
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
  subtitle: { color: '#6b7280' },
});

export default DraftsList;
