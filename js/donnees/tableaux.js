import { recipes } from './recettes.js';
import { Utilitaire } from '../utilitaires.js';
import { MotsCles } from '../mots_cles.js';

// Listes
export let recettesNonFiltrees = []; /* Recettes tirées des données json */
export let ingredientsFiltres; /* Ingrédients compris dans les recettes triées */
export let appareilsFiltres; /* Appareils compris dans les recettes triées */
export let ustencilesFiltres; /* Ustenciles compris dans les recettes triées */
export let motsClesFiltres; /* Mots clés filtrés par le remplissage du champs secondaire */

// Classe comportant les méthodes générant des données sous forme de liste
export class Tableau {
  constructor(json = recipes) {
    this.json = json
  }
  // Crée une liste tirée des données json au chargement de la page
  creeListeRecettesNonFiltrees() {
    // Remplissage de la liste
    recettesNonFiltrees = this.json
                         .slice(0) /* Copie de la liste json */
                         .sort((a, b) => a.name > b.name ? 1 : -1) /* Tri par noms de recettes */
    
    // Modification des propriétés de chaque recette pour faciliter la recherche
    recettesNonFiltrees.map(recette =>  {
      // Ajustemement des caractères de tous les éléments et création d'un tableau d'appareils
      recette.pureIngredients = recette.ingredients.map(portion => Utilitaire.ajusteTaille(portion.ingredient))
      recette.ustensils = recette.ustensils.map(ustensile => Utilitaire.ajusteTaille(ustensile))
      recette.appliance = Utilitaire.ajusteTaille(recette.appliance).split('  ');
        
      // Ajout d'une propriété contenant une chaîne de tous les mots ciblés par la recherche principale 
      const resume = `${recette.name} ${recette.pureIngredients} ${recette.appliance} ${recette.ustensils} ${recette.description}`;
      recette.resume = Utilitaire.harmonise(resume);
    })
    console.log('recettes non filtrées', recettesNonFiltrees);
  }

  // Ajoute les ingrédients, appareils et ustensiles compris dans les recettes filtrées dans des tableaux distincts
  static creeListesMotsCles(recettes) {
    ingredientsFiltres = [];
    appareilsFiltres = [];
    ustencilesFiltres = [];

    // Répartition des ingrédients, appareils et ustensiles dans leurs listes respectives pour chaque recette
    for (let recette of recettes) {
      this.creeListeObjets(recette, 'pureIngredients', 'rgb(50, 130, 247)', ingredientsFiltres); /* Crée liste d'ingrédients */
      this.creeListeObjets(recette, 'appliance', 'rgb(104, 217, 164)', appareilsFiltres); /* Crée liste d'appareils */
      this.creeListeObjets(recette, 'ustensils', 'rgb(237, 100, 84)', ustencilesFiltres); /* Crée liste d'ustensiles */
    }
    // console.log(ingredientsFiltres, appareilsFiltres, ustencilesFiltres);
  }

  // Crée liste d'objets (ingrédients, appareils, ustensiles) à partir d'une liste de recette
  static creeListeObjets(recette, type, couleur, tableau) {
    for (let elementRecette of recette[type]) {
    const nouveauMotCle = new MotsCles(elementRecette, couleur, type); 
    let trouve = false;
      for (let elementTableau of tableau) {
        if(Utilitaire.harmonise(elementRecette) === Utilitaire.harmonise(elementTableau.nom)) {
          trouve = true;
        }
      }
      if (!trouve) {
        tableau.push(nouveauMotCle.creeMotCle()); /* Ajoute le mot-clé dans le tableau dédié avec 3 propriétés (nom, couleur, type) */
      }
    }
    tableau.sort((a, b) => Utilitaire.harmonise(a.nom) > Utilitaire.harmonise(b.nom) ? 1 : -1);
  }
  
  // static creeListeObjets(recette, type, tableau) {
  //   for (let element of recette[type]) {
  //     if (!tableau.includes(element)) {
  //       tableau.push(element);
  //     }
  //   }
  //   tableau.sort((a, b) => Utilitaire.harmonise(a) > Utilitaire.harmonise(b) ? 1 : -1);
  // }

  // Réduit la liste de recettes préalablement filtrées par le champs principal (même vide)
  static reduitListeRecettesParMotCle(element, tableau, type) {
    for (let i = tableau.length - 1; i >= 0; i--) {
        if (!tableau[i][type].map(el => Utilitaire.harmonise(el)).includes(Utilitaire.harmonise(element.nom))) {
        tableau.splice(i, 1);
      }
    }
  }

  // // Réduit la liste de recettes préalablement filtrées par le champs principal (même vide)
  // static reduitListeRecettesParMotCle(element, tableau, couleur, type) {
  //   if (element.couleur === couleur) {
  //     for (let i = tableau.length - 1; i >= 0; i--) {
  //       if (!tableau[i][type].includes(element.texte)) {
  //         tableau.splice(i, 1);
  //       }
  //     }
  //   }
  // }

  // Crée la liste de mots-clés à afficher
  static creeListeMotClesParChamps(evt, tableau) {
    console.log('tableau mots', tableau);
    motsClesFiltres = [];
    const entree = Utilitaire.harmonise(evt.target.value);
    for (let element of tableau) {
      if (Utilitaire.harmonise(element.nom).includes(entree)) {
        motsClesFiltres.push(element);
      }
    }
    console.log('mots', motsClesFiltres);
  }
}
export const tableau = new Tableau();