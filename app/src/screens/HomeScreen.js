import React from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { levels } from '../data/subjects';
import { useProgress } from '../context/ProgressContext';
import { useAuth } from '../context/AuthContext';

function levelStats(level, statuses) {
  const realModules = level.subjects.flatMap((subject) => subject.modules.filter((mod) => !mod.placeholder));
  const done = realModules.filter((mod) => statuses[mod.id] === 'termine').length;
  return { available: realModules.length, done };
}

export default function HomeScreen({ navigation }) {
  const { statuses } = useProgress();
  const { user, signOut } = useAuth();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Mon niveau</Text>
          <Text style={styles.pseudo}>{user?.pseudo}</Text>
        </View>
        <Pressable onPress={signOut}>
          <Text style={styles.signOut}>Déconnexion</Text>
        </Pressable>
      </View>
      <FlatList
        data={levels}
        keyExtractor={(level) => level.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => {
          const { available, done } = levelStats(item, statuses);
          return (
            <Pressable style={styles.card} onPress={() => navigation.navigate('Level', { levelId: item.id })}>
              <Text style={styles.cardTitle}>{item.nom}</Text>
              <Text style={styles.cardSubtitle}>{item.subjects.length} matières</Text>
              <Text style={styles.cardProgress}>
                {available > 0
                  ? `${done} / ${available} modules disponibles terminés`
                  : 'Contenu en préparation'}
              </Text>
            </Pressable>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', paddingTop: 60 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  title: { fontSize: 26, fontWeight: '700' },
  pseudo: { fontSize: 14, color: '#666', marginTop: 2 },
  signOut: { color: '#4f46e5', fontSize: 14 },
  list: { paddingHorizontal: 20, paddingBottom: 40 },
  card: { backgroundColor: '#f5f5f7', borderRadius: 14, padding: 18, marginBottom: 14 },
  cardTitle: { fontSize: 20, fontWeight: '700', marginBottom: 4 },
  cardSubtitle: { fontSize: 14, color: '#666', marginBottom: 2 },
  cardProgress: { fontSize: 13, color: '#4f46e5' },
});
