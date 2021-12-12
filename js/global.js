import { barrePrincipale, recherchePrincipale, recettesFiltrees } from './rech-pri.js';
import { rechercheParMotsCles } from './rech-sec.js';

let recherche = () => {
  recherchePrincipale.filtreRecettes();
  rechercheParMotsCles.afficheTousLesTypesDeMotCle();
  rechercheParMotsCles.selectionneTousLesTypesDeMotClé();
  rechercheParMotsCles.ouvreTousLesTypesDeChamps();

  barrePrincipale.addEventListener('input', () => {
    recherchePrincipale.filtreRecettes();
    rechercheParMotsCles.afficheTousLesTypesDeMotCle();
    if (recettesFiltrees.length === 0) {
      recherchePrincipale.afficheMessage();
    }
  });
};
recherche();