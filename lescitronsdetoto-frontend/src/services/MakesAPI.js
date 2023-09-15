import axios from 'axios';
import {prune} from './common';

const apiURL = 'https://vpic.nhtsa.dot.gov/api/vehicles/GetMakesForVehicleType/car?format=json';

export async function fetchMakes() {
    
    const options = {
        method: 'GET',
        url: apiURL,
    };

    const response = await axios.request(options);
    if (response.status === 200) {
        const prunedMakes = await prune(response.data.Results,"MakeName");
        
        //console.log(JSON.stringify(prunedMakes,null,"  "));
        return prunedMakes;
    } else {
        throw new Error('Failed to fetch Makes data');
    }
}
