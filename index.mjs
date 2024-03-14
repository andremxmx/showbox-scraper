import { makeProviders, makeStandardFetcher, targets, makeSimpleProxyFetcher  } from '@movie-web/providers';

const proxyUrl = ""; // Replace with your proxy URL

const providers = makeProviders({
  // proxiedFetcher: makeSimpleProxyFetcher(proxyUrl, fetch),      // Use this line if you want to use a proxy
  fetcher: makeStandardFetcher(fetch),
  target: targets.NATIVE, // targets.BROWSER usable but we're scarping for downloading so we use NATIVE
})
/*
For configuring the things you want to change are:
Seasons array
Max episode count in the for loop
type (will be either 'show' or 'movie')
tmdbID (TMDB ID of the movie or show)
TMDB API key at the end of the URL (replace with your own if mine dies)

If its a movie, itll fetch it, give the link and tell you to CTRL+C
If its a show, itll continue going over the episodes and seasons you specified and give you the links

SEASONS ARRAY AND EPISODE COUNT DOESNT MATTER IF YOU'RE SCRAPING A MOVIE
IT'LL JUST FETCH THE MOVIE AND GIVE YOU THE LINK
*/


const seasons = [1, 2, 3, 4, 5, 6, 7, 8]; // Modify this array to include the seasons you want to scrape over 
// Added that because if you get ratelimited you can just change the array to the seasons you want to scrape over

for (const seasonNumber of seasons) {
  for (let episodeNumber = 1; episodeNumber <= 25; episodeNumber++) { //If episode count changes every season make the max value the highest episode count, itll break when it reaches the end of the season anyways
    try {
      /*

      type and tmdbID is the variables that you need to change
      */
      const type = 'show'; // 'movie' or 'show'
      const tmdbID = 48891; // TMDB ID of the movie or show
      /*
      examples
      movie: 431693
      show: 48891
      */
      const response = await fetch(`https://api.themoviedb.org/3/${type === 'show' ? 'tv' : 'movie'}/${tmdbID}?api_key=5666d46d7f9ce6368ae16ea8bea0467a`); // Fetch the movie or show data from TMDB
      const data = await response.json();
      let releaseYear;
      let title;
      
      if (type === 'show') {
        releaseYear = data.first_air_date.split('-')[0];
        title = data.name;
      } else if (type === 'movie') {
        releaseYear = data.release_date.split('-')[0];
        title = data.original_title;
      }
              
      const media = {
        type: type,
        title: title, // Title of the movie or show
        releaseYear: releaseYear, // Release year of the movie or show
        tmdbId: tmdbID, // TMDB ID of the movie or show
        episode: {
          number: episodeNumber 
        },
        season: {
          number: seasonNumber
        }
      };
// scrape a stream
      const Stream = await providers.runAll({
        media: media,
        sourceOrder: ['showbox'] // You can change, but preferably use showbox
      });

      const qualities = Object.keys(Stream.stream.qualities); // Get all the qualities available for the stream
      const bestQuality = qualities.reduce((prev, curr) => { // Find the best quality
        const prevQuality = parseInt(prev); 
        const currQuality = parseInt(curr);
        return currQuality > prevQuality ? curr : prev;
      });

        if (type === 'movie') {
             console.log(`Title: ${title}`);
             console.log(`Link: ${Stream.stream.qualities[bestQuality].url}`);
               console.log(`Press CTRL + C to stop the script`); 
                  break;
           } else if (type === 'show') {
             console.log(`Season ${seasonNumber}, Episode ${episodeNumber}: ${Stream.stream.qualities[bestQuality].url}`);
           }
           } catch (error) {
      console.error(`Error fetching Season ${seasonNumber}, Episode ${episodeNumber}: ${error.message}`); // Log the error Mostly for outputting that season episodes reached the end but also can mean script got ratelimited
      break; // Move to the next season if an error occurs
    }
  }}
