import React, { useEffect, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { getModule } from '../data/subjects';
import { useAuth } from '../context/AuthContext';
import { useProgress } from '../context/ProgressContext';
import { recordQuizAttempt } from '../lib/progress';

function normalize(value) {
  return value.trim().toLowerCase().replace(/\s+/g, '');
}

export default function ModuleScreen({ route }) {
  const { levelId, subjectId, moduleId } = route.params;
  const mod = getModule(levelId, subjectId, moduleId);
  const { user } = useAuth();
  const { statuses, updateModuleStatus } = useProgress();

  const [questionIndex, setQuestionIndex] = useState(0);
  const [answer, setAnswer] = useState('');
  const [feedback, setFeedback] = useState(null); // 'correct' | 'incorrect' | null
  const [showHint, setShowHint] = useState(false);
  const [finished, setFinished] = useState(statuses[moduleId] === 'termine');

  useEffect(() => {
    if (!mod.placeholder && (statuses[moduleId] ?? 'a_faire') === 'a_faire') {
      updateModuleStatus(moduleId, 'en_cours');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (mod.placeholder) {
    return (
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <Text style={styles.title}>Contenu à venir</Text>
        <Text style={styles.cours}>
          Les cours et quiz de cette matière sont en préparation. Reviens bientôt !
        </Text>
      </ScrollView>
    );
  }

  const question = mod.quiz[questionIndex];
  const isLastQuestion = questionIndex === mod.quiz.length - 1;

  const handleCheck = async () => {
    const isCorrect = question.reponses_acceptees.some((accepted) => normalize(accepted) === normalize(answer));
    setFeedback(isCorrect ? 'correct' : 'incorrect');
    setShowHint(!isCorrect);
    await recordQuizAttempt(user, question.id, answer, isCorrect);
  };

  const handleNext = () => {
    setAnswer('');
    setFeedback(null);
    setShowHint(false);
    if (isLastQuestion) {
      updateModuleStatus(moduleId, 'termine');
      setFinished(true);
    } else {
      setQuestionIndex((index) => index + 1);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>{mod.titre}</Text>
      <Text style={styles.cours}>{mod.cours}</Text>

      {finished ? (
        <Text style={styles.done}>Module terminé, bravo !</Text>
      ) : (
        <View style={styles.quizBox}>
          <Text style={styles.quizProgress}>
            Question {questionIndex + 1} / {mod.quiz.length}
          </Text>
          <Text style={styles.question}>{question.question}</Text>

          {question.type === 'choix' && question.choix ? (
            <View style={styles.choices}>
              {question.choix.map((choice) => (
                <Pressable
                  key={choice}
                  style={[styles.choiceButton, answer === choice && styles.choiceButtonSelected]}
                  onPress={() => setAnswer(choice)}
                >
                  <Text style={[styles.choiceText, answer === choice && styles.choiceTextSelected]}>{choice}</Text>
                </Pressable>
              ))}
            </View>
          ) : (
            <TextInput
              style={styles.input}
              value={answer}
              onChangeText={setAnswer}
              placeholder="Ta réponse"
              autoCapitalize="none"
            />
          )}

          {feedback === 'correct' && <Text style={styles.correct}>Bonne réponse !</Text>}
          {feedback === 'incorrect' && (
            <View>
              <Text style={styles.incorrect}>Ce n'est pas ça, réessaie.</Text>
              {showHint && question.indice ? <Text style={styles.hint}>Indice : {question.indice}</Text> : null}
            </View>
          )}

          {feedback === 'correct' ? (
            <Pressable style={styles.button} onPress={handleNext}>
              <Text style={styles.buttonText}>{isLastQuestion ? 'Terminer le module' : 'Question suivante'}</Text>
            </Pressable>
          ) : (
            <Pressable
              style={[styles.button, !answer && styles.buttonDisabled]}
              onPress={handleCheck}
              disabled={!answer}
            >
              <Text style={styles.buttonText}>Valider</Text>
            </Pressable>
          )}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  content: { padding: 20, paddingBottom: 60 },
  title: { fontSize: 24, fontWeight: '700', marginBottom: 16 },
  cours: { fontSize: 15, lineHeight: 22, color: '#333', marginBottom: 28 },
  quizBox: { backgroundColor: '#f5f5f7', borderRadius: 16, padding: 18 },
  quizProgress: { fontSize: 13, color: '#666', marginBottom: 8 },
  question: { fontSize: 17, fontWeight: '600', marginBottom: 16 },
  choices: { marginBottom: 16 },
  choiceButton: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 14,
    marginBottom: 10,
    backgroundColor: '#fff',
  },
  choiceButtonSelected: { borderColor: '#4f46e5', backgroundColor: '#eef2ff' },
  choiceText: { fontSize: 15, color: '#333' },
  choiceTextSelected: { color: '#4f46e5', fontWeight: '600' },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    marginBottom: 16,
    backgroundColor: '#fff',
  },
  correct: { color: '#16a34a', fontWeight: '600', marginBottom: 16 },
  incorrect: { color: '#dc2626', fontWeight: '600', marginBottom: 4 },
  hint: { color: '#666', fontStyle: 'italic', marginBottom: 16 },
  button: { backgroundColor: '#4f46e5', borderRadius: 10, paddingVertical: 14, alignItems: 'center' },
  buttonDisabled: { opacity: 0.5 },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  done: { fontSize: 17, fontWeight: '600', color: '#16a34a', textAlign: 'center', marginTop: 20 },
});
