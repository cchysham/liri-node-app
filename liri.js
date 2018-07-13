require("dotenv").config();
var request = require("request");
var keys = require("./keys.js");
var Twitter = require("twitter");
var Spotify = require('node-spotify-api');
var spotify = new Spotify(keys.spotify);
var client = new Twitter(keys.twitter);
var fs = require("fs");

var liriCommand = process.argv[2];
var searchTerm = process.argv.slice(3).join(" ");

switch (liriCommand) {
    case "my-tweets":
        displayTweets();
        break;

    case "spotify-this-song":
        fuckSpotifyAPI();
        break;

    case "movie-this":
        displayMovies();
        break;

    case "do-what-it-says":
        fs.readFile("random.txt", "utf8", function(err, data){
            var dataArr = data.split(",");
            searchTerm = dataArr[1];
            displayMovies();
        });
        break;
}


function displayTweets() {
    var params = { screen_name: 'realDonaldTrump' };
    client.get('statuses/user_timeline', params, function (error, tweets, response) {
        if (!error) {
            //console.log(tweets);
            for (var i = 0; i < 20; i++) {
                console.log(i + 1 + ". " + tweets[i].text + "\n");
            }
        }
    });
}

function fuckSpotifyAPI() {
    spotify.search({ type: 'track', query: searchTerm }, function (err, data) {
        if (err) {
            return console.log('Error occurred: ' + err);
        }

        console.log(data);
    });
    //DATA BEING RETURNED WITH A 401. CANNOT GET THIS API TO RECOGNIZE MY KEY.
    //SOME SORT OF STRANGE ERROR IN THE MODULE'S JSON FILE (MAYBE WHY IT'S NOT WORKING?)
    break;
}

function displayMovies() {
    if (searchTerm === "") {
        searchTerm = "Mr. Nobody";
    }
    request("http://www.omdbapi.com/?t=" + searchTerm + "&apikey=8843fa34&", function (error, response, body) {

        if (!error && response.statusCode === 200) {
            var jsonObj = JSON.parse(body);
            console.log("Title: " + jsonObj.Title + "\nReleased: " + jsonObj.Released + "\nIMDB Rating: " + jsonObj.imdbRating + "\nRotten Tomatoes Rating: " + jsonObj.Ratings[1].Value + "\nProduced in: " + jsonObj.Country + "\nLanguage: " + jsonObj.Language + "\nPlot: " + jsonObj.Plot + "\nActors: " + jsonObj.Actors);
        }
    });
}