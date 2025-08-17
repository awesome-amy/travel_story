import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from './types';

export function EntryEditorScreen({ route }: NativeStackScreenProps<RootStackParamList, 'EntryEditor'>) {
  const entry = route.params?.entry;
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{entry ? `Editing: ${entry.title}` : 'Create New Entry'}</Text>
      <Text>Editor placeholder</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 16 },
  title: { fontSize: 20, fontWeight: '600', marginBottom: 12 },
});

