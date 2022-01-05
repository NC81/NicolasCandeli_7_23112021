import { affichage, galerie } from './affichage.js';
import { Tableau } from './donnees/tableaux.js';
import { Utilitaire } from './utilitaires.js';
import { motsClesChoisis } from './mots_cles.js';

// DOM
export const champsPrincipal = document.querySelector('#rech-princ');

// Tableaux
export let recettesFiltreesParChampsPrincipal;
export let recettesFiltreesParMotsCles;
let recettesNonFiltreesAffichees = false; /* Variable contrôlant l'affichage des recettes non filtrées */

// Classe de recherche classique
export class Recherche {
  // recettes = recettesNonFiltrees;
  constructor(champs, conteneur) {
    this.champs = champs, /* Champs de saisie */
    this.conteneur = conteneur /* Conteneur de toutes les recettes affichées */
  }

  // Filtre les recettes correspondant à la valeur du champs (affiche les recettes et les copie dans "recettesFiltreesParChampsPrincipal")
  filtreRecettesParChampsPrincipal(recettes) {
    const entree =  Utilitaire.harmonise(this.champs.value);
    
    // Si le champs est composé de moins de 3 caractères et que les recettes non filtrées n'ont pas déjà été affichées
    if ((entree.length < 3) && (!recettesNonFiltreesAffichees)) {
      recettesNonFiltreesAffichees = true;
      // Si la liste de mots-clés est vide ...
      if (motsClesChoisis.length === 0) {
        this.conteneur.innerHTML = '';
        recettesFiltreesParChampsPrincipal = recettes.filter(recette => this.constructor.filtre(recette, entree));
      // Si la liste de mots-clés n'est pas vide ...
      } else {
      // recettesFiltreesParChampsPrincipal = recettes.filter(recette => recette.resume.includes(entree));
      recettesFiltreesParChampsPrincipal = recettes.slice(0);
      this.filtreRecettesParMotsCles(motsClesChoisis);
      }
    // Si le champs est composé d'au moins 3 caractères ...
    } else if (entree.length >= 3) {
      recettesNonFiltreesAffichees = false;
      // Si la liste de mots-clés est vide ...
      if (motsClesChoisis.length === 0) {
        this.conteneur.innerHTML = '';
        recettesFiltreesParChampsPrincipal = recettes.filter(recette => this.constructor.filtre(recette, entree));
      // Si la liste de mots-clés n'est pas vide ...
      } else {
      recettesFiltreesParChampsPrincipal = recettes.filter(recette => recette.resume.includes(entree));
      this.filtreRecettesParMotsCles(motsClesChoisis);
      }
    }
  // console.log(recettesNonFiltreesAffichees);
  }
  
  // Affiche les recettes correspondant à la recherche puis renvoie un booléen (pour la méthode filter)
  static filtre(element, chaine) {
    // console.log('filtrage');
    if (element.resume.includes(chaine)) {
      affichage.inscritRecettes(element);
      return true;
    } else {
      return false;
    }
  }

  // Filtre les recettes filtrées par le champs principal (même vide) à partir d'une liste de mots-clés
  filtreRecettesParMotsCles(motsCles) {
    // console.log('mots-clés', motsCles);
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