import React, { useEffect, useState } from 'react';
import MapView, { Marker } from 'react-native-maps';
import { StyleSheet, View } from 'react-native';
import * as Location from 'expo-location';

const stockholmCoords = {
  latitude: 59.3293,
  longitude: 18.0686,
  latitudeDelta: 0.01,
  longitudeDelta: 0.01,
};

type CustomLocationObject = {
  coords: {
    latitude: number;
    longitude: number;
    latitudeDelta: number;
    longitudeDelta: number;
  };
  timestamp: number;
};

export default function Map() {
  const [location, setLocation] = useState<CustomLocationObject | null>(null);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.log('Permission to access location was denied');
        setLocation({ coords: stockholmCoords, timestamp: Date.now() });
        return;
      }
      let currentLocation = await Location.getCurrentPositionAsync({});
      setLocation({
        coords: {
          latitude: currentLocation.coords.latitude,
          longitude: currentLocation.coords.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        },
        timestamp: currentLocation.timestamp,
      });
    })();
  }, []);

  return (
    <View style={styles.container}>
      {location && (
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            latitudeDelta: location.coords.latitudeDelta,
            longitudeDelta: location.coords.longitudeDelta,
          }}
        >
          <Marker
            coordinate={{
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
            }}
            title="You are here"
          />
        </MapView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: '100%',
    height: '100%',
  },
});
