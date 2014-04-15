
var config = { };

// should end in /
config.rootUrl  = process.env.ROOT_URL                  || 'http://social-watch.localapp.com:3000/';

config.facebook = {
    appId:          process.env.FACEBOOK_APPID          || '573562206093362',
    appSecret:      process.env.FACEBOOK_APPSECRET      || '327f58ef29394277ca6a9c91e49c3b26',
    appNamespace:   process.env.FACEBOOK_APPNAMESPACE   || 'social-watch',
    redirectUri:    process.env.FACEBOOK_REDIRECTURI    ||  config.rootUrl + 'login/callback'
};

module.exports = config;
