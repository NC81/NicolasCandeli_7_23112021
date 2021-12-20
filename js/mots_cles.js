export let motsClesChoisis = [];

//  DOM
const conteneurDeMotsCles = document.querySelector('.header__selec');

// Classe comportant l'ajout et la suppression de mots clés
export class MotsCles {
  // Ajout de mot clé
  static ajoute(evt, btn) {
    const boutonStyle = window.getComputedStyle(btn); /* comment ajouter cette ligne hors de l'evt (perfs) ? */
    const texteColle = evt.target.textContent.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/ /g,'');
    // Délégation d'évènement
    if ((evt.target.tagName === 'LI') && (!conteneurDeMotsCles.classList.contains(`${texteColle}`))) {
      conteneurDeMotsCles.innerHTML = '';
      motsClesChoisis.push({texte : evt.target.textContent, couleur : boutonStyle.getPropertyValue("background-color")}); /* Ajout du mot clé dans la liste dédiée (texte et couleur) */
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
    // console.log('mots clés', motsClesChoisis);
  }

  // Suppression de mot clé
  static supprime(evt) {
    const texte = evt.target.parentElement.firstElementChild.textContent;
    const texteColle = texte.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/ /g,'');
    if (evt.target.className === 'far fa-times-circle') {
      for (let i = 0; i < motsClesChoisis.length; i++) {
        if (motsClesChoisis[i].texte == texte) {
          motsClesChoisis.splice(i, 1); /* Suppression du mot clé de la liste */
          conteneurDeMotsCles.classList.remove(`${texteColle}`);
        }
      }
      evt.target.parentElement.remove(); /* Suppression du bouton correspondant */
      // console.log('mots clés', motsClesChoisis);
    }
  }
}