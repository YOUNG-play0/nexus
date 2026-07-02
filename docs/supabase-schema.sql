-- Schéma de base de données pour l'appli de révision (voir docs/cahier-des-charges.md §6)
-- À exécuter dans l'éditeur SQL de Supabase (Project > SQL Editor).

-- Les comptes utilisateurs sont gérés par Supabase Auth (auth.users).
-- Cette table stocke les infos complémentaires (pseudo affiché, etc.).
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  pseudo text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.subjects (
  id text primary key,
  nom text not null,
  ordre integer not null default 0
);

create table if not exists public.modules (
  id text primary key,
  subject_id text not null references public.subjects (id) on delete cascade,
  titre text not null,
  niveau text not null check (niveau in ('Troisième', 'Seconde', 'Première', 'Terminale')),
  contenu text not null default '',
  ordre integer not null default 0
);

create table if not exists public.quiz_questions (
  id text primary key,
  module_id text not null references public.modules (id) on delete cascade,
  question text not null,
  type text not null check (type in ('numerique', 'choix')),
  reponses_acceptees jsonb not null default '[]'::jsonb,
  choix jsonb,
  indice text,
  ordre integer not null default 0
);

create table if not exists public.progress (
  user_id uuid not null references auth.users (id) on delete cascade,
  module_id text not null references public.modules (id) on delete cascade,
  statut text not null default 'a_faire' check (statut in ('a_faire', 'en_cours', 'termine')),
  completed_at timestamptz,
  primary key (user_id, module_id)
);

create table if not exists public.quiz_attempts (
  id bigint generated always as identity primary key,
  user_id uuid not null references auth.users (id) on delete cascade,
  question_id text not null references public.quiz_questions (id) on delete cascade,
  reponse_donnee text,
  correcte boolean not null,
  created_at timestamptz not null default now()
);

-- Row Level Security : chaque élève ne voit/modifie que ses propres données.
-- Le contenu (subjects/modules/quiz_questions) est en lecture publique pour tout utilisateur connecté.

alter table public.profiles enable row level security;
alter table public.subjects enable row level security;
alter table public.modules enable row level security;
alter table public.quiz_questions enable row level security;
alter table public.progress enable row level security;
alter table public.quiz_attempts enable row level security;

create policy "Un élève gère son propre profil"
  on public.profiles for all
  using (auth.uid() = id)
  with check (auth.uid() = id);

create policy "Contenu lisible par tout utilisateur connecté"
  on public.subjects for select
  using (auth.role() = 'authenticated');

create policy "Contenu lisible par tout utilisateur connecté"
  on public.modules for select
  using (auth.role() = 'authenticated');

create policy "Contenu lisible par tout utilisateur connecté"
  on public.quiz_questions for select
  using (auth.role() = 'authenticated');

create policy "Un élève gère sa propre progression"
  on public.progress for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Un élève gère ses propres tentatives de quiz"
  on public.quiz_attempts for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
