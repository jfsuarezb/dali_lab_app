// Initial set up
const weatherApiReqURL = "http://api.weatherapi.com/v1/current.json"
const yelpApiReqURL = "https://api.yelp.com/v3/businesses/search"
const axios = require("axios");

// Main method to be exported
exports.getMessageToSend = async (req) => {
	let messageToSend = "";

	let cityName = req.body.Body.split(" ")[req.body.Body.split(" ") - 1]

	try {
		// This block of code gets info from the weather api
		// and adds it to the eventual message response.
		// If there is an error, then a message saying there
		// was an error is returned to the server

		let res = await axios.get(weatherApiReqURL + `?key=${process.env.WEATHER_API_KEY}&q=${cityName}`).data
		messageToSend = messageToSend + `Weather Today in ${cityName}:\n\nTemperature: ${res.temp_f}\nFeels Like: ${res.feelslike_f}\nCloud Coverage: ${res.could}%\n\n`
	} catch(_) {
		return "There was a server error";
	}

	try {

		// This block of code searches for coffee shops and
		// restaurants nearby. It aggregates five random 
		// coffee shops and restaurants

		let res = await axios.get(yelpApiReqURL + `?location=${cityName}`, {
			headers: {
				'Authorization': `Bearer ${process.env.YELP_API_KEY}`
			}
		}).data
		
		let cnum = 0;
		
		messageToSend = messageToSend + "Coffe shops nearby:\n\n"

		for (const busi of res.businesses) {
			if (busi.rating >= 4 && busi.categories.some((cat) => cat.alias == "coffee")) {
				messagToSend = messageToSend + `${busi.name}\n${busi.address1}\n${busi.url}\n`
				cnum = cnum + 1;
			}

			if (cnum == 5) {
				break;
			}
		}

		let rnum = 0;
		
		messageToSend = messageToSend + "\nRestaurants nearby:\n\n"

		for (const busi of res.businesses) {
			if (busi.rating >= 4 && busi.categories.some((cat) => cat.alias == "restaurant")) {
				messagToSend = messageToSend + `${busi.name}\n${busi.address1}\n${busi.url}\n`
				rnum = rnum + 1;
			}

			if (rnum == 5) {
				break;
			}
		}

		return messageToSend
	} catch(_) {
		return "There was a server error";
	}	
};
