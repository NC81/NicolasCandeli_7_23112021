import { recherchePrincipale, recettesFiltrees, ingredientsFiltres, appareilsFiltres, ustencilesFiltres, galerie } from './rech-pri.js';

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

// Tableaux
let motsClesChoisis = []; 
let recettesFiltreesParMotsCles;

// Classe de recherche par mots clés
class RechercheParMotsCles {
  constructor(bouton, label, formulaire, champs, liste) {
    this.bouton = bouton, /* Bouton d'ouverture */
    this.label = label, /* Label de fermeture */
    this.formulaire = formulaire, 
    this.champs = champs,
    this.liste = liste /* Liste (DOM) contenant les <li> à remplir */
  }

  // Contrôle l'ouverture et la fermeture des champs de recherche
  ouvreChamps() {
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

  ouvreTousLesTypesDeChamps() {
    rechercheIngredientsParMotsCles.ouvreChamps();
    rechercheAppareilsParMotsCles.ouvreChamps();
    rechercheUstencilesParMotsCles.ouvreChamps();
  }

  // Gestion des mots clés (par le tableau "motsClesChoisis" et les boutons correspondants)
  selectionneMotCle() {
    const conteneurDeMotsCles = document.querySelector('.header__selec');
    const boutonStyle = window.getComputedStyle(this.bouton);

    // Évènement d'ajout de mots clés
    this.liste.addEventListener('click', (evt) => {
      const texteColle = evt.target.textContent.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/ /g,'');
      if ((evt.target.tagName === 'LI') && (!conteneurDeMotsCles.classList.contains(`${texteColle}`))) {
        conteneurDeMotsCles.innerHTML = '';
        motsClesChoisis.push({texte : evt.target.textContent, couleur : boutonStyle.getPropertyValue("background-color")});
        conteneurDeMotsCles.classList.add(`${texteColle}`);
        // Création de boutons de mots clés
        for (let motCle of motsClesChoisis) {
          let nouveauBouton = document.createElement('button');
          conteneurDeMotsCles.appendChild(nouveauBouton);
          nouveauBouton.classList.add('btn-mini');
          nouveauBouton.innerHTML = `<span class="btn-mini__cont">${motCle.texte}</span><span class="far fa-times-circle"></span>`;
          nouveauBouton.style.backgroundColor = motCle.couleur;
        }
      }
      this.champs.value = '',
      this.filtreRecettes();
    });

    // Évènement de suppression de mots clés
    conteneurDeMotsCles.addEventListener('click', (evt) => {
      const texte = evt.target.parentElement.firstElementChild.textContent;
      const texteColle = texte.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/ /g,'');
      if (evt.target.className === 'far fa-times-circle') {
        for (let mot of motsClesChoisis) {
          if (mot.texte == texte) {
            const index = motsClesChoisis.indexOf(mot);
            motsClesChoisis.splice(index, 1);
            conteneurDeMotsCles.classList.remove(`${texteColle}`);
          }
        }
        evt.target.parentElement.remove();
        this.filtreRecettes();
        this.afficheTousLesTypesDeMotCle();
      }
    });
    this.filtreMotsCles(); /* Lance un filtrage de mots clés au chargement de la page */
  }

  // Activation des évènements de sélection/désélection des 3 types de mots clés
  selectionneTousLesTypesDeMotClé() {
    rechercheIngredientsParMotsCles.selectionneMotCle();
    rechercheUstencilesParMotsCles.selectionneMotCle();
    rechercheAppareilsParMotsCles.selectionneMotCle();
  }

  // Filtrage des mots clés selon la valeur du champs
  filtreMotsCles() {
    this.champs.addEventListener('input', (evt) => {
      // Affectation du tableau de mots clés à filtrer
      let motCles;
      if (this.champs.id === 'rech-ingr') {
        motCles = ingredientsFiltres;
      } else if (this.champs.id === 'rech-appa') {
        motCles = appareilsFiltres;
      } else if (this.champs.id === 'rech-uste') {
        motCles = ustencilesFiltres;
      }
      // Création du tableau de mots clés à afficher
      let motsClesFiltres = [];
      const entree = evt.target.value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
      for (let element of motCles) {
        if (element.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().includes(entree)) {
          motsClesFiltres.push(element);
        }
      }
      this.afficheMotsCles(motsClesFiltres, this.liste);
    });
  }
  
  // Modèle d'affichage de mots clés à l'intérieur des listes
  afficheMotsCles(tableau, liste) {
    liste.innerHTML = '';
    const fragment = document.createDocumentFragment();
    for (let element of tableau) {
      const nouveauLi = document.createElement('li');
      fragment.appendChild(nouveauLi);
      nouveauLi.innerHTML = element;
    }
    liste.appendChild(fragment);
  }

  // Affichage de tous les mots clés
  afficheTousLesTypesDeMotCle() {
    this.afficheMotsCles(ingredientsFiltres, listeIngredients);
    this.afficheMotsCles(appareilsFiltres, listeAppareils);
    this.afficheMotsCles(ustencilesFiltres, listeUstenciles);
  }

  // Filtrage des recettes selon les mots clés
  filtreRecettes() {
    galerie.innerHTML = '';
    
    // Réinitialisation avant la recherche de la propriété comptabilisant les correspondances des recettes avec les mots clés
    for (let recette of recettesFiltrees) {
      recette.eligible = 0;
    }

    // console.log("mots clés", motsClesChoisis);
    if (motsClesChoisis.length > 0) {
      recettesFiltreesParMotsCles = [];
      for (let motCle of motsClesChoisis) {
        // Si le mot clé est un ingrédient...
        if (motCle.couleur === "rgb(50, 130, 247)") {
          for (let recette of recettesFiltrees) {
            for (let portion of recette.ingredients) {
              if (portion.ingredient.includes(motCle.texte)) {
                recette.eligible++; /* Ajoute 1 par mot clé correspondant */
                if (recette.eligible === motsClesChoisis.length) { /* Si le nombre est équivalent à la taille du tableau de mots clés, la recette est affichée */
                  recherchePrincipale.afficheLesRecettes(recette.name, recette.description, recette.time, recette.ingredients, recette.id);
                  recettesFiltreesParMotsCles.push(recette);
                }
              }
            }
          }
        // Si le mot clé est un appareil...
        } else if (motCle.couleur === "rgb(104, 217, 164)") {
          for (let recette of recettesFiltrees) {
            if (recette.appliance.includes(motCle.texte)) {
              recette.eligible++;
              if (recette.eligible === motsClesChoisis.length) {
                recherchePrincipale.afficheLesRecettes(recette.name, recette.description, recette.time, recette.ingredients, recette.id);
                recettesFiltreesParMotsCles.push(recette);
              }
            }
          }
        // Si le mot clé est un ustencile...
        } else if (motCle.couleur === "rgb(237, 100, 84)") {
          for (let recette of recettesFiltrees) {
            for (let ustencile of recette.ustensils) {
              if (ustencile.includes(motCle.texte)) {
                recette.eligible++;
                if (recette.eligible === motsClesChoisis.length) {
                  recherchePrincipale.afficheLesRecettes(recette.name, recette.description, recette.time, recette.ingredients, recette.id);
                  recettesFiltreesParMotsCles.push(recette);
                }
              }
            }
          }
        }
      }
    } else {
      recherchePrincipale.filtreRecettes();
      recettesFiltreesParMotsCles = recettesFiltrees;
    }
    // console.log('ingredients', ingredientsFiltres, 'appareils', appareilsFiltres, 'ustenciles', ustencilesFiltres);
    // console.log("recettesFiltreesParMotsCles", recettesFiltreesParMotsCles);
    recherchePrincipale.filtreMotsCles(recettesFiltreesParMotsCles, ingredientsFiltres, appareilsFiltres, ustencilesFiltres);
    this.afficheTousLesTypesDeMotCle();
  }
}
export const rechercheParMotsCles = new RechercheParMotsCles();

// Instances par type de recherche (ingrédients, appareils, ustenciles)
let rechercheIngredientsParMotsCles = new RechercheParMotsCles(boutonIngredients, labelIngredients, formulaireIngredients, champsIngredients, listeIngredients);
let rechercheAppareilsParMotsCles = new RechercheParMotsCles(boutonAppareils, labelAppareils, formulaireAppareils, champsAppareils, listeAppareils);
let rechercheUstencilesParMotsCles = new RechercheParMotsCles(boutonUstenciles, labelUstenciles, formulaireUstenciles, champsUstenciles, listeUstenciles);