import React from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { getLevel } from '../data/subjects';
import { useProgress } from '../context/ProgressContext';

function subjectProgressLabel(subject, statuses) {
  if (!subject.hasContent) return 'À venir';
  const done = subject.modules.filter((mod) => statuses[mod.id] === 'termine').length;
  return `${done} / ${subject.modules.length} modules terminés`;
}

export default function LevelScreen({ route, navigation }) {
  const { levelId } = route.params;
  const level = getLevel(levelId);
  const { statuses } = useProgress();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{level.nom}</Text>
      <FlatList
        data={level.subjects}
        keyExtractor={(subject) => subject.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <Pressable
            style={[styles.card, !item.hasContent && styles.cardMuted]}
            onPress={() => navigation.navigate('Subject', { levelId, subjectId: item.id })}
          >
            <View style={styles.cardRow}>
              <Text style={styles.cardTitle}>{item.nom}</Text>
              {item.specialite ? (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>Spécialité</Text>
                </View>
              ) : null}
            </View>
            <Text style={[styles.cardProgress, !item.hasContent && styles.cardProgressMuted]}>
              {subjectProgressLabel(item, statuses)}
            </Text>
          </Pressable>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', paddingTop: 20 },
  title: { fontSize: 24, fontWeight: '700', paddingHorizontal: 20, marginBottom: 12 },
  list: { paddingHorizontal: 20, paddingBottom: 40 },
  card: { backgroundColor: '#f5f5f7', borderRadius: 14, padding: 16, marginBottom: 12 },
  cardMuted: { opacity: 0.6 },
  cardRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  cardTitle: { fontSize: 16, fontWeight: '600', flexShrink: 1, marginRight: 8 },
  cardProgress: { fontSize: 13, color: '#4f46e5', marginTop: 4 },
  cardProgressMuted: { color: '#999' },
  badge: { backgroundColor: '#e0e7ff', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 999 },
  badgeText: { color: '#4f46e5', fontSize: 12, fontWeight: '600' },
});
