import { MotsCles, motsClesChoisis } from '../affichage/affi_bouton.js';
import { RecettesParMotsCles, recettesFiltreesParMotsCles } from '../../recherche/rech_mots.js';
import { Chaine } from '../../utilitaire/util_chaine.js';

// DOM
const barreIngredients = document.querySelector('#rech-ingr');
const barreAppareils = document.querySelector('#rech-appa');
const barreUstenciles = document.querySelector('#rech-uste');
const formulaireIngredients = document.querySelector('.form-categ--ingr');
const formulaireAppareils = document.querySelector('.form-categ--appa');
const formulaireUstenciles = document.querySelector('.form-categ--uste');
const conteneurIngredients = document.querySelector('.form-categ--ingr__liste');
const conteneurAppareils = document.querySelector('.form-categ--appa__liste');
const conteneurUstenciles = document.querySelector('.form-categ--uste__liste');
const boutonIngredients = document.querySelector('.btn--ingr');
const boutonAppareils = document.querySelector('.btn--appa');
const boutonUstenciles = document.querySelector('.btn--uste');
const labelIngredients = document.querySelector('.form-categ--ingr label');
const labelAppareils = document.querySelector('.form-categ--appa label');
const labelUstenciles = document.querySelector('.form-categ--uste label');
const conteneurDeMotsCles = document.querySelector('.header__selec');
const bloqueur = document.querySelector('.bloqueur');

// Champs secondaires de recherche avancée
export class ChampsAvance {
  constructor(bouton, label, formulaire, champs, conteneur, liste) {
    this.bouton = bouton, /* Bouton d'ouverture */
    this.label = label, /* Label de fermeture */
    this.formulaire = formulaire, /* Formulaire contenant le champs et la liste (ingrédients, appareils ou ustensiles) */
    this.champs = champs, /* Champs de saisie */
    this.conteneur = conteneur, /* Conteneur de mots-clés */
    this._liste = liste  /* Liste d'objets associés (ingrédient, appareils, ustensiles) */
  }
  
  // Création d'une propriété mutable (liste d'ingrédients, d'appareils ou d'ustensiles)
  get liste() {
    return this._liste;
  }

  set liste(elements) {
    this._liste = elements;
  }

  // Contrôle l'ouverture et la fermeture des champs de recherche
  ouvreEtFermeFormulaire() {
    this.bouton.addEventListener("click", () => { /* Lors d'un cliquage sur le bouton d'ouverture ... */
      this.bouton.classList.remove('reduction'); 
      this.bouton.classList.add('aggrandissement'); /*  Aggrandissement du bouton (animation) */
      this.formulaire.classList.add('apparition'); /*  Ouverture du formulaire (animation) */
      bloqueur.style.display = "block"; /* Ouverture du bloqueur recouvrant le reste de la page */
      this.bouton.setAttribute('aria-expanded', 'true');
    });
    this.label.addEventListener("click", (evt) => { /* Lors d'un cliquage sur le label ... */
      evt.preventDefault();
      this.bouton.classList.replace('aggrandissement', 'reduction'); /*  Réduction du bouton (animation) */
      this.formulaire.classList.remove('apparition');; /* Fermeture du formulaire (animation) */
      bloqueur.style.display = "none"; /* Fermeture du bloqueur */
      this.bouton.setAttribute('aria-expanded', 'false');
    });
    bloqueur.addEventListener('click', () => { /* Lors d'un cliquage sur le bloqueur ... */
      if (this.bouton.getAttribute('aria-expanded') === 'true') {
        this.label.click(); /* Fermeture du formulaire ouvert */
      }
    });
  }

  // Filtre les recettes et les mots-clés par l'ajout de mots-clés au cliquage
  filtreRecettesParMotCle() {
    this.conteneur.addEventListener('mousedown', (evt) => { /* Lors d'un cliquage dans le formulaire ... */
      this.label.click(); /* Fermeture du formulaire */
      this.champs.value = ''; /* Vidage du champs secondaire */
      MotsCles.ajoute(evt, this._liste); /* Ajout du bouton dans le DOM et du mot-clé dans la liste de mots-clés */
      RecettesParMotsCles.filtre(motsClesChoisis); /* Filtrage des recettes selon la nouvelle liste de mots-clés */
      this.constructor.creeListesMotsCles(recettesFiltreesParMotsCles); /* Création des listes d'ingrédients, d'appareils et d'ustensiles */
      this.constructor.inscritMotsClesDansTousLesFormulaires(); /* Affichage des mots-clés dans les 3 formulaires */
    });
  }

