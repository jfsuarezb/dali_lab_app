// Initial requirements and server set-up
require('dotenv').config();
const client = require('twilio')(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN)
const app = require('express')();
const port = 8000;
const urlEncodedParser = require('body-parser').urlencoded({extended:false});
let getMessageToSend = require('./getMessageToSend.js').getMessageToSend;

// This is basic ping functionality to check the server's status 
app.get('/', (_, res) => {
	res.status(200).send('The app is online!');
});

// Main Twilio hook. Messages will arrive and be processed here
app.post('/message', urlEncodedParser, (req, res) => {
	let messageToSend = getMessageToSend(req);
	sendMessage(req, messageToSend);
	res.status(200).send('succesful');
});

// Send Message funcitonality
let sendMessage = (req, messageToSend) => {
	client.messages.create({
		from: req.body.To,
		body: messageToSend,
		to: req.body.From
	}).then(message => console.log(`Sent message ${message.sid}`));
};

// Server initialization
app.listen(port, () => {
	console.log(`App running on port ${port}`);
})
