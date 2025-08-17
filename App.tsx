import React, { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { HomeScreen } from './components/HomeScreen';
import { mockEntries } from './data/mockData';

export default function App() {
  const draftCount = useMemo(
    () => mockEntries.filter(e => e.status === 'draft').length,
    []
  );
  const trashedCount = useMemo(
    () => mockEntries.filter(e => e.status === 'trashed').length,
    []
  );

  const handleNavigate = (screen: 'create' | 'places' | 'map' | 'drafts' | 'trash') => {
    console.log('navigate to', screen);
  };

  return (
    <View style={styles.container}>
      <HomeScreen
        onNavigate={handleNavigate}
        draftCount={draftCount}
        trashedCount={trashedCount}
      />
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
