import React, { useState } from 'react';
import { View, TextInput, StyleSheet, Switch, Text, TouchableOpacity, ScrollView } from 'react-native';
import { Entry, Place } from '../types';

interface EntryEditorProps {
  entry?: Entry;
  places: Place[];
  onBack: () => void;
  onSave: (entryData: Partial<Entry>) => void;
}

export const EntryEditor: React.FC<EntryEditorProps> = ({ entry, places, onBack, onSave }) => {
  const [title, setTitle] = useState(entry?.title || '');
  const [body, setBody] = useState(entry?.body || '');
  const [placeId, setPlaceId] = useState(entry?.placeId || places[0]?.id);
  const [status, setStatus] = useState<Entry['status']>(entry?.status || 'draft');

  const handleSave = () => {
    onSave({
      title,
      body,
      placeId,
      status,
      type: entry?.type || 'blog',
      createdAt: entry?.createdAt || new Date(),
      updatedAt: new Date(),
    });
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TextInput
        placeholder="Title"
        value={title}
        onChangeText={setTitle}
        style={styles.input}
      />
      <TextInput
        placeholder="Content"
        value={body}
        onChangeText={setBody}
        style={[styles.input, { height: 120 }]}
        multiline
      />
      <View style={styles.switchRow}>
        <Text style={styles.label}>Published</Text>
        <Switch
          value={status === 'published'}
          onValueChange={(v) => setStatus(v ? 'published' : 'draft')}
        />
      </View>
      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.button} onPress={handleSave}>
          <Text style={styles.buttonText}>Save</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, styles.cancelButton]}
          onPress={onBack}
        >
          <Text style={[styles.buttonText, { color: '#000' }]}>Cancel</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { padding: 16 },
  input: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  label: { fontSize: 16 },
  buttonRow: { flexDirection: 'row', justifyContent: 'space-between' },
  button: {
    backgroundColor: '#4f46e5',
    padding: 12,
    borderRadius: 8,
    flex: 1,
    alignItems: 'center',
    marginRight: 8,
  },
  cancelButton: { backgroundColor: '#e5e7eb', marginRight: 0, marginLeft: 8 },
  buttonText: { color: '#fff', fontWeight: '600' },
});

export default EntryEditor;
