# About

A movie/series scraper using Movie-WEB's scraping tool. \n
Proxy support

# To start
Open the index.mjs file \n
For configuring the things you want to change are: \n
Seasons array \n
Max episode count in the for loop \n
type (will be either 'show' or 'movie') \n
tmdbID (TMDB ID of the movie or show) \n
TMDB API key at the end of the URL (replace with your own if mine dies) \n

`const seasons = [1, 2, 3, 4, 5, 6, 7, 8];` \n
Change this line into the seasons you want to scrape. (Dont need to if you're scraping a movie) \n

` for (let episodeNumber = 1; episodeNumber <= 25; episodeNumber++) {` \n
Change the "25" to the maximum amount of episodes you want to scrape from a season. If you want to scrape all, you can just put a high number such as maximum amount of episodes a season will have \n
Script will automatically skip to other season \n

```
 const type = 'show'; // 'movie' or 'show'
      const tmdbID = 48891; // TMDB ID of the movie or show
```
\n
Change these regarding what you want to scrape.\n

# Proxy support
If you're getting ratelimited configure the proxy line at top of the file. Code comments should help.

# Known issues:

Getting ratelimited.
Inconsistent and not useful way to input the series/movie you want to scrape

# TODO:

Will make it so this shit has a better interface. Lmao.
