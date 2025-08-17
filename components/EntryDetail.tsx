import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Entry, Place } from '../types';

interface EntryDetailProps {
  entry: Entry;
  place?: Place;
  onBack: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export const EntryDetail: React.FC<EntryDetailProps> = ({
  entry,
  place,
  onBack,
  onEdit,
  onDelete,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={{ padding: 8 }}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={styles.headerTitle}>{entry.title}</Text>
        </View>
        <TouchableOpacity onPress={onEdit} style={{ padding: 8 }}>
          <Ionicons name="create-outline" size={24} color="#4f46e5" />
        </TouchableOpacity>
        <TouchableOpacity onPress={onDelete} style={{ padding: 8 }}>
          <Ionicons name="trash-outline" size={24} color="#dc2626" />
        </TouchableOpacity>
      </View>
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        {place && <Text style={styles.subtitle}>{place.name}</Text>}
        {entry.body && <Text style={styles.content}>{entry.body}</Text>}
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
  subtitle: { color: '#6b7280', marginBottom: 16 },
  content: { fontSize: 16, lineHeight: 22 },
});

export default EntryDetail;
