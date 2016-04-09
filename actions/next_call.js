'use strict'


const nextCall = (mongoClient, since, twilioCalls) => {
	const itemsCollection = mongoClient.collection('items');
	const usersCollection = mongoClient.collection('users');

	function getItem() {
		
		itemsCollection.findAsync({datetime: {$gte: since}}).then((result) => {
			for(var i in result){
				console.log(result[i].userId);
				usersCollection.findOneAsync({_id: result[i].userId}).then((user) => {
					console.log(user.phone);
					console.log("janika");
					console.log(user);
				}, (err) => {
					console.log(error);
				});
			}

			console.log("teeet");
			// console.log(result);
			// res.json(result);
		}, (err) => {
			console.log(error);
		  // res.status(400).json({error_message: 'problem inserting user'});
		});


		console.log("lopp");
	};
	return {
		getCurrent: getItem
	};
}

module.exports = nextCall;