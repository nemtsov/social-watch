var express = require('express');
var app = express();
var fb = require('fb');
app.use(express.logger());

app.get('/', function(request, response) {
  response.send('Hello World!');
});

app.get('/fb', function (req, res) {
  fb.api('me/feed', function (res) {
    if (!res || res.error) {
     console.log(!res ? 'error occurred' : res.error);
     return;
    }
    console.log(res.id);
    console.log(res.name);
  });
});

var port = process.env.PORT || 5000;
app.listen(port, function() {
  console.log("Listening on " + port);
});
