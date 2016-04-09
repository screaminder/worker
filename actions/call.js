'use strict'

const twilioCalls = (twilio_client, config) => {

	function status(request, response) {
		response.json({"status": "ok"});
		// call(request, response);
	};
	function call (request, response) {
	    twilio_client.calls.create({
	        url: "https://demo.twilio.com/welcome/voice/",
	        to: "+37256615540",
	        from: config.from
	    }, function(err, call) {
	        process.stdout.write(call.sid);
	    });
	};

	return {
		sta: status,
		call: call
	};
}
module.exports = twilioCalls;