'use strict'

const twilioCalls = (twilio_client, config) => {

	function call (request, response) {
	    twilio_client.calls.create({
	        url: "https://screaminder-worker.herokuapp.com/voice/",
	        to: "+37256615540",
	        from: config.from
	    }, function(err, call) {
	    	response.json({"status":"ok"});
	    });
	};

	function callNumber(number, url) {
	    twilio_client.calls.create({
	        url: "https://screaminder-worker.herokuapp.com/voice/" + url,
	        to: number,
	        from: config.from
	    }, function(err, call) {
	    	if(err)
		    	console.error(err);
	    });
	};

	return {
		call: call,
		callNumber : callNumber
	};
}

module.exports = twilioCalls;