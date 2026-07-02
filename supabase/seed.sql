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
    $$Avant 1789, la société française est organisée en trois ordres. Le clergé rassemble les membres de l’Église, tandis que la noblesse regroupe les familles qui possèdent des titres et exercent souvent des fonctions militaires ou administratives. Le tiers état réunit tous les autres habitants, soit l’immense majorité de la population.

Le clergé et la noblesse disposent de privilèges. Ils bénéficient notamment d’avantages fiscaux et échappent à certains impôts. Ils possèdent aussi une part importante des terres. Le tiers état est très divers : il comprend des bourgeois, des artisans, des commerçants, des ouvriers et surtout des paysans. Leurs conditions de vie et leurs richesses sont donc très différentes.

La plus grande partie des impôts royaux repose sur le tiers état. Les paysans doivent également payer des droits à leur seigneur et verser la dîme à l’Église. En période de hausse des prix ou de mauvaises récoltes, ces charges deviennent particulièrement lourdes. Les bourgeois, parfois instruits et aisés, supportent mal d’être écartés des privilèges réservés aux deux premiers ordres. Ces inégalités juridiques et fiscales nourrissent un mécontentement croissant et contribuent à la crise qui conduit à la Révolution.$$,
    1
  ),
  (
    '11111111-1111-1111-1111-111111111102',
    '11111111-1111-1111-1111-111111111111',
    'La crise de la monarchie',
    'Les difficultés financières et politiques fragilisent le pouvoir royal.',
    $$À la fin des années 1780, le royaume de France traverse une grave crise financière. L’État a accumulé une dette considérable, notamment à cause des guerres menées au XVIIIe siècle. La participation française à la guerre d’indépendance américaine a encore augmenté les dépenses, même si elle a affaibli la puissance britannique.

Le système fiscal fonctionne mal. Les impôts sont inégalement répartis et rapportent moins que nécessaire, car de nombreux privilégiés y échappent. Une partie des recettes est aussi absorbée par le remboursement des intérêts de la dette. Plusieurs ministres proposent de faire contribuer davantage le clergé et la noblesse, mais leurs projets rencontrent une forte opposition et échouent.

La crise financière se double d’une crise sociale. Les mauvaises récoltes de 1788 réduisent les quantités de céréales disponibles. Le prix du pain augmente fortement, alors qu’il représente une part essentielle du budget des familles populaires. La faim et le chômage aggravent les tensions. Louis XVI ne parvient plus à imposer une réforme durable. Pour obtenir l’accord du pays sur de nouveaux impôts, il décide de convoquer les États généraux. Cette assemblée, qui n’avait pas été réunie depuis 1614, doit s’ouvrir à Versailles en mai 1789. Cette décision ouvre une période d’attentes et de débats politiques.$$,
    2
  ),
  (
    '22222222-2222-2222-2222-222222222201',
    '22222222-2222-2222-2222-222222222222',
    'Des États généraux à l’Assemblée nationale',
    'Les représentants du tiers état contestent l’organisation politique du royaume.',
    $$Les États généraux s’ouvrent à Versailles le 5 mai 1789. Des députés du clergé, de la noblesse et du tiers état sont réunis pour aider le roi à résoudre la crise financière. Avant leur réunion, les Français ont rédigé des cahiers de doléances dans lesquels ils expriment leurs difficultés et leurs souhaits de réforme.

Un désaccord essentiel apparaît rapidement. Les privilégiés défendent le vote par ordre : chaque ordre dispose d’une voix, ce qui permet au clergé et à la noblesse de l’emporter ensemble. Les députés du tiers état réclament le vote par tête, où chaque député compte individuellement. Comme ils sont plus nombreux et espèrent le soutien de certains membres du clergé ou de la noblesse, ce système leur serait plus favorable.

Le 17 juin, les députés du tiers état se proclament Assemblée nationale. Ils affirment représenter la nation entière et non un seul ordre. Le 20 juin, trouvant leur salle fermée, ils se réunissent dans la salle du Jeu de paume. Ils jurent de ne pas se séparer avant d’avoir donné une Constitution à la France. Cet engagement, appelé Serment du Jeu de paume, transforme une réunion convoquée par le roi en révolution politique. L’objectif est désormais de limiter le pouvoir royal par des règles écrites et de faire participer la nation à l’exercice du pouvoir.$$,
    1
  ),
  (
    '22222222-2222-2222-2222-222222222202',
    '22222222-2222-2222-2222-222222222222',
    'La prise de la Bastille',
    'Le 14 juillet 1789 devient un événement majeur de la Révolution.',
    $$Au début de juillet 1789, la tension augmente à Paris. Le renvoi du ministre Necker, apprécié d’une partie de la population, fait craindre une intervention des troupes royales contre l’Assemblée nationale. Les Parisiens cherchent des armes pour défendre la ville. Le 14 juillet, ils prennent des fusils aux Invalides, puis se dirigent vers la Bastille pour y trouver de la poudre.

La Bastille est une forteresse et une prison royale. Après plusieurs heures de combat, elle est prise par la foule. Son gouverneur est tué. La prison ne contient alors que quelques détenus, mais sa chute a une immense portée symbolique : elle représente la victoire du peuple contre l’arbitraire royal. Louis XVI doit reconnaître la nouvelle municipalité parisienne et la Garde nationale.

Dans les campagnes, des rumeurs annoncent l’arrivée de brigands envoyés par les nobles. Cette panique, appelée la Grande Peur, pousse des paysans à attaquer des châteaux et à détruire des documents qui enregistrent les droits seigneuriaux. Pour rétablir le calme, les députés votent dans la nuit du 4 août l’abolition des privilèges et des droits féodaux, même si leur disparition complète demande encore du temps. L’égalité devant l’impôt et la fin de la société d’ordres deviennent alors des principes majeurs de la Révolution.$$,
    2
  ),
  (
    '33333333-3333-3333-3333-333333333301',
    '33333333-3333-3333-3333-333333333333',
    'La monarchie constitutionnelle',
    'La Constitution de 1791 limite les pouvoirs du roi.',
    $$Le 26 août 1789, l’Assemblée adopte la Déclaration des droits de l’homme et du citoyen. Elle affirme que les hommes naissent libres et égaux en droits, que la souveraineté appartient à la nation et que la loi doit être la même pour tous. Ces principes servent de base au nouvel ordre politique, même si tous les habitants ne bénéficient pas encore des mêmes droits politiques.

La Constitution de 1791 transforme la France en monarchie constitutionnelle. Louis XVI reste roi, mais il ne détient plus tous les pouvoirs. Le pouvoir législatif est confié à une assemblée élue, tandis que le roi exerce le pouvoir exécutif et dispose d’un veto suspensif. La séparation des pouvoirs doit empêcher le retour à la monarchie absolue.

Le droit de vote est toutefois limité par le suffrage censitaire. Seuls les hommes qui paient un certain niveau d’impôt peuvent voter, ce qui exclut les citoyens les plus pauvres et toutes les femmes. La confiance envers le roi se dégrade aussi fortement. En juin 1791, Louis XVI et sa famille tentent de fuir Paris, mais ils sont reconnus et arrêtés à Varennes. Beaucoup de Français pensent alors que le roi n’accepte pas sincèrement la Révolution. Même si la monarchie est maintenue par la Constitution, la fuite à Varennes fragilise durablement le nouveau régime et renforce les partisans d’une République.$$,
    1
  ),
  (
    '33333333-3333-3333-3333-333333333302',
    '33333333-3333-3333-3333-333333333333',
    'La naissance de la République',
    'La monarchie tombe et la République est proclamée en septembre 1792.',
    $$En avril 1792, la France déclare la guerre à l’Autriche. Les révolutionnaires redoutent les monarchies européennes, qui pourraient intervenir pour rétablir pleinement le pouvoir de Louis XVI. La Prusse rejoint rapidement l’Autriche. Les premiers revers militaires et les menaces étrangères alimentent la peur d’une trahison du roi et aggravent la crise politique.

Le 10 août 1792, des fédérés venus de plusieurs régions et des habitants de Paris attaquent le palais des Tuileries, où réside la famille royale. Après de violents combats, l’Assemblée suspend Louis XVI. Le roi et sa famille sont ensuite emprisonnés. La monarchie constitutionnelle mise en place en 1791 cesse de fonctionner.

Une nouvelle assemblée, la Convention nationale, est élue au suffrage universel masculin. Elle se réunit pour la première fois le 20 septembre 1792, le jour où les armées françaises remportent la bataille de Valmy. Le lendemain, 21 septembre, la Convention abolit la monarchie. La République est alors proclamée et un nouveau calendrier politique commence : les actes officiels datent désormais de l’an I de la République. Ce changement ne met pas fin aux difficultés. La France reste en guerre et les révolutionnaires sont divisés, mais la souveraineté n’est plus incarnée par un roi. Elle est désormais exercée au nom de la nation.$$,
    2
  )
on conflict (id) do update
set
  chapter_id = excluded.chapter_id,
  title = excluded.title,
  summary = excluded.summary,
  content = excluded.content,
  position = excluded.position;
