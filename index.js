const BASE_URL = 'http://localhost:4269';
const BASE_CONTENT_URL = 'http://www.omdbapi.com/?apikey=8ce98bc8&t='

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
    <div class="movie-content">\
        <img class="movie-poster" src="MOVIE_POSTER">\
        <div class="movie-released">MOVIE_RELEASED</div>\
        <div class="movie-runtime">MOVIE_RUNTIME</div>\
        <div class="movie-plot">MOVIE_PLOT</div>\
        <div class="movie_director">MOVIE_DIRECTOR</div>\
        <div class="movie-writer">MOVIE_WRITER</div>\
        <div class="movie-actors">MOVIE_ACTORS</div>\
    </div>\
</li>';

function createMovie(movie) {
    let template = MOVIE_TEMPLATE;

    template= template.replace(/MOVIE_POSTER/g, movie.Poster);
    template = template.replace(/MOVIE_RELEASED/g, movie.Released);
    template = template.replace(/MOVIE_RUNTIME/g, movie.Runtime);
    template = template.replace(/MOVIE_Plot/g, movie.Plot);
    template = template.replace(/MOVIE_DIRECTOR/g, movie.Director);
    template = template.replace(/MOVIE_WRITER/g, movie.Writer);
    template = template.replace(/MOVIE_ACTORS/g, movie.Actors);
    template = template.replace(/MOVIE_ID/g, movie.id);
    template = template.replace(/MOVIE_TITLE/g, movie.title);

    $("ul.movies-list").append(template);
}

function enlarge(id) {
    $("#movie-" + id + " .movie-plot").slideToggle("slow");
}

function addMovie() {
    const title = $("#newMovie").val();

    fetch (BASE_CONTENT_URL + title)
        .then(res => res.json())
        .then (content => {
            const opts = {
                method: 'POST',
                body: JSON.stringify({
                    title,
                    Poster: content.Poster,
                    Released: content.Released,
                    Runtime: content.Runtime,
                    Plot: content.Plot,
                    Director: content.Director,
                    Writer: content.Writer,
                    Actors: content.Actors,
                }),
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