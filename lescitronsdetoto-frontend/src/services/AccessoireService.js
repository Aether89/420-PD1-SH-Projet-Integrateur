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

export async function createAccessoire(Accessoire) {
    const response = await fetch(`/api/accessoires`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            ...session.getAuthHeaders()
        },
        body: JSON.stringify(Accessoire)
    });

    if (response.ok) {
        return response.json();
    } else {
        throw await createServiceError(response);
    }
};

async function convertToAccessoire(jsonAccessoire) {
    return {
        idAccessoire: jsonAccessoire.idAccessoire,
        nomAccessoire: jsonAccessoire.nomAccessoire
    };
};

/**
 * Récupère depuis l'API back-end la liste de tous les Accessoires
 * 
 * @returns Promesse permettant d'obtenir la liste des Accessoires
 */
export async function fetchAccessoire() {
    const response = await fetch(`/api/accessoires`);
    if (response.ok) {
        const respJson = await response.json();
        return respJson;
    } else {
        throw await createServiceError(response);
    }
}


export async function fetchAccessoireById(idAccessoire) {
    const response = await axios(`/api/accessoires/${idAccessoire}`);
    if (response.status === 200) {
        return convertToAccessoire(response.data);
    } else {
        throw await createServiceError(response);
    }
};

export async function updateAccessoire(Accessoire) {
    const response = await fetch(`/api/accessoires/${Accessoire.idAccessoire}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            ...session.getAuthHeaders()
        },
        body: JSON.stringify(Accessoire)
    });

    if (response.ok) {
        return convertToAccessoire(await response.json());
    } else {
        throw await createServiceError(response);
    }
}



export async function updateAccessoireImage(idAccessoire, formData) {
    const response = await fetch(`/api/accessoires/${idAccessoire}/image`, {
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

export async function deleteAccessoire(idAccessoire) {
    const response = await fetch(`/api/accessoires/${idAccessoire}`, {
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

export async function addAccessoire(Accessoire, vin) {
    const response = await fetch(`/api/accessoires/add/${vin}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            ...session.getAuthHeaders()
        },
        body: JSON.stringify(Accessoire)
    });

    if (response.ok) {
        return response.json();
    } else {
        throw await createServiceError(response);
    }
}

export async function deleteAccessoireWvin(idAccessoire, vin) {
    const response = await fetch(`/api/accessoires/${idAccessoire}/${vin}`, {
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

export async function fetchAccessoireWvin(vin) {
    const response = await fetch(`/api/accessoires/Wvin/${vin}`);
    if (response.ok) {
        const respJson = await response.json();
        return respJson;
    } else {
        throw await createServiceError(response);
    }
}


export async function fetchAccessoireWvinById(idAccessoire,vin) {
    const response = await axios(`/api/accessoires/${vin}/${idAccessoire}`);
    if (response.status === 200) {
        return convertToAccessoire(response.data);
    } else {
        throw await createServiceError(response);
    }
};