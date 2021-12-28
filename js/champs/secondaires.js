import { Tableau, ingredientsFiltres, appareilsFiltres, ustencilesFiltres, motsClesFiltres } from '../donnees/tableaux.js';
import { MotsCles, motsClesChoisis } from '../mots_cles.js';
import { recherche, recettesFiltreesParMotsCles } from '../recherche.js';
import { Affichage } from '../affichage.js';

// DOM
const barreIngredients = document.querySelector('#rech-ingr');
const barreAppareils = document.querySelector('#rech-appa');
const barreUstenciles = document.querySelector('#rech-uste');
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
const conteneurDeMotsCles = document.querySelector('.header__selec');
const bloqueur = document.querySelector('.bloqueur');

// Champs secondaires de recherche avancée
export class ChampsSecondaires {
  constructor(bouton, label, formulaire, champs, liste) {
    this.bouton = bouton, /* Bouton d'ouverture */
    this.label = label, /* Label de fermeture */
    this.formulaire = formulaire, /* Formulaire contenant le champs et la liste d'ingrédients, d'appareils ou d'ustenciles */
    this.champs = champs, /* Champs de saisie */
    this.liste = liste /* Liste contenant les <li> à remplir */
  }

  // Contrôle l'ouverture et la fermeture des champs de recherche
  ouvreFormulaire() {
    this.bouton.addEventListener("click", () => { /* Lors d'un cliquage sur le bouton d'ouverture ... */
      this.formulaire.style.display = "block"; /*  Ouvre le formulaire */
      bloqueur.style.display = "block"; /* Ouvre le bloqueur recouvrant le reste de la page */
      this.bouton.setAttribute('aria-expanded', 'true');
    });
    this.label.addEventListener("click", (evt) => { /* Lors d'un cliquage sur le label ... */
      evt.preventDefault();
      this.formulaire.style.display = "none"; /* Ferme le formulaire */
      bloqueur.style.display = "none"; /* Ferme le bloqueur */
      this.bouton.setAttribute('aria-expanded', 'false');
    });
    bloqueur.addEventListener('click', () => { /* Lors d'un cliquage sur le bloqueur ... */
      if (this.bouton.getAttribute('aria-expanded') === 'true') {
        this.label.click(); /* Ferme le formulaire ouvert */
      }
    });
  }

  // Filtre les recettes et les mots-clés par le cliquage de mots-clés
  filtreRecettesParMotCle() {
    this.liste.addEventListener('click', (evt) => { /* Lors d'un cliquage dans le formulaire ... */
      this.label.click(); /* Fermeture du formulaire */
      this.champs.value = ''; /* Vidage du champs secondaire */
      MotsCles.ajoute(evt, this.constructor.choisitListe(this.champs)); /* Ajout du bouton dans le DOM et du mot-clé dans la liste de mots-clés */
      recherche.filtreRecettesParMotsCles(motsClesChoisis); /* Filtrage des recettes selon la nouvelle liste de mots-clés */
      Tableau.creeListesMotsCles(recettesFiltreesParMotsCles); /* Création des listes d'ingrédients, d'appareils et d'ustenciles */
      Affichage.inscritMotsClesDansTroisFormulaires(); /* Affichage des mots-clés dans les 3 formulaires */
    });
  }

  // Filtre les mots-clés dans les formulaires par le remplissage du champs secondaire
  filtreMotsCles() {
    this.champs.addEventListener('input', (evt) => { /* Lors d'une modification du champs ... */
      Tableau.creeListeMotClesParChamps(evt, this.constructor.choisitListe(this.champs)); /* Création de la liste de mots-clés à afficher selon l'entrée */
      Affichage.inscritMotsClesParFormulaire(motsClesFiltres, this.liste); /* Affichage des mots-clés dans le formulaire correspondant */
    });
  }
  
  // Filtre les recettes et les mots-clés lors d'une suppression de mot-clé
  static supprimeMotCle() {
    conteneurDeMotsCles.addEventListener('click', (evt) => { /* Lors d'un cliquage sur le conteneur de mots-clés ... */
      MotsCles.supprime(evt);  /* Suppression du bouton dans le DOM et du mot-clé dans la liste de mots-clés */
      recherche.filtreRecettesParMotsCles(motsClesChoisis); /* Filtrage des recettes selon la nouvelle liste de mots-clés */
      Tableau.creeListesMotsCles(recettesFiltreesParMotsCles); /* Création des listes d'ingrédients, d'appareils et d'ustenciles */
      Affichage.inscritMotsClesDansTroisFormulaires(); /* Affichage des mots-clés dans les 3 formulaires */
    });
  }

  // Sélectionne la liste (d'ingrédients, d'appareils ou d'ustenciles) correspondant au champs
  static choisitListe(champs) {
    if (champs.id === 'rech-ingr') {
      return ingredientsFiltres;
    }
    else if (champs.id === 'rech-appa') {
      return appareilsFiltres;
    }
    else if (champs.id === 'rech-uste') {
      return ustencilesFiltres;
    }
  }
}
export const champsIngredients = new ChampsSecondaires(boutonIngredients, labelIngredients, formulaireIngredients, barreIngredients, listeIngredients);
export const champsAppareils = new ChampsSecondaires(boutonAppareils, labelAppareils, formulaireAppareils, barreAppareils, listeAppareils);
export const champsUstenciles = new ChampsSecondaires(boutonUstenciles, labelUstenciles, formulaireUstenciles, barreUstenciles, listeUstenciles);