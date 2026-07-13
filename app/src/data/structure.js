// Structure officielle des niveaux et matières du programme français
// (voir docs/cahier-des-charges.md §8bis). Le contenu réel de chaque matière
// est branché dans src/data/subjects/index.js ; toute matière sans contenu
// converti affiche un module "Contenu à venir".

const TRONC_COMMUN_COLLEGE_ET_SECONDE = [
  { id: 'francais', nom: 'Français' },
  { id: 'maths', nom: 'Mathématiques' },
  { id: 'histoire-geo-emc', nom: 'Histoire-Géographie-EMC' },
  { id: 'svt', nom: 'SVT' },
  { id: 'physique-chimie', nom: 'Physique-Chimie' },
  { id: 'anglais', nom: 'Anglais' },
  { id: 'lv2', nom: 'LV2' },
  { id: 'eps', nom: 'EPS' },
  { id: 'arts-musique', nom: 'Arts / Musique' },
];

// En Première/Terminale, ces matières sont des enseignements de spécialité.
const SPECIALITES = [
  { id: 'spe-maths', nom: 'Mathématiques', specialite: true },
  { id: 'spe-physique-chimie', nom: 'Physique-Chimie', specialite: true },
  { id: 'spe-svt', nom: 'SVT', specialite: true },
  { id: 'spe-ses', nom: 'SES', specialite: true },
  { id: 'spe-hggsp', nom: 'HGGSP', specialite: true },
  { id: 'spe-hlp', nom: 'HLP', specialite: true },
  { id: 'spe-llce', nom: 'LLCE', specialite: true },
  { id: 'spe-nsi', nom: 'NSI', specialite: true },
  { id: 'spe-arts', nom: 'Arts', specialite: true },
  { id: 'spe-llca', nom: 'LLCA', specialite: true },
];

const TRONC_COMMUN_PREMIERE = [
  { id: 'francais', nom: 'Français' },
  { id: 'histoire-geo-emc', nom: 'Histoire-Géographie-EMC' },
  { id: 'anglais', nom: 'Anglais' },
  { id: 'lv2', nom: 'LV2' },
  { id: 'eps', nom: 'EPS' },
];

const TRONC_COMMUN_TERMINALE = [
  { id: 'philosophie', nom: 'Philosophie' },
  { id: 'histoire-geo-emc', nom: 'Histoire-Géographie-EMC' },
  { id: 'anglais', nom: 'Anglais' },
  { id: 'lv2', nom: 'LV2' },
  { id: 'eps', nom: 'EPS' },
  { id: 'grand-oral', nom: 'Grand Oral' },
];

export const LEVELS = [
  { id: 'troisieme', nom: 'Troisième', ordre: 1, subjects: TRONC_COMMUN_COLLEGE_ET_SECONDE },
  {
    id: 'seconde',
    nom: 'Seconde',
    ordre: 2,
    subjects: [...TRONC_COMMUN_COLLEGE_ET_SECONDE, { id: 'snt', nom: 'SNT' }],
  },
  { id: 'premiere', nom: 'Première', ordre: 3, subjects: [...TRONC_COMMUN_PREMIERE, ...SPECIALITES] },
  { id: 'terminale', nom: 'Terminale', ordre: 4, subjects: [...TRONC_COMMUN_TERMINALE, ...SPECIALITES] },
];
