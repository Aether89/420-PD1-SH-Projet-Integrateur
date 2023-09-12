export async function prune(objects, value) {
    let pruneValuesSet = new Set();

    objects.forEach(object => {
        pruneValuesSet.add(object[value]);
    });

    let pruneValues = Array.from(pruneValuesSet);
    pruneValues.sort();
    return pruneValues;
}

export async function generateYears() {

    // nombre d'année à retourner dans le passé 
    const pastYears = 35

    const d = new Date();

    // determine l'année courante ajoute + 1 pour exemple les modeles 2024 qui sort durant l'année 2023
    const startingYear = d.getFullYear() + 1;
    let years = [];
    let year;
    for (let i = 0; i <= pastYears; i++) {
        year = startingYear - i;
        years.push(year);
    }

    return years;
}

export function priceFormatting(price) {
    const formattedPrice = new Intl.NumberFormat('en-CA', {
      style: 'currency',
      currency: 'CAD',
      minimumFractionDigits: 2,
    }).format(price);
  
    // Remove the currency symbol
    const priceWithoutCurrency = formattedPrice.replace(/^.*?\s/, '');
  
    return priceWithoutCurrency;
  }
  