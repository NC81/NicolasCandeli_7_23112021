import { ChampsPrincipal } from './page/champs/cham_principal.js';
import { ChampsAvance } from './page/champs/cham_avances.js';
import { filtreRecettesParChamps } from './recherche/rech_champs.js';
import { creeListeRecettesNonFiltrees, recettesNonFiltrees } from './donnees/rece_modifiees.js';

// CHARGEMENT DE LA PAGE
creeListeRecettesNonFiltrees(); /* Création de la liste initiale de recettes à filtrer */
filtreRecettesParChamps(); /* Filtrage des recettes à partir d'un champs vide */
ChampsAvance.creeListesMotsCles(recettesNonFiltrees); /* Création des listes de mots-clés */
ChampsAvance.inscritMotsClesDansTousLesFormulaires(); /* Affichage des mots-clés dans chaque formulaire */

// ÉVÈVEMENTS
ChampsPrincipal.active(); /* Filtrage des recettes par le champs principal et inscription des mots-clés dans chaque formulaire */
ChampsAvance.ouvreEtFermeTousLesFormulaires(); /*  Ouverture et fermeture des formulaires */
ChampsAvance.filtreRecettesParTousLesMotCles(); /* Ajout de mot-clé au cliquage des <li> dans les formulaires  */
ChampsAvance.supprimeMotCle(); /* Suppresion de mots-clés au cliquage du (X) des boutons de mots-clés */
ChampsAvance.filtreTousLesMotsCles(); /* Filtrage de mots-clés par les champs avancés */