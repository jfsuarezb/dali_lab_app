const weatherApiReqURL = "http://api.weatherapi.com/v1/current.json"
const axios = require("axios");

exports.getMessageToSend = async (req) => {
	let messageToSend = "";

	let cityName = req.body.Body.split(" ")[req.body.Body.split(" ") - 1]

	try {
		let res = await axios.get(weatherApiReqURL + `?key=${process.env.WEATHER_API_KEY}&q=${cityName}`).data
		messageToSend = messageToSend + `Weather Today in ${cityName}:\n\nTemperature: ${res.temp_f}\nFeels Like: ${res.feelslike_f}\nCloud Coverage: ${res.could}%\n\n`
	} catch(_) {
		return "There was a server error";
	}

	
};
