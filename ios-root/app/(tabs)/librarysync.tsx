import { View, StyleSheet, Pressable, Switch, Text } from "react-native";
import { useState, useEffect } from 'react';
import * as MediaLibrary from "expo-media-library";
import AsyncStorage from "@react-native-async-storage/async-storage";
import MediaPreview from "@/components/MediaPreview";

type MediaItem = {
  id: string;
  uri: string;
  type: string;
  isSelected: boolean;
}

// AsyncStorage keys
const SELECTED_MEDIA_KEY = "selectedMedia";
const ALLSYNC_STATUS = "syncAllStatus"

export default function LibrarySync() {
  // Array of media permitted to be accessed
  const [media, setMedia] = useState<MediaItem[]>([]);
  // Should all media be selected for syncing?
  const [syncAll, setSyncAll] = useState(false);

  // On page load, loads media for preview
  useEffect(() => {
    fetchMedia();
  }, []);

  // Loads media from device media library
  const fetchMedia = async () => {
    const storedSelectedMedia = await getStoredSelectedMedia();
    const syncAllStatus = await getSyncAllStatus();
    syncAllStatus === "true" ? setSyncAll(true) : null;

    const { assets: fetchedAssets } = await MediaLibrary.getAssetsAsync({
      mediaType: [MediaLibrary.MediaType.photo, MediaLibrary.MediaType.video],
    });

    // Maps necessary metadata from each media item to an array for rendering on screen
    if (syncAll) {
      const formattedMedia = fetchedAssets.map((mediaItem) => ({
        id: mediaItem.id,
        uri: mediaItem.uri,
        type: mediaItem.mediaType,
        isSelected: true,
      }));
      setMedia(formattedMedia);
    } else {
      const formattedMedia = fetchedAssets.map((mediaItem) => ({
        id: mediaItem.id,
        uri: mediaItem.uri,
        type: mediaItem.mediaType,
        isSelected: storedSelectedMedia?.includes(mediaItem.id) || false,
      }));
      setMedia(formattedMedia);
    }
  };
  // fetchMedia helpers: Get stored selected media and syncAllStatus from AsyncStorage
  const getStoredSelectedMedia = async (): Promise<string[] | null> => {
    try {
      const jsonValue = await AsyncStorage.getItem(SELECTED_MEDIA_KEY);
      return jsonValue ? JSON.parse(jsonValue) : null;
    } catch (error) {
      console.error("Error retrieving stored media:", error);
      return null;
    }
  };
  const getSyncAllStatus = async (): Promise<string | null> => {
    try {
      const syncAllStatus = await AsyncStorage.getItem(ALLSYNC_STATUS);
      return syncAllStatus;
    } catch (error) {
      console.error("Error retrieving syncAllStatus", error);
      return null;
    }
  }

  // When the user toggles if they want all media synced
  const handleToggleSyncAll = () => {
    setSyncAll((prev) => !prev);
    setMedia((prevMedia) =>
      prevMedia.map((mediaItem) => ({ ...mediaItem, isSelected: !syncAll }))
    );
  };

  // Save final photo selection to AsyncStorage
  const saveSelectedMedia = async () => {
    try {
      const selectedMediaIds = media?.filter((mediaItem) => mediaItem.isSelected).map((mediaItem) => mediaItem.id) || [];
      await AsyncStorage.setItem(SELECTED_MEDIA_KEY, JSON.stringify(selectedMediaIds));
      await AsyncStorage.setItem(ALLSYNC_STATUS, String(syncAll));
      alert("Selected media saved successfully!");
    } catch (error) {
      console.error("Error saving selected media:", error);
    }
  };

  return (
    // Renders media into an interactable FlatList
    <View style={styles.container}>
      <View style={styles.flatListContainer}>
        <MediaPreview media={media} syncAll={syncAll} setMedia={setMedia} />
      </View>
      <View style={styles.optionsContainer}>
        <View style={styles.toggleRow}>
          <Text style={styles.settingsText}>Sync All Media</Text>
          <Switch value={syncAll} onValueChange={handleToggleSyncAll} />
        </View>
        <View style={styles.saveButtonContainer}>
          <Pressable style={styles.saveButton} onPress={saveSelectedMedia}>
            <Text style={styles.saveButtonText}>Save Changes</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#2C2C2E",
  },
  flatListContainer: {
    height: '80%',
  },
  photoGallery: {
    flex: 1,
  },
  optionsContainer: {
    height: '20%',
    justifyContent: 'center',
    paddingHorizontal: '1%',
    paddingVertical: '5%',
    backgroundColor: '#000000'
  },
  settingsText: {
    fontSize: 20,
    color: 'white',
  },
  toggleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: '#1C1C1E',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  saveButtonContainer: {
    marginTop: '1%',
  },
  saveButton: {
    backgroundColor: '#1C1C1E',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  saveButtonText: {
    color: '#0B84FF',
    fontSize: 20,
  },
});