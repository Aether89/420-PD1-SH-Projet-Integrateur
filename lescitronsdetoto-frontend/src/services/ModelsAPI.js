import axios from 'axios';
import {prune} from './common';

const makeYearURL = 'https://vpic.nhtsa.dot.gov/api/vehicles/getmodelsformakeyear/make/';
const makeURL = 'https://vpic.nhtsa.dot.gov/api/vehicles/getmodelsformake/';

export async function fetchModels(make,year) {

    let apiURL;

    if (year) {
        apiURL = makeYearURL + make + '/modelyear/' + year + '?format=json';
    } else {
        apiURL = makeURL + make + '?format=json';
    }

    const options = {
        method: 'GET',
        url: apiURL
    };

    const response = await axios.request(options);
    if (response.status === 200) {
        const prunedModels = await prune(response.data.Results,"Model_Name");
        
        //console.log(JSON.stringify(prunedModels,null,"  "));
        return prunedModels;
    } else {
        throw new Error('Failed to fetch Models data');
    }
    }