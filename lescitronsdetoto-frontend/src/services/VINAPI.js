import axios from 'axios';

const apiURL = 'https://vpic.nhtsa.dot.gov/api/vehicles/decodevinvaluesextended/';

export async function fetchVIN(vin) {

    const options = {
        method: 'GET',
        url: apiURL + vin + '?format=json',
    };

    const response = await axios.request(options);
    if (response.data.Results[0].ErrorCode === "0") {
        return response.data.Results[0];
    } else {
        throw response.data.Results[0].ErrorText;
    }
}