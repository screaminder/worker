'use strict'

const twilioCalls = (twilio_client, config) => {

	function call (request, response) {
	    twilio_client.calls.create({
	        url: "https://screaminder-worker.herokuapp.com/voice/",
	        to: "+37256615540",
	        from: config.from
	    }, function(err, call) {
	        process.stdout.write(call.sid);
	    });
	};

	return {
		call: call
	};
}
module.exports = twilioCalls;