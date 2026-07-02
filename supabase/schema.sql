create extension if not exists pgcrypto;

create table if not exists public.chapters (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null default '',
  position integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.lessons (
  id uuid primary key default gen_random_uuid(),
  chapter_id uuid not null references public.chapters(id) on delete cascade,
  title text not null,
  summary text not null default '',
  content text not null default '',
  position integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.questions (
  id uuid primary key default gen_random_uuid(),
  lesson_id uuid not null references public.lessons(id) on delete cascade,
  question text not null,
  choice_a text not null,
  choice_b text not null,
  choice_c text not null,
  correct_choice text not null check (correct_choice in ('a', 'b', 'c')),
  position integer not null default 0
);

create table if not exists public.favorites (
  user_id uuid not null references auth.users(id) on delete cascade,
  lesson_id uuid not null references public.lessons(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, lesson_id)
);

create table if not exists public.progress (
  user_id uuid not null references auth.users(id) on delete cascade,
  lesson_id uuid not null references public.lessons(id) on delete cascade,
  best_score smallint not null default 0 check (best_score between 0 and 3),
  completed_at timestamptz not null default now(),
  primary key (user_id, lesson_id)
);

alter table public.chapters enable row level security;
alter table public.lessons enable row level security;
alter table public.questions enable row level security;
alter table public.favorites enable row level security;
alter table public.progress enable row level security;

revoke all on table public.chapters from anon, authenticated;
revoke all on table public.lessons from anon, authenticated;
revoke all on table public.questions from anon, authenticated;
revoke all on table public.favorites from anon, authenticated;
revoke all on table public.progress from anon, authenticated;

grant select on table public.chapters to anon, authenticated;
grant select on table public.lessons to anon, authenticated;
grant select on table public.questions to anon, authenticated;
grant select, insert, delete on table public.favorites to authenticated;
grant select, insert, update, delete on table public.progress to authenticated;

drop policy if exists "chapters are readable" on public.chapters;
create policy "chapters are readable"
on public.chapters
for select
to anon, authenticated
using (true);

drop policy if exists "lessons are readable" on public.lessons;
create policy "lessons are readable"
on public.lessons
for select
to anon, authenticated
using (true);

drop policy if exists "questions are readable" on public.questions;
create policy "questions are readable"
on public.questions
for select
to anon, authenticated
using (true);

drop policy if exists "users can manage their favorites" on public.favorites;
create policy "users can manage their favorites"
on public.favorites
for all
to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

drop policy if exists "users can manage their progress" on public.progress;
create policy "users can manage their progress"
on public.progress
for all
to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);