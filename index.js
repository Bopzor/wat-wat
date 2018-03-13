const BASE_URL = 'baseurl';
const OMDB_API_URL = 'http://www.omdbapi.com/?apikey=8ce98bc8&t=';

const state = {
    movies: [],
    displayMovieId: null,
};

function createMovieTitle(movie) {
    return `
<li class="list-item" id="movie-item-${movie.id}" data-id="${movie.id}">
    <div class="item-list-zone">
        <div class="movie-title" onclick="show(${movie.id})">
            ${movie.title}
        </div>
        <div class="list-button">
            <div class="sort-button handle">
                <a class="mdl-button mdl-js-button mdl-button--fab mdl-button--mini-fab mdl-button--colored" style="width: 20px; height: 20px; min-width: initial;">
                    <i class="material-icons md-18">swap_vert</i>
                </a>
            </div>
            <div class="remove-button">
                <button class="mdl-button mdl-js-button mdl-button--fab mdl-button--mini-fab mdl-button--colored" style="width: 20px; height: 20px; min-width: initial;" id="delete" onclick="deleteMovie(${movie.id})">
                    <i class="material-icons md-18">remove</i>
                </button>
            </div>
        </div>
    </div>
</li>`;
}

function createMovieDetails(movie) {
    return `
<div id="movie-details">
    <div id="movie-img">
    <div class="movie-poster"><img id="poster" src="${movie.poster}" alt="${movie.title}"></div>
    <div class="movie-infos">
        <div class="details-movie-title"><h4>${movie.title}</h4></div>
        <div class="movie-released"><div class="content">Released:</div> ${movie.released}</div>
        <div class="movie-runtime"><div class="content">Runtime:</div> ${movie.runtime}</div>
        <div class="movie_director"><div class="content">Director:</div> ${movie.director}</div>
        <div class="movie-writer"><div class="content">Writer:</div> ${movie.writer}</div>
        <div class="movie-actors"><div class="content">Actors:</div> ${movie.actors}</div>
    </div>
    </div>
    <div class="movie-plot">${movie.plot}</div>
        <div class="comment-form">
            <form class="text-form">
                <input class="author-name" type="text" name="NickName" placeholder="Name" maxlenght="4" required>
                <textarea class="comment" rows="4" cols="50">Say it!</textarea> 
            </form>
            <div class="add-button add-comment" style="width: 35px; height: 35px; min-width: initial;">
                <button class="mdl-button mdl-js-button mdl-button--fab mdl-button--mini-fab mdl-button--colored" style="width: 35px; height: 35px; min-width: initial;">
                    <i class="material-icons">add</i>
                </button>
            </div>
        </div>    
</div>
`;
}

function createMovie(movie) {
    $("ul.movies-list").append(createMovieTitle(movie));
}

function show(id) {
    $("#movie-details").remove();

    if (state.displayMovieId === id) {
        state.displayMovieId = null;
    } else {
        const idx = state.movies.findIndex(m => m.id === id);

        $(".details-container").append(createMovieDetails(state.movies[idx]));
        state.displayMovieId = id;
    }
}

function checkInput() {
    const title = $("#newMovie").val().trim();

    if (title.length === 0) {
        console.log('Error: Enter a movie title');
    }

    fetch (OMDB_API_URL + title)
        .then(res => res.json())
        .then(description => {
            if (description.Response === "False") {
                console.log('Error:', description.Error);
            } else {
                addMovie(title);
            }
        });
}

function addMovie(title) {
    fetch (OMDB_API_URL + title)
        .then(res => res.json())
        .then (details => {
            const opts = {
                method: 'POST',
                body: JSON.stringify({
                    title,
                    plot: details.Plot,
                    released: details.Released,
                    runtime: details.Runtime,
                    director: details.Director,
                    writer: details.Writer,
                    actors: details.Actors,
                    poster: details.Poster,
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
                    state.movies.push(movie);
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
            state.movies = movies;
            movies.forEach(createMovie);
        });
}

function deleteMovie(id) {
    const opts = {
        method: 'DELETE',
    };

    return fetch(BASE_URL + '/api/movie/' + id, opts)
        .catch(error => console.error('Error:', error))
        .then(() => $('#movie-item-' + id).remove())
        .then(() => state.movies.splice(state.movies.findIndex(m => m.id === id), 1));
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
    $('#form').on('submit', checkInput);

    getMoviesList();

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

            for (let i = 0; i < sortedIds.length; i++)
                place[sortedIds[i]] = i + 1;

            sendSort(place)
                .then(movies => state.movies = movies);
        }
    });
    $( ".sortable" ).disableSelection();
});
