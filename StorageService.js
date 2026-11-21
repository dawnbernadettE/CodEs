import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = '@persistent_todos_v1';

export async function loadTasks() {
  try {
    const rawValue = await AsyncStorage.getItem(STORAGE_KEY);
    if (rawValue === null) {
      return [];
    }
    const parsed = JSON.parse(rawValue);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.error('Failed to load tasks from AsyncStorage:', error);
    return [];
  }
}

export async function saveTasks(tasks) {
  try {
    const jsonValue = JSON.stringify(tasks);
    await AsyncStorage.setItem(STORAGE_KEY, jsonValue);
  } catch (error) {
    console.error('Failed to save tasks to AsyncStorage:', error);
  }
}