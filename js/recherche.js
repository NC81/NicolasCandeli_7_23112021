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
      // Si la liste de mots-clés est vide ...
      if (motsClesChoisis.length === 0) {
        this.conteneur.innerHTML = '';
        recettes.forEach(recette => affichage.inscritRecettes(recette));        
        recettesFiltreesParChampsPrincipal = recettes.slice(0);
      // Si la liste de mots-clés n'est pas vide ...
      } else {
      // recettesFiltreesParChampsPrincipal = recettes.filter(recette => recette.resume.includes(entree));
      recettesFiltreesParChampsPrincipal = recettes.slice(0);
      this.filtreRecettesParMotsCles(motsClesChoisis);
      }
      recettesNonFiltreesAffichees = true;
    // Si le champs est composé d'au moins 3 caractères ...
    } else if (entree.length >= 3) {
      // Si la liste de mots-clés est vide ...
      if (motsClesChoisis.length === 0) {
        this.conteneur.innerHTML = ''; /* Vidage du conteneur de recettes */
        recettesFiltreesParChampsPrincipal = recettes.filter(recette => this.constructor.filtre(recette, entree));
      // Si la recherche est infructueuse ...
      if (recettesFiltreesParChampsPrincipal.length === 0) {
        affichage.inscritMessage(); /* Affichage du message d'alerte */
      }
      // Si la liste de mots-clés n'est pas vide ...
      } else {
      recettesFiltreesParChampsPrincipal = recettes.filter(recette => recette.resume.includes(entree));
      this.filtreRecettesParMotsCles(motsClesChoisis);
      }
      recettesNonFiltreesAffichees = false;
    }
  // console.log(recettesNonFiltreesAffichees);
  }
  
  // Affiche les recettes correspondant à la recherche puis renvoie un booléen (pour la méthode filter)
  static filtre(element, chaine) {
    // Pour chaque recette, si la valeur du champs est contenue dans la propriété "resume"...
    if (element.resume.includes(chaine)) {
      affichage.inscritRecettes(element); /* Affichage de la recette */
      return true; /* Ajout de la recette dans la liste "recettesFiltreesParChampsPrincipal" */
    } else {
      return false;
    }
  }

  // Filtre les recettes filtrées par le champs principal (même vide) à partir d'une liste de mots-clés
  filtreRecettesParMotsCles(motsCles) {
    // Création d'une liste de recettes à afficher à partir de la liste de recettes filtrées par le champs principal (même vide)
    recettesFiltreesParMotsCles = recettesFiltreesParChampsPrincipal.slice(0);
    
    // Réduction de la liste de recettes selon leur concordance avec les mots-clés  
    motsCles.forEach(motCle => Tableau.reduitListeRecettesParMotCle(motCle, recettesFiltreesParMotsCles, motCle.type));
  
    this.conteneur.innerHTML = ''; /* Vidage du conteneur de recettes */
    
    // Affichage de chaque recette de la liste obtenue
    recettesFiltreesParMotsCles.forEach(recetteFiltreeParMotCle => affichage.inscritRecettes(recetteFiltreeParMotCle));
    
    // Affichage du message d'alerte
    if (recettesFiltreesParMotsCles.length === 0) {
      affichage.inscritMessage();
    }
    // console.log('recettes filtrées par mots-clés', recettesFiltreesParMotsCles.length);
  }
}
export const recherche = new Recherche(champsPrincipal, galerie);