import { View, StyleSheet, FlatList, Animated, Pressable, Dimensions, ImageBackground, Button, Switch, Text } from "react-native";
import { useState, useEffect } from 'react';
import * as MediaLibrary from "expo-media-library";
import { FontAwesome } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Device screen width to reference for photo rendering
const screenWidth = Dimensions.get('window').width;

type Photo = {
  id: string;
  uri: string;
  isSelected: boolean;
}

// AsyncStorage keys
const SELECTED_PHOTOS_KEY = "selectedPhotos";
const ALLSYNC_STATUS = "syncAllStatus"

export default function LibrarySync() {
  // Array of photos permitted to be accessed
  const [photos, setPhotos] = useState<Photo[] | null>(null);
  // Should all photos be selected for syncing?
  const [syncAll, setSyncAll] = useState(false);

  // On page load, loads photos for preview
  useEffect(() => {
    fetchPhotos();
  }, []);

  // Loads photos from device media library
  const fetchPhotos = async () => {
    const storedSelectedPhotos = await getStoredSelectedPhotos();
    const syncAllStatus = await getSyncAllStatus();
    syncAllStatus === "true" ? setSyncAll(true) : null;

    const { assets: fetchedAssets } = await MediaLibrary.getAssetsAsync({
      mediaType: MediaLibrary.MediaType.photo,
    });

    // Maps necessary metadata from each photo to an array for rendering on screen
    if (syncAll) {
      const formattedPhotos = fetchedAssets.map((photo) => ({
        id: photo.id,
        uri: photo.uri,
        isSelected: true,
      }));
      setPhotos(formattedPhotos);
    } else {
      const formattedPhotos = fetchedAssets.map((photo) => ({
        id: photo.id,
        uri: photo.uri,
        isSelected: storedSelectedPhotos?.includes(photo.id) || false,
      }));
      setPhotos(formattedPhotos);
    }
  };
  // fetchPhotos helpers: Get stored selected photos and syncAllStatus from AsyncStorage
  const getStoredSelectedPhotos = async (): Promise<string[] | null> => {
    try {
      const jsonValue = await AsyncStorage.getItem(SELECTED_PHOTOS_KEY);
      return jsonValue ? JSON.parse(jsonValue) : null;
    } catch (error) {
      console.error("Error retrieving stored photos:", error);
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

  // When the user toggles if they want all photos synced
  const handleToggleSyncAll = () => {
    setSyncAll((prev) => !prev);
    setPhotos((prevPhotos) =>
      prevPhotos.map((photo) => ({ ...photo, isSelected: !syncAll }))
    );
  };

  // In FlatList: Toggles if the photo is selected for syncing
  const togglePhotoSelection = (id: string) => {
    setPhotos((prevPhotos) =>
      prevPhotos.map((photo) =>
        photo.id === id ? { ...photo, isSelected: !photo.isSelected } : photo
      )
    );
  };

  // Save final photo selection to AsyncStorage
  const saveSelectedPhotos = async () => {
    try {
      const selectedPhotoIds = photos?.filter((photo) => photo.isSelected).map((photo) => photo.id) || [];
      await AsyncStorage.setItem(SELECTED_PHOTOS_KEY, JSON.stringify(selectedPhotoIds));
      await AsyncStorage.setItem(ALLSYNC_STATUS, String(syncAll));
      alert("Selected photos saved successfully!");
    } catch (error) {
      console.error("Error saving selected photos:", error);
    }
  };

  return (
    // Renders photos into an interactable FlatList
    <View style={styles.container}>
      <View style={styles.flatListContainer}>
        {!syncAll ?
          (<FlatList
            style={{ backgroundColor: "#000000" }}
            data={photos}
            keyExtractor={(item) => item.id}
            numColumns={3}
            renderItem={({ item }) => (
              <View style={styles.photoContainer}>
                <ImageBackground source={{ uri: item.uri }} style={styles.photo}>
                  {item.isSelected && <View style={styles.selectedPhotoDim} />}
                  <Pressable style={styles.iconContainer} onPress={() => togglePhotoSelection(item.id)}>
                    <FontAwesome name={item.isSelected ? 'check-circle' : 'circle-thin'}
                      size={35} color={item.isSelected ? 'rgb(0, 255, 21)' : 'white'} />
                  </Pressable>
                </ImageBackground>
              </View>
            )}
          />) : <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', marginHorizontal: '20%' }}>
            <Text style={{ color: 'white', fontSize: 20, textAlign: 'center', paddingBottom: 10 }}>All Photos Will Be Synced</Text>
            <FontAwesome name={'check-circle'} size={35} color={'rgb(0, 255, 21)'}/>
          </View>}
      </View>
      <View style={styles.optionsContainer}>
        <View style={styles.toggleRow}>
          <Text style={styles.settingsText}>Sync All Photos</Text>
          <Switch value={syncAll} onValueChange={handleToggleSyncAll} />
        </View>
        <View style={styles.saveButtonContainer}>
          <Pressable style={styles.saveButton} onPress={saveSelectedPhotos}>
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
  photoContainer: {
    width: screenWidth / 3,
    height: screenWidth / 3,
    borderWidth: 0.5,
    borderColor: 'black',
    flex: 1,
    position: 'relative',
  },
  selectedPhotoDim: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
  },
  photo: {
    width: '100%',
    height: '100%',
  },
  iconContainer: {
    position: "absolute",
    top: 5,
    right: 5,
    zIndex: 1,
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