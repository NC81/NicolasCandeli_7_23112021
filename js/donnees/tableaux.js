import { recipes } from './recettes.js';
import { Utilitaire } from '../utilitaires.js';
import { MotsCles } from '../mots_cles.js';

// Listes
export let recettesNonFiltrees = []; /* Recettes tirées des données json */
export let ingredientsFiltres; /* Ingrédients compris dans les recettes triées */
export let appareilsFiltres; /* Appareils compris dans les recettes triées */
export let ustensilesFiltres; /* Ustenciles compris dans les recettes triées */
export let motsClesFiltres; /* Mots clés filtrés par le remplissage du champs secondaire */

// Classe comportant les méthodes générant des données sous forme de liste
export class Tableau {
  constructor(json = recipes) {
    this.json = json
  }
  
  // Crée une liste tirée des données JSON au chargement de la page
  creeListeRecettesNonFiltrees() {
    // Création de la liste
    for (let recetteJson of this.json) {
      recettesNonFiltrees.push(recetteJson);
    }

    // Tri par nom de recettes 
    Utilitaire.triParNoms(recettesNonFiltrees, 'name');
    
    // Modification des propriétés de chaque recette pour faciliter la recherche
    for (let recette of recettesNonFiltrees) {
      // Ajustemement de la taille des caractères de tous les éléments et création d'une liste d'appareils
      const listeIngredients = [];
      const listeUstenciles = [];
      const listeAppareils = Utilitaire.ajusteTaille(recette.appliance).split();
      for (let portion of recette.ingredients) {
        const ingredient = Utilitaire.ajusteTaille(portion.ingredient);
        listeIngredients.push(ingredient);
      }
      for (let uste of recette.ustensils) {
        const ustencile = Utilitaire.ajusteTaille(uste);
        listeUstenciles.push(ustencile);
      }

      // Ajout d'une propriété "aliments" et réaffectation des propriétés "ustensils" et "appliance"
      recette.aliments = listeIngredients;
      recette.ustensils = listeUstenciles;
      recette.appliance = listeAppareils;
    }
    // console.log(recettesNonFiltrees);
  }

  // Ajoute les ingrédients, appareils et ustensiles compris dans les recettes filtrées dans des tableaux distincts
  static creeListesMotsCles(recettes) {
    ingredientsFiltres = [];
    appareilsFiltres = [];
    ustensilesFiltres = [];

    // Répartition des ingrédients, appareils et ustensiles dans leurs listes respectives pour chaque recette
    for (let recette of recettes) {
      this.creeListeObjets(recette, 'aliments', 'rgb(50, 130, 247)', ingredientsFiltres); /* Crée liste d'ingrédients */
      this.creeListeObjets(recette, 'appliance', 'rgb(104, 217, 164)', appareilsFiltres); /* Crée liste d'appareils */
      this.creeListeObjets(recette, 'ustensils', 'rgb(237, 100, 84)', ustensilesFiltres); /* Crée liste d'ustensiles */
    }
    // console.log(ingredientsFiltres, appareilsFiltres, ustensilesFiltres);
  }

  // Crée liste d'objets (ingrédients, appareils, ustensiles) à partir d'une liste de recette
  static creeListeObjets(recette, type, couleur, tableau) {
    for (let elementRecette of recette[type]) {
      const nouveauMotCle = new MotsCles(elementRecette, couleur, type);

      // Si la liste d'objets ne contient pas le mot-clé ...
      if (!Utilitaire.harmonise(tableau.map(el => el.nom)).includes(Utilitaire.harmonise(elementRecette))) {
        tableau.push(nouveauMotCle.creeMotCle()); /* Ajoute le mot-clé dans le tableau dédié avec 3 propriétés (nom, couleur, type) */
      }
    }
    // Tri les listes d'ingrédients, d'appareils et d'ustensils par noms
    Utilitaire.triParNoms(tableau, 'nom');
  }

  // Réduit la liste de recettes préalablement filtrées par le champs principal (même vide)
  static reduitListeRecettesParMotCle(element, tableau, type) {
    for (let i = tableau.length - 1; i >= 0; i--) {
      if (!tableau[i][type].map(el => Utilitaire.harmonise(el)).includes(Utilitaire.harmonise(element.nom))) {
        tableau.splice(i, 1);
      }
    }
  }

  // Crée la liste de mots-clés à afficher
  static creeListeMotClesParChamps(evt, tableau) {
    motsClesFiltres = [];
    const entree = Utilitaire.harmonise(evt.target.value);
    for (let element of tableau) {
      if (Utilitaire.harmonise(element.nom).includes(entree)) {
        motsClesFiltres.push(element);
      }
    }
  }
}
export const tableau = new Tableau();