# Minigolf

Un parcours de minigolf de neuf trous, avec du sable, de l'eau, des obstacles et des bordures sur lesquelles la balle rebondit. Tire en arrière pour viser et doser, lâche pour frapper, et finis le parcours en le moins de coups possible.

*English version: [README.en.md](README.en.md)*

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

Avec l'option **Parcours au hasard**, chaque nouvelle partie crée neuf nouveaux trous : une allée qui serpente, puis du sable, de l'eau ou un obstacle placés sans jamais couper le chemin. Le par (de 2 à 5) dépend de la longueur du trajet, avec un coup de plus s'il y a de l'eau.

## Points

Le haut de l'écran affiche le numéro du trou, son par et tes coups. Chaque trou fini donne son résultat : trou en un, albatros (−3), eagle (−2), birdie (−1), par, bogey (+1), double bogey (+2) ou plus. À la fin, ton total est comparé au par du parcours.

## Statistiques

Meilleur parcours (le moins de coups sur neuf trous), parcours finis, trous en un et total du parcours en cours.

## Données et synchronisation

Tes statistiques et le choix du parcours au hasard sont enregistrés par NeoDex, sauvegardés et synchronisés entre tes PC si la synchro est activée.

## Installer

Dans NeoDex : **NeoStore → À découvrir → Minigolf → Installer**.

Développer un plugin : voir le [SDK NeoDex](https://github.com/NDesumeur/neodex-sdk).
