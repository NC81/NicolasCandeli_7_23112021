// Classe comportant les méthodes utilitaires ciblant les chaînes de caractères
export class Chaine {
  // Transforme la première lettre en majuscule et le reste en minucules
  static ajusteTaille(texte) {
  return texte.charAt(0).toUpperCase() + texte.toLowerCase().slice(1);
  }
  
  // Remplace les accents, trémas et cédilles dans les chaînes de caractères et les listes
  static harmonise(elements) {
    if (typeof elements === 'string') {
      return elements.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
    } 
    if (typeof elements === 'object') {
      return elements.map(element => this.harmonise(element));
    }
  }

  // Tri les listes par ordre alphabétique
  static triParNoms(liste, propriete) {
    liste.sort(function(a, b) {
      if (a[propriete] < b[propriete]) { 
        return -1; 
      }
      if (a[propriete] > b[propriete]) { 
        return 1;
      }
      return 0;
    });
  }
}