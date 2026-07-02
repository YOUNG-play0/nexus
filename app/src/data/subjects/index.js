import mathsSeconde from './maths-seconde.json';

// Ajouter ici chaque nouveau fichier matière/niveau au fur et à mesure de la conversion du contenu.
const subjectFiles = [mathsSeconde];

function buildSubjects(files) {
  const bySubject = new Map();
  for (const file of files) {
    const existing = bySubject.get(file.id);
    if (existing) {
      existing.modules.push(...file.modules);
    } else {
      bySubject.set(file.id, { id: file.id, nom: file.nom, ordre: file.ordre, modules: [...file.modules] });
    }
  }
  return Array.from(bySubject.values())
    .sort((a, b) => a.ordre - b.ordre)
    .map((subject) => ({
      ...subject,
      modules: [...subject.modules].sort((a, b) => a.ordre - b.ordre),
    }));
}

export const subjects = buildSubjects(subjectFiles);

export function getSubject(subjectId) {
  return subjects.find((subject) => subject.id === subjectId);
}

export function getModule(subjectId, moduleId) {
  return getSubject(subjectId)?.modules.find((mod) => mod.id === moduleId);
}
