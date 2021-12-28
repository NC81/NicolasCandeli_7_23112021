import { champsPrincipal, recettesFiltreesParChampsPrincipal, recettesFiltreesParMotsCles, recherche } from '../recherche.js';
import { Affichage, affichage } from '../affichage.js';
import { Tableau } from '../donnees/tableaux.js';
import { motsClesChoisis } from '../mots_cles.js';

// Champs principal de recherche
export class ChampsPrincipal {
  // Filtre les recettes et les mots-clés par le champs principal
  static recherche(liste) {
    champsPrincipal.addEventListener('input', () => { /* Lors d'une modification du champs ... */
      recherche.filtreRecettesParChampsPrincipal(liste); /* Filtrage des recettes (création d'une liste de recettes et affichage */
      // Si la recherche est infructueuse ...
      if (recettesFiltreesParChampsPrincipal.length === 0) {
        affichage.inscritMessage(); /* Affichage du message d'alerte */
      // Sinon ...
      } else {
        Tableau.creeListesMotsCles(this.choisitListe(motsClesChoisis)); /* Création des listes d'ingrédients, d'appareils et d'ustenciles */
        Affichage.inscritMotsClesDansTroisFormulaires(); /* Affichage des mots-clés dans les 3 formulaires */
      }
    });
  }

  // Choisit la liste de recettes permettant de remplir les 3 formulaires de mots-clés
  static choisitListe(liste) {
    // Si aucun mot-clé n'a préalablement été sélectionné ...
    if (liste.length === 0) {
      return recettesFiltreesParChampsPrincipal; /* Retourne la liste de recettes seulement filtrées par le champs principal */
    // Si des mots-clés ont préalablement été sélectionnés ...
    } else if (liste.length > 0) {
      return recettesFiltreesParMotsCles; /* Retourne la liste de recettes filtrées par les mots-clés (après avoir été filtrées par le champs principal) */
    }
  };
}