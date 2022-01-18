import { champsPrincipal, recettesFiltreesParChamps, recettesFiltreesParMotsCles, recherche } from '../recherche.js';
import { Affichage } from '../affichage.js';
import { Tableau } from '../donnees/tableaux.js';
import { motsClesChoisis } from '../mots_cles.js';

// Champs principal de recherche
export class ChampsPrincipal {
  // Filtre les recettes et les mots-clés par le champs principal
  static recherche() {
    champsPrincipal.addEventListener('input', () => { /* Lors d'une modification du champs ... */
      recherche.filtreRecettesParChampsPrincipal(); /* Filtrage des recettes (création d'une liste et affichage des recettes) */
      Tableau.creeListesMotsCles(this.choisitListe(motsClesChoisis)); /* Création des listes d'ingrédients, d'appareils et d'ustensiles */
      Affichage.inscritMotsClesDansTroisFormulaires(); /* Affichage des mots-clés dans les 3 formulaires */
    });
  }

  // Choisit la liste de recettes permettant de remplir les 3 formulaires de mots-clés
  static choisitListe(liste) {
    // Si aucun mot-clé n'a préalablement été sélectionné ...
    if (liste.length === 0) {
      return recettesFiltreesParChamps; /* Retourne la liste de recettes filtrées par le champs principal */
    // Si des mots-clés ont préalablement été sélectionnés ...
    } else if (liste.length > 0) {
      return recettesFiltreesParMotsCles; /* Retourne la liste de recettes filtrées par mots-clés */
    }
  };
}