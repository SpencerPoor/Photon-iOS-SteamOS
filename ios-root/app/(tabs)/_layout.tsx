import { Tabs } from "expo-router";
import Ionicons from '@expo/vector-icons/Ionicons';
import React from "react";
import { Easing, View, StyleSheet } from "react-native";

export default function RootLayout() {
  return (
    <View style={styles.tabsContainer}>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: 'white',
          headerStyle: {
            backgroundColor: '#25292e',
          },
          headerShadowVisible: false,
          headerTintColor: '#fff',
          tabBarStyle: {
            backgroundColor: '#25292e',
          },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: 'Home',
            transitionSpec: {
              animation: 'timing',
              config: {
                duration: 100,
                easing: Easing.inOut(Easing.ease),
              },
            },
            sceneStyleInterpolator: ({ current }) => ({
              sceneStyle: {
                opacity: current.progress.interpolate({
                  inputRange: [-1, 0, 1],
                  outputRange: [0, 1, 0],
                }),
              },
            }),
            tabBarIcon: ({ color, focused }) => (
              <Ionicons name={focused ? 'home-sharp' : 'home-outline'} color={color} size={24} />
            ),
          }}
        />
        <Tabs.Screen
          name="librarysync"
          options={{
            title: 'Library Sync',
            transitionSpec: {
              animation: 'timing',
              config: {
                duration: 100,
                easing: Easing.inOut(Easing.ease),
              },
            },
            sceneStyleInterpolator: ({ current }) => ({
              sceneStyle: {
                opacity: current.progress.interpolate({
                  inputRange: [-1, 0, 1],
                  outputRange: [0, 1, 0],
                }),
              },
            }),
            tabBarIcon: ({color, focused }) => (
              <Ionicons name={focused ? 'sync' : 'sync-outline'} color={color} size={24}/>
            ),
          }}
        />
        <Tabs.Screen
          name="settings"
          options={{
            title: 'Settings',
            transitionSpec: {
              animation: 'timing',
              config: {
                duration: 100,
                easing: Easing.inOut(Easing.ease),
              },
            },
            sceneStyleInterpolator: ({ current }) => ({
              sceneStyle: {
                opacity: current.progress.interpolate({
                  inputRange: [-1, 0, 1],
                  outputRange: [0, 1, 0],
                }),
              },
            }),
            tabBarIcon: ({color, focused }) => (
              <Ionicons name={focused ? 'settings' : 'settings-outline'} color={color} size={24}/>
            ),
          }}
        />
      </Tabs>
    </View>
  )
}

const styles = StyleSheet.create({
  tabsContainer: {
    flex: 1,
    backgroundColor: '#25292e',
  },
});