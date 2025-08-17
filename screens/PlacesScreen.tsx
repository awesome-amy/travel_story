import React from 'react';
import { View, Text, FlatList, Pressable, StyleSheet } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { mockPlaces } from '../data/mockData';
import { Place } from '../types';
import { RootStackParamList } from './types';

export function PlacesScreen({ navigation }: NativeStackScreenProps<RootStackParamList, 'Places'>) {
  const handleSelect = (place: Place) => {
    navigation.navigate('PlaceDetail', { place });
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={mockPlaces}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Pressable style={styles.item} onPress={() => handleSelect(item)}>
            <Text style={styles.title}>{item.name}</Text>
            <Text style={styles.subtitle}>{item.adminArea}</Text>
          </Pressable>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  item: {
    padding: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: '#ccc',
  },
  title: { fontSize: 16, fontWeight: '500' },
  subtitle: { color: '#666', marginTop: 4 },
});

