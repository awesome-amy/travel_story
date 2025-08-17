import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from './types';

export function EntryDetailScreen({ route }: NativeStackScreenProps<RootStackParamList, 'EntryDetail'>) {
  const { entry } = route.params;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>{entry.title}</Text>
      {entry.body && <Text style={styles.body}>{entry.body}</Text>}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16 },
  title: { fontSize: 20, fontWeight: '600', marginBottom: 12 },
  body: { fontSize: 16, lineHeight: 22 },
});

