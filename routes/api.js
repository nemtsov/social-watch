var FB = require('fb'),
  config = require('../config');

exports.timeline = function (req, res) {
  var params = req.query;
  params.access_token = req.session.access_token;

  FB.api('me/posts', {
    fields: 'story',
    limit: 250,
    access_token: req.session.access_token
  }, function (result) {
    if (!result || result.error) {
      return res.send(500, 'error');
    }
    res.send(result);
  });
};
