import axios from 'axios';
import {prune} from './common';

const makeYearURL = 'https://vpic.nhtsa.dot.gov/api/vehicles/getmodelsformakeyear/make/';
const makeURL = 'https://vpic.nhtsa.dot.gov/api/vehicles/getmodelsformakeyear/make/';

    export async function fetchModels(make, year) {
        let apiCarURL;
        let apiTruckURL;
        let apiMultiURL;
    
        if (year) {
            apiCarURL = makeYearURL + make + '/modelyear/' + year + '/vehicleType/car?format=json';
            apiTruckURL = makeYearURL + make + '/modelyear/' + year + '/vehicleType/truck?format=json';
            apiMultiURL = makeYearURL + make + '/modelyear/' + year + '/vehicleType/multu?format=json';

        } else {
            apiCarURL = makeURL + make + '/vehicleType/car?format=json';
            apiTruckURL = makeURL + make + '/vehicleType/truck?format=json';
            apiMultiURL = makeURL + make + '/vehicleType/multi?format=json';
        }
    
        const carOptions = {
            method: 'GET',
            url: apiCarURL
        };
    
        const truckOptions = {
            method: 'GET',
            url: apiTruckURL
        };
    
        const multiOptions = {
            method: 'GET',
            url: apiMultiURL
        };

        const [carResponse, truckResponse, multiResponse] = await Promise.all([
            axios.request(carOptions),
            axios.request(truckOptions),
            axios.request(multiOptions)
        ]);
    
        if (carResponse.status === 200 && truckResponse.status === 200 && multiResponse.status === 200) {
            const carModels = await prune(carResponse.data.Results, "Model_Name");
            const truckModels = await prune(truckResponse.data.Results, "Model_Name");
            const multiModels = await prune(multiResponse.data.Results, "Model_Name");

            const mergedModels = [...carModels, ...truckModels, ...multiModels];
            const returnModels = await prune(mergedModels);
            return returnModels;
        } else {
            throw new Error('Failed to fetch Models data');
        }
    }
    