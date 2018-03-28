const BASE_URL = 'baseurl';
const BASE_API_URL = '/api/movies'
const OMDB_API_URL = 'http://www.omdbapi.com/?apikey=8ce98bc8&t=';

/**

state: {
    movies: Movie[],
    displayMovieId: number | null,
    filter: {
        seen: boolean,
        notSeen: boolean,
    },
}

Movie: {
    id: number,    
    title: string,
    plot: string,
    // other details
    seen: boolean,
    place: number,
    comments: Comment[],
}

Comment: {
    id: number,
    author: string,
    comment: string,
    createdAt: date,
    updatedAt: date,
}

*/

const state = {
    movies: [],
    displayMovieId: null,
    filter: {
        seen: true,
        notSeen: true,
    },
};

function myFetch(route, opts) {
    opts = opts || {};

    print_state();

    return fetch(route, opts)
        .then(res => {
            let promise = null;

            if (/application\/json/.exec(res.headers.get('Content-Type')))
                promise = res.json();  
            else 
                promise = res.text();

            return promise
                .then(json => {
                    print_fetch_result(route, opts, res, json);
                    return json;
                })
                .catch(error => {
                    print_fetch_result(route, opts, res, error);
                    throw error;
                });
        });
}

function print_fetch_result(route, opts, res, json) {
    console.log([
            'fetch:',
            opts.method || 'GET',
            route,
            '->',
            res.status
        ].join(' '),
        json);
}

function print_state() {
    console.log('state: ', $.extend({}, state));
}

function refresh() {
    return myFetch(BASE_URL + BASE_API_URL)
        .then(movies => {
            state.movies = movies;
            let filtered = [];

            if ((state.filter.seen && state.filter.notSeen) || (!state.filter.seen && !state.filter.notSeen))
                $("li.list-item").replaceWith(movies.forEach(createMovie)); 
            else if (state.filter.seen && !state.filter.notSeen) {
                filtered = movies.filter(m => m.seen);
                $("li.list-item").replaceWith(filtered.forEach(createMovie));
            } else { 
                filtered = movies.filter(m => !m.seen);
                $("li.list-item").replaceWith(filtered.forEach(createMovie));                     
            }
                    
        })
        .catch(error => console.error('Error:', error));
}

function createMovie(movie) {
    $("ul.movies-list").append(createMovieTitle(movie));
}


function addMovie(title) {
    myFetch(OMDB_API_URL + title)
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

            return myFetch(BASE_URL + BASE_API_URL, opts)
                .then(movie => {
                    state.movies.push(movie);
                    createMovie(movie);
                })
                .catch(error => console.error('Error:', error));
        });

    document.getElementById("form").reset();
}

function checkInput() {
    const title = $("#newMovie").val().trim();

    if (title.length === 0) {
        console.log('Error: Enter a movie title');
    }

    myFetch(OMDB_API_URL + title)
        .then(description => {
            if (description.Response === "False") {
                console.log('Error:', description.Error);
            } else {
                addMovie(title);
            }
        });
}

function deleteMovie(id) {
    const opts = {
        method: 'DELETE',
    };

    return myFetch(BASE_URL + BASE_API_URL + '/' + id, opts)
        .then(() => $('#movie-item-' + id).remove())
        .then(() => {
            state.movies.splice(state.movies.findIndex(m => m.id === id), 1)
            $("#movie-details").remove();
            $(".comment-container").remove();
        })  
        .catch(error => console.error('Error:', error));
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

    return myFetch(BASE_URL + BASE_API_URL + '/sort', opts)
        .catch(error => console.error('Error:', error));
}

$(function() {
    $('#form').on('submit', checkInput);

    refresh();

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

function show(id) {
    $("#movie-details").remove();
    $(".comment-container").remove();    

    if (state.displayMovieId === id)
        state.displayMovieId = null;
    else {
        const idx = state.movies.findIndex(m => m.id === id);
        const seen = state.movies[idx].seen;
    
        $(".details-container").append(createMovieDetails(state.movies[idx]));
        $(".comments-section").append(createCommentHTML(state.movies[idx]));

        if (seen)
            $("#seen").removeClass("md-inactive").addClass("seen");
        else
            $("#seen").removeClass("seen").addClass("md-inactive");

        state.displayMovieId = id;
    }
}

function setSeen(id) {
    const idx = state.movies.findIndex(m => m.id === id);
    const seen = state.movies[idx].seen;
    const isSeen = !seen;

    const opts = {
        method: 'PUT',
        body: JSON.stringify({
            seen: isSeen,
        }),
        headers: new Headers({
            'Content-Type': 'application/json',
        })
    };

    return myFetch(BASE_URL + BASE_API_URL + '/' + id, opts)  
        .then(movie => {
            console.log('last:', state.movies[idx].seen, ' new: ', isSeen);
            state.movies[idx].seen = isSeen;
            if (isSeen) {
                $("#seen").removeClass("md-inactive").addClass("seen");
            } else {
                $("#seen").removeClass("seen").addClass("md-inactive");
            }
        })
        .catch(error => console.error('Error:', error));
       
}

function filterSeen() {
    state.filter.notSeen = !state.filter.notSeen;
    refresh();
}

function filterNotSeen() {
    state.filter.seen = !state.filter.seen;
    refresh();
}

function deleteComment(movieId, commentId) {
    const opts = {
        method: 'DELETE',
    };

    return myFetch(BASE_URL + BASE_API_URL + '/' + movieId + '/comment/' + commentId, opts)
        .then(() => {
            const movieIdx = state.movies.findIndex(m => m.id === movieId);
            const movie = state.movies[movieIdx];
            const commentIdx = movie.comments.findIndex(c => c.id === commentId);
            const comment = movie.comments[commentIdx];
            $('#comment-id-' + commentIdx).remove();
            state.movies[movieIdx].comments.splice(commentIdx, 1); 
        })
        .catch(error => console.error('Error:', error));
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

    return myFetch(BASE_URL + BASE_API_URL + '/' + id + '/comments', opts)
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
            state.movies.splice(idx, 1, movie);
            $(".comments-section").append(html);
        })
        .catch(error => console.error('Error:', error));
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
<div id="movie-details" data-id="${movie.id}">
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
        <div class="seen-icon">
            <button class="seen-button" onclick="setSeen(${movie.id})">
                <i id="seen" class="material-icons md-48 md-inactive">done_all</i>
            </button>    
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

