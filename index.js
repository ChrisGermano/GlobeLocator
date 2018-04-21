const sentiment = require('sentiment');
const snoowrap = require('snoowrap');
const twitter = require('twitter');
const gmap = require('googlemaps');
const csvWriter = require('csv-write-stream');
const fs = require('fs');

const r = new snoowrap({
  userAgent: 'Reddiment',
  clientId: 'xEZASt8oaEQcNg',
  clientSecret: 'vNYBZhYjbLpop3w7pAU5PbGQuhY',
  username: 'Reddiment',
  password: 'ReddimentPassword123?'
});

var client = new twitter({
  consumer_key: 'FzA616FmpfywdbXE4RduQ0E82',
  consumer_secret: 'SNC2wY3sZlJ9CMSdu2wEHRbz4yONdcKMN461JGOtkbUZMIBRXm',
  access_token_key: '302385349-KL7mkCaS6KLMbWm6Gy14hkIjax4kwdBmQNsIkYEZ',
  access_token_secret: 'zSHcgFUb9E0DDY1VXMeBbDl8zYVl7cMFbMPSJSESRxkHS'
});

var gm_config = {
  key: 'AIzaSyD-BceWZZfeLH8Q28cEpFNxNn_eY31L_T8',
  stagger_time:       1000,
  encode_polylines:   false,
  secure:             true
};


const gmAPI = new gmap(gm_config);

//=============================================

var DEBUG = 0;

var args = process.argv.slice(2);
var targetString = args[0] || 'cyka blyat';
var tweetCount = (parseInt(args[1])+1) || 4;

client.get('search/tweets', {q: targetString, count: tweetCount}, function(err, tweets, r) {

  var writer = csvWriter()
  //writer.pipe(fs.createWriteStream('searches/'+targetString+"-"+Date.now()+'.csv'));
  writer.pipe(fs.createWriteStream('searches/search.csv'))

  var writeToCSV = function(tweet,isDone) {

    if (tweet && tweet.user && tweet.user.location) {} else { return; }

    var param = {
      'address' : tweet.user.location
    }

    gmAPI.geocode(param, function(err, result) {

      try {
        var latLng = result.results[0] ? result.results[0].geometry.location : '';

        if (latLng != '') {
          var senti = sentiment(tweet.text);

          writer.write({lat: latLng.lat, lng: latLng.lng, sentiment: senti.score})
        }
      } catch (e) {
        console.log("A location failed");
      }

    });

    if (isDone) {
      writer.end();
    }

  }

  for (var t = 0; t < tweets.search_metadata.count; t++) {

    var isDone = t == tweets.search_metadata.count - 1;

    writeToCSV(tweets.statuses[t],isDone);

  }

})
return;
