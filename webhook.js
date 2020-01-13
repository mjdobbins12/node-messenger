/* global sendMessage*/

const bodyParser = require('body-parser');
const express = require('express');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const server = app.listen(process.env.PORT || 5000, () => {
	console.log('Express server listening on port %d in %s mode', server.address().port, app.settings.env);
});

app.get('/webhook', (req, res) => {
	if (req.query['hub.mode'] && req.query['hub.verify_token'] === 'tuxedo_cat') {
		res.status(200).send(req.query['hub.challenge']);
	} else {
		res.status(403).end();
	}	
});

app.post('/webhook', (req, res) => {
	console.log(req.body);
	if (req.body.object === 'page') {
		req.body.entry.forEach((entry) => {
			entry.messaging.forEach((event) => {
				if (event.message && event.message.text) {
					sendMessage(event);
				}
			});
		});
		res.status(200).end();
	}
});
