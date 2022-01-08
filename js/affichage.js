import { ingredientsFiltres, appareilsFiltres, ustencilesFiltres } from './donnees/tableaux.js';
import { Utilitaire } from './utilitaires.js';

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

  // Affiche la recette filtrée
  inscritRecettes(recette) {
    const fragment = document.createDocumentFragment()
      // Création de la recette
      const nouvelArticle = document.createElement('article');
      fragment.appendChild(nouvelArticle);
      nouvelArticle.classList.add('plat');
      nouvelArticle.innerHTML = `<img src="https://via.placeholder.com/150/C7BEBE?text=+" alt="" />
                                 <div class="info-bulle" data-titre="${recette.name}" class="tooltiptext"></div>
                                 <div class="plat-intro">
                                   <h2>${recette.name}</h2>
                                   <div><span class="plat-intro__icone far fa-clock"></span><span class="plat-intro__duree">${recette.time} min</span></div>
                                   <div></div>
                                 </div>
                                 <button class="btn-ext" data-ouvert="false"><i class="fas fa-chevron-down"></i></button>
                                 <div class="plat-recette">
                                   <ul class="plat-recette__liste"></ul>
                                   <p class="plat-recette__descr">${recette.description}</p>
                                 </div>`;
      // Génération d'ingrédients dans la recette
      for (let portion of recette.ingredients) {
        const nouveauLi = document.createElement('li');
        nouvelArticle.children[4].children[0].appendChild(nouveauLi);
        nouveauLi.innerHTML = `<span class="plat-recette__ingr">${portion.ingredient}</span><span class="plat-recette__quant">${Utilitaire.afficheDeuxPoints(portion) + (portion.quantity ?? '')} ${portion.unit ?? ''}</span>`;
      }
    // Affichage de la recette
    this.conteneur.appendChild(fragment);

    // Affichage de l'info-bulle
    const largeurNormaleTitre = nouvelArticle.children[2].children[0].offsetWidth; /* Largeur du titre visible (px) */
    const largeurTotaleTitre = nouvelArticle.children[2].children[0].scrollWidth; /* Largeur totale (visible et non visible) du titre (px) */
    const titre = nouvelArticle.children[2].children[0];
    const infoBulle = nouvelArticle.children[1];
    // Si le titre déborde ...
    if (largeurNormaleTitre < largeurTotaleTitre) {
      this.inscritTooltip(titre, infoBulle); /* Activation des évènements d'affichage de l'info-bulle */
    }

    // Affichage du bouton d'extension sur les recettes dont le contenu déborde
    const hauteurTotaleDescription = nouvelArticle.lastChild.children[1].scrollHeight; /* Hauteur totale (visible et non visible) de la description (px) */
    const hauteurTotaleIngredients = nouvelArticle.lastChild.children[0].scrollHeight; /* Hauteur totale (visible et non visible) de la liste d'ingrédients (px) */
    const hauteurContenuDescription = 97; /* Hauteur du contenu visible (px) */
    const hauteurContenuingredients = 101; /* Hauteur du contenu visible (px) */
    const hauteurArticleNormal = 364; /* Hauteur de l'article de recette (px) */
    let hauteurSupplementaire; /* Hauteur supplémentaire à ajouter à l'article lors de l'extension */

    // Si le contenu déborde la liste d'ingrédients ou la description ...
    if ((hauteurContenuDescription < hauteurTotaleDescription) || (hauteurContenuingredients < hauteurTotaleIngredients)) {
      // Affectation de la taille selon le plus grand débordement
      if (hauteurTotaleDescription >= hauteurTotaleIngredients) {
        hauteurSupplementaire = hauteurTotaleDescription - hauteurContenuDescription; /* Affectation de la taille de l'extension selon le débordement de la description */
      } else {
        hauteurSupplementaire = hauteurTotaleIngredients - hauteurContenuingredients; /* Affectation de la taille de l'extension selon le débordement de la liste d'ingrédients */
      }
      const hauteurArticleEtendu = hauteurArticleNormal + hauteurSupplementaire; /* Hauteur finale de l'article après son extension */
      this.inscritBouton(nouvelArticle, hauteurArticleNormal, hauteurArticleEtendu); /* Appel de l'évènement de cliquage du bouton d'extension */
    }
  }

  // Affiche le bouton d'extension et le rend fonctionnel
  inscritBouton(article, normal, etendu) {
    article.children[3].dataset.visible = 'true'; /* Rend le bouton visible */
    // Lors d'un cliquage de bouton d'extension ...
    article.children[3].addEventListener('click', () => {
      // console.log(normal, etendu);
      /* Si l'article n'a pas été déjà aggrandi ... */
      if (article.dataset.ouvert != 'true') {
        article.children[3].innerHTML = `<i class="fas fa-chevron-up"></i>`; /* Changement d'icône */
        article.children[3].dataset.ouvert = 'true'; /* Changement du style du bouton */
        article.style.height = `${etendu}px`; /* Affectation de la nouvelle hauteur de l'article */
        article.dataset.ouvert = 'true'; /* Enregistrement de l'état de l'article */
        article.children[4].children[0].dataset.ellipse = 'false'; /* Affichage de tout le contenu de la liste d'ingrédients */
        article.children[4].children[1].dataset.ellipse = 'false'; /* Affichage de tout le contenu de la description */
      }
      // Sinon ...
      else {
        article.children[3].innerHTML = `<i class="fas fa-chevron-down"></i>`;
        article.children[3].dataset.ouvert = 'false';
        article.style.height = `${normal}px`;
        article.dataset.ouvert = 'false';
        article.children[4].children[0].dataset.ellipse = 'true';
        article.children[4].children[1].dataset.ellipse = 'true';
      }
    });
  }

  // Affiche l'info-bulle au survol
  inscritTooltip(titre, infoBulle) {
    titre.style.cursor = 'pointer';
    titre.addEventListener('mouseover', () => {
      infoBulle.style.visibility = 'visible';
    });
    titre.addEventListener('mouseout', () => {
      infoBulle.style.visibility = 'hidden';
    });
  }

  // Affiche un message en cas de recherche infructueuse
  inscritMessage() {
    this.conteneur.innerHTML = `<aside class="alerte secouage">
                                <p>Aucune recette ne correspond à votre critère… vous pouvez chercher « tarte aux pommes », « poisson », etc.</p>
                                <span class="far fa-times-circle"></span>
                                </aside>`;
    galerie.addEventListener('click', (evt) => {
      if (evt.target.className === 'far fa-times-circle') {
        this.conteneur.innerHTML = '';
      }
    });
  }

  // Affiche les mots-clés dans un formulaire (selon une liste de mots-clés et un conteneur DOM pour les accueillir)
  static inscritMotsClesParFormulaire(liste, dom) {
    dom.innerHTML = '';
    const fragment = document.createDocumentFragment();
    for (let element of liste) {
      const nouveauLi = document.createElement('li');
      fragment.appendChild(nouveauLi);
      nouveauLi.innerHTML = element.nom;
    }
    dom.appendChild(fragment); /* Affichage de la liste de mots-clés */
  }
  
  // Affiche les mots-clés dans les 3 formulaires
  static inscritMotsClesDansTroisFormulaires() {
    this.inscritMotsClesParFormulaire(ingredientsFiltres, listeIngredients);
    this.inscritMotsClesParFormulaire(appareilsFiltres, listeAppareils);
    this.inscritMotsClesParFormulaire(ustencilesFiltres, listeUstenciles);
  }
}
export const affichage = new Affichage();