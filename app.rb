require 'rapgenius'
require 'pp'
require 'json'
require 'soundcloud'
require 'sinatra'

def search_by_lyrics(query, number)
	strings = RapGenius.search_by_lyrics(query)[0..3].collect do | song |
		song.title + " - " + song.artist.name
	end
	strings.join("\n")
end

def search_by_title(query, number)
	songs = RapGenius.search_by_title(query)[0..10].collect do | song |
		puts song
	end
    puts songs
end

def parse_song_list(songsCollection){
    songsCollection.each { |song| puts #{}song.  }
}

def rap_genius_from_name(query, number)
	rapgenius_object_id = RapGenius.search_by_lyrics(query)[0]["id"]
	"genius.com/songs/" + id
end

bas

def getLyrics(songId)
  puts song.title
  iterate_lines(song)
end

def iterate_lines(song)
  output=""
  current_lines = song.lines
  current_lines.each{|current| concat_lines(output,current)}
  puts result_lyrics
end

def concat_lines(buffer,current)
  if(current.lyric[0] == ",")
    buffer << "\n\n"
  else
    buffer << "\n"+current.lyric.to_s
  end
end


get '/' do
    'Genius-As-A-Service\n------------------\n\n
    Choose your poison mane
\n\n
    Seriously though.\n
    Currently we\'re offering querying service only.\n
    You could query by song, by lyrics or by artist'
end

#Print name of artist, name of song, release year, album
get '/:songId/' do
    current = params['songId']
    "#{print_details(current)}"
end



