import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import styles from './styles';

export default function TodoItem({ item, onToggle, onUpdate, onDelete }) {
  const [isEditing, setIsEditing] = useState(false);
  const [draftText, setDraftText] = useState(item.text);

  useEffect(() => {
    setDraftText(item.text);
  }, [item.text]);

  const handleSaveEdit = () => {
    const trimmed = draftText.trim();
    if (!trimmed) {
      setDraftText(item.text);
      setIsEditing(false);
      return;
    }
    onUpdate(item.id, trimmed);
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setDraftText(item.text);
    setIsEditing(false);
  };

  return (
    <View style={styles.itemCard}>
      {isEditing ? (
        <View style={styles.editRow}>
          <TextInput
            style={styles.editInput}
            value={draftText}
            onChangeText={setDraftText}
            autoFocus
            multiline
            returnKeyType="done"
            onSubmitEditing={handleSaveEdit}
          />
          <TouchableOpacity style={styles.saveBtn} onPress={handleSaveEdit}>
            <Text style={styles.actionBtnText}>Save</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.cancelBtn} onPress={handleCancelEdit}>
            <Text style={styles.actionBtnText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.itemRow}>
          <TouchableOpacity
            style={styles.taskContent}
            onPress={() => onToggle(item.id)}
            activeOpacity={0.7}
          >
            <View style={[styles.checkbox, item.completed && styles.checkboxChecked]}>
              {item.completed && <Text style={styles.checkmark}>✓</Text>}
            </View>
            <Text style={[styles.taskText, item.completed && styles.taskTextCompleted]}>
              {item.text}
            </Text>
          </TouchableOpacity>

          <View style={styles.actions}>
            <TouchableOpacity
              style={styles.editBtn}
              onPress={() => setIsEditing(true)}
            >
              <Text style={styles.actionBtnText}>Edit</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.deleteBtn}
              onPress={() => onDelete(item.id)}
            >
              <Text style={styles.actionBtnText}>Delete</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
}