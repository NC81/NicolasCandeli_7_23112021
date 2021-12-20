import { recipes } from './recettes.js';

// Listes
export let recettesNonFiltrees = []; /* Recettes tirées des données json */
export let ingredientsFiltres; /* Ingrédients compris dans les recettes triées */
export let appareilsFiltres; /* Appareils compris dans les recettes triées */
export let ustencilesFiltres; /* Ustenciles compris dans les recettes triées */
export let motsClesFiltres; /* Mots clés filtrés par le remplissage du champs secondaire */

// Classe comportant les méthodes générant des données sous forme de liste
export class Tableau {
  constructor(json) {
    this.json = json
  }
  // Crée une liste tirée des données json au chargement de la page
  creeListeRecettesNonFiltrees() {
    // Remplissage de la liste
    for (let recetteJson of this.json) {
      recettesNonFiltrees.push(recetteJson);
    }
    // Tri par noms de recette
    recettesNonFiltrees.sort((a, b) => a.name > b.name ? 1 : -1);
    // Ajout de propriétés simplifiant la recherche
    for (let recette of recettesNonFiltrees) {
      const listeIngredients = [];
      const listeUstenciles = [];
      const appareil = recette.appliance.toLowerCase().charAt(0).toUpperCase() + recette.appliance.toLowerCase().slice(1);
      const listeAppareils = appareil.split('  ');
      for (let portion of recette.ingredients) {
        const ingredient = portion.ingredient.toLowerCase().charAt(0).toUpperCase() + portion.ingredient.toLowerCase().slice(1);
        listeIngredients.push(ingredient);
      }
      for (let uste of recette.ustensils) {
        const ustencile = uste.toLowerCase().charAt(0).toUpperCase() + uste.toLowerCase().slice(1);
        listeUstenciles.push(ustencile);
      }
      recette.pureIngredients = listeIngredients; 
      recette.ustensils = listeUstenciles;
      recette.appliance = listeAppareils;
      /* Ajout d'une propriété contenant une chaîne de tous les mots ciblés par la recherche principale */
      recette.resume = `${recette.name} ${recette.pureIngredients} ${recette.appliance} ${recette.ustensils} ${recette.description}`;
    }
    console.log(recettesNonFiltrees);
  }

  // Ajoute les ingrédients, appareils et ustenciles compris dans les recettes filtrées dans des tableaux distincts
  static creeListesMotsCles(recettes) {
    ingredientsFiltres = [];
    appareilsFiltres = [];
    ustencilesFiltres = [];
    // Répartition des ingrédients, appareils et ustenciles dans leurs listes respectives pour chaque recette
    for (let recette of recettes) {
      this.creeListeObjets(recette, 'pureIngredients', ingredientsFiltres); /* Crée liste d'ingrédients */
      this.creeListeObjets(recette, 'appliance', appareilsFiltres); /* Crée liste d'appareils */
      this.creeListeObjets(recette, 'ustensils', ustencilesFiltres); /* Crée liste d'ustenciles */
    }
    // console.log(ingredientsFiltres);
  }

  // Crée liste d'objets (ingrédients, appareils, ustenciles) à partir d'une liste de recette
  static creeListeObjets(recette, type, tableau) {
    for (let element of recette[type]) {
      if (!tableau.includes(element)) {
        tableau.push(element);
      }
    }
    tableau.sort((a, b) => a.normalize("NFD").replace(/[\u0300-\u036f]/g, "") > b.normalize("NFD").replace(/[\u0300-\u036f]/g, "") ? 1 : -1);
  }

  // Réduit la liste de recettes préalablement filtrées par le champs principal (même vide)
  static reduitListeRecettesParMotCle(element, tableau, couleur, type) {
    if (element.couleur === couleur) {
      for (let i = tableau.length - 1; i >= 0; i--) {
        if (!tableau[i][type].includes(element.texte)) {
          tableau.splice(i, 1);
        }
      }
    }
  }

  // Crée la liste de mots clés à afficher
  static creeListeMotClesParChamps(evt, tableau) {
    motsClesFiltres = [];
    const entree = evt.target.value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
    for (let element of tableau) {
      if (element.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().includes(entree)) {
        motsClesFiltres.push(element);
      }
    }
    console.log('mots', motsClesFiltres);
  }
}
export const tableau = new Tableau(recipes);