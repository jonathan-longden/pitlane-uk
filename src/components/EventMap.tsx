import React, { useEffect, useRef } from 'react';
import { StyleSheet } from 'react-native';
import MapView, { Marker, PROVIDER_DEFAULT, type Region } from 'react-native-maps';
import { UK_REGION } from '../lib/geo';
import { colors } from '../theme';
import type { EventMapProps } from './EventMap.types';

/**
 * Native map. `EventMap.web.tsx` sits alongside this file and is picked up
 * automatically by the bundler on web, where react-native-maps has no
 * implementation.
 */
export function EventMap({
  events,
  selectedId,
  onSelect,
  initialCentre,
  showsUserLocation,
}: EventMapProps) {
  const mapRef = useRef<MapView>(null);

  const initialRegion: Region = initialCentre
    ? { ...initialCentre, latitudeDelta: 2.5, longitudeDelta: 2.5 }
    : UK_REGION;

  // Pan to whichever pin the carousel below the map is showing.
  useEffect(() => {
    if (!selectedId) return;
    const event = events.find((e) => e.id === selectedId);
    if (!event) return;
    mapRef.current?.animateToRegion(
      {
        latitude: event.latitude,
        longitude: event.longitude,
        latitudeDelta: 0.6,
        longitudeDelta: 0.6,
      },
      350,
    );
  }, [selectedId, events]);

  return (
    <MapView
      ref={mapRef}
      style={StyleSheet.absoluteFill}
      provider={PROVIDER_DEFAULT}
      initialRegion={initialRegion}
      showsUserLocation={showsUserLocation}
      showsMyLocationButton={false}
      toolbarEnabled={false}
    >
      {events.map((event) => (
        <Marker
          key={event.id}
          coordinate={{ latitude: event.latitude, longitude: event.longitude }}
          title={event.title}
          description={`${event.venue}, ${event.town}`}
          pinColor={event.id === selectedId ? colors.accent : undefined}
          onPress={() => onSelect(event.id)}
        />
      ))}
    </MapView>
  );
}
