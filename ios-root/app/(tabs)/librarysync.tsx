import { Text, View, StyleSheet, FlatList, Image, Pressable, Dimensions } from "react-native";
import { useState, useEffect } from 'react';
import * as MediaLibrary from "expo-media-library";

// Device screen width to reference for photo rendering
const screenWidth = Dimensions.get('window').width;

type Photo = {
  id: string;
  uri: string;
  isSelected: boolean;
}

export default function LibrarySync() {
  // Array of photos permitted to be accessed
  const [photos, setPhotos] = useState<Photo[]>([])

  // On page load, loads photos for preview
  useEffect(() => {
    loadPhotos();
  }, []);

  // Loads photos from device media library
  const loadPhotos = async () => {
    const { assets } = await MediaLibrary.getAssetsAsync({
      mediaType: MediaLibrary.MediaType.photo,
      first: 50, // Fetch the first 50 photos
    });

    // Maps necessary metadata from each photo to an array for rendering on screen
    const formattedPhotos = assets.map((photo) => ({
      id: photo.id,
      uri: photo.uri,
      isSelected: false, // Initially, no photo is selected
    }));

    setPhotos(formattedPhotos);
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
    <FlatList
      data={photos}
      keyExtractor={(item) => item.id}
      numColumns={3}
      renderItem={({ item }) => (
        <Pressable onPress={() => togglePhotoSelection(item.id)}>
          <View style={[styles.photoContainer, item.isSelected && styles.selectedPhotoContainer]}>
            <Image source={{ uri: item.uri }} style={[ styles.photo ]}/>
          </View>
        </Pressable>
      )}
      contentContainerStyle={styles.gallery}
    />
  );
}

const styles = StyleSheet.create({
  gallery: {
    paddingTop: 10,
    backgroundColor: "#25292e",
    flex: 1,
  },
  photoContainer: {
    width: screenWidth / 3,
    height: screenWidth / 3,
    borderWidth: 0.5,
    borderColor: 'black',
  },
  selectedPhotoContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Dim the photo with a semi-transparent overlay
  },
  photo: {
    width: '100%',
    height: '100%',
  },
  selectedPhoto: {
    borderWidth: 3,
    borderColor: "green",
  },
});