import React from 'react';
import { View, Text, FlatList, Pressable, StyleSheet } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { mockEntries } from '../data/mockData';
import { Entry } from '../types';
import { RootStackParamList } from './types';

export function DraftsScreen({ navigation }: NativeStackScreenProps<RootStackParamList, 'Drafts'>) {
  const drafts = mockEntries.filter(e => e.status === 'draft');

  const handleEdit = (entry: Entry) => {
    navigation.navigate('EntryEditor', { entry });
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={drafts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Pressable style={styles.item} onPress={() => handleEdit(item)}>
            <Text style={styles.title}>{item.title}</Text>
          </Pressable>
        )}
        ListEmptyComponent={<Text>No drafts available.</Text>}
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

