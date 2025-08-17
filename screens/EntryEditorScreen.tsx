import React from 'react';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from './types';
import { EntryEditor } from '../components/EntryEditor';
import { mockPlaces } from '../data/mockData';
import { Entry } from '../types';

export function EntryEditorScreen({ route, navigation }: NativeStackScreenProps<RootStackParamList, 'EntryEditor'>) {
  const entry = route.params?.entry;

  const handleSave = (data: Partial<Entry>) => {
    console.log('Saved entry', data);
    navigation.goBack();
  };

  return (
    <EntryEditor
      entry={entry}
      places={mockPlaces}
      onBack={() => navigation.goBack()}
      onSave={handleSave}
    />
  );
}
