import React from 'react';
import { View, Text, FlatList, Pressable, StyleSheet } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { mockEntries } from '../data/mockData';
import { Entry } from '../types';
import { RootStackParamList } from './types';

export function TrashScreen({ navigation }: NativeStackScreenProps<RootStackParamList, 'Trash'>) {
  const trashed = mockEntries.filter(e => e.status === 'trashed');

  const handleView = (entry: Entry) => {
    navigation.navigate('EntryDetail', { entry });
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={trashed}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Pressable style={styles.item} onPress={() => handleView(item)}>
            <Text style={styles.title}>{item.title}</Text>
          </Pressable>
        )}
        ListEmptyComponent={<Text>Trash is empty.</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  item: {
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: '#ccc',
  },
  title: { fontSize: 16 },
});

