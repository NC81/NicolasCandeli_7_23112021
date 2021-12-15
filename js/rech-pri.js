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
    const entree = this.champs.value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
    // Si le champs est composé d'au moins 3 caractères
    if (entree.length >= 3) {
      this.conteneur.innerHTML = '';
      // Lancement de la recherche
      this.json.forEach(recette => {
        const ingredients =  recette.ingredients.map(portion => portion.ingredient);
        const ustenciles =  recette.ustensils.map(ustencile => ustencile);
        const recetteCondensee = `${recette.name} ${ingredients} ${recette.appliance} ${ustenciles} ${recette.description}`;
        
        if (recetteCondensee.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().includes(entree)) {
          this.afficheLesRecettes(recette.name, recette.description, recette.time, recette.ingredients, recette.id);
          this.recettes.push(recette);
        }
      });
      // console.log(this.recettes);

    // Si le champs est composé de moins de 3 caractères
    } else {
      this.conteneur.innerHTML = '';
      
      this.json.forEach(recette => {
        this.afficheLesRecettes(recette.name, recette.description, recette.time, recette.ingredients, recette.id);
        this.recettes.push(recette);
      })
    }
    recettesFiltrees = this.recettes;
    this.filtreMotsCles(this.recettes, this.ingredients, this.appareils, this.ustenciles);
  }

  // Remplissage des tableaux de mots clés à partir des recettes filtrées
  filtreMotsCles(recettes, ingredients, appareils, ustenciles) {
    ingredients = [];
    appareils = [];
    ustenciles = [];

    recettes.forEach((recette) => {
      recette.ingredients.forEach((ingredient) => {
        if(!ingredients.includes(ingredient.ingredient.normalize("NFD").replace(/[\u0300-\u036f]/g, ""))) {
          ingredients.push(ingredient.ingredient);
        }
      });
      if(!appareils.includes(recette.appliance)) {
        appareils.push(recette.appliance);
      }
      recette.ustensils.forEach(ustencile => {
        if(!ustenciles.includes(ustencile)) {
          ustenciles.push(ustencile);
        }
      })
    });

    // console.log(ingredients, appareils, ustenciles);
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