import * as MediaLibrary from "expo-media-library";
import AsyncStorage from "@react-native-async-storage/async-storage";
import StorageKeys from "./constants/AsyncStorageKeys";

// Get stored selected "Array of IDs" media from AsyncStorage
export const getStoredSelectedMediaIds = async (selectedMediaKey: string): Promise<string[] | null> => {
  try {
    const jsonValue = await AsyncStorage.getItem(selectedMediaKey);
    return jsonValue ? JSON.parse(jsonValue) : null;
  } catch (error) {
    console.error("Error retrieving stored media:", error);
    return null;
  }
};

// Store selected "Array of IDs" media ids in AsyncStorage
export const setStoredSelectedMediaIds = async (selectedMediaIds: string[]) => {
  try {
    await AsyncStorage.setItem(StorageKeys.SELECTED_MEDIA_INDEX_KEY, JSON.stringify(selectedMediaIds));
  } catch (error) {
    console.error("Error saving selected media:", error);
  }
}

// Get AllSync status "boolean" from AsyncStorage
export const getAllSyncStatus = async (): Promise<boolean | null> => {
  try {
    const allSyncStatus = await AsyncStorage.getItem(StorageKeys.ALLSYNC_STATUS_KEY);
    return allSyncStatus === "true" ? true : false;
  } catch (error) {
    console.error("Error retrieving syncAllStatus", error);
    return null;
  }
}

// Fetches media metadata for the purposes of previewing in librarysync
export const PreviewMediaFetch = async () => {
  const storedSelectedMedia = await getStoredSelectedMediaIds(StorageKeys.SELECTED_MEDIA_INDEX_KEY);
  const syncAllStatus = await getAllSyncStatus();

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
  // "Array of Objects"
  return formattedMedia;
}

// Updates the media id index with any changes that are detected on the on-device media library
export const updateMediaIndex = async (): Promise<string[] | void> => {
  try {
    // "Array of string IDs"
    const storedMediaIds: string[] | null = await getStoredSelectedMediaIds(StorageKeys.SELECTED_MEDIA_INDEX_KEY);
    if (!storedMediaIds) {
      return console.info(
        `No selected media found to update in AsyncStorage, update will not proceed: getStoredSelectedMediaIds returned ${storedMediaIds}`
      );
    }

    const { assets } = await MediaLibrary.getAssetsAsync({
      mediaType: [MediaLibrary.MediaType.photo, MediaLibrary.MediaType.video],
    });
    const currentMediaIds = assets.map(asset => asset.id);

    // Current device MediaLibrary ids
    const currentMediaIdsSet = new Set(currentMediaIds);
    // Stored marked-for-sync media ids
    const storedMediaIdsSet = new Set(storedMediaIds);
    // New updated list of marked-for-sync ids that reflect any MediaLibrary changes
    const updatedMediaIdsSet = new Set<string>();

    // Checks if AllSync is true, if so then simply adds the entire current MediaLibrary to updated set
    const allSyncStatus = await getAllSyncStatus();
    if (allSyncStatus) {
      for (const id of currentMediaIdsSet) {
        updatedMediaIdsSet.add(id);
      }
    /* Otherwise if AllSync is not true, takes existing sync data and proceeds to compare it with the current
    MediaLibrary on if any stored media ids don't exist anymore on the device, and if so, filters them out
    before putting the remaining ids into the updated set
    */
    } else {
      // "Deletes" ids that don't exist in the user's media library
      for (const id of storedMediaIdsSet) {
        if (currentMediaIdsSet.has(id)) {
          updatedMediaIdsSet.add(id);
        }
      }
    }

    const updatedMediaIds = Array.from(updatedMediaIdsSet);
    await setStoredSelectedMediaIds(updatedMediaIds);

    console.debug('Stored media ID index updated successfully')
    return updatedMediaIds;
  } catch (error) {
    console.error('Error updating media index:', error);
    throw error;
  }
}