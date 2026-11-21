import React, { useContext } from 'react';
import { View, Text, StyleSheet, StatusBar } from 'react-native';
import { AppContext } from './AppContext';

export default function HomeTab() {
  const { username, darkMode } = useContext(AppContext);

  const theme = darkMode ? styles.dark : styles.light;
  const textTheme = darkMode ? styles.darkText : styles.lightText;
  const cardTheme = darkMode ? styles.darkCard : styles.lightCard;

  return (
    <View style={[styles.container, theme]}>
      <StatusBar barStyle={darkMode ? 'light-content' : 'dark-content'} />

      <Text style={[styles.greeting, textTheme]}>Welcome back,</Text>
      <Text style={[styles.username, textTheme]}>{username} 👋</Text>

      <View style={[styles.card, cardTheme]}>
        <Text style={[styles.cardTitle, textTheme]}>Your Feed</Text>
        <Text style={[styles.cardBody, textTheme]}>
          Here are your latest updates, {username}. Head over to the Settings tab to
          update your name or switch the colour theme, and watch this screen change
          instantly.
        </Text>
      </View>

      <View style={[styles.card, cardTheme]}>
        <Text style={[styles.cardLabel, textTheme]}>Current Theme</Text>
        <Text style={[styles.cardValue, textTheme]}>
          {darkMode ? '🌙 Dark Mode' : '☀️ Light Mode'}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    paddingTop: 48,
  },
  light: {
    backgroundColor: '#F2F4F7',
  },
  dark: {
    backgroundColor: '#1A1A2E',
  },
  greeting: {
    fontSize: 18,
    marginBottom: 4,
  },
  username: {
    fontSize: 30,
    fontWeight: '700',
    marginBottom: 28,
  },
  lightText: {
    color: '#1A1A2E',
  },
  darkText: {
    color: '#F2F4F7',
  },
  card: {
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  lightCard: {
    backgroundColor: '#FFFFFF',
  },
  darkCard: {
    backgroundColor: '#16213E',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  cardBody: {
    fontSize: 14,
    lineHeight: 22,
    opacity: 0.8,
  },
  cardLabel: {
    fontSize: 13,
    fontWeight: '500',
    opacity: 0.6,
    marginBottom: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  cardValue: {
    fontSize: 18,
    fontWeight: '600',
  },
});
