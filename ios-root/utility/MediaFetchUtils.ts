import * as MediaLibrary from "expo-media-library";
import AsyncStorage from "@react-native-async-storage/async-storage";
import StorageKeys from "./constants/AsyncStorageKeys";

// Get stored selected media from AsyncStorage
export const getStoredSelectedMediaIds = async (selectedMediaKey: string): Promise<string[] | null> => {
  try {
    const jsonValue = await AsyncStorage.getItem(selectedMediaKey);
    return jsonValue ? JSON.parse(jsonValue) : null;
  } catch (error) {
    console.error("Error retrieving stored media:", error);
    return null;
  }
};

// Store selected media ids in AsyncStorage
export const storeSelectedMediaIds = async (selectedMediaIds: string[]) => {
  try {
    await AsyncStorage.setItem(StorageKeys.SELECTED_MEDIA_INDEX_KEY, JSON.stringify(selectedMediaIds));
  } catch (error) {
    console.error("Error saving selected media:", error);
  }
}

// Get AllSync status from AsyncStorage
export const getAllSyncStatus = async (allSyncStatusKey: string): Promise<boolean | null> => {
  try {
    const allSyncStatus = await AsyncStorage.getItem(allSyncStatusKey);
    return allSyncStatus === "true" ? true : false;
  } catch (error) {
    console.error("Error retrieving syncAllStatus", error);
    return null;
  }
}

// Fetches media metadata for the purposes of previewing in librarysync
export const PreviewMediaFetch = async () => {
  const storedSelectedMedia = await getStoredSelectedMediaIds(StorageKeys.SELECTED_MEDIA_INDEX_KEY);
  const syncAllStatus = await getAllSyncStatus(StorageKeys.ALLSYNC_STATUS_KEY);

  const { assets: fetchedAssets } = await MediaLibrary.getAssetsAsync({
    mediaType: [MediaLibrary.MediaType.photo, MediaLibrary.MediaType.video],
  });

  // Maps necessary metadata from each media item to an array
  const formattedMedia = fetchedAssets.map((mediaItem) => ({
    id: mediaItem.id,
    uri: mediaItem.uri,
    type: mediaItem.mediaType,
    isSelected: syncAllStatus ? true : storedSelectedMedia?.includes(mediaItem.id) || false,
  }));
  return formattedMedia;
}