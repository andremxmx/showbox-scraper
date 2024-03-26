import fs from 'fs';
import fetch from 'node-fetch';
import minimist from 'minimist';
import { makeProviders, makeStandardFetcher, targets } from '@movie-web/providers';
import { Agent as httpsAgent } from 'https';

const https = new httpsAgent();

const proxies = [
  'https://144.22.62.109:3128'
];

let proxyIndex = 0;
const useProxy = true;

const args = minimist(process.argv.slice(2));
const { mode, id } = args;
const idString = String(id);

if (!mode || (mode !== 'tv' && mode !== 'movie')) {
  console.error('Error: Please specify a valid mode: "tv" or "movie".');
  process.exit(1);
}

if (!id) {
  console.error('Error: Please specify at least one ID.');
  process.exit(1);
}

const idList = idString.includes(',') ? idString.split(',').map(Number) : [Number(idString)];

async function fetchAndSaveLinks() {
  try {
    const providers = makeProviders({
      fetcher: makeStandardFetcher(fetch),
      target: targets.NATIVE,
    });

    for (const seriesID of idList) {
      const currentProxy = useProxy ? proxies[proxyIndex % proxies.length] : null;
      proxyIndex++;

      const response = await fetch(`https://api.themoviedb.org/3/${mode === 'tv' ? 'tv' : 'movie'}/${seriesID}?api_key=5666d46d7f9ce6368ae16ea8bea0467a`, {
        agent: currentProxy ? https : undefined,
      });
      const seriesData = await response.json();

      if (mode === 'tv') {
        const seriesName = seriesData.original_name;
        const numberOfSeasons = seriesData.number_of_seasons;
        const seasons = Array.from({ length: numberOfSeasons }, (_, index) => index + 1);

        const outputJSON = { [seriesName]: {} };

        for (const seasonNumber of seasons) {
          outputJSON[seriesName][`Season ${seasonNumber}`] = {};
          for (let episodeNumber = 1; episodeNumber <= 150; episodeNumber++) {
            try {
              const type = 'show';
              const response = await fetch(`https://api.themoviedb.org/3/${type === 'show' ? 'tv' : 'movie'}/${seriesID}?api_key=5666d46d7f9ce6368ae16ea8bea0467a`, {
                agent: currentProxy ? undefined : null,
              });
              const data = await response.json();
              let releaseYear, title;

              if (type === 'show') {
                releaseYear = data.first_air_date.split('-')[0];
                title = data.name;
              } else if (type === 'movie') {
                releaseYear = data.release_date.split('-')[0];
                title = data.original_title;
              }

              const media = {
                type: type,
                title: title,
                releaseYear: releaseYear,
                tmdbId: seriesID,
                episode: {
                  number: episodeNumber
                },
                season: {
                  number: seasonNumber
                }
              };
              const Stream = await providers.runAll({
                media: media,
                sourceOrder: ['showbox']
              });

              const qualities = Object.keys(Stream.stream.qualities);
              const bestQuality = qualities.reduce((prev, curr) => {
                const prevQuality = parseInt(prev);
                const currQuality = parseInt(curr);
                return currQuality > prevQuality ? curr : prev;
              });

              const episodeKey = `Episode ${episodeNumber}`;
              if (!outputJSON[seriesName][`Season ${seasonNumber}`][episodeKey]) {
                outputJSON[seriesName][`Season ${seasonNumber}`][episodeKey] = Stream.stream.qualities[bestQuality].url;
                console.log(`Season ${seasonNumber}, Episode ${episodeNumber}: ${Stream.stream.qualities[bestQuality].url}`);
              }
            } catch (error) {
              console.error(`Error fetching Season ${seasonNumber}, Episode ${episodeNumber}: ${error.message}`);
              break;
            }
          }
        }

        const seriesOutputPath = `url_scraped/${seriesName}.json`;
        fs.existsSync('url_scraped') || fs.mkdirSync('url_scraped');
        fs.writeFileSync(seriesOutputPath, JSON.stringify(outputJSON, null, 2));
        console.log(`TV show JSON file for "${seriesName}" created successfully.`);
      } else {
        const title = seriesData.original_title;
        try {
          const type = 'movie';
          const response = await fetch(`https://api.themoviedb.org/3/${type === 'show' ? 'tv' : 'movie'}/${seriesID}?api_key=5666d46d7f9ce6368ae16ea8bea0467a`, {
            agent: currentProxy ? undefined : null,
          });
          const data = await response.json();
          let releaseYear, movieTitle;

          if (type === 'show') {
            releaseYear = data.first_air_date.split('-')[0];
            movieTitle = data.name;
          } else if (type === 'movie') {
            releaseYear= data.release_date.split('-')[0];
            movieTitle = data.original_title;
          }

          const media = {
            type: type,
            title: movieTitle,
            releaseYear: releaseYear,
            tmdbId: seriesID
          };
          const Stream = await providers.runAll({
            media: media,
            sourceOrder: ['showbox']
          });

          const qualities = Object.keys(Stream.stream.qualities);
          const bestQuality = qualities.reduce((prev, curr) => {
            const prevQuality = parseInt(prev);
            const currQuality = parseInt(curr);
            return currQuality > prevQuality ? curr : prev;
          });

          const movieOutputJSON = {
            id: seriesID,
            name: movieTitle,
            url: Stream.stream.qualities[bestQuality].url
          };

          const moviesOutputPath = `url_scraped/movies.json`;
          fs.existsSync('url_scraped') || fs.mkdirSync('url_scraped');
          fs.appendFileSync(moviesOutputPath, JSON.stringify(movieOutputJSON, null, 2) + ',\n');
          console.log(`Movie JSON file for "${movieTitle}" created successfully.`);
          console.log(`Using proxy: ${currentProxy}`);

        } catch (error) {
          console.error(`Error fetching movie data: ${error.message}`);
        }
      }
    }
  } catch (error) {
    console.error(`Error: ${error.message}`);
  }
}
// Run the script with command line arguments if any are provided
// node index.mjs --mode movie --id 155,854

// --mode   tv & movie 

fetchAndSaveLinks();
