import { Tableau, tableau, recettesNonFiltrees } from './donnees/tableaux.js';
import { Recherche } from './recherches.js';
import { ChampsPrincipal } from './champs/principal.js';
import { Affichage } from './affichage.js';
import { ChampsSecondaires, champsIngredients, champsAppareils, champsUstenciles } from './champs/secondaires.js';


///////////////////////////
// CHARGEMENT DE LA PAGE //
///////////////////////////
// Création de la liste initiale de recettes à filtrer
tableau.creeListeRecettesNonFiltrees();
// Filtrage des recettes à partir d'un champs vide
new Recherche(recettesNonFiltrees).filtreRecettesParChampsPrincipal();
// Affichage des mots-clés dans les formulaires
Tableau.creeListesMotsCles(recettesNonFiltrees); /* Création des listes de mots-clés */
Affichage.inscritMotsClesDansTroisFormulaires(); /* Inscription des mots-clés dans chaque formulaire */

////////////////
// ÉVÈVEMENTS //
////////////////
// Filtrage des recettes par le champs principal et inscription des mots-clés dans chaque formulaire
ChampsPrincipal.recherche();
// Ouverture et fermeture des formulaires
champsIngredients.ouvreFormulaire();
champsAppareils.ouvreFormulaire();
champsUstenciles.ouvreFormulaire();
// Ajout de mot-clé au cliquage des <li> dans les formulaires
champsIngredients.filtreRecettesParMotCle();
champsAppareils.filtreRecettesParMotCle();
champsUstenciles.filtreRecettesParMotCle();
// Suppresion de mots-clés au cliquage du (X) des boutons de mots-clés
ChampsSecondaires.supprimeMotCle();
// Filtrage de mots-clés par les champs secondaires
champsIngredients.filtreMotsCles();
champsAppareils.filtreMotsCles();
champsUstenciles.filtreMotsCles();