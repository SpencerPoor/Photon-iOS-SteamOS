import { PropsWithChildren } from "react";
import { Text, View, StyleSheet, Modal, Pressable, Linking, Alert } from "react-native";
import * as MediaLibrary from 'expo-media-library';

type Props = PropsWithChildren<{
  showSetup: boolean;
  setShowSetup: React.Dispatch<React.SetStateAction<boolean>>;
}>;

export default function PermissionsSetup({ showSetup, setShowSetup }: Props) {

  // Requests media permissions from the device
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
    <Modal animationType="slide" transparent={true} visible={showSetup}>
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContainerContent}>
            <Text style={styles.modalText}>Photon needs access to your Photos library to sync media</Text>
            <Pressable style={styles.button} onPress={requestPermissions}>
              <Text style={styles.buttonText}>Allow Access</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  modalContainer: {
    height: '60%',
    width: '100%',
    backgroundColor: '#25292e',
    justifyContent: 'center',
    alignItems: 'center',
    borderTopLeftRadius: 60,
    borderTopRightRadius: 60,
    shadowColor: 'rgb(0, 0, 0)',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
  },
  modalContainerContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalText: {
    textAlign: 'center',
    color: 'white',
    fontSize: 25,
    marginHorizontal: 20,
  },
  buttonText: {
    textAlign: 'center',
    color: 'white',
    fontSize: 20,
  },
  button: {
    marginTop: 30,
    padding: 20,
    width: '50%',
    backgroundColor: 'rgb(67, 67, 67)',
    color: 'white',
    borderRadius: 10,
    borderStyle: 'solid',
    borderWidth: 2,
    borderColor: '#25292e',
  }
})