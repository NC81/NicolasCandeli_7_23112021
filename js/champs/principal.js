import { champsPrincipal, recettesFiltreesParChampsPrincipal, recherche } from '../recherche.js';
import { Affichage, affichage } from '../affichage.js';
import { Tableau } from '../donnees/tableaux.js';

export let rechercheParChampsPrincipal = () => {
  champsPrincipal.addEventListener('input', () => {
    recherche.filtreRecettesParChampsPrincipal(); /* Filtrage des recettes (affichage et création d'une liste de recettes) */
    Tableau.creeListesMotsCles(recettesFiltreesParChampsPrincipal); /* Création des listes d'ingrédients, appareils et ustenciles */
    Affichage.inscritMotsClesDansTroisFormulaires(); /* Affichage des mots clés dans les 3 formulaires */
    if (recettesFiltreesParChampsPrincipal.length === 0) {
      affichage.inscritMessage(); /* Affichage du message d'alerte après d'une recherche infructueuse */
    }
  });
}