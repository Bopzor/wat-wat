const BASE_URL = 'http://localhost:4269';
const OMDB_API_URL = 'http://www.omdbapi.com/?apikey=8ce98bc8&t='

const MOVIE_TEMPLATE = '\
<li class="list-item" id="movie-MOVIE_ID" data-id="MOVIE_ID">\
    <div class="remove-button">\
        <button class="mdl-button mdl-js-button mdl-button--fab mdl-button--mini-fab mdl-button--colored" style="width: 20px; height: 20px; min-width: initial;" onclick="deleteMovie(MOVIE_ID)">\
            <i class="material-icons md-18">remove</i>\
        </button>\
    </div>\
    <div class="sort-button handle">\
        <a class="mdl-button mdl-js-button mdl-button--fab mdl-button--mini-fab mdl-button--colored" style="width: 20px; height: 20px; min-width: initial;">\
            <i class="material-icons md-18">swap_vert</i>\
        </a>\
    </div>\
        <div class="movie-title" onclick="enlarge(MOVIE_ID)">\
            MOVIE_TITLE\
        </div>\
        <div class="movie-content">\
            <img class="movie-poster" src="MOVIE_POSTER" alt="MOVIE_TITLE">\
            <div class="movie-released"><div class="content">Released:</div> MOVIE_RELEASED</div>\
            <div class="movie-runtime"><div class="content">Runtime:</div> MOVIE_RUNTIME</div>\
            <div class="movie-plot"><div class="content">Plot:</div> MOVIE_PLOT</div>\
            <div class="movie_director"><div class="content">Director:</div> MOVIE_DIRECTOR</div>\
            <div class="movie-writer"><div class="content">Writer:</div> MOVIE_WRITER</div>\
            <div class="movie-actors"><div class="content">Actors:</div> MOVIE_ACTORS</div>\
        </div>\
    </li>';

function createMovie(movie) {
    let template = MOVIE_TEMPLATE;

    template= template.replace(/MOVIE_POSTER/g, movie.poster);
    template = template.replace(/MOVIE_RELEASED/g, movie.released);
    template = template.replace(/MOVIE_RUNTIME/g, movie.runtime);
    template = template.replace(/MOVIE_PLOT/g, movie.plot);
    template = template.replace(/MOVIE_DIRECTOR/g, movie.director);
    template = template.replace(/MOVIE_WRITER/g, movie.writer);
    template = template.replace(/MOVIE_ACTORS/g, movie.actors);
    template = template.replace(/MOVIE_ID/g, movie.id);
    template = template.replace(/MOVIE_TITLE/g, movie.title);

    $("ul.movies-list").append(template);
}

function enlarge(id) {
    $("#movie-" + id + " .movie-content").slideToggle("slow");
}

function checkInput() {
    const title = $("#newMovie").val();

    fetch (OMDB_API_URL + title)
        .then(res => res.json())
        .then(content => {
            if (title.length === 0 || (title.length !== 0 && content.Response === "False")) {
                console.log('Error:', content.Error);
            } else {addMovie(title)}
        });
}

function addMovie(title) {
    fetch (OMDB_API_URL + title)
        .then(res => res.json())
        .then (content => {
            const opts = {
                method: 'POST',
                body: JSON.stringify({
                    title,
                    plot: content.Plot,
                    released: content.Released,
                    runtime: content.Runtime,
                    director: content.Director,
                    writer: content.Writer,
                    actors: content.Actors,
                    poster: content.Poster,
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

    document.getElementById("form").reset();
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

function sendSort(place){
    const opts = {
        method: 'POST',
        body: JSON.stringify({
            order: place,
        }),
        headers: new Headers({
            'Content-Type': 'application/json',
        })
    };

    return fetch(BASE_URL + '/api/movies/sort', opts)
        .catch(error => console.error('Error:', error))
}

$(function() {
    $("#sortable").sortable({
        axis: 'y',
        cursor: 'move',
        items: '> li',
        scroll: true,
        handle: '.handle',
        placeholder: "ui-sortable-placeholder",
        update: function(event, ui){
            const sortedIds = $(".list-item").toArray().map(elem => $(elem).data('id'));
            const place = {};

            for (var i = 0; i < sortedIds.length; i++)
                place[sortedIds[i]] = i + 1;

            sendSort(place)

        }
    });
    $( ".sortable" ).disableSelection();
});
