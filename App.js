import React from 'react';
import { SafeAreaView, StatusBar } from 'react-native';
import ProfilePage from './ProfilePage';
import styles from './profileStyles';

export default function App() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" />
      <ProfilePage />
    </SafeAreaView>
  );
}