insert into public.chapters (id, title, description, position)
values
  (
    '11111111-1111-1111-1111-111111111111',
    'La fin de l''Ancien Régime',
    'Comprendre la société française et la crise avant 1789.',
    1
  ),
  (
    '22222222-2222-2222-2222-222222222222',
    'L''année 1789',
    'Découvrir les événements qui lancent la Révolution française.',
    2
  ),
  (
    '33333333-3333-3333-3333-333333333333',
    'De la monarchie à la République',
    'Suivre les changements politiques entre 1791 et 1792.',
    3
  )
on conflict (id) do update
set
  title = excluded.title,
  description = excluded.description,
  position = excluded.position;
