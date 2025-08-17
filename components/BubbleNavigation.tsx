import React, { useRef, useState } from 'react';
import { View, Pressable, StyleSheet, Animated } from 'react-native';
import { Feather } from '@expo/vector-icons';

interface BubbleNavigationProps {
  onNavigate: (screen: 'home' | 'places' | 'map') => void;
  onCreateEntry: () => void;
}

export function BubbleNavigation({ onNavigate, onCreateEntry }: BubbleNavigationProps) {
  const [open, setOpen] = useState(false);
  const anim = useRef(new Animated.Value(0)).current;

  const toggle = () => {
    Animated.spring(anim, {
      toValue: open ? 0 : 1,
      useNativeDriver: true,
    }).start();
    setOpen(!open);
  };

  const handleNavigate = (screen: 'home' | 'places' | 'map') => {
    onNavigate(screen);
    toggle();
  };

  const handleCreate = () => {
    onCreateEntry();
    toggle();
  };

  const homeTranslate = anim.interpolate({ inputRange: [0, 1], outputRange: [0, -80] });
  const placesTranslate = anim.interpolate({ inputRange: [0, 1], outputRange: [0, -80] });
  const placesTranslateX = anim.interpolate({ inputRange: [0, 1], outputRange: [0, -80] });
  const mapTranslate = anim.interpolate({ inputRange: [0, 1], outputRange: [0, -56] });
  const mapTranslateX = anim.interpolate({ inputRange: [0, 1], outputRange: [0, -56] });

  return (
    <View pointerEvents="box-none" style={StyleSheet.absoluteFill}>
      {open && <Pressable style={styles.overlay} onPress={toggle} />}
      <View style={styles.container} pointerEvents="box-none">
        <Animated.View
          style={{
            position: 'absolute',
            transform: [{ translateY: homeTranslate }, { scale: anim }],
          }}
        >
          <Pressable style={styles.smallBubble} onPress={() => handleNavigate('home')}>
            <Feather name="home" size={20} color="#fff" />
          </Pressable>
        </Animated.View>

        <Animated.View
          style={{
            position: 'absolute',
            transform: [
              { translateY: placesTranslate },
              { translateX: placesTranslateX },
              { scale: anim },
            ],
          }}
        >
          <Pressable style={styles.smallBubble} onPress={() => handleNavigate('places')}>
            <Feather name="map-pin" size={20} color="#fff" />
          </Pressable>
        </Animated.View>

        <Animated.View
          style={{
            position: 'absolute',
            transform: [
              { translateY: mapTranslate },
              { translateX: mapTranslateX },
              { scale: anim },
            ],
          }}
        >
          <Pressable style={styles.smallBubble} onPress={() => handleNavigate('map')}>
            <Feather name="map" size={20} color="#fff" />
          </Pressable>
        </Animated.View>

        <Pressable
          style={styles.mainBubble}
          onPress={open ? handleCreate : toggle}
        >
          <Feather name="plus" size={24} color="#fff" />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 24,
    right: 24,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
  },
  mainBubble: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#007AFF',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
  },
  smallBubble: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#007AFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    elevation: 4,
  },
});

