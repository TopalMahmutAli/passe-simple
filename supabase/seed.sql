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

insert into public.lessons (id, chapter_id, title, summary, content, position)
values
  (
    '11111111-1111-1111-1111-111111111101',
    '11111111-1111-1111-1111-111111111111',
    'La société d’ordres',
    'La société française est divisée entre le clergé, la noblesse et le tiers état.',
    'Sous l’Ancien Régime, le clergé et la noblesse disposent de privilèges. Le tiers état rassemble la majorité de la population.',
    1
  ),
  (
    '11111111-1111-1111-1111-111111111102',
    '11111111-1111-1111-1111-111111111111',
    'La crise de la monarchie',
    'Les difficultés financières et politiques fragilisent le pouvoir royal.',
    'À la fin du XVIIIe siècle, la monarchie est très endettée. Les réformes échouent et la crise politique s’aggrave.',
    2
  ),
  (
    '22222222-2222-2222-2222-222222222201',
    '22222222-2222-2222-2222-222222222222',
    'Des États généraux à l’Assemblée nationale',
    'Les représentants du tiers état contestent l’organisation politique du royaume.',
    'En juin 1789, les députés du tiers état se déclarent Assemblée nationale. Ils affirment représenter la nation.',
    1
  ),
  (
    '22222222-2222-2222-2222-222222222202',
    '22222222-2222-2222-2222-222222222222',
    'La prise de la Bastille',
    'Le 14 juillet 1789 devient un événement majeur de la Révolution.',
    'Le 14 juillet 1789, les Parisiens prennent la Bastille. Cet événement symbolise la contestation du pouvoir royal.',
    2
  ),
  (
    '33333333-3333-3333-3333-333333333301',
    '33333333-3333-3333-3333-333333333333',
    'La monarchie constitutionnelle',
    'La Constitution de 1791 limite les pouvoirs du roi.',
    'La Constitution de 1791 partage le pouvoir entre le roi et une assemblée élue. La France devient une monarchie constitutionnelle.',
    1
  ),
  (
    '33333333-3333-3333-3333-333333333302',
    '33333333-3333-3333-3333-333333333333',
    'La naissance de la République',
    'La monarchie tombe et la République est proclamée en septembre 1792.',
    'Le 10 août 1792, la monarchie est renversée. La République est proclamée le 21 septembre 1792.',
    2
  )
on conflict (id) do update
set
  chapter_id = excluded.chapter_id,
  title = excluded.title,
  summary = excluded.summary,
  content = excluded.content,
  position = excluded.position;
