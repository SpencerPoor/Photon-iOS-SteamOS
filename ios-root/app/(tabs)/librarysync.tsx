import { View, StyleSheet, Pressable, Switch, Text } from "react-native";
import { useState, useEffect } from 'react';
import AsyncStorage from "@react-native-async-storage/async-storage";
import MediaPreview from "@/components/MediaPreview";
import StorageKeys from "@/utility/constants/AsyncStorageKeys";
import { PreviewMediaFetch, getAllSyncStatus, storeSelectedMediaIds } from "@/utility/MediaFetchUtils";

type MediaItem = {
  id: string;
  uri: string;
  type: string;
  isSelected: boolean;
}

export default function LibrarySync() {
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [syncAll, setSyncAll] = useState<boolean | null>(false);

  // On page load, loads media for preview
  useEffect(() => {
    handleFetchMediaUtils();
  }, []);

  const handleFetchMediaUtils = async () => {
    const fetchedSyncStatus = await getAllSyncStatus(StorageKeys.ALLSYNC_STATUS_KEY);
    setSyncAll(fetchedSyncStatus);
    const fetchedPreviewMedia = await PreviewMediaFetch();
    setMedia(fetchedPreviewMedia);

  }

  // When the user toggles if they want all media synced
  const handleToggleSyncAll = () => {
    setSyncAll(!syncAll);
    setMedia((prevMedia) =>
      prevMedia.map((mediaItem) => ({ ...mediaItem, isSelected: !syncAll }))
    );
  };
  // Save final media and allSync selection to AsyncStorage
  const saveSelectedMedia = async () => {
    try {
      const selectedMediaIds = media?.filter((mediaItem) => mediaItem.isSelected).map((mediaItem) => mediaItem.id) || [];
      storeSelectedMediaIds(selectedMediaIds);
      await AsyncStorage.setItem(StorageKeys.ALLSYNC_STATUS_KEY, String(syncAll));
      alert("Selected media saved successfully!");
    } catch (error) {
      console.error("Error saving selected media:", error);
    }
  };

  return (
    /* Renders media into an interactable FlatList for sync selection.
    User can toggle if they want all media to be synced or not, and then
    can save their final selections for the app's reference
     */
    <View style={styles.container}>
      <View style={styles.flatListContainer}>
        <MediaPreview media={media} syncAll={syncAll} setMedia={setMedia} />
      </View>
      <View style={styles.optionsContainer}>
        <View style={styles.toggleRow}>
          <Text style={styles.settingsText}>Sync All Media</Text>
          <Switch value={syncAll || false} onValueChange={handleToggleSyncAll} />
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