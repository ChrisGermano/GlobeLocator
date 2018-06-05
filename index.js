const sentiment = require('sentiment');
const snoowrap = require('snoowrap');
const twitter = require('twitter');
const gmap = require('googlemaps');
const csvWriter = require('csv-write-stream');
const fs = require('fs');

const config = require('./config.js');

const r = new snoowrap({
  userAgent: config.snoowrap.userAgent,
  clientId: config.snoowrap.clientId,
  clientSecret: config.snoowrap.clientSecret,
  username: config.snoowrap.username,
  password: config.snoowrap.password
});

const client = new twitter({
  consumer_key: config.twitter.consumer_key,
  consumer_secret: config.twitter.consumer_secret,
  access_token_key: config.twitter.access_token_key,
  access_token_secret: config.twitter.access_token_secret
});

const gm_config = {
  key: config.gm_config.key,
  secure: config.gm_config.secure
};

const gmAPI = new gmap(gm_config);

//=============================================

var DEBUG = 1;

var args = process.argv.slice(2);
var targetString = args[0] || 'cyka blyat';
var tweetCount = parseInt(args[1])   || 4;
var storeBackup = args[2] || 0;

var writer = csvWriter();
writer.pipe(fs.createWriteStream('searches/search.csv'))

if (storeBackup) {
  var backupWriter = csvWriter();
  backupWriter.pipe(fs.createWriteStream('searches/'+targetString+'-'+Date.now()+'.csv'));
}

//Tweets with valid locations, defined in geoCode()
var locatedTweets = [];

//=============================================

console.log("Pulling tweets containing \"" + targetString + "\"");

//TODO: Ensure targetString doesn't include username results
client.get('search/tweets', {q: targetString, count: tweetCount}, function(err, tweets, r) {

  var validTweets = [];

  for (var i = 0; i < tweets.statuses.length; i++) {
    if (tweets.statuses[i] && tweets.statuses[i].user.geo_enabled) {
      validTweets.push(tweets.statuses[i]);
    }
  }

  console.log("Valid tweets: " + validTweets.length);

  if (validTweets.length) {
    geoCode(validTweets,0);
  }

});

function geoCode(tweets,index) {

  var max = tweets.length - 1;
  var isDone = index == max;

  var param = {
    'address' : tweets[index].user.location
  }

  gmAPI.geocode(param, function(err, result) {

    if (err) {
      console.log(err.message);
    }

    try {
      var latLng = result.results[0] ? result.results[0].geometry.location : '';

      if (latLng != '') {

        tweets[index].lat = latLng.lat;
        tweets[index].lng = latLng.lng;

        locatedTweets.push(tweets[index]);

        if (!isDone) {
          index++;
          geoCode(tweets, index);
        } else {
          console.log("Tweets with valid locations: " + locatedTweets.length);
          writeToCSV(locatedTweets, 0);
        }
      }
    } catch (e) {
      if (DEBUG) {
        console.log(e);
      } else {
        console.log("A location failed");
      }
    }
  });

}

function writeToCSV(tweets, index) {

  var isDone = tweets.length-1 == index;
  var tweet = tweets[index];

  var senti = sentiment(tweet.text);

  if (storeBackup) {
    backupWriter.write({lat: tweet.lat, lng: tweet.lng, sentiment: senti.score});
  }

  writer.write({lat: tweet.lat, lng: tweet.lng, sentiment: senti.score});

  if (DEBUG)
    console.log("Tweet [lat:" + tweet.lat + ", lng:" + tweet.lng + ", score:" + senti.score + "]");

  index++;

  if (!isDone) {
    writeToCSV(tweets, index);
  } else {
    if (storeBackup) {
      backupWriter.end();
    }
    writer.end();
    console.log("Process complete, " + locatedTweets.length + "/" + tweetCount + " tweets saved.");
  }

}

return;
