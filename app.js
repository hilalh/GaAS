var express = require('express')
    var http = require('http')
    var sys = require('sys');
    var twilio = require('twilio')
    var config = require('./config')
    var bodyParser = require('body-parser');

    var app = express();
var client = new twilio.RestClient(config.AcSid,config.authToken)
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
  extended: true
}))
 app.set('port', (process.env.PORT || 5000))
 app.get('/', function(request, response) {
   response.send('Hello World LOLBro!')
 });


app.post('/incoming', function(request, response) {
    var message = request.body.Body;
    var from = request.body.From;
    //result = processedMessage(message)
    sys.log('From: ' + from + ', Message: ' + message);
    var twiml = '<?xml version="1.0" encoding="UTF-8" ?><Response><Message>'+message+'</Message></Response>';
    response.send(twiml,{'Content-Type':'text/xml'}, 200);
});

http.createServer(app).listen(app.get('port'), function() {    console.log("Node app is running at localhost:" + app.get('port'))  })

function processMessage(message){
    querySongs = require('./getlyrics.js')
    var temp = message
    var oStr = message.slice(0,3)
    var result = "Sorry, couldn't process your request"
    temp = temp(oStr+' ', '')
    if (oStr.localeCompare('(l)')){
        result = 'Name'
        //querySongs.getName(temp)
    }
    else if (oStr.localeCompare('(n)')){
        result = 'Lyrics'
        //querySongs.getLyrics(temp)
    }
    var twiml = '<?xml version="1.0" encoding="UTF-8" ?>n<Response>n<Message>'+result+'</Message>n</Response>';
    return twiml;
}
