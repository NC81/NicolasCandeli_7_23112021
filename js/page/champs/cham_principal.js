import { motsClesChoisis } from '../affichage/affi_bouton.js';
import { ChampsAvance } from './cham_avances.js';
import { recettesFiltreesParMotsCles } from '../../recherche/rech_mots.js';
import { filtreRecettesParChamps, recettesFiltreesParChamps } from '../../recherche/rech_champs.js';

export const champsPrincipal = document.querySelector('#rech-princ'); /* Champs principal (DOM) */

// Champs principal de recherche
export class ChampsPrincipal {
  // Filtre les recettes par le champs principal puis affiche les mots-clés
  static active() {
    champsPrincipal.addEventListener('input', () => { /* Lors d'une modification du champs ... */
      filtreRecettesParChamps(); /* Filtrage des recettes (création d'une liste et affichage des recettes) */
      ChampsAvance.creeListesMotsCles(this.choisitListe(motsClesChoisis)); /* Création des listes d'ingrédients, d'appareils et d'ustensiles */
      ChampsAvance.inscritMotsClesDansTousLesFormulaires(); /* Affichage des mots-clés dans les 3 formulaires */
    });
  }

  // Choisit la liste de recettes permettant de remplir les 3 formulaires de mots-clés
  static choisitListe(liste) {
    // Si aucun mot-clé n'a préalablement été sélectionné ...
    if (liste.length === 0) {
      return recettesFiltreesParChamps; /* Retourne la liste de recettes filtrées par le champs principal */
    // Si des mots-clés ont préalablement été sélectionnés ...
    } else {
      return recettesFiltreesParMotsCles; /* Retourne la liste de recettes filtrées par mots-clés */
    }
  };
}
