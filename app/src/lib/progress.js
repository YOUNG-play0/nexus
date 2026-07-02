import AsyncStorage from '@react-native-async-storage/async-storage';
import { isSupabaseConfigured, supabase } from './supabase';

function localKey(userId) {
  return `progress:${userId}`;
}

async function getLocalProgress(userId) {
  const raw = await AsyncStorage.getItem(localKey(userId));
  return raw ? JSON.parse(raw) : {};
}

async function setLocalProgress(userId, statusesByModuleId) {
  await AsyncStorage.setItem(localKey(userId), JSON.stringify(statusesByModuleId));
}

// Retourne { [moduleId]: 'a_faire' | 'en_cours' | 'termine' }
export async function getModuleStatuses(user) {
  if (!user) return {};
  if (!user.isGuest && isSupabaseConfigured) {
    const { data, error } = await supabase.from('progress').select('module_id, statut').eq('user_id', user.id);
    if (error) throw error;
    return Object.fromEntries(data.map((row) => [row.module_id, row.statut]));
  }
  return getLocalProgress(user.id);
}

export async function setModuleStatus(user, moduleId, statut) {
  if (!user) return;
  if (!user.isGuest && isSupabaseConfigured) {
    const { error } = await supabase.from('progress').upsert({
      user_id: user.id,
      module_id: moduleId,
      statut,
      completed_at: statut === 'termine' ? new Date().toISOString() : null,
    });
    if (error) throw error;
    return;
  }
  const current = await getLocalProgress(user.id);
  current[moduleId] = statut;
  await setLocalProgress(user.id, current);
}

// En mode invité (sans compte Supabase), seul le statut du module est conservé localement ;
// l'historique détaillé des tentatives (quiz_attempts) nécessite un compte réel.
export async function recordQuizAttempt(user, questionId, reponseDonnee, correcte) {
  if (!user || user.isGuest || !isSupabaseConfigured) return;
  const { error } = await supabase.from('quiz_attempts').insert({
    user_id: user.id,
    question_id: questionId,
    reponse_donnee: reponseDonnee,
    correcte,
  });
  if (error) throw error;
}
