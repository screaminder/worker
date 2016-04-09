'use strict'
const moment = require('moment');
const _ = require('lodash');

var titles = ["yoga", "walking", "swimming", "running", "martial", "gym", "grouptraining","teamsports"];
var day = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];

const nextCall = (mongoClient, since, twilioCalls) => {
	const itemsCollection = mongoClient.collection('items');
	const usersCollection = mongoClient.collection('users');

	function getItem() {
		
		itemsCollection.findAsync({datetime: {$gte: since}}).then((result) => {

			result.each(function(err, item){
				if(err)
					console.error(err);

				if(item){
					usersCollection.findOneAsync({_id: item.userId}).then((user) => {
						console.log(resolveToFile(item.type, item.title));
					}, (err) => {
						console.error(error);
					});
				}

			});
		}, (err) => {
			console.error(error);
		});
	};

	function resolveToFile(item_type, title) {

		if(item_type == "workout" && _.includes(titles, title)){
			return item_type + "_" + title + ".mp3";
		} else if (item_type == "alarm") {
			var n = day[new Date().getDay()];
			return item_type + "_" + n + ".mp3" ;
		} else {
			return "response_callmother.mp3";
		}
	}
	return {
		getCurrent: getItem
	};
}

module.exports = nextCall;