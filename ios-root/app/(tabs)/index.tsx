import { Text, View, StyleSheet } from "react-native";
import { useState, useEffect } from "react";
import * as MediaLibrary from 'expo-media-library';

import PermissionsSetup from "@/components/PermissionsSetup";

export default function Index() {
  // Boolean to determine if setup is visible
  const [showSetup, setShowSetup] = useState<boolean>(false);

  // App startup functions
  useEffect(() => {
    checkPermissionAccess();
    checkAllSync();
  }, [])

  // Checks if app has media permissions. If not, triggers setup
  const checkPermissionAccess = async () => {
    const { status } = await MediaLibrary.getPermissionsAsync();
    if (status !== 'granted') {
      setShowSetup(true);
    } else {
      setShowSetup(false);
    }
  }

  // If user wants entire library to be synced, then app load refreshes StoredSelectedMediaIds index
  const checkAllSync = async () => {

  }

  return (
      <View style={styles.container}>
        <Text style={styles.text}>Edit app/index.tsx to edit this screen.</Text>
        <PermissionsSetup showSetup={showSetup} setShowSetup={setShowSetup} />
      </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#25292e',
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  text: {
    color: 'white',
  }
})