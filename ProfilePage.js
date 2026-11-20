import React from 'react';
import { View, Text, Image, ScrollView } from 'react-native';
import styles from './profileStyles';

const SKILLS = ['React Native', 'JavaScript', 'UI Design', 'Git', 'Figma'];

const STATS = [
  { label: 'Projects', value: '12' },
  { label: 'Followers', value: '248' },
  { label: 'Following', value: '96' },
];

export default function ProfilePage() {
  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
    >
      {/* Header / Banner */}
      <View style={styles.banner} />

      {/* Avatar + Name */}
      <View style={styles.avatarSection}>
        <Image
          source={{ uri: 'https://placehold.co/160x160/6c5ce7/ffffff?text=JD' }}
          style={styles.avatar}
        />
        <Text style={styles.name}>Jordan Diaz</Text>
        <Text style={styles.handle}>@jordan.codes</Text>
        <Text style={styles.bio}>
          Mobile developer who loves clean UI, coffee, and weekend hikes.
        </Text>
      </View>

      {/* Stats Row */}
      <View style={styles.statsRow}>
        {STATS.map((stat) => (
          <View key={stat.label} style={styles.statBox}>
            <Text style={styles.statValue}>{stat.value}</Text>
            <Text style={styles.statLabel}>{stat.label}</Text>
          </View>
        ))}
      </View>

      {/* About Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>About</Text>
        <Text style={styles.sectionText}>
          Based in Austin, TX. Building delightful mobile experiences for
          three years. Currently exploring cross-platform design systems.
        </Text>
      </View>

      {/* Skills Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Skills</Text>
        <View style={styles.skillsWrap}>
          {SKILLS.map((skill) => (
            <View key={skill} style={styles.skillChip}>
              <Text style={styles.skillChipText}>{skill}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Contact Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Contact</Text>
        <Text style={styles.sectionText}>jordan.diaz@example.com</Text>
        <Text style={styles.sectionText}>linkedin.com/in/jordandiaz</Text>
      </View>
    </ScrollView>
  );
}