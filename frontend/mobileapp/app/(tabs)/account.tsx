import React, { useEffect } from 'react';
import { StyleSheet, Image, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Link } from 'expo-router';

import { Collapsible } from '@/components/Collapsible';
import { ExternalLink } from '@/components/ExternalLink';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';

export default function AccountScreen() {
  const isLoggedIn = false; // Replace with actual authentication logic

  if (!isLoggedIn) {
    return (
      <ParallaxScrollView
        headerBackgroundColor={{ light: '#D0D0D0', dark: '#353636' }}
        headerImage={
          <IconSymbol
            size={310}
            color="#808080"
            name="person.crop.circle"
            style={styles.headerImage}
          />
        }
      >
        <ThemedView style={styles.redirectContainer}>
          <ThemedText>
            You are not logged in. Please <Link href="/login">login</Link> to
            access your account.
          </ThemedText>
        </ThemedView>
      </ParallaxScrollView>
    );
  }

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#D0D0D0', dark: '#353636' }}
      headerImage={
        <IconSymbol
          size={310}
          color="#808080"
          name="person.crop.circle"
          style={styles.headerImage}
        />
      }
    >
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Account View</ThemedText>
      </ThemedView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    color: '#808080',
    bottom: -90,
    left: -35,
    position: 'absolute',
  },
  titleContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  redirectContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
