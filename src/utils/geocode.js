const dotenv = require('dotenv');
const mapKey = process.env.MAP_API_KEY || dotenv.config().parsed.MAP_API_KEY;
const axios = require('axios');

const geocode = (address, callback) => {
	const encodedAddress = encodeURIComponent(address);
	const url = `http://www.mapquestapi.com/geocoding/v1/address?key=${mapKey}&location=${encodedAddress}`;

	axios
		.get(url)
		.then(({ data } = {}) => {
			const location = data.results[0].locations[0];

			if (data.info.statuscode === 400) {
				throw new Error('Invalid input. Please try again.');
			} else {
				callback(undefined, {
					lat: location.latLng.lat,
					lng: location.latLng.lng,
					street: location.street,
					adminArea5: location.adminArea5,
					adminArea3: location.adminArea3,
					postalCode: location.postalCode
				});
			}
		})
		.catch(error => {
			if (error.code === 'ENOTFOUND') {
				callback({ message: 'Unable to connect to servers. Please try again later.' }, undefined);
			} else {
				callback({ message: 'Cannot find location. Please try again' }, undefined);
			}
		});
};

module.exports = geocode;
