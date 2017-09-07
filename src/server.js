var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();
var utils = require('./utils.js');
var SlackBot = require('./slack.js');

var server = app.listen(8081, function () {
    var host = server.address().address
    var port = server.address().port

    console.log("Example app listening at http://%s:%s", host, port)
})

var nickelBot = new SlackBot(process.env.token);

app.get('/', function (req, res) {
    res.send('Hello World');
})

function sendSlackMessage (responseBody) {
    var formatted = utils.parseRequestBody(responseBody);
    if (!formatted.merge_request.work_in_progress) {
        nickelBot.displayNewRequest(formatted);
    }
}

/* WebHook Post entry point. */
app.post('/webhook', jsonParser, function(req, res, next) {
    console.log('Webhook received!');

    res.send('yay, webhook works!');

    if (req.headers['x-gitlab-event'] === 'Merge Request Hook') {
        sendSlackMessage(req.body);
    };
});