  // Filtre les mots-clés dans les formulaires par le remplissage du champs secondaire
  filtreMotsCles() {
    this.champs.addEventListener('input', (evt) => { /* Lors d'une modification du champs ... */
      this.inscritMotsClesParFormulaire(evt); /* Affichage des mots-clés dans le formulaire correspondant */
    });
  }
  
  // Filtre les recettes et les mots-clés lors d'une suppression de mot-clé
  static supprimeMotCle() {
    conteneurDeMotsCles.addEventListener('mousedown', (evt) => { /* Lors d'un cliquage sur le conteneur de mots-clés ... */
      MotsCles.supprime(evt);  /* Suppression du bouton dans le DOM et du mot-clé dans la liste de mots-clés */
      RecettesParMotsCles.filtre(motsClesChoisis); /* Filtrage des recettes selon la nouvelle liste de mots-clés */
      this.creeListesMotsCles(recettesFiltreesParMotsCles); /* Création des listes d'ingrédients, d'appareils et d'ustensiles */
      this.inscritMotsClesDansTousLesFormulaires(); /* Affichage des mots-clés dans les 3 formulaires */
    });
  }

  // Affiche les mots-clés dans les formulaires (qu'ils soient filtrés ou non par le champs)
  inscritMotsClesParFormulaire(evt) {
    // Choix de la liste de mots-clés à afficher 
    let liste;
    if (this.champs.value.length === 0) { /* Si la liste est vide ... */
      liste = this._liste.slice(0); /* Exploitation de la liste initiale */
    } else { /* Sinon ... */
      liste = this.creeListeMotClesParChamps(evt).slice(0); /* Exploitation de la liste filtrée */
    }
    this.conteneur.innerHTML = '';
    const fragment = document.createDocumentFragment();
    for (let element of liste) {
      const nouveauLi = document.createElement('li');
      fragment.appendChild(nouveauLi);
      nouveauLi.innerHTML = element.nom;
    }
    this.conteneur.appendChild(fragment); /* Affichage de la liste de mots-clés */
  }

  // Crée une liste de mots-clés selon la valeur du champs
  creeListeMotClesParChamps(evt) {
    const entree = Chaine.harmonise(evt.target.value);
    return this._liste.filter(motCle => Chaine.harmonise(motCle.nom).includes(entree));
  }

  // Ajoute les ingrédients, appareils et ustensiles compris dans les recettes filtrées dans des listes
  static creeListesMotsCles(recettes) {
    champsIngredients.liste = [];
    champsAppareils.liste = [];
    champsUstenciles.liste = [];
    // Répartition des ingrédients, appareils et ustensiles dans leurs listes respectives pour chaque recette
    for (let recette of recettes) {
      MotsCles.creeListe(recette, 'aliments', 'rgb(50, 130, 247)', champsIngredients.liste); /* Crée liste d'ingrédients */
      MotsCles.creeListe(recette, 'appliance', 'rgb(104, 217, 164)', champsAppareils.liste); /* Crée liste d'appareils */
      MotsCles.creeListe(recette, 'ustensils', 'rgb(237, 100, 84)', champsUstenciles.liste); /* Crée liste d'ustensiles */
    }
  }

  // Regroupement des trois instances
  static inscritMotsClesDansTousLesFormulaires() {
    champsIngredients.inscritMotsClesParFormulaire();
    champsAppareils.inscritMotsClesParFormulaire();
    champsUstenciles.inscritMotsClesParFormulaire();
  }
  static ouvreEtFermeTousLesFormulaires() {
    champsIngredients.ouvreEtFermeFormulaire();
    champsAppareils.ouvreEtFermeFormulaire();
    champsUstenciles.ouvreEtFermeFormulaire();
  }
  static filtreRecettesParTousLesMotCles() {
    champsIngredients.filtreRecettesParMotCle();
    champsAppareils.filtreRecettesParMotCle();
    champsUstenciles.filtreRecettesParMotCle();
  }
  static filtreTousLesMotsCles() {
    champsIngredients.filtreMotsCles();
    champsAppareils.filtreMotsCles();
    champsUstenciles.filtreMotsCles();
  }
}
export const champsIngredients = new ChampsAvance(boutonIngredients, labelIngredients, formulaireIngredients, barreIngredients, conteneurIngredients);
export const champsAppareils = new ChampsAvance(boutonAppareils, labelAppareils, formulaireAppareils, barreAppareils, conteneurAppareils);
export const champsUstenciles = new ChampsAvance(boutonUstenciles, labelUstenciles, formulaireUstenciles, barreUstenciles, conteneurUstenciles);