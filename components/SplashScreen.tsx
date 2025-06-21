import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Image } from 'expo-image';
import React, { useCallback, useEffect, useRef } from 'react';
import { Animated, Dimensions, StyleSheet, View } from 'react-native';
import { ThemedText } from './ThemedText';

const { width, height } = Dimensions.get('window');

interface SplashScreenProps {
  onFinish: () => void;
}

export default function SplashScreen({ onFinish }: SplashScreenProps) {
  const colorScheme = useColorScheme();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const dropAnim = useRef(new Animated.Value(-100)).current;

  const handleAnimationComplete = useCallback(() => {
    onFinish();
  }, [onFinish]);

  useEffect(() => {
    const animations = [
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(dropAnim, {
          toValue: 0,
          duration: 1200,
          useNativeDriver: true,
        }),
      ]),
      Animated.delay(1500),
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
    ];

    Animated.sequence(animations).start(handleAnimationComplete);
  }, [fadeAnim, scaleAnim, dropAnim, handleAnimationComplete]);

  return (
    <View style={[
      styles.container, 
      { backgroundColor: Colors[colorScheme ?? 'light'].background }
    ]}>
      <Animated.View
        style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [
              { scale: scaleAnim },
              { translateY: dropAnim }
            ]
          }
        ]}
      >
        <View style={styles.logoContainer}>
          <Image
            source={require('@/assets/images/icon.png')}
            style={styles.logo}
            contentFit="contain"
          />
          <View style={styles.waterDropContainer}>
            <View style={[
              styles.waterDrop,
              { backgroundColor: Colors[colorScheme ?? 'light'].tint }
            ]} />
          </View>
        </View>
        
        <ThemedText type="title" style={styles.title}>
          Hydrate Me
        </ThemedText>
        
        <ThemedText style={styles.subtitle}>
          Stay healthy, stay hydrated 💧
        </ThemedText>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
  },
  logoContainer: {
    position: 'relative',
    marginBottom: 20,
  },
  logo: {
    width: 120,
    height: 80,
    opacity: 0.8,
  },
  waterDropContainer: {
    position: 'absolute',
    top: -10,
    right: -15,
  },
  waterDrop: {
    width: 30,
    height: 40,
    borderRadius: 20,
    transform: [{ rotate: '45deg' }],
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    opacity: 0.7,
    textAlign: 'center',
  },
}); 