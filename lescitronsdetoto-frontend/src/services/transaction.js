export async function fetchTransactionVente(id_type_evenement) {
    const response = await fetch('/api/transaction/vente');

    if (response.ok) {
        const respJson = await response.json();
        return respJson.map(p => convertToTransactionList(p));
    } else {
        throw await createServiceError(response);
    }
}

export async function fetchTransactionAchat(id_type_evenement) {
    const response = await fetch('/api/transaction/achat');

    if (response.ok) {
        const respJson = await response.json();
        return respJson.map(p => convertToTransactionList(p));
    } else {
        throw await createServiceError(response);
    }
}

const convertToTransactionList = jsonTransaction => {
    return {
        id_evenement: jsonTransaction.id_evenement,
        id_type_evenement: jsonTransaction.id_type_evenement,
        id_client: jsonTransaction.id_client,
        user_account_id: jsonTransaction.user_account_id,
        prix_evenement: jsonTransaction.prix_evenement,
        date_heure_evenement: jsonTransaction.date_heure_evenement,
        nom_client: jsonTransaction.nom_client,
        prenom_client: jsonTransaction.prenom_client
    };
};