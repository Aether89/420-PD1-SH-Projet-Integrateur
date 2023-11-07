import session from '../session';
import { createServiceError } from '../ErrorService';
import { convertToVehicule,convertToVehiculeUpdate, convertToVehiculefr } from './VehicleDB';

export async function createVehicule(vehicule) {
    const response = await fetch(`/api/vehicule`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            ...session.getAuthHeaders()
        },
        body: JSON.stringify(vehicule)
    });

    if (response.ok) {
        return convertToVehicule(await response.json());
    } else {
        throw await createServiceError(response);
    }
}

export async function udpateVoiture(vehicule) {

    
    const response = await fetch(`/api/vehicule/${vehicule.vin}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            ...session.getAuthHeaders()
        },
        body: JSON.stringify(vehicule)
    });

    if (response.ok) {
        return convertToVehicule(await response.json());
    } else {
        throw await createServiceError(response);
    }
}

export async function deleteVehicule(id) {
    const response = await fetch(`/api/vehicule/${id}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            ...session.getAuthHeaders()
        }
    }).then((response) => {
        if (response.ok) {
            return response.json();
        } else {
            throw  createServiceError(response);
        }
    });
    return response;
}

export async function getVehiculefr(vin) {

        const response = await fetch(`/api/vehicule/${vin}`);
  
        if (response.ok) {
          return convertToVehiculefr(await response.json());
        } else {
          throw new Error("Failed to fetch vehicle data");
        }
  };