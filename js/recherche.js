import { Affichage, affichageParDefault, galerie } from './affichage.js';
import { Tableau, recettesNonFiltrees } from './donnees/tableaux.js';
import { Utilitaire } from './utilitaires.js';
import { motsClesChoisis } from './mots_cles.js';

// DOM
export const champsPrincipal = document.querySelector('#rech-princ');

// Tableaux
export let recettesFiltreesParChamps;
export let recettesFiltreesParMotsCles;

// Autre
export let filtrageInitialActive = true; /* Variable activant/désactivant le filtrage initial de recettes (lorsque la longueur du champs est inférieure à 3) */

// Classe de recherche classique
export class Recherche {
  // recettes = recettes;
  constructor(champs, recettes, conteneur) {
    this.champs = champs, /* Champs de saisie */
    this.recettes = recettes, /* Liste initiale de recettes non filtrées */
    this.conteneur = conteneur /* Conteneur de toutes les recettes affichées */
  }

  // Filtre les recettes correspondant à la valeur du champs (affiche les recettes et les copie dans la liste "recettesFiltreesParChamps")
  filtreRecettesParChampsPrincipal() { /* recettes = recettesNonFiltrées */
    const entree =  Utilitaire.harmonise(this.champs.value);
    // Si le champs est composé de moins de 3 caractères et que les recettes non filtrées n'ont pas déjà été affichées
    if ((entree.length < 3) && (filtrageInitialActive)) {
      recettesFiltreesParChamps = []; /* Initialisation/vidage de la liste des recettes filtrées par le champs principal */
      // Si la liste de mots-clés est vide ...
      if (motsClesChoisis.length === 0) {
        this.conteneur.innerHTML = ''; /* Vidage du conteneur de recettes */
        // Pour toutes les recettes non filtrées (liste initiale)
        for (let recette of this.recettes) {
          new Affichage(recette).inscritRecettes(recette); /* Affichage de la recette */
          recettesFiltreesParChamps.push(recette); /* Ajout de la recette dans la liste de recettes filtrées */
        }
      // Si la liste de mots-clés n'est pas vide ...
      } else {
        for (let recette of this.recettes) {
          recettesFiltreesParChamps.push(recette); /* Ajout de la recette dans la liste de recettes filtrées */
        }
        this.filtreRecettesParMotsCles(motsClesChoisis); /* Appel de la recherche par mots clés chargée d'afficher les recettes et de créer la liste 'recetteFiltreeParMotsCle' */
      }
      filtrageInitialActive = false; /* Désactivation du filtrage lorsque la longueur du champs est inférieure à 3 */
    // Si le champs est composé d'au moins 3 caractères ...
    } else if (entree.length >= 3) {
      recettesFiltreesParChamps = []; /* Initialisation/vidage de la liste des recettes filtrées par le champs principal */
      // Si la liste de mots-clés est vide ...
      if (motsClesChoisis.length === 0) {
        this.conteneur.innerHTML = ''; /* Vidage du conteneur de recettes */
        // Pour toutes les recettes non filtrées (liste initiale)
        for (let recette of this.recettes) {
          // Si une des propriétés contient la valeur du champs ...
          if ((this.filtre(entree, recette, 'name'))
            || (this.filtre(entree, recette, 'aliments'))
            || (this.filtre(entree, recette, 'ustensils'))
            || (this.filtre(entree, recette, 'appliance'))
            || (this.filtre(entree, recette, 'description'))) {
              new Affichage(recette).inscritRecettes(recette); /* Affichage de la recette */
              recettesFiltreesParChamps.push(recette); /* Ajout de la recette dans la liste de recettes filtrées */
          }
        }
        // Si la liste de recettes filtrées est vide ...
        if (recettesFiltreesParChamps.length === 0) {
          affichageParDefault.inscritMessage(); /* Affichage du message d'alerte */
        }
      // Si la liste de mots-clés n'est pas vide ...
      } else {
        for (let recette of this.recettes) {
          if ((this.filtre(entree, recette, 'name'))
            || (this.filtre(entree, recette, 'aliments'))
            || (this.filtre(entree, recette, 'ustensils'))
            || (this.filtre(entree, recette, 'appliance'))
            || (this.filtre(entree, recette, 'description'))) {
              recettesFiltreesParChamps.push(recette); /* Ajout de la recette dans la liste de recettes filtrées */
          }
        }
        this.filtreRecettesParMotsCles(motsClesChoisis); /* Appel de la recherche par mots clés chargée d'afficher les recettes et de créer la liste 'recetteFiltreeParMotsCle' */
      }
      filtrageInitialActive = true; /* Activation du filtrage lorsque la longueur du champs est inférieure à 3 */
    }
  }

  // Vérifie si l'entrée est contenue dans les propriétés de chaque recette, qu'elles soient des listes ou des chaînes de caractères
  filtre(champs, recette, propriete) {
    if (typeof recette[propriete] === 'object') {
      for (let element of recette[propriete]) {
        if (Utilitaire.harmonise(element).includes(champs)) {
          return true;
        }
      }
    }
    if ((typeof recette[propriete] === 'string') && (Utilitaire.harmonise(recette[propriete]).includes(champs))) {
      return true;
    }
  }

  // Filtre les recettes préalablement filtrées par la méthode 'filtreRecettesParChampsPrincipal' à partir d'une liste de mots-clés
  filtreRecettesParMotsCles(motsCles) {
    recettesFiltreesParMotsCles = []; /* Initialisation/vidage de la liste des recettes filtrées par mots clés */
    // Clonage de la liste 'recettesFiltreesParChamps'
    for (let recetteFiltree of recettesFiltreesParChamps) {
      recettesFiltreesParMotsCles.push(recetteFiltree);
    }
    // Réduction de la liste de recettes selon leur concordance avec les mots-clés  
    for (let motCle of motsCles) {
      Tableau.reduitListeRecettesParMotCle(motCle, recettesFiltreesParMotsCles, motCle.type);
    }
    this.conteneur.innerHTML = ''; /* Vidage du conteneur de recettes */
    // Affichage de chaque recette de la liste obtenue
    for (let recetteFiltreeParMotsCle of recettesFiltreesParMotsCles) {
      new Affichage(recetteFiltreeParMotsCle).inscritRecettes();
    }
    // Si la liste de recettes filtrées par mots clés est vide ...
    if (recettesFiltreesParMotsCles.length === 0) {
      affichageParDefault.inscritMessage(); /* Affichage du message d'alerte */
    }
  }
}
export const recherche = new Recherche(champsPrincipal, recettesNonFiltrees, galerie);