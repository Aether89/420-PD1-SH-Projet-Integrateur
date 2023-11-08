import session from '../session';
import axios from 'axios';

class ServiceError extends Error {
    constructor(status, message) {
        super(message);
        this.status = status;
    }
}

async function getResponseMessage(response) {
    try {
        const obj = await response.json();
        return obj.message ? obj.message : "Erreur inconnue";
    } catch (err) {
        return "" + err;
    }
}

async function createServiceError(response) {
    return new ServiceError(response.status, await getResponseMessage(response));
}

export async function createClient(InfoClient) {
    const response = await fetch(`/api/clients`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            ...session.getAuthHeaders()
        },
        body: JSON.stringify(InfoClient)
    });

    console.log(response);
    if (response.ok) {
        return response.json();
    } else {
        throw await createServiceError(response);
    }
};

async function convertToInfoClient(jsonInfoClient) {
    return {
        idClient: jsonInfoClient.idClient,
        nomClient: jsonInfoClient.nomClient,
        prenomClient: jsonInfoClient.prenomClient,
        posteClient: jsonInfoClient.posteClient,
        telephoneClient: jsonInfoClient.telephoneClient,
        numeroCivic: jsonInfoClient.numeroCivic,
        numeroAppartement: jsonInfoClient.numeroAppartement,
        nomRue: jsonInfoClient.nomRue,
        nomVille: jsonInfoClient.nomVille,
        nomProvince: jsonInfoClient.nomProvince,
        codePostal: jsonInfoClient.codePostal,
        isArchive: jsonInfoClient.isArchive
    };
};

/**
 * Récupère depuis l'API back-end la liste de tous les infoClients
 * 
 * @returns Promesse permettant d'obtenir la liste des Clients
 */
export async function fetchClient() {
    const response = await fetch('/api/clients');
    if (response.ok) {
        const respJson = await response.json();
        return respJson;
    } else {
        throw await createServiceError(response);
    }
}


export async function fetchClientById(idInfoClient) {
    const response = await axios(`/api/clients/${idInfoClient}`);
    if (response.status === 200) {
        return convertToInfoClient(response.data);
    } else {
        throw await createServiceError(response);
    }
};

export async function updateClient(infoClient) {
    const response = await fetch(`/api/clients/${infoClient.idClient}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            ...session.getAuthHeaders()
        },
        body: JSON.stringify(infoClient)
    });

    if (response.ok) {
        return convertToInfoClient(await response.json());
    } else {
        throw await createServiceError(response);
    }
}



export async function updateClientImage(idInfoClient, formData) {
    const response = await fetch(`/api/clients/${idInfoClient}/image`, {
        method: "POST",
        headers: {
            ...session.getAuthHeaders()
        },
        body: formData
    });

    if (response.ok) {
        return;
    } else {
        throw await createServiceError(response);
    }
}

export async function deleteClient(idInfoClient) {
    const response = await fetch(`/api/clients/${idInfoClient}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            ...session.getAuthHeaders()
        },
    });

    if (response.ok) {
        return;
    } else {
        throw await createServiceError(response);
    }
}