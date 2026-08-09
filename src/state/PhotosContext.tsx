import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

const STORAGE_KEY = 'pitlane.photos.v1';

/** Event id -> local image URI chosen by this user. */
type PhotoMap = Record<string, string>;

interface PhotosContextValue {
  photos: PhotoMap;
  photoFor: (eventId: string) => string | undefined;
  setPhoto: (eventId: string, uri: string) => void;
  removePhoto: (eventId: string) => void;
}

const PhotosContext = createContext<PhotosContextValue | null>(null);

/**
 * Photos a user has attached to a listing.
 *
 * These live on the device only. Publishing a photo to everyone else needs
 * somewhere to upload it to, an account to attribute it to, and moderation
 * before it goes public — none of which exist while the catalogue is bundled
 * into the app. When a backend lands, this provider is where the upload call
 * goes, and the screens above it do not change.
 */
export function PhotosProvider({ children }: { children: React.ReactNode }) {
  const [photos, setPhotos] = useState<PhotoMap>({});

  useEffect(() => {
    let cancelled = false;
    AsyncStorage.getItem(STORAGE_KEY)
      .then((raw) => {
        if (cancelled || !raw) return;
        const parsed: unknown = JSON.parse(raw);
        if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
          setPhotos(parsed as PhotoMap);
        }
      })
      .catch(() => {
        // Unreadable store just means no attached photos.
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const persist = useCallback((next: PhotoMap) => {
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next)).catch(() => {});
    return next;
  }, []);

  const value = useMemo<PhotosContextValue>(
    () => ({
      photos,
      photoFor: (eventId) => photos[eventId],
      setPhoto: (eventId, uri) => setPhotos((c) => persist({ ...c, [eventId]: uri })),
      removePhoto: (eventId) =>
        setPhotos((c) => {
          const { [eventId]: _removed, ...rest } = c;
          return persist(rest);
        }),
    }),
    [photos, persist],
  );

  return <PhotosContext.Provider value={value}>{children}</PhotosContext.Provider>;
}

export function usePhotos(): PhotosContextValue {
  const ctx = useContext(PhotosContext);
  if (!ctx) throw new Error('usePhotos must be used inside a PhotosProvider');
  return ctx;
}
