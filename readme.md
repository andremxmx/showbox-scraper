# About

A movie/series scraper using Movie-WEB's scraping tool. 

Proxy support

## NOTE:
Ratelimit is a HUGE problem for this project (at least for scraping series.) It should work fine on movies but keep in mind that series still have problem.

Also, scraping data from TMDB is still poorly made, so if any bugs happen 🤷‍♂️

# To start
Open the index.mjs file 

For configuring the things you want to change are: 

Seasons array ( Which seasons you want to go over scraping) [No need to change if Movie]

Max episode count in the for loop (Use either a limit if you want or if you want them all, use a high number that max episode count a season can have) [No need to change if Movie]

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

# Video of demo:

( It's bad. I know.)

https://github.com/semihofc/showbox-scraper/assets/119341546/6c65047b-b64b-4da7-a891-1c2da9f9a9ae

# Known issues:

Getting ratelimited.
Inconsistent and not useful way to input the series/movie you want to scrape

# TODO:

Will make it so this shit has a better interface. Lmao.
