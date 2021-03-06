'use_strict';

const playVoices = (twilio_client) => {

	function scream (request, response){
		var resp = new twilio_client.TwimlResponse();
		resp.play('https://screaminder-worker.herokuapp.com/sounds/'+ request.params.fileName);
		console.log(resp.toString());
		response.header('Content-Type', 'text/xml');
		response.send(resp.toString());
	};

	return {
		scream: scream
	};
}

module.exports = playVoices;
