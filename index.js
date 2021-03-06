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

var client = new twitter({
  consumer_key: config.twitter.consumer_key,
  consumer_secret: config.twitter.consumer_secret,
  access_token_key: config.twitter.access_token_key,
  access_token_secret: config.twitter.access_token_secret
});

var gm_config = {
  key: config.gm_config.key,
  secure: config.gm_config.secure
};


const gmAPI = new gmap(gm_config);

//=============================================

var DEBUG = 0;

//The number of Tweets with a valid location, either from Tweet or user
var validTweets = 0;

var args = process.argv.slice(2);
var targetString = args[0] || 'cyka blyat';
var tweetCount = (parseInt(args[1])+1) || 4;
var storeBackup = args[2] || 0;

console.log("Pulling tweets containing \"" + targetString + "\"");

client.get('search/tweets', {q: targetString, count: tweetCount}, function(err, tweets, r) {

  console.log("Tweets scraped successfully");

  if (storeBackup) {
    var backupWriter = csvWriter();
    backupWriter.pipe(fs.createWriteStream('searches/'+targetString+'-'+Date.now()+'.csv'));
  }

  var writer = csvWriter()
  writer.pipe(fs.createWriteStream('searches/search.csv'))

  var writeToCSV = function(tweet,isDone) {

    if (tweet && tweet.user && tweet.user.location) {} else { return; }

    var param = {
      'address' : tweet.user.location
    }

    gmAPI.geocode(param, function(err, result) {

      try {
        var latLng = result.results[0] ? result.results[0].geometry.location : '';

        if (latLng != '' && !isDone) {

          validTweets++;

          var senti = sentiment(tweet.text);

          if (backupWriter) {
            backupWriter.write({lat: latLng.lat, lng: latLng.lng, sentiment: senti.score});
          }

          writer.write({lat: latLng.lat, lng: latLng.lng, sentiment: senti.score});

        } else if (isDone) {
          //backupWriter.end();
          //writer.end();
          console.log("Analysis complete, " + validTweets + "/" + (tweetCount-1) + " tweets saved.");
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

  console.log("Beginning analysis of tweets");

  const tCount = tweets.search_metadata.count - 1;

  for (var t = 0; t < tweets.search_metadata.count; t++) {

    writeToCSV(tweets.statuses[t], t == tCount);

  }

})
return;
