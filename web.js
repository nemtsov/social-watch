var express = require('express'),
  FB = require('fb'),
  http = require('http'),
  path = require('path'),
  api = require('./routes/api'),
  home = require('./routes/home');

var app = express();

app.configure(function () {
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'ejs');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.cookieParser());
  app.use(express.cookieSession({secret: 'soc234adsdlkj'}));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function() {
  app.use(express.errorHandler());
});

app.get( '/',                home.index);
app.get( '/login/callback',  home.loginCallback);
app.get( '/logout',          home.logout);
app.get( '/timeline',        api.timeline);

http.createServer(app).listen(app.get('port'), function () {
  console.log('Server listening on port ' + app.get('port'));
});
