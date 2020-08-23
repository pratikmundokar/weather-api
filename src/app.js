const path = require('path');
const express = require('express');
const hbs = require('hbs');
const geocode = require('./utils/geocode');
const weather = require('./utils/weather');
const PORT = process.env.PORT || 3000;

const app = express();
const name = 'Tim Acker';

// Configure handlebars templating engine and define
// a custom handlebars directory versus the views default
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, '../templates/views'));
hbs.registerPartials(path.join(__dirname, '../templates/partials'));

// Set location of static assets. This is default to serving
// index.html at the root url
app.use(express.static(path.join(__dirname, '../public')));

app.get('/', (req, res) => {
	res.render('index', {
		title: 'Weather Home Page',
		name
	});
});

app.get('/about', (req, res) => {
	res.render('about', {
		title: 'Weather About Page',
		name
	});
});

app.get('/help', (req, res) => {
	res.render('help', {
		title: 'Weather Help Page',
		name
	});
});

app.get('/weather', (req, res) => {
	const errorHandler = error => {
		res.send({ error });
	};

	if (!req.query.location) return errorHandler({ message: 'No location provided' });

	geocode(
		req.query.location,
		(error, { lat, lng, street, adminArea5, adminArea3, postalCode } = {}) => {
			if (error) return errorHandler(error);

			weather(lat, lng, (error, { summary, temperature, apparentTemperature } = {}) => {
				if (error) return errorHandler(error);

				res.send({
					location: `${street} ${adminArea5}, ${adminArea3} ${postalCode}`.trim(),
					summary,
					temperature,
					apparentTemperature
				});
			});
		}
	);
});

// Handles other help routes not specified
app.get('/help/*', (req, res) => {
	res.render('404', {
		title: '404',
		error: 'Help page not found.',
		name: 'Tim Acker'
	});
});

// Handles all other routes not specified
app.get('*', (req, res) => {
	res.render('404', {
		title: '404',
		error: 'Page not found.',
		name: 'Tim Acker'
	});
});

app.listen(PORT, () => {
	console.info(`Server listening on port ${PORT}.`);
});
