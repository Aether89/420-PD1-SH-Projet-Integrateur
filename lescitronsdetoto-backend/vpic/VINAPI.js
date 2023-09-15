const axios = require('axios');

const apiURL = 'https://vpic.nhtsa.dot.gov/api/vehicles/decodevinvaluesextended/';

async function fetchVIN(vin) {
    const options = {
        method: 'GET',
        url: apiURL + vin + '?format=json',
    };

    const response = await axios.request(options);
    const data = response.data.Results[0];
    console.log("errorcode = ", data.ErrorCode);
    if (data.ErrorCode === "0") {
        const filteredData = {
            ErrorCode: data.ErrorCode,
            Make: data.Make,
            Model: data.Model,
            ModelYear: data.ModelYear,
        };

        return filteredData;
    } else {
        return data.ErrorCode = 1;
    }
}

module.exports = fetchVIN;