insert into public.chapters (id, title, description, position)
values
  (
    '11111111-1111-1111-1111-111111111111',
    'La Révolution française',
    'Découvrez les événements qui ont transformé la France à partir de 1789.',
    1
  ),
  (
    '22222222-2222-2222-2222-222222222222',
    'Le Premier Empire',
    'Suivez le parcours de Napoléon Bonaparte et la naissance de l’Empire.',
    2
  ),
  (
    '33333333-3333-3333-3333-333333333333',
    'La révolution industrielle',
    'Comprenez les changements techniques et sociaux du XIXe siècle.',
    3
  )
on conflict (id) do update
set
  title = excluded.title,
  description = excluded.description,
  position = excluded.position;