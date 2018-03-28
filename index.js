const BASE_URL = '{{baseurl}}';
const BASE_API_URL = '/api/movies'
const OMDB_API_URL = 'http://www.omdbapi.com';
const OMDB_API_KEY = '8ce98bc8';

const state = {
    movies: [],
    displayMovieId: null,
    searchResult: null,
};

function buildUrl(baseurl, params) {
    let url = baseurl;
    const paramsStr = Object.keys(params).map(key => key + '=' + params[key]);

    if (!url.endsWith('/')) {
        url += '/';
    }

    if (paramsStr.length > 0) {
        url += '?';
        url += paramsStr.join('&');
    }

    return url;
}

function searchMovie(query) {
    const url = buildUrl(OMDB_API_URL, {
        apiKey: OMDB_API_KEY,
        s: query,
    });

    return fetch(url)
        .then(res => res.json())
        .then(json => {
            if (json.Response !== 'True')
                throw json;

            return json.Search.map(movie => movie.Title);
        })
        .catch(err => console.error(err)); 
}

function getMovieDetails(title) {
    const url = buildUrl(OMDB_API_URL, {
        apiKey: OMDB_API_KEY,
        t: title,
    });

    return fetch(url)
        .then(res => res.json())
        .then(json => {
            if (json.Response !== 'True')
                throw json;

            return json;
        })
        .catch(err => console.error(err));
}

