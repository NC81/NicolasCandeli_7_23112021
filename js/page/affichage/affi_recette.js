import { champsPrincipal } from '../champs/cham_principal.js';
import { filtreRecettesParChamps } from '../../recherche/rech_champs.js';

// DOM
export const galerie = document.querySelector('.galerie');

// Classe comportant les méthodes d'affichage de recettes
export class Affichage {
  constructor(recette) {
    this.recette = recette
  }
  
  // Affiche les recettes correspondant à la recherche puis renvoie un booléen (callback de la méthode filter)
  filtre(chaine) {
    // Pour chaque recette, si la valeur du champs est contenue dans la propriété 'resume'...
    if (this.recette.resume.includes(chaine)) {
      this.inscritRecettes(); /* Affichage de la recette */
      return true; /* Ajout de la recette à la liste "recettesFiltreesParChamps" */
    } else {
      return false;
    }
  }

  // Affiche la recette filtrée
  inscritRecettes() {
    const fragment = document.createDocumentFragment()
    // Création de la recette
    const article = document.createElement('article');
    fragment.appendChild(article); /* Ajout du noeud de l'article dans le fragment */
    article.classList.add('plat');
    // Définition de la syntaxe HTML de l'article
    article.innerHTML = `<img src="https://via.placeholder.com/150/C7BEBE?text=+" alt="" />
                         <div class="info-bulle" data-titre="${this.recette.name}" class="tooltiptext"></div>
                         <div class="plat-intro">
                           <h2>${this.recette.name}</h2>
                           <div><span class="plat-intro__icone far fa-clock"></span><span class="plat-intro__duree">${this.recette.time} min</span></div>
                           <div></div>
                         </div>
                         <button class="btn-ext" data-ouvert="false"><i class="fas fa-chevron-down"></i></button>
                         <div class="plat-recette">
                           <ul class="plat-recette__liste"></ul>
                           <p class="plat-recette__descr">${this.recette.description}</p>
                         </div>`;
    // Génération d'ingrédients dans la recette
    for (let portion of this.recette.ingredients) {
      const li = document.createElement('li');
      article.children[4].children[0].appendChild(li);
      // Remplissage de la liste d'ingrédients
      li.innerHTML = `<span class="plat-recette__ingr">${portion.ingredient}</span><span class="plat-recette__quant">${this.constructor.afficheDeuxPoints(portion) + (portion.quantity ?? '')} ${portion.unit ?? ''}</span>`;
    }
    galerie.appendChild(fragment); /* Affichage de la recette */

    // Ajout de propriétés renvoyant au DOM (article, titre, info-bulle, description, ingrédients, bouton d'extension)
    this.recette.DOM_art = article;
    this.recette.DOM_tit = article.children[2].children[0];
    this.recette.DOM_bul = article.children[1];
    this.recette.DOM_des = article.lastChild.children[1];
    this.recette.DOM_ing = article.lastChild.children[0];
    this.recette.DOM_btn = article.children[3];
    
    this.inscritInfoBulle(); /* Affichage de l'info-bulle pour les titres dont le contenu déborde */
    this.inscritBouton(); /* Ajout du bouton d'extension aux recettes dont le contenu (description ou liste d'ingrédients) déborde */
  }

  inscritInfoBulle() {
    // Affichage de l'info-bulle
    const largeurVisibleTitre = this.recette.DOM_tit.offsetWidth; /* Largeur du titre visible (px) */
    const largeurTotaleTitre = this.recette.DOM_tit.scrollWidth; /* Largeur totale (visible et non visible) du titre (px) */
    // Si le titre déborde ...
    if (largeurVisibleTitre < largeurTotaleTitre) {
      const titre = this.recette.DOM_tit;
      const infoBulle = this.recette.DOM_bul;
      // Évènements d'affichage de l'info-bulle
      titre.style.cursor = 'pointer';
      titre.addEventListener('mouseover', () => {
        infoBulle.style.visibility = 'visible'; /* Affiche l'info-bulle au survol */
      });
      titre.addEventListener('mouseout', () => {
        infoBulle.style.visibility = 'hidden'; /* Rend l'info-bulle invisible à l'issue du survol */
      });
    }
  }

