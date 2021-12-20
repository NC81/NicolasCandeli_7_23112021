import { Tableau, tableau } from './donnees/tableaux.js';
import { recherche, recettesFiltreesParChampsPrincipal } from './recherche.js';
import { rechercheParChampsPrincipal } from './champs/principal.js';
import { Affichage } from './affichage.js';
import { ChampsSecondaires, champsIngredients, champsAppareils, champsUstenciles } from './champs/secondaires.js';

// Création de la liste initiale de recettes à filtrer
tableau.creeListeRecettesNonFiltrees();

// CHAMPS PRINCIPAL
// Filtrage des recettes au chargement de la page
recherche.filtreRecettesParChampsPrincipal();
// Évènement de filtrage de recettes par le champs principal
rechercheParChampsPrincipal(); 

// CHAMPS SECONDAIRES
// Affichage des mots clés au chargement de la page
Tableau.creeListesMotsCles(recettesFiltreesParChampsPrincipal); /* Création des listes de mots clés */
Affichage.inscritMotsClesDansTroisFormulaires(); /* Inscription des mots clés dans chaque formulaire */
// Évènements d'ouverture et fermeture des formulaires
champsIngredients.ouvreFormulaire();
champsAppareils.ouvreFormulaire();
champsUstenciles.ouvreFormulaire();
// Évènements d'ajout de mot clé au cliquage des <li> dans les formulaires
champsIngredients.filtreRecettesParMotCle();
champsAppareils.filtreRecettesParMotCle();
champsUstenciles.filtreRecettesParMotCle();
// Évènement de suppresion de mots clés au cliquage des boutons de mots clés (X)
ChampsSecondaires.supprimeMotCle();
// Évènements de filtrage de mots clés par les champs secondaires
champsIngredients.filtreMotsCles();
champsAppareils.filtreMotsCles();
champsUstenciles.filtreMotsCles();