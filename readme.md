# About

A movie/series scraper using Movie-WEB's scraping tool. 

Proxy support

# To start
Open the index.mjs file 

For configuring the things you want to change are: 

Seasons array 

Max episode count in the for loop 

type (will be either 'show' or 'movie') 

tmdbID (TMDB ID of the movie or show) 

TMDB API key at the end of the URL (replace with your own if mine dies) 

`const seasons = [1, 2, 3, 4, 5, 6, 7, 8];` 

Change this line into the seasons you want to scrape. (Dont need to if you're scraping a movie) 

` for (let episodeNumber = 1; episodeNumber <= 25; episodeNumber++) {` 

Change the "25" to the maximum amount of episodes you want to scrape from a season. If you want to scrape all, you can just put a high number such as maximum amount of episodes a season will have 
Script will automatically skip to other season 

```
 const type = 'show'; // 'movie' or 'show'
      const tmdbID = 48891; // TMDB ID of the movie or show
```

Change these regarding what you want to scrape.

# Proxy support
If you're getting ratelimited configure the proxy line at top of the file. Code comments should help.

# Known issues:

Getting ratelimited.
Inconsistent and not useful way to input the series/movie you want to scrape

# TODO:

Will make it so this shit has a better interface. Lmao.
