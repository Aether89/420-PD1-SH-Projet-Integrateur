export async function prune(objects, value) {
    let pruneValuesSet = new Set();

    objects.forEach(object => {
        pruneValuesSet.add(object[value]);
    });

    let pruneValues = Array.from(pruneValuesSet);

    return pruneValues;
}