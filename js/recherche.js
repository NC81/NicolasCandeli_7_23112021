import { affichage, galerie } from './affichage.js';
import { Tableau } from './donnees/tableaux.js';
import { Utilitaire } from './utilitaires.js';
import { motsClesChoisis } from './mots_cles.js';

// DOM
export const champsPrincipal = document.querySelector('#rech-princ');

// Tableaux
export let recettesFiltreesParChampsPrincipal;
export let recettesFiltreesParMotsCles;

// Autre
let recettesNonFiltreesAffichees = false; /* Variable contrôlant l'affichage des recettes non filtrées */

// Classe de recherche classique
export class Recherche {
  // recettes = recettes;
  constructor(champs, conteneur) {
    this.champs = champs, /* Champs de saisie */
    this.conteneur = conteneur /* Conteneur de toutes les recettes affichées */
  }

  // Filtre les recettes correspondant à la valeur du champs (affiche les recettes et les copie dans "recettesFiltreesParChampsPrincipal")
  filtreRecettesParChampsPrincipal(recettes) {
    const entree =  Utilitaire.harmonise(this.champs.value);
  
    // // Si le champs est composé d'au moins 3 caractères et qu'aucun mot-clé n'a été sélectionné ...
    // if ((entree.length >= 3) && (motsClesChoisis.length === 0)) {
    //   for (let recette of recettes) {
    //     if ((this.verifieChaine(entree, recette, 'name'))
    //       || (this.verifieListe(entree, recette, 'pureIngredients'))
    //       || (this.verifieListe(entree, recette, 'ustensils'))
    //       || (this.verifieListe(entree, recette, 'appliance'))
    //       || (this.verifieChaine(entree, recette, 'description'))) {
    //       affichage.inscritRecettes(recette);
    //       recettesFiltreesParChampsPrincipal.push(recette);
    //     }
    //   }
    // }
    // // Si le champs est composé de moins de 3 caractères et qu'aucun mot-clé n'a été sélectionné ...
    // else if ((entree.length < 3) && (motsClesChoisis.length === 0)) {
    //   for (let recette of recettes) {
    //     affichage.inscritRecettes(recette);
    //     recettesFiltreesParChampsPrincipal.push(recette);
    //   }
    // }
    // // Si le champs est composé d'au moins 3 caractères et qu'un mot-clé a déjà été sélectionné ...
    // else if ((entree.length >= 3) && (motsClesChoisis.length > 0)) {
    //   for (let recette of recettes) {
    //     if ((this.verifieChaine(entree, recette, 'name'))
    //       || (this.verifieListe(entree, recette, 'pureIngredients'))
    //       || (this.verifieListe(entree, recette, 'ustensils'))
    //       || (this.verifieListe(entree, recette, 'appliance'))
    //       || (this.verifieChaine(entree, recette, 'description'))) {
    //       recettesFiltreesParChampsPrincipal.push(recette);
    //     }
    //   }
    //   this.filtreRecettesParMotsCles(motsClesChoisis);
    // }
    // Si le champs est composé de moins de 3 caractères et qu'un mot-clé a déjà été sélectionné ...
    // else if ((entree.length < 3) && (motsClesChoisis.length > 0)) {
    //   for (let recette of recettes) {
    //     recettesFiltreesParChampsPrincipal.push(recette);
    //   }
    //   this.filtreRecettesParMotsCles(motsClesChoisis);
    // }

    // Si le champs est composé de moins de 3 caractères et que les recettes non filtrées n'ont pas déjà été affichées
    if ((entree.length < 3) && (!recettesNonFiltreesAffichees)) {
      recettesFiltreesParChampsPrincipal = [];
      recettesNonFiltreesAffichees = true;
      // Si la liste de mots-clés est vide ...
      if (motsClesChoisis.length === 0) {
        this.conteneur.innerHTML = '';
        for (let recette of recettes) {
          affichage.inscritRecettes(recette);
          recettesFiltreesParChampsPrincipal.push(recette);
        }
      // Si la liste de mots-clés n'est pas vide ...
      } else {
        for (let recette of recettes) {
          recettesFiltreesParChampsPrincipal.push(recette);
        }
        this.filtreRecettesParMotsCles(motsClesChoisis);
      }
    // Si le champs est composé d'au moins 3 caractères ...
    } else {
      recettesFiltreesParChampsPrincipal = [];
      recettesNonFiltreesAffichees = false;
      // Si la liste de mots-clés est vide ...
      if (motsClesChoisis.length === 0) {
        this.conteneur.innerHTML = '';
        for (let recette of recettes) {
          if ((this.verifieChaine(entree, recette, 'name'))
            || (this.verifieListe(entree, recette, 'pureIngredients'))
            || (this.verifieListe(entree, recette, 'ustensils'))
            || (this.verifieListe(entree, recette, 'appliance'))
            || (this.verifieChaine(entree, recette, 'description'))) {
            affichage.inscritRecettes(recette);
            recettesFiltreesParChampsPrincipal.push(recette);
          }
        }
      // Si la liste de mots-clés n'est pas vide ...
      } else {
        for (let recette of recettes) {
          if ((this.verifieChaine(entree, recette, 'name'))
            || (this.verifieListe(entree, recette, 'pureIngredients'))
            || (this.verifieListe(entree, recette, 'ustensils'))
            || (this.verifieListe(entree, recette, 'appliance'))
            || (this.verifieChaine(entree, recette, 'description'))) {
            recettesFiltreesParChampsPrincipal.push(recette);
          }
        }
        this.filtreRecettesParMotsCles(motsClesChoisis);
      }
    }
    console.log(recettesFiltreesParChampsPrincipal.length);
  }

  // Vérifie les listes de chaque recette (propriétés 'pureIngredients', 'ustensils' et 'appliance')
  verifieListe(champs, recette, propriete) {
    for (let element of recette[propriete]) {
      if (Utilitaire.harmonise(element).includes(champs)) {
        return true;
      }
    }
  }

  // Vérifie les chaînes de chaque recette (propriétés 'name' et 'description')
  verifieChaine(champs, recette, propriete) {
    if (Utilitaire.harmonise(recette[propriete]).includes(champs)) {
      return true;
    }
  }

  // Filtre les recettes filtrées par le champs principal (même vide) à partir d'une liste de mots-clés
  filtreRecettesParMotsCles(motsCles) {
    console.log('mots-clés', motsCles);
    recettesFiltreesParMotsCles = [];
    // Création d'une liste de recettes à afficher à partir de la liste de recettes filtrées par le champs principal (même vide)
    for (let recetteFiltree of recettesFiltreesParChampsPrincipal) {
      recettesFiltreesParMotsCles.push(recetteFiltree);
    }
    // Réduction de la liste de recettes selon leur concordance avec les mots-clés  
    for (let motCle of motsCles) {
      Tableau.reduitListeRecettesParMotCle(motCle, recettesFiltreesParMotsCles, motCle.type);
    }
    this.conteneur.innerHTML = '';
    // Affichage de chaque recette de la liste obtenue
    for (let recetteFiltreeParMotCle of recettesFiltreesParMotsCles) {
      affichage.inscritRecettes(recetteFiltreeParMotCle);
    }
    console.log('recettes filtrées par mots-clés', recettesFiltreesParMotsCles.length);
  }
}
export const recherche = new Recherche(champsPrincipal, galerie);