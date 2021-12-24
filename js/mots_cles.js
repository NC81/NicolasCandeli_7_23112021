export let motsClesChoisis = [];

//  DOM
const conteneurDeMotsCles = document.querySelector('.header__selec');

// Classe comportant les méthodes d'ajout et de suppression de mots clés appelées par des évènements de cliquage (secondaires.js)
export class MotsCles {
  // Ajout de mot clé
  static ajoute(evt, btn) {
    const boutonStyle = window.getComputedStyle(btn); /* Style du bouton d'ouverture */
    // Délégation d'évènement (si la cible est un élément <li> et si le tableau de mot clés ne contient pas sa chaîne ...)
    if ((evt.target.tagName === 'LI') && (!motsClesChoisis.map(mot => mot.texte).includes(evt.target.textContent))) {
      conteneurDeMotsCles.innerHTML = '';
      // ... alors le mot clé est ajouté dans la liste dédiée ("texte" : chaîne du mot clé, "couleur" : couleur du bouton d'ouverture)
      motsClesChoisis.push({texte : evt.target.textContent, couleur : boutonStyle.getPropertyValue("background-color")}); 
      // Création de boutons de mots clés
      for (let motCle of motsClesChoisis) {
        let nouveauBouton = document.createElement('button');
        conteneurDeMotsCles.appendChild(nouveauBouton);
        nouveauBouton.classList.add('btn-mini');
        nouveauBouton.innerHTML = `<span class="btn-mini__cont">${motCle.texte}</span><span class="far fa-times-circle"></span>`;
        nouveauBouton.style.backgroundColor = motCle.couleur; /* Exploitation de la couleur du bouton d'ouverture */
      }
    }
    // console.log('mots clés', motsClesChoisis);
  }

  // Suppression de mot clé
  static supprime(evt) {
    const texte = evt.target.parentElement.firstElementChild.textContent; /* Chaîne du bouton cliqué */
    // Délégation d'évènement : si la cible est l'icône placée dans le bouton du mot clé ...
    if (evt.target.className === 'far fa-times-circle') {
      for (let i = 0; i < motsClesChoisis.length; i++) {
        // et si la chaîne du bouton correspond à un objet de la liste de mots clés ...
        if (motsClesChoisis[i].texte === texte) {
          motsClesChoisis.splice(i, 1); /* ... alors le mot clé est supprimé de la liste ... */
        }
      }
      evt.target.parentElement.remove(); /* ... et le bouton est retiré du DOM */
      // console.log('mots clés', motsClesChoisis);
    }
  }
}