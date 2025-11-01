TMDB Poster Fetcher

This repository includes a small Node script to fetch poster URLs from The Movie Database (TMDB) for the movie entries in `movie.js`.

How it works
- The script `scripts/fetch_tmdb_posters.js` executes `movie.js` in a sandbox to read `window.movieRecommendations` (an array).
- For each movie it does a TMDB search by title (and year if available) and, when found, writes `posterUrl` as `https://image.tmdb.org/t/p/w500{poster_path}`.
- The script backups the original `movie.js` to `movie.js.bak.<timestamp>` before overwriting it.

Security
- Do NOT commit your TMDB API key. The script reads the key from the environment variable `TMDB_API_KEY` or from the first CLI argument.

Setup & Run
1. Install Node (if you don't already). Node 14+ recommended.
2. From the repo root, install dependencies:

   npm init -y
   npm install axios

3. Run the script (example):

   TMDB_API_KEY=your_tmdb_api_key node scripts/fetch_tmdb_posters.js ./movie.js

   Or, on Windows PowerShell:

   $env:TMDB_API_KEY = "your_tmdb_api_key"; node scripts/fetch_tmdb_posters.js ./movie.js

Behavior & Notes
- The script skips entries that already have a non-placeholder `posterUrl`.
- It tries to match by year when possible to reduce false positives.
- It waits ~250ms between requests to be polite; you can adjust this in the script.
- If a movie has no TMDB match, it leaves the entry unchanged.

If you'd like, I can:
- Change the output size (w500 → w780 or original) or add multiple sizes.
- Store the poster mapping in a separate JSON file instead of overwriting `movie.js`.
- Run the script here if you provide an API key (but it's safer to run locally).
