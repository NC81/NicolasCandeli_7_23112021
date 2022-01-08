// Classe comportant les méthodes harmonisant les chaînes de caractères
export class Utilitaire {
  // Transforme la première lettre en majuscule et le reste en minucules
  static ajusteTaille(texte) {
  return texte.charAt(0).toUpperCase() + texte.toLowerCase().slice(1);
  }
  
  // Remplace les accents, trémas et cédilles dans les chaînes de caractères
  static harmonise(texte) {
    return texte.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
  }

  // Remplace les accents, trémas et cédilles dans les listes
  static harmoniseListe(liste) {
    let tableau = [];
    for (let element of liste) {
       tableau.push(this.harmonise(element))
    }
    return tableau;
  }

  // N'affiche ':' après un ingrédient que seulement si sa quantité est définie
  static afficheDeuxPoints(el) {
    if (el.quantity === undefined) {
      return '';
    } else {
      return ': ';
    }
  }
}