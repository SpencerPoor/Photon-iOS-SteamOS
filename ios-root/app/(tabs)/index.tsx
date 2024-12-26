import { Text, View, StyleSheet, Alert, Linking, Modal } from "react-native";
import { useState, useEffect } from "react";
import * as MediaLibrary from 'expo-media-library';

import PermissionsSetup from "@/components/PermissionsSetup";

export default function Index() {
  // Boolean to determine if setup is visible
  const [showSetup, setShowSetup] = useState<boolean>(false);

  // App startup functions
  useEffect(() => {
    checkPermissionAccess();
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

  const requestPermissions = async () => {
    const { status } = await MediaLibrary.requestPermissionsAsync();
    if (status === 'granted') {
      setShowSetup(false);
    } else {
      Alert.alert(
        'Please allow access to your Photos library',
        'Settings > Apps > Photon > Photos',
        [{ text: 'Open Settings', onPress: () => Linking.openSettings() }],
      );
    }
  }

  return (
      <View style={styles.container}>
        <Text style={styles.text}>Edit app/index.tsx to edit this screen.</Text>
        <PermissionsSetup showSetup={showSetup} requestPermissions={requestPermissions} />
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