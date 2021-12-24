import { champsPrincipal, recettesFiltreesParChampsPrincipal, recherche } from '../recherche.js';
import { Affichage, affichage } from '../affichage.js';
import { Tableau, recettesNonFiltrees } from '../donnees/tableaux.js';

// Filtre les recettes et les mots clés par le champs principal
export let rechercheParChampsPrincipal = () => {
  champsPrincipal.addEventListener('input', () => { /* Lors d'une modification du champs ... */
    recherche.filtreRecettesParChampsPrincipal(recettesNonFiltrees); /* Filtrage des recettes (affichage et création d'une liste de recettes) */
    Tableau.creeListesMotsCles(recettesFiltreesParChampsPrincipal); /* Création des listes d'ingrédients, s'appareils et d'ustenciles */
    Affichage.inscritMotsClesDansTroisFormulaires(); /* Affichage des mots clés dans les 3 formulaires */
    if (recettesFiltreesParChampsPrincipal.length === 0) { /* Après une recherche infructueuse ... */
      affichage.inscritMessage(); /* Affichage du message d'alerte */
    }
  });
}