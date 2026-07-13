import React from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { getSubject } from '../data/subjects';
import { useProgress } from '../context/ProgressContext';

const STATUS_LABELS = {
  a_faire: 'À faire',
  en_cours: 'En cours',
  termine: 'Terminé',
};

const STATUS_COLORS = {
  a_faire: '#9ca3af',
  en_cours: '#f59e0b',
  termine: '#16a34a',
};

export default function SubjectScreen({ route, navigation }) {
  const { levelId, subjectId } = route.params;
  const subject = getSubject(levelId, subjectId);
  const { statuses } = useProgress();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{subject.nom}</Text>
      <FlatList
        data={subject.modules}
        keyExtractor={(mod) => mod.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => {
          const statut = statuses[item.id] ?? 'a_faire';
          return (
            <Pressable
              style={[styles.card, item.placeholder && styles.cardMuted]}
              onPress={() => navigation.navigate('Module', { levelId, subjectId, moduleId: item.id })}
            >
              <View style={styles.cardRow}>
                <Text style={styles.cardTitle}>{item.titre}</Text>
                {item.placeholder ? (
                  <View style={[styles.badge, { backgroundColor: '#9ca3af' }]}>
                    <Text style={styles.badgeText}>À venir</Text>
                  </View>
                ) : (
                  <View style={[styles.badge, { backgroundColor: STATUS_COLORS[statut] }]}>
                    <Text style={styles.badgeText}>{STATUS_LABELS[statut]}</Text>
                  </View>
                )}
              </View>
              <Text style={styles.cardLevel}>{item.niveau}</Text>
            </Pressable>
          );
        }}
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
  cardLevel: { fontSize: 13, color: '#666', marginTop: 4 },
  badge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 999 },
  badgeText: { color: '#fff', fontSize: 12, fontWeight: '600' },
});
