import { Text, View, StyleSheet, FlatList, Image, Pressable, Dimensions, ImageBackground } from "react-native";
import { useState, useEffect } from 'react';
import * as MediaLibrary from "expo-media-library";
import { FontAwesome } from "@expo/vector-icons";
import { opacity } from "react-native-reanimated/lib/typescript/Colors";

// Device screen width to reference for photo rendering
const screenWidth = Dimensions.get('window').width;

type Photo = {
  id: string;
  uri: string;
  isSelected: boolean;
}

export default function LibrarySync() {
  // Array of photos permitted to be accessed
  const [photos, setPhotos] = useState<Photo[] | null>(null);

  // On page load, loads photos for preview
  useEffect(() => {
    console.log(`photos useState on page load: type is ${typeof photos}
      value is ${photos}`);
    if (photos === null) {
      loadPhotos();
    }
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
      console.log(`photos useState after page load: type is ${typeof photos}
        value is ${photos}`);
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
  }
});