'use_strict';

const playVoices = (twilio_client) => {

	function scream (request, response){
		var resp = new twilio_client.TwimlResponse();
		resp.play('http://www.example.com/some_sound.mp3');
		console.log(resp.toString());
	};

	return {
		scream: scream
	};
}

module.exports = playVoices;
