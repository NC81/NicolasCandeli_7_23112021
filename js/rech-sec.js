import {ingredientsFiltres, appareilsFiltres, ustencilesFiltres} from './rech-pri.js';

// DOM
const champsIngredients = document.querySelector('#rech-ingr');
const champsAppareils = document.querySelector('#rech-appa');
const champsUstenciles = document.querySelector('#rech-uste');
const formulaireIngredients = document.querySelector('.form-categ--ingr');
const formulaireAppareils = document.querySelector('.form-categ--appa');
const formulaireUstenciles = document.querySelector('.form-categ--uste');
const listeIngredients = document.querySelector('.form-categ--ingr__liste');
const listeAppareils = document.querySelector('.form-categ--appa__liste');
const listeUstenciles = document.querySelector('.form-categ--uste__liste');
const boutonIngredients = document.querySelector('.btn--ingr');
const boutonAppareils = document.querySelector('.btn--appa');
const boutonUstenciles = document.querySelector('.btn--uste');
const labelIngredients = document.querySelector('.form-categ--ingr label');
const labelAppareils = document.querySelector('.form-categ--appa label');
const labelUstenciles = document.querySelector('.form-categ--uste label');

// Instances par type de recherche (ingrédients, appareils, ustenciles)
let rechercheIngredientsParMotsCles;
let rechercheAppareilsParMotsCles;
let rechercheUstencilesParMotsCles;

// Classe de recherche par mots clés
class RechercheParMotsCles {
  constructor(bouton, label, formulaire, champs, liste, tableau) {
    this.bouton = bouton, /* Bouton d'ouverture */
    this.label = label, /* Label de fermeture */
    this.formulaire = formulaire, 
    this.champs = champs,
    this.liste = liste, /* Liste contenant les <li> à remplir */
    this.tableau = tableau /* Tableau contenant les valeurs à inscrire dans les <li> */
  }

  // Contrôle l'ouverture et la fermeture des champs de recherche
  ouvreLeChamps() {
    this.bouton.addEventListener("click", () => {
      this.formulaire.style.display = "block";
      this.bouton.setAttribute('aria-expanded', 'true');
    });
    this.label.addEventListener("click", (evt) => {
      evt.preventDefault();
      this.formulaire.style.display = "none";
      this.bouton.setAttribute('aria-expanded', 'false');
    });
  }

  ouvreTousLesChamps() {
    rechercheIngredientsParMotsCles.ouvreLeChamps();
    rechercheAppareilsParMotsCles.ouvreLeChamps();
    rechercheUstencilesParMotsCles.ouvreLeChamps();
  }

  // Affiche les mots clés placés dans leur tableau respectif
  afficheLesMotsCles() {
    this.liste.innerHTML = '';
    const fragment = document.createDocumentFragment();
    console.log(this.tableau, ingredientsFiltres);
    for (let element of this.tableau) {
      const nouveauLi = document.createElement('li');
      fragment.appendChild(nouveauLi);
      nouveauLi.innerHTML = element;
    }
    this.liste.appendChild(fragment);
  }

  afficheTousLesMotsCles() {
    rechercheIngredientsParMotsCles = new RechercheParMotsCles(boutonIngredients, labelIngredients, formulaireIngredients, champsIngredients, listeIngredients, ingredientsFiltres);
    rechercheAppareilsParMotsCles = new RechercheParMotsCles(boutonAppareils, labelAppareils, formulaireAppareils, champsAppareils, listeAppareils, appareilsFiltres);
    rechercheUstencilesParMotsCles = new RechercheParMotsCles(boutonUstenciles, labelUstenciles, formulaireUstenciles, champsUstenciles, listeUstenciles, ustencilesFiltres);

    rechercheIngredientsParMotsCles.afficheLesMotsCles();
    rechercheAppareilsParMotsCles.afficheLesMotsCles();
    rechercheUstencilesParMotsCles.afficheLesMotsCles();
  }
}
export const rechercheParMotsCles = new RechercheParMotsCles();