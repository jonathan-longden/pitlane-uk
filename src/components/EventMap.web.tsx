import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import React, { useEffect, useRef } from 'react';
import { StyleSheet, View } from 'react-native';
import { colors, radius } from '../theme';
import type { EventMapProps } from './EventMap.types';

/**
 * Web build of the map tab. react-native-maps is native-only, so the web build
 * renders a real Leaflet map instead — same pins, same selection behaviour,
 * over dark raster tiles that match the app's theme.
 *
 * Leaflet is a DOM library, which is fine here: react-native-web renders to the
 * DOM anyway, so a plain <div> can sit inside a React Native tree. This file is
 * never bundled for iOS or Android.
 */

// Roughly the UK including the Northern Isles.
const UK_BOUNDS = L.latLngBounds([49.8, -8.2], [59.4, 1.9]);

function pinIcon(selected: boolean): L.DivIcon {
  const fill = selected ? colors.accent : colors.surfaceHigh;
  const stroke = selected ? colors.accent : colors.textMuted;
  const size = selected ? 34 : 26;
  return L.divIcon({
    className: '',
    iconSize: [size, size],
    iconAnchor: [size / 2, size],
    html: `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none">
      <path d="M12 23s8-7.2 8-13a8 8 0 1 0-16 0c0 5.8 8 13 8 13Z"
            fill="${fill}" stroke="${stroke}" stroke-width="1.6"/>
      <circle cx="12" cy="10" r="3" fill="${selected ? colors.white : colors.bg}"/>
    </svg>`,
  });
}

export function EventMap({
  events,
  selectedId,
  onSelect,
  initialCentre,
  showsUserLocation,
}: EventMapProps) {
  const hostRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markersRef = useRef<globalThis.Map<string, L.Marker>>(new globalThis.Map());
  // Held in a ref so rebuilding markers does not need to re-run on every render.
  const onSelectRef = useRef(onSelect);
  onSelectRef.current = onSelect;

  // Create the map once.
  useEffect(() => {
    if (!hostRef.current || mapRef.current) return;

    const map = L.map(hostRef.current, {
      zoomControl: false,
      attributionControl: true,
    });
    mapRef.current = map;

    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; OpenStreetMap contributors &copy; CARTO',
      subdomains: 'abcd',
      maxZoom: 19,
    }).addTo(map);

    L.control.zoom({ position: 'bottomright' }).addTo(map);

    if (initialCentre) {
      map.setView([initialCentre.latitude, initialCentre.longitude], 9);
    } else {
      map.fitBounds(UK_BOUNDS, { padding: [20, 20] });
    }

    return () => {
      map.remove();
      mapRef.current = null;
      markersRef.current.clear();
    };
  }, [initialCentre]);

  // Rebuild markers whenever the filtered set changes.
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    for (const marker of markersRef.current.values()) marker.remove();
    markersRef.current.clear();

    for (const event of events) {
      const marker = L.marker([event.latitude, event.longitude], {
        icon: pinIcon(event.id === selectedId),
        title: `${event.venue}, ${event.town}`,
        zIndexOffset: event.id === selectedId ? 1000 : 0,
      })
        .addTo(map)
        .on('click', () => onSelectRef.current(event.id));
      markersRef.current.set(event.id, marker);
    }
  }, [events, selectedId]);

  // Pan to whichever pin the carousel below the map is showing.
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !selectedId) return;
    const event = events.find((e) => e.id === selectedId);
    if (!event) return;
    map.panTo([event.latitude, event.longitude], { animate: true, duration: 0.35 });
  }, [selectedId, events]);

  return (
    <View style={styles.wrap}>
      <div ref={hostRef} style={hostStyle} />
    </View>
  );
}

const hostStyle: React.CSSProperties = {
  position: 'absolute',
  inset: 0,
  backgroundColor: colors.bg,
};

const styles = StyleSheet.create({
  wrap: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: colors.bg,
    borderRadius: radius.sm,
    overflow: 'hidden',
  },
});
