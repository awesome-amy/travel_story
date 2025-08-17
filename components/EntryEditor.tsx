import React, { useState } from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  FlatList,
} from 'react-native';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import Markdown from 'react-native-markdown-display';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { Entry, Place } from '../types';

interface EntryEditorProps {
  entry?: Entry;
  places: Place[];
  onBack: () => void;
  onSave: (entryData: Partial<Entry>) => void;
}

export const EntryEditor: React.FC<EntryEditorProps> = ({
  entry,
  places,
  onBack,
  onSave,
}) => {
  const [title, setTitle] = useState(entry?.title || '');
  const [body, setBody] = useState(entry?.body || '');
  const [placeId, setPlaceId] = useState(entry?.placeId || undefined);
  const [locationText, setLocationText] = useState('');
  const [status, setStatus] = useState<Entry['status']>(entry?.status || 'draft');
  const [media, setMedia] = useState<string[]>(entry?.mediaUrls || []);

  const pickMedia = async () => {
    const res = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsMultipleSelection: true,
    });
    if (!res.canceled) {
      const assets = (res.assets || []).map(a => a.uri);
      setMedia(prev => [...prev, ...assets]);
    }
  };

  const moveMedia = (from: number, to: number) => {
    if (to < 0 || to >= media.length) return;
    setMedia(prev => {
      const arr = [...prev];
      const [item] = arr.splice(from, 1);
      arr.splice(to, 0, item);
      return arr;
    });
  };

  const handleSave = () => {
    onSave({
      title,
      body,
      placeId,
      mediaUrls: media,
      status,
      type: entry?.type || 'blog',
      createdAt: entry?.createdAt || new Date(),
      updatedAt: new Date(),
    });
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack}>
          <Text style={styles.headerButton}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleSave}>
          <Text style={[styles.headerButton, styles.saveButton]}>Save</Text>
        </TouchableOpacity>
      </View>

      <GooglePlacesAutocomplete
        placeholder="Tag location"
        query={{ key: 'YOUR_GOOGLE_API_KEY', language: 'en' }}
        fetchDetails
        onPress={(data) => {
          setPlaceId(data.place_id);
          setLocationText(data.description);
        }}
        textInputProps={{
          value: locationText,
          onChangeText: setLocationText,
        }}
        styles={{ textInput: styles.input }}
      />

      <TextInput
        placeholder="Title"
        value={title}
        onChangeText={setTitle}
        style={styles.input}
      />

      <TextInput
        placeholder="Content (markdown supported)"
        value={body}
        onChangeText={setBody}
        style={[styles.input, { height: 120 }]}
        multiline
      />

      {body.length > 0 && <Markdown style={styles.preview}>{body}</Markdown>}

      <TouchableOpacity style={styles.mediaButton} onPress={pickMedia}>
        <Text style={styles.mediaButtonText}>Add Photos/Videos</Text>
      </TouchableOpacity>

      <FlatList
        horizontal
        data={media}
        keyExtractor={(item, index) => item + index}
        renderItem={({ item, index }) => (
          <View style={styles.mediaItem}>
            <Image source={{ uri: item }} style={styles.mediaThumb} />
            <View style={styles.mediaActions}>
              <TouchableOpacity
                disabled={index === 0}
                onPress={() => moveMedia(index, index - 1)}
              >
                <Ionicons name="arrow-back" size={20} />
              </TouchableOpacity>
              <TouchableOpacity
                disabled={index === media.length - 1}
                onPress={() => moveMedia(index, index + 1)}
              >
                <Ionicons name="arrow-forward" size={20} />
              </TouchableOpacity>
            </View>
          </View>
        )}
      />

      <View style={styles.statusSection}>
        <View style={styles.switchRow}>
          <Text style={styles.label}>Status</Text>
          <Switch
            value={status === 'published'}
            onValueChange={(v) => setStatus(v ? 'published' : 'draft')}
          />
        </View>
        <Text style={styles.statusText}>
          {status === 'published'
            ? 'This entry will be published and visible to others'
            : 'This entry will be saved as a draft'}
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { padding: 16 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  headerButton: {
    fontSize: 16,
    color: '#4f46e5',
  },
  saveButton: { fontWeight: '600' },
  input: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  preview: { marginBottom: 16 },
  mediaButton: {
    backgroundColor: '#4f46e5',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 12,
  },
  mediaButtonText: { color: '#fff', fontWeight: '600' },
  mediaItem: {
    marginRight: 12,
    alignItems: 'center',
  },
  mediaThumb: { width: 80, height: 80, borderRadius: 8 },
  mediaActions: {
    flexDirection: 'row',
    marginTop: 4,
    width: 80,
    justifyContent: 'space-between',
  },
  statusSection: { marginTop: 16 },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  label: { fontSize: 16 },
  statusText: { color: '#6b7280', fontSize: 14 },
});

export default EntryEditor;
