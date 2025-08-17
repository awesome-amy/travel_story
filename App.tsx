import React, { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer, useNavigationContainerRef } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { HomeScreen } from './components/HomeScreen';
import { BubbleNavigation } from './components/BubbleNavigation';
import { mockEntries } from './data/mockData';
import { PlacesScreen } from './screens/PlacesScreen';
import { PlaceDetailScreen } from './screens/PlaceDetailScreen';
import { EntryDetailScreen } from './screens/EntryDetailScreen';
import { MapScreen } from './screens/MapScreen';
import { DraftsScreen } from './screens/DraftsScreen';
import { TrashScreen } from './screens/TrashScreen';
import { EntryEditorScreen } from './screens/EntryEditorScreen';
import { RootStackParamList } from './screens/types';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  const navigationRef = useNavigationContainerRef<RootStackParamList>();

  const draftCount = useMemo(
    () => mockEntries.filter(e => e.status === 'draft').length,
    []
  );
  const trashedCount = useMemo(
    () => mockEntries.filter(e => e.status === 'trashed').length,
    []
  );

  return (
    <View style={styles.container}>
      <NavigationContainer ref={navigationRef}>
        <Stack.Navigator>
          <Stack.Screen name="Home" options={{ title: 'Home' }}>
            {({ navigation }) => (
              <HomeScreen
                draftCount={draftCount}
                trashedCount={trashedCount}
                onNavigate={(screen) => {
                  const mapping = {
                    create: 'EntryEditor',
                    places: 'Places',
                    map: 'Map',
                    drafts: 'Drafts',
                    trash: 'Trash',
                  } as const;
                  navigation.navigate(mapping[screen]);
                }}
              />
            )}
          </Stack.Screen>
          <Stack.Screen name="EntryEditor" component={EntryEditorScreen} options={{ title: 'Entry' }} />
          <Stack.Screen name="Places" component={PlacesScreen} options={{ title: 'Places' }} />
          <Stack.Screen
            name="PlaceDetail"
            component={PlaceDetailScreen}
            options={({ route }) => ({ title: route.params.place.name })}
          />
          <Stack.Screen name="EntryDetail" component={EntryDetailScreen} options={{ title: 'Entry' }} />
          <Stack.Screen name="Map" component={MapScreen} options={{ title: 'Map' }} />
          <Stack.Screen name="Drafts" component={DraftsScreen} options={{ title: 'Drafts' }} />
          <Stack.Screen name="Trash" component={TrashScreen} options={{ title: 'Trash' }} />
        </Stack.Navigator>
      </NavigationContainer>
      <BubbleNavigation
        onNavigate={(screen) => {
          const mapping = { home: 'Home', places: 'Places', map: 'Map' } as const;
          navigationRef.navigate(mapping[screen]);
        }}
        onCreateEntry={() => navigationRef.navigate('EntryEditor')}
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

