const BASE_URL = 'http://localhost:4269';

const imdb = require('imdb-api');

const MOVIE_TEMPLATE = '\
<li class="list-item" id="movie-MOVIE_ID">\
    <div class="remove-button">\
        <button class="mdl-button mdl-js-button mdl-button--fab mdl-button--mini-fab mdl-button--colored" style="width: 20px; height: 20px; min-width: initial;" onclick="deleteMovie(MOVIE_ID)">\
            <i class="material-icons md-18">remove</i>\
        </button>\
    </div>\
    <div class="movie-title" onclick="enlarge(MOVIE_ID)">\
        MOVIE_TITLE\
    </div>\
    <div class="movie-plot">\
        MOVIE_PLOT\
    </div>\
</li>';

function createMovie(movie) {
    let template = MOVIE_TEMPLATE;

    template = template.replace(/MOVIE_ID/g, movie.id);
    template = template.replace(/MOVIE_TITLE/g, movie.title);
    template = template.replace(/MOVIE_PLOT/g, getMoviePlot)

    $("ul.movies-list").append(template);
}

function enlarge(id) {
    $("#movie-" + id + " .movie-plot").slideToggle("slow");
}

function addMovie() {
    const title = $("#newMovie").val();
    const opts = {
        method: 'POST',
        body: JSON.stringify({ title }),
        headers: new Headers({
            'Content-Type': 'application/json',
        })
    };

    return fetch(BASE_URL + '/api/movie', opts)
        .then(res => res.json())
        .catch(error => console.error('Error:', error))
        .then(movie => {
            console.log('Success:', movie);
            createMovie(movie);
        });
}

function getMoviesList() {
    return fetch(BASE_URL + '/api/movies')
        .then(res => res.json())
        .catch(error => console.error('Error:', error))
        .then(movies => {
            console.log('Success:', movies);
            movies.forEach(createMovie);
        });
}

function deleteMovie(id) {
    const opts = {
        method: 'DELETE',
    };

    return fetch(BASE_URL + '/api/movie/' + id, opts)
        .catch(error => console.error('Error:', error))
        .then(() => $('#movie-' + id).remove());
}

function getMoviePlot() {
    const title = $("#newMovie").val();
    imdb.get(title, {apiKey: '8ce98bc8', timeout: 30000})
    .then(console.log).catch(console.log);
}