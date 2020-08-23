const dotenv = require('dotenv');
const weatherKey = process.env.WEATHER_API_KEY || dotenv.config().parsed.WEATHER_API_KEY;
const axios = require('axios');

const weather = (lat, lng, callback) => {
	const url = `https://api.darksky.net/forecast/${weatherKey}/${lat},${lng}`;

	axios
		.get(url)
		.then(({ data } = {}) => {
			callback(undefined, {
				summary: data.daily.data[0].summary,
				temperature: data.currently.temperature,
				apparentTemperature: data.currently.apparentTemperature
			});
		})
		.catch(error => {
			if (error.code === 'ENOTFOUND') {
				callback({ message: 'Unable to connect to servers. Please try again later.' }, undefined);
			} else if (error.response.status === 400) {
				callback({ message: 'Invalid input. Please try again.' }, undefined);
			} else {
				callback({ message: error.message }, undefined);
			}
		});
};

module.exports = weather;
