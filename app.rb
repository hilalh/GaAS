require 'rapgenius'
require 'pp'
require 'json'
require 'soundcloud'
require 'sinatra'

def search_by_lyrics(query, number)
	strings = RapGenius.search_by_lyrics(query)[0..2].collect do | song |
		song.title + " - " + song.artist.name
	end
	strings.join("\n")
end

def search_by_title(query, number)
	strings = RapGenius.search_by_title(query)[0..5].collect do | song |
		puts song
	end
end


def getLyrics(query)
  song = RapGenius.search_by_title(query)[0]
  puts song.title
  iterate_lyrics(song)
end

def concat_lyrics(buffer,current)
  if(current.lyric[0] == ",")
    buffer << "\n\n"
  else
    buffer << "\n"+current.lyric.to_s
  end
end

def iterate_lyrics(song)
  result_lyrics=""
  current_lines = song.lines
  current_lines.each{|current| concat_lyrics(result_lyrics,current)}
  puts result_lyrics
end


get '/' do
    'Nothin\' here homie'
end

get '/lyrics/:name' do
    songName = params['name']
    "#{getLyrics(songName)}"
end

def rap_genius_from_name(query, number)
	rapgenius_object_id = RapGenius.search_by_lyrics(query)[0]["id"]
	"genius.com/songs/" + id
end
