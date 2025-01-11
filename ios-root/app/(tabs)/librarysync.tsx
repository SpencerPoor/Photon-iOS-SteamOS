import { View, StyleSheet, FlatList, Image, Pressable, Dimensions, ImageBackground, Button } from "react-native";
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

// AsyncStorage key
const SELECTED_PHOTOS_KEY = "selectedPhotos"

export default function LibrarySync() {
  // Array of photos permitted to be accessed
  const [photos, setPhotos] = useState<Photo[] | null>(null);

  // On page load, loads photos for preview
  useEffect(() => {
      loadPhotosWithSelectedState();
  }, []);

  // Loads photos from device media library
  const loadPhotosWithSelectedState = async () => {
      const storedSelectedPhotos = await getStoredSelectedPhotos();

      const { assets } = await MediaLibrary.getAssetsAsync({
        mediaType: MediaLibrary.MediaType.photo,
        first: 50, // Fetch the first 50 photos
      });

      // Maps necessary metadata from each photo to an array for rendering on screen
      const formattedPhotos = assets.map((photo) => ({
        id: photo.id,
        uri: photo.uri,
        isSelected: storedSelectedPhotos?.includes(photo.id) || false,
      }));

      setPhotos(formattedPhotos);
  };
  // Get stored selected photos from AsyncStorage
  const getStoredSelectedPhotos = async (): Promise<string[] | null> => {
    try {
      const jsonValue = await AsyncStorage.getItem(SELECTED_PHOTOS_KEY);
      return jsonValue ? JSON.parse(jsonValue) : null;
    } catch (error) {
      console.error("Error retrieving stored photos:", error);
      return null;
    }
  };
  // Save selected photos to AsyncStorage
  const saveSelectedPhotos = async () => {
    try {
      const selectedPhotoIds = photos?.filter((photo) => photo.isSelected).map((photo) => photo.id) || [];
      await AsyncStorage.setItem(SELECTED_PHOTOS_KEY, JSON.stringify(selectedPhotoIds));
      alert("Selected photos saved successfully!");
    } catch (error) {
      console.error("Error saving selected photos:", error);
    }
  };

  // Toggles if the photo is selected for syncing
  const togglePhotoSelection = (id: string) => {
    setPhotos((prevPhotos) =>
      prevPhotos.map((photo) =>
        photo.id === id ? { ...photo, isSelected: !photo.isSelected } : photo
      )
    );
  };

  return (
    // Renders photos into an interactable FlatList
    <View style={{ flex: 1 }}>
      <FlatList
        style={{ backgroundColor: "#25292e" }}
        data={photos}
        keyExtractor={(item) => item.id}
        numColumns={3}
        renderItem={({ item }) => (
          <View style={ styles.photoContainer }>
            <ImageBackground source={{ uri: item.uri }} style={ styles.photo }>
              {item.isSelected && <View style={styles.selectedPhotoDim} />}
              <Pressable style={styles.iconContainer} onPress={() => togglePhotoSelection(item.id)}>
                <FontAwesome name={item.isSelected ? 'check-circle' : 'circle-thin'}
                size={35} color={item.isSelected ? 'rgb(0, 255, 21)' : 'white'} />
              </Pressable>
            </ImageBackground>
          </View>
        )}
        contentContainerStyle={styles.gallery}
      />
      <View style={styles.saveButtonContainer}>
          <Button title="Save Selected Photos" onPress={saveSelectedPhotos} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  gallery: {
    paddingTop: 10,
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
  saveButtonContainer: {
    padding: 10,
    backgroundColor: "#25292e",
  },
});