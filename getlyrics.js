var superAgent = require("superagent");
var Constants = require("./constants");
var LyricsParser = require("./lyrics_parser")
var SongParser = require("./song_parser")

var RAP_GENIUS_URL = "http://rapgenius.com";
var RAP_GENIUS_ARTIST_URL = "http://rapgenius.com/artists/";
var RAP_GENIUS_SONG_EXPLANATION_URL = RAP_GENIUS_URL + "/annotations/for_song_page";


var globalResult;

//2.Call searchSongLyrics
function searchSongLyrics(link, type, callback){
  //Check whether the URL is fully defined or relative
console.log("Searching for lyrics...")
  type = type.toLowerCase();
  var type2Urls = Constants.Type2URLs[ type];
  if (!type2Urls){
    process.nextTick(function(){
      callback("Unrecognized type in song lyrics search [type=" + type + "]");
    });
    return;
  }

  var url = /^http/.test(link) ? link : type2Urls.base_url + link;
  superAgent.get(url)
    .set("Accept", "text/html")
    .end(function(res){
      if(res.ok){
        var result = LyricsParser.parseLyricsHTML(res.text, type);
        if(result instanceof  Error){
          callback(result);
        }else{
          callback(null, result);
        }
      }else{
        console.log("An error occurred while trying to access lyrics[url=%s, status=%s]", url, res.status);
        callback(new Error("Unable to access the page for lyrics [url=" + link + "]"));
      }
    });
}

//2*.Lyrics search callback function
function lyricsSearchCb(err, lyricsOnly){
    console.log("Lyrics found and being coppied")
    if(err){
      //console.log("Error: " + err);
      globalResult = ("Error: " + err);
    }else{
      var lyrics = lyricsOnly
      //console.log("**** LYRICS *****\n%s", lyrics.getFullLyrics(true));
      globalResult = lyrics.getFullLyrics(true);
    }
};

//1*. searchCallback function
function searchCallback(err, songs){
    console.log("SearchCallback called")
  if(err){
    //console.log("Error: " + err);
    return ("Error: " + err);
  }else{
    if(songs.length > 0){
      //We have some songs
      return searchSongLyrics(songs[0].link, "rap", lyricsSearchCb);

    }
  }
};

//1.Search a song first
function searchSong(query, type, callback) {
  //TODO perform input validation
console.log("Searching for song..." + query)
  type = type.toLowerCase();
  var type2Urls = Constants.Type2URLs[ type];
  if (!type2Urls){
      process.nextTick(function(){
         callback("Unrecognized type in song search [type=" + type + "]");
      });
      return;
  }
  superAgent.get(type2Urls.search_url)
    .query({q: query})
    .set("Accept", "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8")
    .end(function (res) {
      if (res.ok) {
        var result = SongParser.parseSongHTML(res.text, type);
        if (result instanceof Error) {
          callback(result);
        } else {
          callback(null, result)
        }
      } else {
        console.log("Received a non expected HTTP status [status=" + res.status + "]");
        callback(new Error("Unexpected HTTP status: " + res.status));
      }
    });
}
//call the function, "name of song"
exports.getLyrics = function(name){
    searchCallback = searchCallback,
    lyricsSearchCb = lyricsSearchCb,
    searchSongLyrics = searchSongLyrics,
    searchSong(name , "rap", searchCallback);
}

exports.FinalResult = globalResult
