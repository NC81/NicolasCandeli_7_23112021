import { barrePrincipale, recherchePrincipale } from './js/rech-pri.js';
import { rechercheParMotsCles } from './js/rech-sec.js';

let recherche = () => {
  recherchePrincipale.afficheLesRecettes();
  rechercheParMotsCles.afficheTousLesMotsCles();
  rechercheParMotsCles.ouvreTousLesChamps();

  barrePrincipale.addEventListener('input', () => {
    recherchePrincipale.afficheLesRecettes();
    rechercheParMotsCles.afficheTousLesMotsCles();
  })
};
recherche();