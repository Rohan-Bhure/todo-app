import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import React from 'react';
import { SafeAreaView, StyleSheet, View } from 'react-native';

export default function Layout() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Tabs
          screenOptions={({ route }) => ({
            tabBarIcon: ({ color, size }) => {
              let iconName;

             
              if (route.name === 'home') {
                iconName = 'people-outline';
              } else if (route.name === 'adduser') {
                iconName = 'person-add-outline';
              } else if (route.name === 'userdetails') {
                iconName = 'create-outline';
              }

              return <Ionicons name={iconName} size={size} color={color} />;
            },
            tabBarActiveTintColor: '#D32F2F',
            tabBarInactiveTintColor: 'gray',
            headerShown: true,
            tabBarStyle: { backgroundColor: '#000' },
            headerStyle: { backgroundColor: '#000' },
            headerTintColor: '#fff',
          })}
        >
          <Tabs.Screen name="home" options={{ title: 'Users' }} />
          <Tabs.Screen name="adduser" options={{ title: 'Add User' }} />
          <Tabs.Screen name="userdetails" options={{ title: 'Update/Delete' }} />
        </Tabs>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#000',
  },
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
});