  // Affiche le bouton d'extension et le rend fonctionnel
  inscritBouton() {
    // Affichage du bouton d'extension sur les recettes dont le contenu déborde
    const hauteurTotaleDescription = this.recette.DOM_des.scrollHeight; /* Hauteur totale (visible et non visible) de la description (px) */
    const hauteurTotaleIngredients = this.recette.DOM_ing.scrollHeight; /* Hauteur totale (visible et non visible) de la liste d'ingrédients (px) */
    const hauteurVisibleDescription = 97; /* Hauteur du contenu visible de la decription (px) */
    const hauteurVisibleIngredients = 101; /* Hauteur du contenu visible de la liste d'ingrédients (px) */
    const hauteurNormaleArticle = 364; /* Hauteur de l'article de recette (px) */
    let hauteurSupplementaire; /* Hauteur supplémentaire à ajouter à l'article lors de l'extension */
 
    // Si le contenu déborde la liste d'ingrédients ou la description ...
    if ((hauteurVisibleDescription < hauteurTotaleDescription) || (hauteurVisibleIngredients < hauteurTotaleIngredients)) {
      // Affectation de la taille selon le débordement le plus large
      if (hauteurTotaleDescription >= hauteurTotaleIngredients) {
        hauteurSupplementaire = hauteurTotaleDescription - hauteurVisibleDescription; /* Affectation de la taille de l'extension selon le débordement de la description */
      } else {
        hauteurSupplementaire = hauteurTotaleIngredients - hauteurVisibleIngredients; /* Affectation de la taille de l'extension selon le débordement de la liste d'ingrédients */
      }
      const hauteurEtendueArticle = hauteurNormaleArticle + hauteurSupplementaire; /* Hauteur finale de l'article après son extension */
      // Évènement de cliquage du bouton d'extension
      this.recette.DOM_btn.dataset.visible = 'true'; /* Rend le bouton visible */
      // Lors d'un cliquage de bouton d'extension ...
      this.recette.DOM_btn.addEventListener('click', () => {
        /* Si l'article n'a pas été déjà aggrandi ... */
        if (this.recette.DOM_art.dataset.ouvert != 'true') {
          this.recette.DOM_btn.innerHTML = `<i class="fas fa-chevron-up"></i>`; /* Changement d'icône */
          this.recette.DOM_btn.dataset.ouvert = 'true'; /* Changement du style du bouton */
          this.recette.DOM_art.style.height = `${hauteurEtendueArticle}px`; /* Affectation de la nouvelle hauteur de l'article */
          this.recette.DOM_art.dataset.ouvert = 'true'; /* Enregistrement de l'état de l'article */
          this.recette.DOM_ing.dataset.ellipse = 'false'; /* Affichage de tout le contenu de la liste d'ingrédients */
          this.recette.DOM_des.dataset.ellipse = 'false'; /* Affichage de tout le contenu de la description */
        }
        // Sinon ...
        else {
          this.recette.DOM_btn.innerHTML = `<i class="fas fa-chevron-down"></i>`;
          this.recette.DOM_btn.dataset.ouvert = 'false';
          this.recette.DOM_art.style.height = `${hauteurNormaleArticle}px`;
          this.recette.DOM_art.dataset.ouvert = 'false';
          this.recette.DOM_ing.dataset.ellipse = 'true';
          this.recette.DOM_des.dataset.ellipse = 'true';
        }
      });
    }
  }

  // N'affiche ':' après un ingrédient que seulement si sa quantité est définie
  static afficheDeuxPoints(el) {
    if (el.quantity === undefined) {
      return '';
    } else {
      return ': ';
    }
  }

  // Affiche un message en cas de recherche infructueuse
  static inscritMessage() {
    galerie.innerHTML = `<aside class="alerte secouage">
                                <p>Aucune recette ne correspond à votre critère… vous pouvez chercher « tarte aux pommes », « poisson », etc.</p>
                                <span class="far fa-times-circle"></span>
                                </aside>`;
    galerie.addEventListener('click', (evt) => {
      if (evt.target.className === 'far fa-times-circle') { /* Lors d'un cliquage sur l'icône de fermeture ... */
        champsPrincipal.value = ''; /* Vidage du champs principal */
        filtreRecettesParChamps(); /* Chargement de toutes les recettes */
      }
    });
  }
}