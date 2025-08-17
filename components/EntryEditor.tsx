import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, ScrollView, StyleSheet, Pressable, Image, Switch } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Entry, Place } from '../types';

interface EntryEditorProps {
  entry?: Entry;
  places: Place[];
  onBack: () => void;
  onSave: (entry: Partial<Entry>) => void;
}

export function EntryEditor({ entry, places, onBack, onSave }: EntryEditorProps) {
  const [title, setTitle] = useState(entry?.title || '');
  const [type, setType] = useState<Entry['type']>(entry?.type || 'blog');
  const [body, setBody] = useState(entry?.body || '');
  const [location, setLocation] = useState(entry?.location || '');
  const [country, setCountry] = useState(entry?.country || '');
  const [isPublished, setIsPublished] = useState(entry?.status === 'published');
  const [mediaUrls, setMediaUrls] = useState<string[]>(entry?.mediaUrls || []);

  useEffect(() => {
    ImagePicker.requestMediaLibraryPermissionsAsync();
  }, []);

  const addMedia = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: type === 'album' ? ImagePicker.MediaTypeOptions.Images : ImagePicker.MediaTypeOptions.Videos,
      allowsMultipleSelection: true,
      quality: 0.5,
    });
    if (!result.canceled) {
      const uris = result.assets.map(a => a.uri);
      setMediaUrls(prev => [...prev, ...uris]);
    }
  };

  const removeMedia = (index: number) => {
    setMediaUrls(mediaUrls.filter((_, i) => i !== index));
  };

  const canSave = title.trim() && (location.trim() || country.trim()) && (
    (type === 'blog' && body.trim()) ||
    (type !== 'blog' && mediaUrls.length > 0)
  );

  const handleSave = () => {
    const entryData: Partial<Entry> = {
      id: entry?.id,
      title,
      type,
      body: type === 'blog' ? body : undefined,
      mediaUrls: type !== 'blog' ? mediaUrls : undefined,
      location,
      country,
      status: isPublished ? 'published' : 'draft',
      updatedAt: new Date(),
    };
    if (!entry) {
      entryData.createdAt = new Date();
    }
    onSave(entryData);
  };

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.header}>
        <Pressable onPress={onBack}>
          <Text style={styles.headerButton}>Cancel</Text>
        </Pressable>
        <Pressable onPress={handleSave} disabled={!canSave}>
          <Text style={[styles.headerButton, !canSave && styles.disabled]}>Save</Text>
        </Pressable>
      </View>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.label}>Title</Text>
        <TextInput
          style={styles.input}
          value={title}
          onChangeText={setTitle}
          placeholder="Enter title..."
        />

        <Text style={styles.label}>Entry Type</Text>
        <View style={styles.typeRow}>
          {(['blog', 'album', 'video'] as Entry['type'][]).map((t) => (
            <Pressable
              key={t}
              onPress={() => setType(t)}
              style={[styles.typeButton, type === t && styles.typeButtonActive]}
            >
              <Text style={[styles.typeButtonText, type === t && styles.typeButtonTextActive]}>
                {t === 'blog' ? 'Blog' : t === 'album' ? 'Album' : 'Video'}
              </Text>
            </Pressable>
          ))}
        </View>

        <Text style={styles.label}>Location</Text>
        <TextInput
          style={styles.input}
          value={location}
          onChangeText={setLocation}
          placeholder="Location (e.g., Central Park)"
        />
        <Text style={styles.label}>Country</Text>
        <TextInput
          style={styles.input}
          value={country}
          onChangeText={setCountry}
          placeholder="Country"
        />

        {type === 'blog' ? (
          <>
            <Text style={styles.label}>Content</Text>
            <TextInput
              style={[styles.input, styles.multiline]}
              multiline
              value={body}
              onChangeText={setBody}
              placeholder="Write your story..."
              textAlignVertical="top"
            />
          </>
        ) : (
          <>
            <Pressable style={styles.addMedia} onPress={addMedia}>
              <Text style={styles.addMediaText}>
                Add {type === 'album' ? 'Photos' : 'Videos'}
              </Text>
            </Pressable>
            {mediaUrls.map((uri, index) => (
              <View key={index} style={styles.mediaItem}>
                {type === 'album' ? (
                  <Image source={{ uri }} style={styles.mediaPreview} />
                ) : (
                  <Text style={styles.videoLabel}>{uri}</Text>
                )}
                <Pressable onPress={() => removeMedia(index)} style={styles.removeMedia}>
                  <Text style={styles.removeMediaText}>Remove</Text>
                </Pressable>
              </View>
            ))}
          </>
        )}

        <View style={styles.publishRow}>
          <Text style={styles.label}>Published</Text>
          <Switch value={isPublished} onValueChange={setIsPublished} />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: '#ccc',
  },
  headerButton: {
    fontSize: 16,
    color: '#007AFF',
  },
  disabled: {
    opacity: 0.5,
  },
  content: {
    padding: 16,
    paddingBottom: 40,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    marginTop: 16,
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    padding: 8,
  },
  multiline: {
    height: 120,
  },
  typeRow: {
    flexDirection: 'row',
    marginTop: 8,
  },
  typeButton: {
    flex: 1,
    padding: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    marginRight: 8,
    alignItems: 'center',
  },
  typeButtonActive: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  typeButtonText: {
    color: '#007AFF',
  },
  typeButtonTextActive: {
    color: '#fff',
  },
  addMedia: {
    marginTop: 8,
    padding: 12,
    backgroundColor: '#f0f0f0',
    borderRadius: 4,
    alignItems: 'center',
  },
  addMediaText: {
    color: '#007AFF',
  },
  mediaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  mediaPreview: {
    width: 64,
    height: 64,
    marginRight: 8,
    borderRadius: 4,
  },
  videoLabel: {
    flex: 1,
    marginRight: 8,
  },
  removeMedia: {
    padding: 4,
  },
  removeMediaText: {
    color: '#d00',
  },
  publishRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 24,
  },
});
