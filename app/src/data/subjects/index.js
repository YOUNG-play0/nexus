import { LEVELS } from '../structure';
import mathsSeconde from './maths-seconde.json';

// Contenu réel déjà converti en JSON, indexé par "niveau:matière".
// Ajouter une entrée ici pour chaque fichier converti depuis le contenu HTML
// existant. Emplacements prévus pour le contenu déjà prêt côté auteur :
//   'seconde:physique-chimie'      Physique-Chimie Seconde (6 modules)
//   'seconde:snt'                  SNT Seconde (7 thèmes)
//   'premiere:francais'            Français Première (méthodologie, œuvres)
//   'premiere:spe-maths'           Maths spécialité Première (9 modules)
//   'premiere:spe-physique-chimie' Physique-Chimie spécialité Première (4 modules)
//   'premiere:spe-nsi'             NSI spécialité Première (6 modules)
const realModules = {
  'seconde:maths': mathsSeconde.modules,
};

function placeholderModule(level, subject) {
  return {
    id: `${level.id}-${subject.id}-a-venir`,
    titre: 'Contenu à venir',
    niveau: level.nom,
    ordre: 1,
    placeholder: true,
    cours: '',
    quiz: [],
  };
}

export const levels = LEVELS.map((level) => ({
  ...level,
  subjects: level.subjects.map((subject, index) => {
    const modules = realModules[`${level.id}:${subject.id}`];
    return {
      ...subject,
      ordre: index + 1,
      hasContent: Boolean(modules),
      modules: modules
        ? [...modules].sort((a, b) => a.ordre - b.ordre)
        : [placeholderModule(level, subject)],
    };
  }),
}));

export function getLevel(levelId) {
  return levels.find((level) => level.id === levelId);
}

export function getSubject(levelId, subjectId) {
  return getLevel(levelId)?.subjects.find((subject) => subject.id === subjectId);
}

export function getModule(levelId, subjectId, moduleId) {
  return getSubject(levelId, subjectId)?.modules.find((mod) => mod.id === moduleId);
}
