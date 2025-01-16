import { PropsWithChildren } from "react";
import { Text, View, StyleSheet, Pressable, FlatList, ImageBackground, Dimensions } from "react-native";
import { FontAwesome } from "@expo/vector-icons";

type MediaItem = {
  id: string;
  uri: string;
  type: string;
  isSelected: boolean;
}

type Props = PropsWithChildren<{
  syncAll: boolean | null;
  media: MediaItem[];
  setMedia: React.Dispatch<React.SetStateAction<MediaItem[]>>;
}>;

// Device screen width to reference for media rendering
const screenWidth = Dimensions.get('window').width;

export default function MediaPreview({ syncAll, media, setMedia }: Props) {

  // In FlatList: Toggles if the media item is selected for syncing
  const toggleMediaSelection = (id: string) => {
    setMedia((prevMedia) =>
      prevMedia.map((mediaItem) =>
        mediaItem.id === id ? { ...mediaItem, isSelected: !mediaItem.isSelected } : mediaItem
      )
    );
  };

  return (
    !syncAll ?
          (<FlatList
            style={{ backgroundColor: "#000000" }}
            data={media}
            keyExtractor={(item) => item.id}
            numColumns={3}
            renderItem={({ item }) => (
              <View style={styles.photoContainer}>
                <ImageBackground source={{ uri: item.uri }} style={styles.photo}>
                  {item.isSelected && <View style={styles.selectedPhotoDim} />}

                  <Pressable style={styles.iconContainer} onPress={() => toggleMediaSelection(item.id)}>
                    <FontAwesome name={item.isSelected ? 'check-circle' : 'circle-thin'}
                      size={35} color={item.isSelected ? 'rgb(0, 255, 21)' : 'white'} />
                  </Pressable>
                </ImageBackground>
              </View>
            )}
          />) : <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', marginHorizontal: '20%' }}>
            <Text style={{ color: 'white', fontSize: 20, textAlign: 'center', paddingBottom: 10 }}>All Media Will Be Synced</Text>
            <FontAwesome name={'check-circle'} size={35} color={'rgb(0, 255, 21)'}/>
          </View>
  );
}

const styles = StyleSheet.create({
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
})
