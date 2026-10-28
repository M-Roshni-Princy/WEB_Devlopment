# Weather & Movie Finder

A small two-in-one web project made with HTML, CSS and modern JavaScript. It lets users search current weather by city and look up movies with posters, release years and IMDb ratings.

## Features

- Search current weather by city name.
- Display temperature, condition, feels-like temperature, humidity and wind speed.
- Search movies by title.
- Show movie posters, release year and rating when available.
- Show helpful messages for empty or invalid searches and API problems.
- Responsive layout for desktop and mobile screens.
- Uses ES modules, `fetch`, `async/await`, template literals and DOM updates.

## Technologies

- HTML5
- CSS3
- JavaScript ES6+
- Open-Meteo weather and geocoding APIs (no API key needed)
- OMDb API

## Setup

Only the movie search needs an API key. The weather app uses Open-Meteo, which does not require a key.

1. Get a key from [OMDb API](https://www.omdbapi.com/apikey.aspx).
2. Open `js/config.js`.
3. Replace the placeholder with your OMDb key:

   ```js
   export const MOVIE_API_KEY = "paste_your_omdb_key_here";
   ```

4. Run the folder through a local server because JavaScript modules may not work when the HTML file is opened directly.

### Run with VS Code

Install the **Live Server** extension, open `index.html`, and choose **Open with Live Server**.

### Run with Python

From the project folder, run:

```bash
python -m http.server 5500
```

Then open `http://localhost:5500` in your browser.

## Project structure

```text
weather_movie_minor_project/
├── index.html
├── css/
│   └── style.css
├── js/
│   ├── app.js
│   ├── config.js
│   ├── movies.js
│   └── weather.js
└── README.md
```

## Notes

- The apps need an internet connection. Movie search also needs a valid OMDb API key; weather search does not need a key.
- Keep personal API keys private. Do not commit real keys to a public repository.
- Movie ratings may not be available for every result.
