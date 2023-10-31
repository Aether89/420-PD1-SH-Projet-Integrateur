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


async function convertToEmploye(jsonEmploye) {
    return {
        idEmploye: jsonEmploye.idEmploye,
        nomEmploye: jsonEmploye.nomEmploye,
        prenomEmploye: jsonEmploye.prenomEmploye,
        posteEmploye: jsonEmploye.posteEmploye,
        telephoneEmploye: jsonEmploye.telephoneEmploye,
        numeroCivic: jsonEmploye.numeroCivic,
        numeroAppartement: jsonEmploye.numeroAppartement,
        nomRue: jsonEmploye.nomRue,
        nomVille: jsonEmploye.nomVille,
        nomProvince: jsonEmploye.nomProvince,
        codePostal: jsonEmploye.codePostal,
        isArchive: jsonEmploye.isArchive
    };
};

/**
 * Récupère depuis l'API back-end la liste de tous les employes
 * 
 * @returns Promesse permettant d'obtenir la liste des Employes
 */
export async function fetchEmploye() {
    const response = await axios('/api/employes');
    if (response.ok) {
        const respJson = await response.json();
        return respJson;
    } else {
        throw await createServiceError(response);
    }
}


export async function fetchemploye(idEmploye) {
    const response = await fetch(`/api/employes/${idEmploye}`);
    if (response.status === 200) {
        const data = await response.json();
        return convertToEmploye(data);
    } else {
        throw await createServiceError(response);
    }
};

export async function createEmploye(Employe) {
    const response = await fetch(`/api/employes`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            ...session.getAuthHeaders()
        },
        body: JSON.stringify(Employe)
    });

    if (response.ok) {
        return response.json();
    } else {
        throw await createServiceError(response);
    }
};

export async function updateEmploye(employe) {
    const response = await fetch(`/api/employes/${employe.idEmploye}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            ...session.getAuthHeaders()
        },
        body: JSON.stringify(employe)
    });

    if (response.ok) {
        return convertToEmploye(await response.json());
    } else {
        throw await createServiceError(response);
    }
}



export async function updateEmployeImage(idEmploye, formData) {
    const response = await fetch(`/api/Employes/${idEmploye}/image`, {
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

export async function deleteEmploye(idEmploye) {
    const response = await fetch(`/api/employes/${idEmploye}`, {
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