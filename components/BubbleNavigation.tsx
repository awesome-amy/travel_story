import React, { useState } from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface BubbleNavigationProps {
  onNavigate: (screen: 'home' | 'places' | 'map') => void;
  onCreateEntry: () => void;
}

export const BubbleNavigation: React.FC<BubbleNavigationProps> = ({ onNavigate, onCreateEntry }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <View style={styles.container}>
      {expanded && (
        <View style={styles.actions}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => {
              setExpanded(false);
              onNavigate('home');
            }}
          >
            <Ionicons name="home" size={20} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => {
              setExpanded(false);
              onNavigate('places');
            }}
          >
            <Ionicons name="location" size={20} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => {
              setExpanded(false);
              onNavigate('map');
            }}
          >
            <Ionicons name="map" size={20} color="#fff" />
          </TouchableOpacity>
        </View>
      )}
      <TouchableOpacity
        style={styles.mainButton}
        onPress={() => {
          if (expanded) {
            setExpanded(false);
            onCreateEntry();
          } else {
            setExpanded(true);
          }
        }}
      >
        <Ionicons name={expanded ? 'close' : 'add'} size={24} color="#fff" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    alignItems: 'center',
  },
  actions: { marginBottom: 12 },
  actionButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#4f46e5',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  mainButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#4f46e5',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default BubbleNavigation;
