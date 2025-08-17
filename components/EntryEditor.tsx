import React, { useState } from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  Image,
  FlatList,
} from 'react-native';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import DraggableFlatList, {
  RenderItemParams,
} from 'react-native-draggable-flatlist';
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

  const removeMedia = (index: number) =>
    setMedia(prev => prev.filter((_, i) => i !== index));

  const renderMediaItem = ({
    item,
    index,
    drag,
  }: RenderItemParams<string>) => (
    <View style={styles.mediaItem}>
      <TouchableOpacity onLongPress={drag} activeOpacity={0.8}>
        <Image source={{ uri: item }} style={styles.mediaThumb} />
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.deleteBadge}
        onPress={() => removeMedia(index)}
      >
        <Ionicons name="close" size={14} color="#fff" />
      </TouchableOpacity>
    </View>
  );

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
    <View style={styles.wrapper}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack}>
          <Text style={styles.headerButton}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleSave}>
          <Text style={[styles.headerButton, styles.saveButton]}>Save</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={[]}
        keyExtractor={() => 'content'}
        renderItem={null}
        keyboardShouldPersistTaps="handled"
        ListHeaderComponent={
          <View>
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
              styles={{ textInput: styles.input, listView: { zIndex: 10 } }}
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
              style={[styles.input, styles.multiline]}
              multiline
            />

            <TouchableOpacity style={styles.mediaButton} onPress={pickMedia}>
              <Text style={styles.mediaButtonText}>Add Photos/Videos</Text>
            </TouchableOpacity>

            {media.length > 0 && (
              <DraggableFlatList
                horizontal
                data={media}
                keyExtractor={(item, index) => item + index}
                renderItem={renderMediaItem}
                onDragEnd={({ data }) => setMedia(data)}
                contentContainerStyle={{ paddingVertical: 8 }}
              />
            )}

            <View style={styles.statusCard}>
              <View style={styles.statusHeader}>
                <Text style={styles.statusLabel}>Status</Text>
                <View style={styles.statusToggleRow}>
                  <Switch
                    value={status === 'published'}
                    onValueChange={(v) => setStatus(v ? 'published' : 'draft')}
                  />
                  <Text style={styles.statusValue}>
                    {status === 'published' ? 'Published' : 'Draft'}
                  </Text>
                </View>
              </View>
              <Text style={styles.statusDescription}>
                {status === 'published'
                  ? 'This entry will be published and visible to others'
                  : 'This entry will be saved as a draft'}
              </Text>
            </View>
          </View>
        }
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: { flex: 1, backgroundColor: '#f9fafb' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
  },
  headerButton: {
    fontSize: 16,
    color: '#2563eb',
  },
  saveButton: { fontWeight: '600' },
  listContent: { padding: 16, paddingBottom: 32 },
  input: {
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    padding: 12,
    marginBottom: 12,
  },
  multiline: { height: 120, textAlignVertical: 'top' },
  mediaButton: {
    backgroundColor: '#2563eb',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 12,
  },
  mediaButtonText: { color: '#fff', fontWeight: '600' },
  mediaItem: {
    marginRight: 12,
    width: 80,
    height: 80,
  },
  mediaThumb: { width: '100%', height: '100%', borderRadius: 8 },
  deleteBadge: {
    position: 'absolute',
    top: -6,
    right: -6,
    backgroundColor: '#00000099',
    borderRadius: 10,
    padding: 2,
  },
  statusCard: {
    backgroundColor: '#f3f4f6',
    borderRadius: 8,
    padding: 16,
    marginTop: 16,
  },
  statusHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  statusLabel: { fontSize: 16, fontWeight: '500' },
  statusToggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusValue: {
    marginLeft: 8,
    fontSize: 16,
    color: '#374151',
  },
  statusDescription: {
    color: '#6b7280',
    fontSize: 14,
  },
});

export default EntryEditor;
