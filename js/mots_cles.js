export let motsClesChoisis = []; /* Liste de mots-clés cliqués */

//  DOM
const conteneurDeMotsCles = document.querySelector('.header__selec');

// Classe comportant les méthodes d'ajout et de suppression de mots-clés appelées par des évènements de cliquage (secondaires.js)
export class MotsCles {
  constructor(nom, couleur, type) {
    this.nom = nom,
    this.couleur = couleur,
    this.type = type
  }

  // Crée un objet avec 3 propriétés à partir d'un mot-clé
  creeMotCle() {
    const motCle = { nom : this.nom, /* Chaîne du mot-clé */
                     couleur : this.couleur, /* Couleur du mot-clé à afficher sur le bouton (dépendant de son type) */
                     type : this.type /* Nom de la propriété listant les mots-clés du même type dans chaque recette */
                   };
    return motCle;
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
    // Délégation d'évènement : si le contenu de la cible correspond à un élément de la liste générale de mots-clés et si la liste de mot-clés cliqués ne contient pas le mot-clé ciblé ...
    let listeElementCible = liste.filter(el => el.nom === evt.target.textContent);
    if ((evt.target.textContent === listeElementCible[0].nom) && (!motsClesChoisis.map(mot => mot.texte).includes(evt.target.textContent))) {
      motsClesChoisis.push(listeElementCible[0]); /* Ajout du mot-clé dans la liste dédiée */
      this.creeBouton(listeElementCible[0]); /* Appel de la méthode de création de bouton */
    }
    console.log('mots-clés', motsClesChoisis);
  }

  // Suppression de mot-clé
  static supprime(evt) {
    const texte = evt.target.parentElement.firstElementChild.textContent; /* Chaîne du bouton cliqué */
    // Délégation d'évènement : si la cible est l'icône placée dans le bouton du mot-clé ...
    if (evt.target.className === 'far fa-times-circle') {
      for (let i = 0; i < motsClesChoisis.length; i++) {
        // Et si la chaîne du bouton correspond à un élément de la liste de mots-clés ...
        if (motsClesChoisis[i].nom === texte) {
          motsClesChoisis.splice(i, 1); /* Suppression du mot-clé de la liste */
        }
      }
      evt.target.parentElement.remove(); /* Effacement du bouton du DOM */
      console.log('mots-clés', motsClesChoisis);
    }
  }
}