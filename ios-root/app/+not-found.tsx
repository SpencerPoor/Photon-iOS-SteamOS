import { Link, Stack } from 'expo-router';
import { View, Text, StyleSheet } from 'react-native';

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: 'Oops! Page Not Found' }} />
      <View style={styles.container}>
        <Text style={styles.text}>This screen doesn't exist.</Text>
        <View style={styles.linkContainer}>
          <Link href="/" style={styles.link}>
            Go to home screen!
          </Link>
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: 'rgb(41, 41, 41)'
  },
  text: {
    marginBottom: 30,
    color: 'white',
  },
  linkContainer: {
    justifyContent: 'center',
    padding: 10,
    backgroundColor: 'rgb(0, 116, 240)',
    borderStyle: 'solid',
    borderColor: 'rgb(0, 0, 0)',
    borderRadius: 5,
  },
  link: {
    paddingVertical: 15,
    color: 'rgb(0, 32, 242)',
  },
});
