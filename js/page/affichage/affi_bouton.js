import { Chaine } from '../../utilitaire/util_chaine.js';

export let motsClesChoisis = []; /* Liste de mots-clés cliqués */

//  DOM
const conteneurDeMotsCles = document.querySelector('.header__selec');

// Classe comportant la création de mots-clés et l'affichage des boutons
export class MotsCles {
  constructor(nom, couleur, type) {
    this.nom = nom,
    this.couleur = couleur,
    this.type = type
  }

  // Crée un objet avec 3 propriétés à partir d'un mot-clé
  creeMotCle() {
    const motCle = { nom : this.nom, /* Nom du mot-clé */
                     couleur : this.couleur, /* Couleur du mot-clé à afficher sur le bouton selon le type */
                     type : this.type /* Chaîne de la propriété listant les mots-clés du même type dans chaque recette */
                   };
    return motCle;
  }

  // Crée liste de mots-clés (ingrédients, appareils, ustensiles) à partir d'une liste de recettes
  static creeListe(recette, type, couleur, tableau) {
    for (let motCle of recette[type]) {
      // Si la liste d'objets ne contient pas le mot-clé ...
      if (!Chaine.harmonise(tableau.map(el => el.nom)).includes(Chaine.harmonise(motCle))) {
        const nouveauMotCle = new MotsCles(motCle, couleur, type);
        tableau.push(nouveauMotCle.creeMotCle()); /* Ajoute le mot-clé dans la liste dédiée avec 3 propriétés (nom, couleur, type) */
      }
    }
    // Tri les listes d'ingrédients, d'appareils et d'ustensils par noms
    Chaine.triParNoms(tableau, 'nom');
  }

  // Crée un bouton de mot-clé sous le champs principal
  static creeBouton(element) {
    let nouveauBouton = document.createElement('button');
    conteneurDeMotsCles.appendChild(nouveauBouton);
    nouveauBouton.classList.add('btn-mini');
    nouveauBouton.innerHTML = `<span class="btn-mini__cont">${element.nom}</span><span class="far fa-times-circle"></span>`;
    nouveauBouton.style.backgroundColor = element.couleur;
  }
  
  // Ajout de mot-clé
  static ajoute(evt, liste) {
    let listeElementCible = liste.filter(el => el.nom === evt.target.textContent);
    // Délégation d'évènement : si la liste de mot-clés ne contient pas le mot-clé cliqué ...
    if (!motsClesChoisis.map(mot => mot.nom).includes(evt.target.textContent)) {
      motsClesChoisis.push(listeElementCible[0]); /* Ajout du mot-clé dans la liste dédiée */
      this.creeBouton(listeElementCible[0]); /* Appel de la méthode de création de bouton */
    }
  }

  // Suppression de mot-clé
  static supprime(evt) {
    const chaine = evt.target.parentElement.firstElementChild.textContent; /* Chaîne du bouton cliqué */
    // Délégation d'évènement : si la cible est l'icône placée dans le bouton du mot-clé ...
    if (evt.target.className === 'far fa-times-circle') {
      for (let i = 0; i < motsClesChoisis.length; i++) {
        // Et si la chaîne du bouton correspond à un élément de la liste de mots-clés ...
        if (motsClesChoisis[i].nom === chaine) {
          motsClesChoisis.splice(i, 1); /* Suppression du mot-clé de la liste */
        }
      }
      evt.target.parentElement.remove(); /* Effacement du bouton du DOM */
    }
  }
}