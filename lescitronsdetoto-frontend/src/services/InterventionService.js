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

export async function createInterventionWvin(Intervention, vin) {
    const response = await fetch(`/api/interventions/wvin/${vin}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            ...session.getAuthHeaders()
        },
        body: JSON.stringify(Intervention)
    });

    if (response.ok) {
        return response.json();
    } else {
        throw await createServiceError(response);
    }
};

export async function createIntervention(Intervention) {
    const response = await fetch(`/api/interventions`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            ...session.getAuthHeaders()
        },
        body: JSON.stringify(Intervention)
    });

    if (response.ok) {
        return response.json();
    } else {
        throw await createServiceError(response);
    }
};

async function convertToIntervention(jsonIntervention) {
    return {
        idIntervention: jsonIntervention.idIntervention,
        typeIntervention: jsonIntervention.typeIntervention,
        valeurIntervention: jsonIntervention.valeurIntervention,
        etatIntervention: jsonIntervention.etatIntervention
    };
};

/**
 * Récupère depuis l'API back-end la liste de tous les Interventions
 * 
 * @returns Promesse permettant d'obtenir la liste des Interventions
 */
export async function fetchIntervention() {
    const response = await fetch('/api/interventions');
    if (response.ok) {
        const respJson = await response.json();
        return respJson;
    } else {
        throw await createServiceError(response);
    }
}

export async function fetchInterventionByVIN(vin) {
    const response = await axios(`/api/interventions/wvin/${vin}`);
    if (response.status === 200) {
        return convertToIntervention(response.data);
    } else {
        throw await createServiceError(response);
    }
};

export async function fetchInterventionById(idIntervention) {
    const response = await axios(`/api/interventions/${idIntervention}`);
    if (response.status === 200) {
        return convertToIntervention(response.data);
    } else {
        throw await createServiceError(response);
    }
};

export async function updateIntervention(Intervention) {
    const response = await fetch(`/api/interventions/${Intervention.idIntervention}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            ...session.getAuthHeaders()
        },
        body: JSON.stringify(Intervention)
    });

    if (response.ok) {
        return convertToIntervention(await response.json());
    } else {
        throw await createServiceError(response);
    }
}

export async function updateInterventionWvin(Intervention,vin) {
    const response = await fetch(`/api/interventions/wvin/${Intervention.idIntervention}/${vin}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            ...session.getAuthHeaders()
        },
        body: JSON.stringify(Intervention)
    });

    if (response.ok) {
        return convertToIntervention(await response.json());
    } else {
        throw await createServiceError(response);
    }
}




export async function deleteIntervention(idIntervention) {
    const response = await fetch(`/api/interventions/${idIntervention}`, {
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

export async function fetchInterventionWvinById(idIntervention,vin) {
    const response = await axios(`/api/interventions/wvin/${idIntervention}/${vin}`);
    if (response.status === 200) {
        return convertToIntervention(response.data);
    } else {
        throw await createServiceError(response);
    }
};



export async function deleteInterventionWvin(idIntervention,vin) {
    const response = await fetch(`/api/interventions/wvin/${idIntervention}/${vin}`, {
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