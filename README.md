# Minigolf

Un parcours de minigolf de neuf trous, avec du sable, de l'eau, des obstacles et des bordures sur lesquelles la balle rebondit. Tire en arrière pour viser et doser, lâche pour frapper, et finis le parcours en le moins de coups possible.

*English version: [README.en.md](README.en.md)*

## À plusieurs (nouveau en 1.2.0)

Le choix **Joueurs** (1 à 4) permet de jouer à plusieurs sur le même PC, chacun son tour. Chaque joueur a sa balle (blanche, rouge, bleue, jaune) ; quand la balle s'arrête, c'est au suivant. Celui qui a fini le trou attend les autres (10 coups au plus par trou). À la fin de chaque trou, un tableau donne les coups et le total de chacun, puis le gagnant à la fin du parcours.

## Comment jouer

- **Clique et maintiens** n'importe où sur le terrain, puis **tire en arrière** : des pointillés montrent la direction du coup, à l'opposé de ton geste.
- Plus tu tires loin, plus le coup est fort ; la jauge en bas à gauche passe du blanc au jaune puis au rouge près du maximum.
- **Lâche** pour frapper. Un geste trop court est ignoré et ne compte pas comme un coup.
- On ne peut pas tirer tant que la balle roule.
- Une fois la balle dans le trou : **clic**, **Espace** ou **Entrée** pour passer au trou suivant.

## Le terrain

- Le **gazon** freine doucement la balle.
- Le **sable** la freine beaucoup.
- L'**eau** fait « plouf » : la balle revient à l'endroit du tir, avec un coup de pénalité.
- Les **bordures** et les obstacles renvoient la balle, en lui faisant perdre un peu de vitesse.
- Le bord du trou attire un peu une balle lente ; une balle trop rapide passe par-dessus.

## Le parcours

Le parcours de base compte neuf trous fixes, du par 2 au par 5, pour un par total de 31 : une ligne droite, des virages, un bunker au milieu, un ruisseau à traverser, un étang avec un seul passage, des plots en quinconce…

La liste **Parcours** propose aussi :

- **Île aux pirates** : une île de gazon au milieu de la mer, des palmiers, un drapeau pirate, de l'eau partout et des **pont-levis** ;
- **Banquise** : de la neige, des sapins, des plaques de **glace** où la balle glisse loin, des moulins et des tapis roulants ;
- **Station spatiale** : des plaques de métal au milieu des étoiles, des **trous noirs** qui attirent la balle et l'avalent (un coup de pénalité), du **vide** qui fait comme l'eau et des tapis roulants ;
- **Au hasard** : chaque nouvelle partie crée neuf nouveaux trous, avec du sable, de l'eau, des plots et des obstacles qui bougent, placés sans jamais couper le chemin.

Les trois parcours à thème sont toujours les mêmes, pour pouvoir battre ton record sur chacun. Le par (de 2 à 5) dépend de la longueur du trajet, avec un coup de plus s'il y a de l'eau ou plusieurs obstacles qui bougent.

## Les obstacles qui bougent

- **Le moulin** : ses quatre ailes tournent devant la porte ; la balle passe entre deux ailes, sinon elle rebondit.
- **Le pont-levis** : il se lève régulièrement ; une balle sur le pont ou qui arrive pendant qu'il est levé tombe à l'eau.
- **Le tapis roulant** : ses flèches avancent et poussent la balle, même arrêtée, jusqu'au bout du tapis.

## Points

Le haut de l'écran affiche le numéro du trou, son par et tes coups. Chaque trou fini donne son résultat : trou en un, albatros (−3), eagle (−2), birdie (−1), par, bogey (+1), double bogey (+2) ou plus. À la fin, ton total est comparé au par du parcours.

## Statistiques

Meilleur parcours (le moins de coups sur neuf trous, pour le parcours choisi), parcours finis, trous en un et total du parcours en cours.

## Plein écran

Le bouton **Plein écran** agrandit le parcours à tout l'écran (Échap pour en sortir). Hors plein écran, il prend toute la place que laisse la fenêtre, du petit portable au grand écran.

## Données et synchronisation

Tes statistiques et le parcours choisi sont enregistrés par NeoDex, sauvegardés et synchronisés entre tes PC si la synchro est activée.

## Installer

Dans NeoDex : **NeoStore → À découvrir → Minigolf → Installer**.

Développer un plugin : voir le [SDK NeoDex](https://github.com/NDesumeur/neodex-sdk).
