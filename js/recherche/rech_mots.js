import { Affichage, galerie } from '../page/affichage/affi_recette.js';
import { Chaine } from '../utilitaire/util_chaine.js';
import { recettesFiltreesParChamps } from './rech_champs.js';

export let recettesFiltreesParMotsCles; /* Liste de recettes filtrées par les mots clés */

// Recherche par mots-clés
export class RecettesParMotsCles {
  // Filtre les recettes filtrées par le champs principal à partir d'une liste de mots-clés
  static filtre(motsCles) {
    // Création d'une liste de recettes à afficher à partir de la liste de recettes filtrées par le champs principal
    recettesFiltreesParMotsCles = recettesFiltreesParChamps.slice(0);
    // Réduction de la liste de recettes selon leur concordance avec les mots-clés actifs
    motsCles.forEach(motCle => this.reduitListe(motCle, recettesFiltreesParMotsCles, motCle.type));
    galerie.innerHTML = ''; /* Vidage du conteneur de recettes */
    // Affichage de chaque recette de la liste obtenue
    recettesFiltreesParMotsCles.forEach(recetteFiltreeParMotCle => new Affichage(recetteFiltreeParMotCle).inscritRecettes());
    // Affichage du message d'alerte
    if (recettesFiltreesParMotsCles.length === 0) {
      Affichage.inscritMessage();
    }
  }

  // Réduit la liste de recettes préalablement filtrées par le champs principal
  static reduitListe(mot, liste, type) {
    // Pour chaque recette ...
    for (let i = liste.length - 1; i >= 0; i--) {
      let motsCles = liste[i][type].filter(el => Chaine.harmonise(el).includes(Chaine.harmonise(mot.nom)));
      // Si la liste de mots-clés contenant le mot-clé ajouté est vide ...
      if (motsCles.length === 0) {
        liste.splice(i, 1); /* La recette est retirée de 'recettesFiltreesParMotsCles' */
      }
    }
  }
}