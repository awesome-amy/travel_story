import React from 'react';
import { View, Text, FlatList, Pressable, StyleSheet } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { mockEntries } from '../data/mockData';
import { Entry, Place } from '../types';
import { RootStackParamList } from './types';

export function PlaceDetailScreen({ route, navigation }: NativeStackScreenProps<RootStackParamList, 'PlaceDetail'>) {
  const { place } = route.params;
  const entries = mockEntries.filter(e => e.placeId === place.id && e.status === 'published');

  const handleSelect = (entry: Entry) => {
    navigation.navigate('EntryDetail', { entry });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>{place.name}</Text>
      <FlatList
        data={entries}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Pressable style={styles.item} onPress={() => handleSelect(item)}>
            <Text style={styles.title}>{item.title}</Text>
          </Pressable>
        )}
        ListEmptyComponent={<Text>No entries yet.</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  heading: { fontSize: 20, fontWeight: '600', marginBottom: 16 },
  item: {
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: '#ccc',
  },
  title: { fontSize: 16 },
});

