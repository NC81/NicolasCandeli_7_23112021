// Json
import { recipes } from './recettes.js';

// DOM
const galerie = document.querySelector('.galerie');
export const barrePrincipale = document.querySelector('#rech-princ');

// Tableaux
export let recettesFiltrees;
export let ingredientsFiltres;
export let appareilsFiltres;
export let ustencilesFiltres;

// Classe de recherche classique
class RechercheClassique {
  constructor(champs, json, recettes, ingredients, appareils, ustenciles, conteneur) {
    this.champs = champs,
    this.json = json, /* Tableau json comportant toutes les recettes */
    this.recettes = recettes, /* Recette triées à partir du champs */
    this.ingredients = ingredients, /* Ingrédients compris dans les recettes triées */
    this.appareils = appareils, /* Appareils compris dans les recettes triées */
    this.ustenciles = ustenciles, /* Ustenciles compris dans les recettes triées */
    this.conteneur = conteneur /* Conteneur de toutes les recettes affichées */
  }

  // Filtre les recettes correspondant au champs en les plaçant dans le tableau "recettesFiltrees"
  filtreLesRecettes() {
    this.recettes = [];
    const entree = this.champs.value.toLowerCase();
    // Si le champs est composé de 3 caractères au moins
    if (entree.length >= 3) { 
      for (let recetteJson of this.json) {
        // Vérification de la correspondance du champs avec le nom...
        if ((recetteJson.name.toLowerCase().includes(entree)) && (!this.recettes.includes(recetteJson))) {
          this.recettes.push(recetteJson);
          // ... sinon avec la description
        } else if ((recetteJson.description.toLowerCase().includes(entree)) && (!this.recettes.includes(recetteJson))) {
          this.recettes.push(recetteJson);
          // ... sinon avec les ingrédients
        } else {
          for (let element of recetteJson.ingredients) {
            if ((element.ingredient.toLowerCase().includes(entree)) && (!this.recettes.includes(recetteJson))) {
              this.recettes.push(recetteJson);
            }
          }
        }
      }
    // Si le champs est composé de moins de 3 caractères
    } else {
      for (let recetteJson of this.json) {
        this.recettes.push(recetteJson);
      }
    }
  }

  // Filtre les ingrédients, appareils et ustenciles compris dans les recettes filtrées
  filtreLesMotsCles() {
    this.ingredients = [];
    this.appareils = [];
    this.ustenciles = [];

    for (let recette of this.recettes) {
      //  Remplissage du tableau d'ingredients
      for (let element of recette.ingredients) {
        if (!this.ingredients.includes(element.ingredient)) {
          this.ingredients.push(element.ingredient);
        }
      }
      //  Remplissage du tableau d'appareils
      if (!this.appareils.includes(recette.appliance)) {
        this.appareils.push(recette.appliance);
      }
      //  Remplissage du tableau d'ustenciles
      for (let element of recette.ustensils) {
        if(!this.ustenciles.includes(element)) {
          this.ustenciles.push(element);
        }
      }
    }
    // Réaffectation des tableaux pour la recherche par mots clés
    ingredientsFiltres = this.ingredients;
    appareilsFiltres = this.appareils;
    ustencilesFiltres = this.ustenciles;
  }

  // Affiche les recettes filtrées
  afficheLesRecettes() {
    const fragment = document.createDocumentFragment();
    
    this.conteneur.innerHTML = "";
    this.filtreLesRecettes();
    this.filtreLesMotsCles();

    if (this.recettes.length >= 1) {
      // Création de recettes
      for (let i=0; i <  this.recettes.length; i++) {
        const nouveauArticle = document.createElement('article');
        fragment.appendChild(nouveauArticle);
        nouveauArticle.classList.add('plat');
        nouveauArticle.innerHTML = `<img src="https://via.placeholder.com/150/C7BEBE?text=+" alt="" />
                                    <div class="plat-intro">
                                    <h2>${this.recettes[i].name}</h2>
                                    <div><span class="plat-intro__icone far fa-clock"></span><span class="plat-intro__duree">${this.recettes[i].time}</span></div>
                                    </div>
                                    <div class="plat-recette"><ul class="plat-recette__liste"></ul>
                                    <p class="plat-recette__descr">${this.recettes[i].description}</p>
                                    </div>`;
        // Génération d'ingrédients dans chaque plat
        for (let element of this.recettes[i].ingredients) {
          const nouveauLi = document.createElement('li');
          fragment.children[i].children[2].firstElementChild.appendChild(nouveauLi);
          nouveauLi.innerHTML = `<span class="plat-recette__ingr">${element.ingredient}:</span><span class="plat-recette__quant"> ${element.quantity ?? ''} ${element.unit ?? ''}</span>`;
        }
      }
      // Affichage de toutes les recettes
      this.conteneur.appendChild(fragment);
    }
  }
}
export const recherchePrincipale = new RechercheClassique(barrePrincipale, recipes, recettesFiltrees, ingredientsFiltres, appareilsFiltres, ustencilesFiltres, galerie);