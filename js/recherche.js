import { affichage, galerie } from './affichage.js';
import { Tableau } from './donnees/tableaux.js';
import { Utilitaire } from './utilitaires.js';

// DOM
export const champsPrincipal = document.querySelector('#rech-princ');

// Tableaux
export let recettesFiltreesParChampsPrincipal;
export let recettesFiltreesParMotsCles;

// Classe de recherche classique
export class Recherche {
  // recettes = recettesNonFiltrees;
  constructor(champs, conteneur) {
    this.champs = champs, /* Champs de saisie */
    this.conteneur = conteneur /* Conteneur de toutes les recettes affichées */
  }

  // Filtre les recettes correspondant à la valeur du champs (affiche les recettes et les copie dans "recettesFiltreesParChampsPrincipal")
  filtreRecettesParChampsPrincipal(recettes) {
    const entree =  Utilitaire.remplaceDiacritiques(this.champs.value);
    this.conteneur.innerHTML = '';
    // Si le champs est composé d'au moins 3 caractères...
    if (entree.length >= 3) {
      // Lancement de la recherche se concluant par l'affichage des recettes et le remplissage de la liste de recettes filtrées
      recettesFiltreesParChampsPrincipal = recettes.filter(recette => this.constructor.filtre(recette, entree));
    // Si le champs est composé de moins de 3 caractères...
    } else {
      // // Affichage de toutes les recettes et création d'une nouvelle liste
      recettesFiltreesParChampsPrincipal = recettes.filter(recette => this.constructor.filtre(recette, ''));
    }
    // console.log('recettes filtrées', recettesFiltreesParChampsPrincipal);
  }
  
  // Affiche les recettes correspondant à la recherche puis renvoie un booléen (callback de la méthode filter)
  static filtre(element, chaine) {
    if (element.resume.includes(chaine)) {
      affichage.inscritRecettes(element);
      return true;
    } else {
      return false;
    }
  }

  // Filtre les recettes filtrées par le champs principal (même vide) à partir d'une liste de mots clés
  filtreRecettesParMotsCles(motsCles) {
    recettesFiltreesParMotsCles = [];
    // Création d'une liste de recettes à afficher à partir de la liste de recettes filtrées par le champs principal (même vide)
    for (let recetteFiltree of recettesFiltreesParChampsPrincipal) {
      recettesFiltreesParMotsCles.push(recetteFiltree);
    }
    // Réduction de la liste de recettes selon leur concordance avec les mots clés
    // console.log('mots clés', motsCles);
    for (let motCle of motsCles) {
      Tableau.reduitListeRecettesParMotCle(motCle, recettesFiltreesParMotsCles, 'rgb(50, 130, 247)', 'pureIngredients');
      Tableau.reduitListeRecettesParMotCle(motCle, recettesFiltreesParMotsCles, 'rgb(104, 217, 164)', 'appliance');
      Tableau.reduitListeRecettesParMotCle(motCle, recettesFiltreesParMotsCles, 'rgb(237, 100, 84)', 'ustensils');
    }
    this.conteneur.innerHTML = '';
    // Affichage de chaque recette de la liste obtenue
    for (let recetteFiltreeParMotCle of recettesFiltreesParMotsCles) {
      affichage.inscritRecettes(recetteFiltreeParMotCle);
    }
  }
}
export const recherche = new Recherche(champsPrincipal, galerie);