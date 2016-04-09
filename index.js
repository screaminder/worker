'use strict';

const Q = require('q');
const express = require('express');
const serve_static = require('serve-static')
const cors = require('cors');
const path = require('path');
const MongoDB = require('./db/mongoDB.js');
const statusReq = require('./actions/status.js');
const later = require('later');
const ejs = require('ejs')
const moment = require('moment');
const app = express();


var config = {};
var since = moment().subtract(3, 'h').toDate();
var mongoClient = {};

//prod/heroku
if (process.env.ACCOUNT_SID) {
	mongoClient = new MongoDB(process.env.MONGOLAB_URI);
    config.accountSid = process.env.ACCOUNT_SID;
    config.authToken = process.env.AUTH_TOKEN;
    config.from = process.env.TWILIO_FROM;
} else {
    config = require('./config.js');
    mongoClient = new MongoDB(config.mongo);
}

const twilio = require('twilio');
const twilio_client = twilio(config.accountSid, config.authToken);
const twilioCalls = require('./actions/call.js')(twilio_client, config);
const playVoices = require('./actions/voice.js')(twilio);
const nextCall = require('./actions/next_call.js')(mongoClient, since, twilioCalls);

function onError(err, req, res, next) {
    res.statusCode = 500;
    res.status(500).json({error_message: 'something went wrong'});
    console.error(err.stack);
}

var s = later.parse.text('every 5 seconds');
//later.schedule(s).prev(10);

var timer = later.setInterval(testTimeout, s);

function testTimeout(){
	nextCall.getCurrent();
}

//actions
app.get('/status', statusReq.get);
app.get('/call', twilioCalls.call, statusReq.get);
app.post('/voice', playVoices.scream, statusReq.get);


// error handler
app.use(onError);
app.use("/sounds", express.static(path.join(__dirname, 'sounds')));

Q.all([mongoClient.connectAsync()]).then(() => {
  app.listen(process.env.PORT, () => {
    console.log('Started worker on port ' + process.env.PORT);
  });
}, (err) => {
  throw err;
});
