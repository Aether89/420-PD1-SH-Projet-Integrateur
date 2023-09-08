import session from '../session';
import { createServiceError } from '../ErrorService';

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