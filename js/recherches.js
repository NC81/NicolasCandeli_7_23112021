import { Affichage, galerie } from './affichage.js';
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
  // recettes = recettesNonFiltrees;
  constructor(recettes) {
    this.recettes = recettes /* Liste initiale de recettes non filtrées */
  }

  // Filtre les recettes correspondant à la valeur du champs (affiche les recettes et les copie dans "recettesFiltreesParChamps")
  filtreRecettesParChampsPrincipal() {
    const entree =  Utilitaire.harmonise(champsPrincipal.value);

    // Si le champs est composé de moins de 3 caractères et que les recettes non filtrées n'ont pas déjà été affichées
    if ((entree.length < 3) && (filtrageInitialActive)) {
      // Si la liste de mots-clés est vide ...
      if (motsClesChoisis.length === 0) {
        galerie.innerHTML = '';
        this.recettes.forEach(recette => new Affichage(recette).inscritRecettes()); /* Affichage de la recette */
        recettesFiltreesParChamps = this.recettes.slice(0);
      // Si la liste de mots-clés n'est pas vide ...
      } else {
      // recettesFiltreesParChamps = recettes.filter(recette => recette.resume.includes(entree));
      recettesFiltreesParChamps = this.recettes.slice(0);
      this.filtreRecettesParMotsCles(motsClesChoisis);
      }
      filtrageInitialActive = false;
    // Si le champs est composé d'au moins 3 caractères ...
    } else if (entree.length >= 3) {
      // Si la liste de mots-clés est vide ...
      if (motsClesChoisis.length === 0) {
        galerie.innerHTML = ''; /* Vidage du conteneur de recettes */
        recettesFiltreesParChamps = this.recettes.filter(recette => new Affichage(recette).filtre(entree));
          // Si la recherche est infructueuse ...
      if (recettesFiltreesParChamps.length === 0) {
        Affichage.inscritMessage(); /* Affichage du message d'alerte */
      }
      // Si la liste de mots-clés n'est pas vide ...
      } else {
      recettesFiltreesParChamps = this.recettes.filter(recette => recette.resume.includes(entree));
      this.filtreRecettesParMotsCles(motsClesChoisis);
      }
      filtrageInitialActive = true;
    }
  }


  // Filtre les recettes filtrées par le champs principal (même vide) à partir d'une liste de mots-clés
  filtreRecettesParMotsCles(motsCles) {
    // Création d'une liste de recettes à afficher à partir de la liste de recettes filtrées par le champs principal (même vide)
    recettesFiltreesParMotsCles = recettesFiltreesParChamps.slice(0);
    
    // Réduction de la liste de recettes selon leur concordance avec les mots-clés  
    motsCles.forEach(motCle => Tableau.reduitListeRecettesParMotCle(motCle, recettesFiltreesParMotsCles, motCle.type));
  
    galerie.innerHTML = ''; /* Vidage du conteneur de recettes */
    
    // Affichage de chaque recette de la liste obtenue
    recettesFiltreesParMotsCles.forEach(recetteFiltreeParMotCle => new Affichage(recetteFiltreeParMotCle).inscritRecettes());
    
    // Affichage du message d'alerte
    if (recettesFiltreesParMotsCles.length === 0) {
      Affichage.inscritMessage(); /* Affichage du message d'alerte */
    }
    // console.log('recettes filtrées par mots-clés', recettesFiltreesParMotsCles.length);
  }
}
export const recherche = new Recherche(recettesNonFiltrees);