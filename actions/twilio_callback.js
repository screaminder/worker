'use strict'

const twilioCallback = () =>  {
	
	function handleCall(request, response) {
		console.log("handling")
		console.log(request);
		console.log(request.body)
		console.log(request.body.From)
		console.log(request.body.CallStatus);
	};

	return {
		handleCall: handleCall
	};
}

module.exports = twilioCallback;