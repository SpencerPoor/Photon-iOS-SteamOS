import * as MediaLibrary from "expo-media-library";
import AsyncStorage from "@react-native-async-storage/async-storage";
import StorageKeys from "./constants/AsyncStorageKeys";

// FetchMedia helpers: Get stored selected media and allSync status from AsyncStorage
export const getStoredSelectedMediaIds = async (selectedMediaKey: string): Promise<string[] | null> => {
  try {
    const jsonValue = await AsyncStorage.getItem(selectedMediaKey);
    return jsonValue ? JSON.parse(jsonValue) : null;
  } catch (error) {
    console.error("Error retrieving stored media:", error);
    return null;
  }
};
export const getAllSyncStatus = async (allSyncStatusKey: string): Promise<boolean | null> => {
  try {
    const syncAllStatus = await AsyncStorage.getItem(allSyncStatusKey);
    return syncAllStatus === "true" ? true : false;
  } catch (error) {
    console.error("Error retrieving syncAllStatus", error);
    return null;
  }
}

export const FetchMedia = async () => {
  const storedSelectedMedia = await getStoredSelectedMediaIds(StorageKeys.SELECTED_MEDIA_KEY);
  const syncAllStatus = await getAllSyncStatus(StorageKeys.ALLSYNC_STATUS_KEY);

  const { assets: fetchedAssets } = await MediaLibrary.getAssetsAsync({
    mediaType: [MediaLibrary.MediaType.photo, MediaLibrary.MediaType.video],
  });

  // Maps necessary metadata from each media item to an array for rendering on screen
  const formattedMedia = fetchedAssets.map((mediaItem) => ({
    id: mediaItem.id,
    uri: mediaItem.uri,
    type: mediaItem.mediaType,
    isSelected: syncAllStatus ? true : storedSelectedMedia?.includes(mediaItem.id) || false,
  }));
  return formattedMedia;
}