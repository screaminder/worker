'use strict';

const Q = require('q');
const express = require('express');
const serve_static = require('serve-static')
const cors = require('cors');
const path = require('path')
const statusReq = require('./actions/status.js');
const ejs = require('ejs')
const app = express();


var config = {};

//prod/heroku
if (process.env.ACCOUNT_SID) {
    config.accountSid = process.env.ACCOUNT_SID;
    config.authToken = process.env.AUTH_TOKEN;
    config.from = process.env.FROM;
} else {
    config = require('./config.js');
}
const twilio = require('twilio');
const twilio_client = twilio(config.accountSid, config.authToken);
const twilioCalls = require('./actions/call.js')(twilio_client, config);
const playVoices = require('./actions/voice.js')(twilio);

function onError(err, req, res, next) {
    res.statusCode = 500;
    res.status(500).json({error_message: 'something went wrong'});
    console.error(err.stack);
}

//actions
app.get('/status', statusReq.get);
app.get('/call', twilioCalls.call, statusReq.get);
app.post('/voice', playVoices.scream, statusReq.get);


// error handler
app.use(onError);
app.use("/sounds", express.static(path.join(__dirname, 'sounds')));

app.listen(process.env.PORT, () => {
  console.log('Started slack-api on port ' + process.env.PORT);
});


