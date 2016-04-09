'use strict';

const Q = require('q');
const express = require('express');
const cors = require('cors');
const statusReq = require('./actions/status.js');
const twilio = require('twilio');
const ejs = require('ejs')
var app = express();

var config = {};


// app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
// app.use(app.router);
// app.use(express.static(path.join(__dirname, 'public')));


//prod/heroku
if (process.env.ACCOUNT_SID) {
    config.accountSid = process.env.ACCOUNT_SID;
    config.authToken = process.env.AUTH_TOKEN;
}

//local dev
else {
    config = require('./config.js');
}

function onError(err, req, res, next) {
    res.statusCode = 500;
    res.status(500).json({error_message: 'something went wrong'});
    console.error(err.stack);
}
console.log("account" + config.accountSid);
console.log("token" + config.authToken);

//Quick Start Example 1 - Make an outbound call
function qs1(request, response) {
    var capability = new twilio.Capability(config.accountSid, config.authToken);

    //This is a TwiML app SID configured with a voice URL
    //https://www.twilio.com/user/account/apps
    capability.allowClientOutgoing('CNbe8ba10acf2087b1524b6c1d75fee4c9');

    // Render an EJS template with the token and page title in context
    // EJS template is found in views/qs1.ejs
    response.render('qs1', {
        title:'Hello Monkey 1',
        token:capability.generate()
    });
}

//actions
app.get('/status', statusReq.get);
app.get('/', qs1);
app.get('/qs1', qs1);

// error handler
app.use(onError);


app.listen(process.env.PORT, () => {
  console.log('Started slack-api on port ' + process.env.PORT);
});
