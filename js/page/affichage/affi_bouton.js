import { Chaine } from '../../utilitaire/util_chaine.js';

export let motsClesChoisis = []; /* Liste de mots-clés cliqués */

// DOM
const conteneurDeMotsCles = document.querySelector('.header__selec');

// Classe comportant la création de mots-clés et l'affichage des boutons
export class MotsCles {
  constructor(nom, couleur, type, ordre) {
    this.nom = nom,
    this.couleur = couleur,
    this.type = type,
    this.ordre = ordre
  }

  // Crée un objet avec 3 propriétés à partir d'un mot-clé
  creeMotCle() {
    const motCle = { nom : this.nom, /* Nom du mot-clé */
                     couleur : this.couleur, /* Couleur du mot-clé à afficher sur le bouton selon le type */
                     type : this.type, /* Chaîne de la propriété listant les mots-clés du même type dans chaque recette */
                     ordre : this.ordre /* Ordre d'affichage du bouton associé à chaque champs secondaire */
                   };
    return motCle;
  }

  // Crée liste de mots-clés (ingrédients, appareils, ustensiles) à partir d'une liste de recettes
  static creeListe(recette, type, couleur, tableau, ordre) {
    for (let motCle of recette[type]) {
      // Si la liste d'objets ne contient pas le mot-clé ...
      if (!Chaine.harmonise(tableau.map(el => el.nom)).includes(Chaine.harmonise(motCle))) {
        const nouveauMotCle = new MotsCles(motCle, couleur, type, ordre);
        tableau.push(nouveauMotCle.creeMotCle()); /* Ajoute le mot-clé dans la liste dédiée avec 4 propriétés (nom, couleur, type, ordre) */
      }
    }
    // Tri les listes d'ingrédients, d'appareils et d'ustensils par noms
    Chaine.triParNoms(tableau, 'nom');
  }

  // Affiche un bouton pour chaque élément de la liste de mots-clés sous le champs principal
  static inscritBoutons(motsCles) {
    conteneurDeMotsCles.innerHTML = ''; /* Vidage du conteneur de mots-clés */
    for (let motCle of motsCles) {
      let nouveauBouton = document.createElement('button');
      conteneurDeMotsCles.appendChild(nouveauBouton); /* Inscription du bouton */
      nouveauBouton.classList.add('btn-mini'); /* Application du style CSS */
      nouveauBouton.innerHTML = `<span class="btn-mini__cont">${motCle.nom}</span><span class="far fa-times-circle"></span>`; /* Affichage du nom */
      nouveauBouton.style.backgroundColor = motCle.couleur; /* Coloration du bouton */
    }
  }
  
  // Ajout de mot-clé
  static ajoute(evt, liste) {
    let listeElementCible = liste.filter(el => el.nom === evt.target.textContent);
    // Délégation d'évènement : si un élément <li> est cliqué et si la liste de mot-clés ne contient pas le mot-clé cliqué ...
    if ((evt.target.tagName === 'LI') && (!motsClesChoisis.map(mot => mot.nom).includes(evt.target.textContent))) {
      motsClesChoisis.push(listeElementCible[0]); /* Ajout du mot-clé dans la liste dédiée */
    }
    this.triMotsCles(motsClesChoisis); /* Triage de la liste de mots-clés selon l'ordre attribué */
    this.inscritBoutons(motsClesChoisis); /* Affichage des boutons selon la liste triée */
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

  // Tri la liste de mots-clés par ordre croissant
  static triMotsCles(liste) {
    liste.sort(function(a, b) {
      return a.ordre - b.ordre;
    });
  }
}