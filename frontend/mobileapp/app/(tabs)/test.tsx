import React, { useEffect, useState } from 'react';
import { Image, StyleSheet, Platform } from 'react-native';
import axios from 'axios';

import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

export default function TestScreen() {
  const [data, setData] = useState<string | null>(null);

  useEffect(() => {
    axios.get('http://192.168.0.129:8080')
      .then(response => {
        setData(response.data);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }, []);

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
      headerImage={
        <Image
          source={require('@/assets/images/partial-react-logo.png')}
          style={styles.reactLogo}
        />
      }
    >
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Test NEW TEST</ThemedText>
      </ThemedView>
      <ThemedView style={styles.content}>
        {data ? (
          <ThemedText type="default">{data}</ThemedText>
        ) : (
          <ThemedText type="default">Loading...</ThemedText>
        )}
      </ThemedView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
  content: {
    padding: 16,
  },
});
