import axios from 'axios';
import {prune} from './common';

const makeYearURL = 'https://vpic.nhtsa.dot.gov/api/vehicles/getmodelsformakeyear/make/';
const makeURL = 'https://vpic.nhtsa.dot.gov/api/vehicles/getmodelsformakeyear/make/';

    export async function fetchModels(make, year) {
        let apiCarURL;
        let apiTruckURL;
    
        if (year) {
            apiCarURL = makeYearURL + make + '/modelyear/' + year + '/vehicleType/car?format=json';
            apiTruckURL = makeYearURL + make + '/modelyear/' + year + '/vehicleType/truck?format=json';
        } else {
            apiCarURL = makeURL + make + '/vehicleType/car?format=json';
            apiTruckURL = makeURL + make + '/vehicleType/truck?format=json';
        }
    
        const carOptions = {
            method: 'GET',
            url: apiCarURL
        };
    
        const truckOptions = {
            method: 'GET',
            url: apiTruckURL
        };
    
        const [carResponse, truckResponse] = await Promise.all([
            axios.request(carOptions),
            axios.request(truckOptions)
        ]);
    
        if (carResponse.status === 200 && truckResponse.status === 200) {
            const carModels = await prune(carResponse.data.Results, "Model_Name");
            const truckModels = await prune(truckResponse.data.Results, "Model_Name");
    
            // Merge carModels and truckModels into a single array
            const mergedModels = [...carModels, ...truckModels];
    
            return mergedModels;
        } else {
            throw new Error('Failed to fetch Models data');
        }
    }
    