function createMovieTitle(movie) {
    return `
<li class="list-item" id="movie-item-${movie.id}" data-id="${movie.id}">
    <div class="item-list-zone">
        <div class="movie-title" onclick="show(${movie.id})">
            ${movie.title}
        </div>
        <div class="list-button">
            <div class="sort-button handle">
                <a class="mdl-button mdl-js-button mdl-button--fab mdl-button--mini-fab mdl-button--colored" 
                style="width: 20px; height: 20px; min-width: initial;">
                    <i class="material-icons md-18">swap_vert</i>
                </a>
            </div>
            <div class="remove-button">
                <button class="mdl-button mdl-js-button mdl-button--fab mdl-button--mini-fab mdl-button--colored" 
                style="width: 20px; height: 20px; min-width: initial;" id="delete" onclick="deleteMovie(${movie.id})">
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
    <div id="details">
        <div class="movie-poster"><img id="poster" src="${movie.poster}" alt="${movie.title}"></div>
        <div class="movie-infos">
            <div class="details-movie-title">${movie.title}</div><br>
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
            <textarea class="comment-input" rows="4" cols="50">Say it!</textarea> 
        </form>
        <div class="add-button add-comment" style="width: 35px; height: 35px; min-width: initial;">
            <button class="mdl-button mdl-js-button mdl-button--fab mdl-button--mini-fab mdl-button--colored" 
            style="width: 35px; height: 35px; min-width: initial;" onclick="postComment(${movie.id})">
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
    $(".comment-container").remove();    

    if (state.displayMovieId === id) {
        state.displayMovieId = null;
    } else {
        const idx = state.movies.findIndex(m => m.id === id);

        $(".details-container").append(createMovieDetails(state.movies[idx]));
        $(".comments-section").append(createCommentHTML(state.movies[idx]));
        state.displayMovieId = id;
    }
}

let debounceTimeout = null;

function onMovieInputKeyPress() {
    const title = $("#newMovie").val().trim();

    if (debounceTimeout) {
        clearTimeout(debounceTimeout);
        debounceTimeout = null;
    }

    if (title.length < 3) 
        return;

    debounceTimeout = setTimeout(() => {
        searchMovie(title)
            .then(titlesArray => state.searchResult = titlesArray);
    }, 2000);
}

function checkInput() {
    const title = $("#newMovie").val().trim();

    if (title.length === 0) {
        console.log('Error: Enter a movie title');
    }

    addMovie(title)
        .then(console.log);
}

function addMovie(title) {
    getMovieDetails(title)
        .then(details => {
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

            return fetch(BASE_URL + BASE_API_URL, opts)
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
    return fetch(BASE_URL + BASE_API_URL)
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

    return fetch(BASE_URL + BASE_API_URL + '/' + id, opts)
        .catch(error => console.error('Error:', error))
        .then(() => $('#movie-item-' + id).remove())
        .then(() => {
            state.movies.splice(state.movies.findIndex(m => m.id === id), 1)
            $("#movie-details").remove();
            $(".comment-container").remove();
            });  
}

function sendSort(place) {
    const opts = {
        method: 'POST',
        body: JSON.stringify({
            order: place,
        }),
        headers: new Headers({
            'Content-Type': 'application/json',
        })
    };

    return fetch(BASE_URL + BASE_API_URL + '/sort', opts)

        .then(res => res.json())
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
        helper: 'original',
        handle: '.handle',
        placeholder: "ui-sortable-placeholder",
        update: function(event, ui) {
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

function postComment(id) {
    const author = $(".author-name").val().trim();
    const comment = $(".comment-input").val().trim();
    const opts = {
        method: 'POST',
        body: JSON.stringify({
            comment: comment,
            author: author,
        }),
        headers: new Headers({
            'Content-Type': 'application/json',
        })
    };

    return fetch(BASE_URL + BASE_API_URL + '/' + id + '/comments', opts)
        .then(res => res.json())
        .catch(error => console.error('Error:', error))
        .then(movie => {
            const idx = state.movies.findIndex(m => m.id === id);
            const comment = movie.comments[movie.comments.length - 1];
            const html =`
<div class="comment-container">
    <div class="comment" id="comment-id-${comment.id}">
        <div class="comment-author">${comment.author} :</div>
        <div class="comment-message">${comment.comment}</div>
    </div>
    <div class="comment-buttons">
        <div class="edit-button">
            <button class="mdl-button mdl-js-button mdl-button--fab mdl-button--mini-fab mdl-button--colored" 
            style="width: 20px; height: 20px; min-width: initial;">
                <i class="material-icons md-18">mode_edit</i>
            </button>
        </div>
        <div class="remove-button">
            <button class="mdl-button mdl-js-button mdl-button--fab mdl-button--mini-fab mdl-button--colored" 
            style="width: 20px; height: 20px; min-width: initial;" onclick="deleteComment(${movie.id}, ${comment.id})">
                <i class="material-icons md-18">remove</i>
            </button>
        </div>
    </div>
</div>
`            
            console.log('Success:', comment.author, 'said:', comment.comment);
            
            state.movies.splice(idx, 1, movie);
            $(".comments-section").append(html);
        });
}

function createCommentHTML(movie) {
    const comments = movie.comments;
    let html = '';

    for (let i = 0; i < comments.length; i++)
    html +=`
<div class="comment-container">
    <div class="comment" id="comment-id-${comments[i].id}">
        <div class="comment-author">${comments[i].author} :</div>
        <div class="comment-message">${comments[i].comment}</div>
    </div>
    <div class="comment-buttons">
        <div class="edit-button">
            <button class="mdl-button mdl-js-button mdl-button--fab mdl-button--mini-fab mdl-button--colored" 
            style="width: 20px; height: 20px; min-width: initial;">
                <i class="material-icons md-18">mode_edit</i>
            </button>
        </div>
        <div class="remove-button">
            <button class="mdl-button mdl-js-button mdl-button--fab mdl-button--mini-fab mdl-button--colored" 
            style="width: 20px; height: 20px; min-width: initial;" 
            onclick="deleteComment(${movie.id}, ${comments[i].id})">
                <i class="material-icons md-18">remove</i>
            </button>
        </div>
    </div>
</div>
        `

    return html;
}

function deleteComment(movieId, commentId) {
    const opts = {
        method: 'DELETE',
    };

    return fetch(BASE_URL + BASE_API_URL + '/' + movieId + '/comment/' + commentId, opts)
        .catch(error => console.error('Error:', error))
        .then(() => {
            const movieIdx = state.movies.findIndex(m => m.id === movieId);
            const movie = state.movies[movieIdx];
            const commentIdx = movie.comments.findIndex(c => c.id === commentId);
            const comment = movie.comments[commentIdx];
            $('#comment-id-' + commentIdx).remove();
            state.movies[movieIdx].comments.splice(commentIdx, 1);
            
        });
}