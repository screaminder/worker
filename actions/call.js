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
	        from: config.from,
	        statusCallback: "https://screaminder-worker.herokuapp.com/callback/",
		    statusCallbackMethod: "POST",
		    statusCallbackEvent: ["initiated", "ringing", "answered", "completed"],
	    }, function(err, call) {
	    	if(err)
		    	console.error(err);
	    });
	};

	function callManual(request, response) {
		callNumber(request.params.phoneNumber, request.params.fileName);
		response.json({"status" : "calling"});
	};

	return {
		call: call,
		callNumber : callNumber,
		callManual : callManual
	};
}

module.exports = twilioCalls;