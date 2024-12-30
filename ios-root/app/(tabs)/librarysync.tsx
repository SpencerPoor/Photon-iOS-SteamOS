import { Text, View, StyleSheet } from "react-native";

export default function LibrarySync() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Library Sync Screen</Text>
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