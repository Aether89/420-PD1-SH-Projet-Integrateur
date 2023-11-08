import session from '../session';
import axios from 'axios';

async function createServiceError(response) {
    console.error(`Error ${response.status}: ${response.statusText}`);
}

export async function saveAvailability(availability) {
    const response = await fetch(`/api/availability`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            ...session.getAuthHeaders()
        },
        body: JSON.stringify(availability)
    });

    if (response.ok) {
        return response.json();
    } else {
        createServiceError(response);
    }
}

export async function saveAppointment(availability) {
    const options = {
        method: "PUT",
        url: '/api/rendezvous',
        headers: {
            "Content-Type": "application/json",
            ...session.getAuthHeaders()
        },
        data: JSON.stringify(availability)
    };
    
    const response = await axios.request(options);
        if (response.status === 200) {
            return {status: 200};
    } else {
        return {status: 500, error: createServiceError(response)};
    }
}

export async function fetchAvailability() {
    const options = {
        method: 'GET',
        url: '/api/availability',
        headers: {
            ...session.getAuthHeaders()
        }
    };

    const response = await axios.request(options);
    if (response.status === 200) {
        return response;
    } else {
        return {status: 500};
    }
};

export async function fetchAvailabilities() {
    const options = {
        method: 'GET',
        url: '/api/availability/all',
        headers: {
            ...session.getAuthHeaders()
        }
    };

    const response = await axios.request(options);
    if (response.status === 200) {
        return response;
    } else {
        return {status: 500};
    }
};