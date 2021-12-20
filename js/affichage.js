import { ingredientsFiltres, appareilsFiltres, ustencilesFiltres } from './donnees/tableaux.js';

export const galerie = document.querySelector('.galerie');

// DOM
const listeIngredients = document.querySelector('.form-categ--ingr__liste');
const listeAppareils = document.querySelector('.form-categ--appa__liste');
const listeUstenciles = document.querySelector('.form-categ--uste__liste');

// Classe comportant les méthodes d'affichage de contenu
export class Affichage {
  constructor(conteneur = galerie) {
    this.conteneur = conteneur
  }

  // Affiche les recettes filtrées
  inscritRecettes(nom, description, duree, ingredients) {
    const fragment = document.createDocumentFragment();
      // Création de recettes
      const nouveauArticle = document.createElement('article');
      fragment.appendChild(nouveauArticle);
      nouveauArticle.classList.add('plat');
      nouveauArticle.innerHTML = `<img src="https://via.placeholder.com/150/C7BEBE?text=+" alt="" />
                                  <div class="plat-intro">
                                  <h2>${nom}</h2>
                                  <div><span class="plat-intro__icone far fa-clock"></span><span class="plat-intro__duree">${duree}</span></div>
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
    this.conteneur.appendChild(fragment); /* Affichage de la recette */
  }
  
  // Affiche un message en cas de recherche infructueuse
  inscritMessage() {
    this.conteneur.innerHTML = `<aside class="galerie__mess">
                                <span>Aucune recette ne correspond à votre critère… vous pouvez chercher « tarte aux pommes », « poisson », etc.</span>
                                <span class="far fa-times-circle"></span>
                                </aside>`;
    galerie.addEventListener('click', (evt) => {
      if (evt.target.className === 'far fa-times-circle') {
        this.conteneur.innerHTML = '';
      }
    });
  }

  // Affiche les mots clés dans un formulaire
  static inscritMotsClesParFormulaire(liste, dom) {
    dom.innerHTML = '';
    const fragment = document.createDocumentFragment();
    for (let element of liste) {
      const nouveauLi = document.createElement('li');
      fragment.appendChild(nouveauLi);
      nouveauLi.innerHTML = element;
    }
    dom.appendChild(fragment); /* Affichage de la liste de mots clés */
  }
  
  // Affiche les mots clés dans les 3 formulaires
  static inscritMotsClesDansTroisFormulaires() {
    this.inscritMotsClesParFormulaire(ingredientsFiltres, listeIngredients);
    this.inscritMotsClesParFormulaire(appareilsFiltres, listeAppareils);
    this.inscritMotsClesParFormulaire(ustencilesFiltres, listeUstenciles);
  }
}
export const affichage = new Affichage();