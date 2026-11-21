import React, { useContext, useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  Switch,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { AppContext } from './AppContext';

export default function ProfileTab() {
  const { username, darkMode, isSaving, errorMessage, saveSettings } =
    useContext(AppContext);

  const [draftName, setDraftName] = useState(username);
  const [draftDark, setDraftDark] = useState(darkMode);

  useEffect(() => {
    setDraftName(username);
    setDraftDark(darkMode);
  }, [username, darkMode]);

  const theme = darkMode ? styles.dark : styles.light;
  const textTheme = darkMode ? styles.darkText : styles.lightText;
  const cardTheme = darkMode ? styles.darkCard : styles.lightCard;
  const inputTheme = darkMode ? styles.darkInput : styles.lightInput;

  const handleSave = () => {
    saveSettings(draftName, draftDark);
  };

  return (
    <View style={[styles.container, theme]}>
      <Text style={[styles.heading, textTheme]}>Settings</Text>

      {/* Username field */}
      <View style={[styles.card, cardTheme]}>
        <Text style={[styles.label, textTheme]}>Display Name</Text>
        <TextInput
          style={[styles.input, inputTheme, textTheme]}
          value={draftName}
          onChangeText={setDraftName}
          placeholder="Enter your name"
          placeholderTextColor={darkMode ? '#888' : '#aaa'}
          editable={!isSaving}
        />
      </View>

      {/* Dark mode toggle */}
      <View style={[styles.card, cardTheme, styles.row]}>
        <Text style={[styles.label, textTheme]}>Dark Mode</Text>
        <Switch
          value={draftDark}
          onValueChange={setDraftDark}
          disabled={isSaving}
          trackColor={{ false: '#ccc', true: '#6C63FF' }}
          thumbColor={draftDark ? '#fff' : '#fff'}
        />
      </View>

      {/* Error message */}
      {errorMessage ? (
        <Text style={styles.error}>{errorMessage}</Text>
      ) : null}

      {/* Save button — shows "Saving..." while isSaving is true */}
      <TouchableOpacity
        style={[styles.button, isSaving && styles.buttonDisabled]}
        onPress={handleSave}
        disabled={isSaving}
        activeOpacity={0.8}
      >
        {isSaving ? (
          <View style={styles.savingRow}>
            <ActivityIndicator color="#fff" size="small" />
            <Text style={styles.buttonText}>  Saving...</Text>
          </View>
        ) : (
          <Text style={styles.buttonText}>Save Changes</Text>
        )}
      </TouchableOpacity>

      {!isSaving && (
        <Text style={[styles.hint, textTheme]}>
          Changes will reflect immediately on the Home tab.
        </Text>
      )}
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
  heading: {
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
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 10,
    opacity: 0.7,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  input: {
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 16,
    borderWidth: 1,
  },
  lightInput: {
    backgroundColor: '#F9FAFB',
    borderColor: '#DDE1E9',
  },
  darkInput: {
    backgroundColor: '#0F3460',
    borderColor: '#2A2A5A',
  },
  error: {
    color: '#E53E3E',
    marginBottom: 12,
    fontSize: 14,
    paddingHorizontal: 4,
  },
  button: {
    backgroundColor: '#6C63FF',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  buttonDisabled: {
    backgroundColor: '#9B93FF',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
  savingRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  hint: {
    marginTop: 14,
    textAlign: 'center',
    fontSize: 13,
    opacity: 0.5,
  },
});
