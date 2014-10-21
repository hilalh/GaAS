var rapgeniusClient = require("rapgenius-js");
var superAgent = require("superagent");
var Constants = require("./constants");
var LyricsParser = require("./lyrics_parser")

function searchLyricsExplanation(songId, type, callback){
  //Check whether the URL is fully defined or relative
    type = type.toLowerCase();
    var type2Urls = Constants.Type2URLs[type];
    if (!type2Urls){
        process.nextTick(function(){
            callback("Unrecognized type in song lyrics search [type=" + type + "]");
        });
    return;
    }
    superAgent.get(type2Urls.annotations_url)
    .set("Accept", "text/html")
    .query({song_id: songId})
    .end(function(res){
        if(res.ok){
            var explanations = RapLyricsParser.parseLyricsExplanationJSON(JSON.parse(res.text));
            if(explanations instanceof Error){
                return callback(explanations);
            }
            else{
                return callback(null, explanations);
            }
          }
        else{
                console.log("An error occurred while trying to get lyrics explanation[song-id=%s, status=%s]", songId, res.status);
                return callback(new Error("Unable to access the page for lyrics [url=" + songId + "]"));
        }
    });
}

function lyricsSearchCb(err, lyricsAndExplanations){
    if(err){
      console.log("Error: " + err);
    }else{
      //Printing lyrics with section names
      var lyrics = lyricsAndExplanations.lyrics;
      var explanations = lyricsAndExplanations.explanations;
      ("Found lyrics for song [title=%s, main-artist=%s, featuring-artists=%s, producing-artists=%s]",
        lyrics.songTitle, lyrics.mainArtist, lyrics.featuringArtists, lyrics.producingArtists);
      console.log("**** LYRICS *****\n%s", lyrics.getFullLyrics(true));

      //Now we can embed the explanations within the verses
      lyrics.addExplanations(explanations);
      var firstVerses = lyrics.sections[0].verses[0];

    //return firstVerse or set to global variable
      //console.log("\nVerses:\n %s \n\n *** This means ***\n%s", firstVerses.content, firstVerses.explanation);
    }
};

function searchCallback(err, songs){
  if(err){
    console.log("Error: " + err);
  }else{
    if(songs.length > 0){
      //We have some songs
      searchLyricsAndExplanations(songs[0].link, "rap", lyricsSearchCb);

    }
  }
};

//call the function, "name of song"

    exports.getLyrics = function(name){
        rapgeniusClient.searchSong(name , "rap", searchCallback);
    }
