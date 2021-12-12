// Json
import { recipes } from './recettes.js';

// DOM
export const galerie = document.querySelector('.galerie');
export const barrePrincipale = document.querySelector('#rech-princ');

// Tableaux
export let recettesFiltrees;
export let ingredientsFiltres;
export let appareilsFiltres;
export let ustencilesFiltres;

// Variable de recherche
let recetteTrouvee;

// Classe de recherche classique
export class RechercheClassique {
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
  filtreRecettes() {
    this.recettes = [];
    const entree = this.champs.value.toLowerCase();
    // Si le champs est composé d'au moins 3 caractères
    if (entree.length >= 3) {
      this.conteneur.innerHTML = '';

      for (let recetteJson of this.json) {
        this.filtreParNom(entree, recetteJson);
        if (!recetteTrouvee) {
          this.filtreParDescription(entree,recetteJson);
        } if (!recetteTrouvee) { 
          this.filtreParIngredient(entree, recetteJson);
        } if (!recetteTrouvee) {
          this.filtreParAppareil(entree, recetteJson);
        } if (!recetteTrouvee) {
          this.filtreParUstencile(entree, recetteJson);
        }
      }
    // Si le champs est composé de moins de 3 caractères
    } else {
      for (let recetteJson of this.json) {
        this.afficheLesRecettes(recetteJson.name, recetteJson.description, recetteJson.time, recetteJson.ingredients, recetteJson.id);
        this.recettes.push(recetteJson);
      }
    }
    recettesFiltrees = this.recettes;
    this.filtreLesMotsCles(this.recettes, this.ingredients, this.appareils, this.ustenciles);
  }

  // Vérification de la correspondance du champs avec le nom...
  filtreParNom(valeur, tableau) {
    if ((tableau.name.toLowerCase().includes(valeur)) && (!this.recettes.includes(tableau))) {
      this.afficheLesRecettes(tableau.name, tableau.description, tableau.time, tableau.ingredients, tableau.id);
      this.recettes.push(tableau);
      recetteTrouvee = true;
    } else {
      recetteTrouvee = false;
    }
  }

  // Vérification de la correspondance du champs avec la description...
  filtreParDescription(valeur, tableau) {
    if ((tableau.description.toLowerCase().includes(valeur)) && (!this.recettes.includes(tableau))) {
      this.afficheLesRecettes(tableau.name, tableau.description, tableau.time, tableau.ingredients, tableau.id);
      this.recettes.push(tableau);
      recetteTrouvee = true;
    } else {
      recetteTrouvee = false;
    }
  }

  // Vérification de la correspondance du champs avec les ingrédients...
  filtreParIngredient(valeur, tableau) {
    for (let portion of tableau.ingredients) {
      if ((portion.ingredient.toLowerCase().includes(valeur)) && (!this.recettes.includes(tableau))) {
        this.afficheLesRecettes(tableau.name, tableau.description, tableau.time, tableau.ingredients, tableau.id);
        this.recettes.push(tableau);
        recetteTrouvee = true;
      } else {
        recetteTrouvee = false;
      }
    }
  }

  // Vérification de la correspondance du champs avec les appareils...
  filtreParAppareil(valeur, tableau) {
    if ((tableau.appliance.toLowerCase().includes(valeur)) && (!this.recettes.includes(tableau))) {
      this.afficheLesRecettes(tableau.name, tableau.description, tableau.time, tableau.ingredients, tableau.id);
      this.recettes.push(tableau);
      recetteTrouvee = true;
    } else {
      recetteTrouvee = false;
    }
  }

  // Vérification de la correspondance du champs avec les ustenciles...
  filtreParUstencile(valeur, tableau) {
    for (let ustencile of tableau.ustensils) {
      if ((ustencile.toLowerCase().includes(valeur)) && (!this.recettes.includes(tableau))) {
        this.afficheLesRecettes(tableau.name, tableau.description, tableau.time, tableau.ingredients, tableau.id);
        this.recettes.push(tableau);
      }
    }
  }

  // Filtre les ingrédients, appareils et ustenciles compris dans les recettes filtrées
  filtreLesMotsCles(recettes, ingredients, appareils, ustenciles) {
    ingredients = [];
    appareils = [];
    ustenciles = [];

    for (let recette of recettes) {
      //  Remplissage du tableau d'ingredients
      for (let portion of recette.ingredients) {
        if (!ingredients.includes(portion.ingredient)) {
          ingredients.push(portion.ingredient);
        }
      }
      //  Remplissage du tableau d'appareils
      if (!appareils.includes(recette.appliance)) {
        appareils.push(recette.appliance);
      }
      //  Remplissage du tableau d'ustenciles
      for (let ustencile of recette.ustensils) {
        if(!ustenciles.includes(ustencile)) {
          ustenciles.push(ustencile);
        }
      }
    }
    // Réaffectation des tableaux pour la recherche par mots clés
    ingredientsFiltres = ingredients;
    appareilsFiltres = appareils;
    ustencilesFiltres = ustenciles;
  }

  // Affiche les recettes filtrées
  afficheLesRecettes(nom, description, temps, ingredients, id) {
    const fragment = document.createDocumentFragment();
      // Création de recettes
      const nouveauArticle = document.createElement('article');
      fragment.appendChild(nouveauArticle);
      nouveauArticle.classList.add('plat');
      nouveauArticle.dataset.id = id;
      nouveauArticle.innerHTML = `<img src="https://via.placeholder.com/150/C7BEBE?text=+" alt="" />
                                  <div class="plat-intro">
                                  <h2>${nom}</h2>
                                  <div><span class="plat-intro__icone far fa-clock"></span><span class="plat-intro__duree">${temps}</span></div>
                                  </div>
                                  <div class="plat-recette"><ul class="plat-recette__liste"></ul>
                                  <p class="plat-recette__descr">${description}</p>
                                  </div>`;
      // Génération d'ingrédients dans la recette
      for (let portion of ingredients) {
        const nouveauLi = document.createElement('li');
        fragment.firstElementChild.children[2].firstElementChild.appendChild(nouveauLi);
        nouveauLi.innerHTML = `<span class="plat-recette__ingr">${portion.ingredient}:</span><span class="plat-recette__quant"> ${portion.quantity ?? ''} ${portion.unit ?? ''}</span>`;
      }
    // Affichage de la recette
    this.conteneur.appendChild(fragment);
  }

  // Affichage du message en cas de recherche infructueuse
  afficheMessage() {
    this.conteneur.innerHTML = `<aside class="galerie__mess">
                         <span>Aucune recette ne correspond à votre critère… vous pouvez chercher « tarte aux pommes », « poisson », etc.</span>
                         <span class="far fa-times-circle"></span>
                         </aside>`;
    this.conteneur.addEventListener('click', (evt) => {
      if (evt.target.className === 'far fa-times-circle') {
        this.conteneur.innerHTML = '';
      }
    });
  }
}
export const recherchePrincipale = new RechercheClassique(barrePrincipale, recipes, recettesFiltrees, ingredientsFiltres, appareilsFiltres, ustencilesFiltres, galerie);