import { recipes } from './rece_brutes.js'
import { Chaine } from '../utilitaire/util_chaine.js'

export let recettesNonFiltrees = []; /* Recettes tirées des données json */

// Crée une liste de recettes tirée des données json au chargement de la page
export let creeListeRecettesNonFiltrees = () => {
  // const debut = Date.now();
  // Remplissage de la liste
  recettesNonFiltrees = recipes.slice(0) /* Copie de la liste json */
  Chaine.triParNoms(recettesNonFiltrees, 'name'); /* Tri par nom de recettes */
  // Modification des propriétés de chaque recette pour faciliter la recherche
  recettesNonFiltrees.map(recette =>  {
    // Ajustemement des caractères et création d'une liste d'appareils
    recette.aliments = recette.ingredients.map(portion => Chaine.ajusteTaille(portion.ingredient))
    recette.ustensils = recette.ustensils.map(ustensile => Chaine.ajusteTaille(ustensile))
    recette.appliance = Chaine.ajusteTaille(recette.appliance).split();
    // Ajout d'une propriété contenant une chaîne de tous les mots ciblés par la recherche principale 
    const resume = `${recette.name} ${recette.aliments} ${recette.appliance} ${recette.ustensils} ${recette.description}`;
    recette.resume = Chaine.harmonise(resume);
  })
  // const fin = Date.now();
  // const duree = fin - debut;
  // console.log('duree', duree)
}