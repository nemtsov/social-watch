var FB = require('fb'),
  Step = require('step'),
  config = require('../config'),
  FB = require('fb');

FB.options({
  appId:          config.facebook.appId,
  appSecret:      config.facebook.appSecret,
  redirectUri:    config.facebook.redirectUri
});

exports.index = function(req, res) {
  var accessToken = req.session.access_token;
  if (!accessToken) {
    res.render('index', {
      title: 'Social Watch',
      loginUrl: FB.getLoginUrl({
        scope: 'user_about_me,read_stream'
      })
    });
  } else {
    FB.api('me/posts', {
      limit: 250,
      fields: 'message',
      access_token: req.session.access_token
    }, function (result) {
      if (!result || result.error) {
        return res.send(500, 'error');
      }

      getStories(result.data, function (err, messages) {
        if (err) return res.send(500, 'error');

        res.render('posts', {
          messages: messages
        });
      });
    });
  }
};

function getStories(data, cb) {
  var messages = data.filter(function (post) {
    return post.message;
  })

  getBadWords(function (err, badWords) {
    if (err) return cb(err);
    var rbw = RegExp('(?:' + badWords.join('|') + ')');
    messages.forEach(function (post) {
      var message = post.message;
      if (message.match(rbw)) {
        post.isFlagged = true;
      }
      return post;
    });
    cb(null, messages);
  });
}

function getBadWords(cb) {
  cb(null, ['drugs', 'gun', 'drunk']);
}

exports.loginCallback = function (req, res, next) {
    var code            = req.query.code;

    if (req.query.error) {
      // user might have disallowed the app
      return res.send('login-error ' + req.query.error_description);
    } else if(!code) {
      return res.redirect('/');
    }

    Step(
        function exchangeCodeForAccessToken() {
            FB.napi('oauth/access_token', {
                client_id:      FB.options('appId'),
                client_secret:  FB.options('appSecret'),
                redirect_uri:   FB.options('redirectUri'),
                code:           code
            }, this);
        },
        function extendAccessToken(err, result) {
            if(err) throw(err);
            FB.napi('oauth/access_token', {
                client_id:          FB.options('appId'),
                client_secret:      FB.options('appSecret'),
                grant_type:         'fb_exchange_token',
                fb_exchange_token:  result.access_token
            }, this);
        },
        function (err, result) {
            if (err) return next(err);

            req.session.access_token    = result.access_token;
            req.session.expires         = result.expires || 0;

            if(req.query.state) {
                var parameters              = JSON.parse(req.query.state);
                parameters.access_token     = req.session.access_token;
                FB.api('/me/' + config.facebook.appNamespace +':eat', 'post', parameters , function (result) {
                    console.log(result);
                    if(!result || result.error) {
                        return res.send(500, result || 'error');
                        // return res.send(500, 'error');
                    }

                    return res.redirect('/');
                });
            } else {
                return res.redirect('/');
            }
        }
    );
};

exports.logout = function (req, res) {
    req.session = null; // clear session
    res.redirect('/');
};
