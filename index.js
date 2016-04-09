'use strict';

const Q = require('q');
const express = require('express');
const cors = require('cors');
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

const twilio_client = require('twilio')(config.accountSid, config.authToken);


function onError(err, req, res, next) {
    res.statusCode = 500;
    res.status(500).json({error_message: 'something went wrong'});
    console.error(err.stack);
}

function call(request, response) {
    twilio_client.calls.create({
        url: "https://demo.twilio.com/welcome/voice/",
        to: "+37256615540",
        from: config.from
    }, function(err, call) {
        process.stdout.write(call.sid);
    });
}

//actions
app.get('/status', statusReq.get);
app.get('/call', call);

// error handler
app.use(onError);

app.listen(process.env.PORT, () => {
  console.log('Started slack-api on port ' + process.env.PORT);
});
