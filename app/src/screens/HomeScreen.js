import React from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { subjects } from '../data/subjects';
import { useProgress } from '../context/ProgressContext';
import { useAuth } from '../context/AuthContext';

function countCompleted(modules, statuses) {
  return modules.filter((mod) => statuses[mod.id] === 'termine').length;
}

export default function HomeScreen({ navigation }) {
  const { statuses } = useProgress();
  const { user, signOut } = useAuth();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Mes matières</Text>
          <Text style={styles.pseudo}>{user?.pseudo}</Text>
        </View>
        <Pressable onPress={signOut}>
          <Text style={styles.signOut}>Déconnexion</Text>
        </Pressable>
      </View>
      <FlatList
        data={subjects}
        keyExtractor={(subject) => subject.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => {
          const done = countCompleted(item.modules, statuses);
          return (
            <Pressable style={styles.card} onPress={() => navigation.navigate('Subject', { subjectId: item.id })}>
              <Text style={styles.cardTitle}>{item.nom}</Text>
              <Text style={styles.cardProgress}>
                {done} / {item.modules.length} modules terminés
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
  cardTitle: { fontSize: 18, fontWeight: '600', marginBottom: 6 },
  cardProgress: { fontSize: 14, color: '#666' },
});
