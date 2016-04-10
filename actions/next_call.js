'use strict'
const moment = require('moment');
const _ = require('lodash');

var titles = ["yoga", "walking", "swimming", "running", "martial", "gym", "grouptraining","teamsports"];
var day = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];

const nextCall = (mongoClient, since, twilioCalls) => {
	const itemsCollection = mongoClient.collection('items');
	const usersCollection = mongoClient.collection('users');
	const workerCollection = mongoClient.collection('worker');

	function getItem() {
		var lastCheck = {datetime: since},
		currentCheck = {datetime: new Date()};
		workerCollection.findOneAsync({}).then((result) => {

			// console.log(result);
			if(result){
				lastCheck = result;
				console.log(result._id);
				workerCollection.updateAsync({_id: lastCheck._id}, currentCheck).then((rr) => {
				}, (err) => {
					console.error(err);
				});
			}else {
				workerCollection.insertOneAsync(currentCheck).then((rr) => {
				}, (err) => {
					console.error(err);
				});
			}

			itemsCollection.findAsync({
				$and: [
					{datetime: {$gte: lastCheck.datetime}},
					{datetime: {$lte: currentCheck.datetime}}
				]
			}).then((result) => {

				result.each(function(err, item){
					if(err)
						console.error(err);

					if(item){
						usersCollection.findOneAsync({_id: item.userId}).then((user) => {
							if(user.phone.indexOf("+372") > -1){
								twilioCalls.callNumber(user.phone, resolveToFile(item.type, item.title));
							}
							console.log("calling to", user.phone, "with mp3: ", resolveToFile(item.type, item.title));
						}, (err) => {
							console.error(error);
						});
					}
				});
			}, (err) => {
				console.error(error);
			});
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