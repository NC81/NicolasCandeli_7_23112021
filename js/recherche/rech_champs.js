import { recettesNonFiltrees } from '../donnees/rece_modifiees.js';
import { Chaine } from '../utilitaire/util_chaine.js';
import { Affichage, galerie } from '../page/affichage/affi_recette.js';
import { motsClesChoisis } from '../page/affichage/affi_bouton.js';
import { RecettesParMotsCles } from './rech_mots.js';

export const champsPrincipal = document.querySelector('#rech-princ'); /* Champs principal (DOM) */
export let recettesFiltreesParChamps; /* Liste de recettes filtrées par le champs principal */
let filtrageInitialActive = true; /* Booléen activant/désactivant le filtrage initial de recettes (au chargement et lorsque la longueur du champs est inférieure à 3) */

// Filtre les recettes correspondant à la valeur du champs (affiche les recettes et les range dans 'recettesFiltreesParChamps')
export let filtreRecettesParChamps = () => {
  // const debut = Date.now();
  const entree =  Chaine.harmonise(champsPrincipal.value);
  // Si le champs est composé de moins de 3 caractères et que les recettes non filtrées n'ont pas déjà été affichées
  if ((entree.length < 3) && (filtrageInitialActive)) {
    // Si la liste de mots-clés est vide ...
    if (motsClesChoisis.length === 0) {
      galerie.innerHTML = ''; /* Vidage du conteneur de recettes */
      recettesNonFiltrees.forEach(recette => new Affichage(recette).inscritRecettes()); /* Affichage de toutes les recettes non filtrées */
      recettesFiltreesParChamps = recettesNonFiltrees.slice(0); /* Affectation de la liste de recettes filtrées */
    // Si la liste de mots-clés n'est pas vide ...
    } else {
    recettesFiltreesParChamps = recettesNonFiltrees.slice(0); /* Affectation de la liste de recettes filtrées */
    RecettesParMotsCles.filtre(motsClesChoisis); /* Appel du filtrage par mots-clés */
    }
    filtrageInitialActive = false; /* Désactivation du filtrage initial */
  // Si le champs est composé d'au moins 3 caractères ...
  } else if (entree.length >= 3) {
    // Si la liste de mots-clés est vide ...
    if (motsClesChoisis.length === 0) {
      galerie.innerHTML = ''; /* Vidage du conteneur de recettes */
      recettesFiltreesParChamps = recettesNonFiltrees.filter(recette => new Affichage(recette).filtre(entree)); /* Affectation de la liste de recettes filtrées et affichage des recettes */
    // Si la recherche est infructueuse ...
    if (recettesFiltreesParChamps.length === 0) {
      Affichage.inscritMessage(); /* Affichage du message d'alerte */
    }
    // Si la liste de mots-clés n'est pas vide ...
    } else {
    recettesFiltreesParChamps = recettesNonFiltrees.filter(recette => recette.resume.includes(entree)); /* Affectation de la liste de recettes filtrées */
    RecettesParMotsCles.filtre(motsClesChoisis); /* Appel du filtrage par mots-clés */
    }
    filtrageInitialActive = true; /* Activation du filtrage initial */
  }
  // const fin = Date.now();
  // const duree = fin - debut;
  // console.log('duree', duree)
}