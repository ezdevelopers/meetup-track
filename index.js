var express = require("express");
var app = express();
var path = require('path');
var https = require('https');
const { StringDecoder } = require('string_decoder');
 //parse the payload
var decoder = new StringDecoder('utf-8');

app.use(function(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin','*');
    res.setHeader('Access-Control-Allow-Method','GET, POST');
    next();
})

//api.meetup.com
// /2/concierge?sign=true&key=711029677e83bc31536f7569b13&city=lagos&category_id=34
app.get("/list/events", function(req, res){
    var path = `/2/events?sign=true&key=711029677e83bc31536f7569b13&member_id=266048663&page=40`;
    var reqParameter = {
        'protocol':'https:',
        'hostname':'api.meetup.com',
        'method':'GET',
        'timeout':100000,
        'path':path,
        'headers':{
            'content-type':'application/json'
        }
    }
    var request = https.request(reqParameter, function(response){
        var data = '';
        response.on('data', (d) => {
            data += decoder.write(d);
        });
        response.on("end", function(){
            data += decoder.end();
            data = JSON.parse(data);
            res.json(data);
        })
       
    });

    request.on("error", function(e){
        console.log(e);
    });

    request.end();
    console.log("Querying request");
});

app.use('/bundle.js', express.static(path.join("./meetup/public/bundle.js")));
app.get('/', function(req, res){
    console.log("sending file");
    res.sendFile(path.resolve("./meetup/public/index.html"));

});

var port = process.env.PORT || 3000;
app.listen(port, function(){
    console.log(`listening on port ${port}`)
})
