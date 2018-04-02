const BASE_URL = '{{baseurl}}';
const BASE_API_URL = '/api/movies'
const OMDB_API_URL = 'http://www.omdbapi.com';
const OMDB_API_KEY = '8ce98bc8';

// STATE

/**

state: {
    movies: Movie[],
    displayMovieId: number | null,
    searchResult: null | MovieTitle[]
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
    searchResult: null,
    filter: {
        seen: false,
        notSeen: false,
    },
};

// OMDB STUFF

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

    return myFetch(url)
        .then(json => {
            if (json.Response !== 'True')
                throw json;

            return json;
        })
        .catch(err => console.error(err));
}

// CUSTOM FETCH

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

// INITIALIZATION

$(function() {
    $('#form').on('submit', checkInput);

    getMoviesList()
        .then(refresh);
});

function getMoviesList() {
    return fetch(BASE_URL + BASE_API_URL)
        .then(res => res.json())
        .then(movies => {
            console.log('Success:', movies);
            state.movies = movies;
            movies.forEach(DOM.addMovieTitleToList);
        })
        .catch(error => console.error('Error:', error));
}

// DOM HANDLERS

let debounceTimeout = null;

function onMovieInputKeyUp() {
    const title = $("#newMovie").val().trim();

    if (debounceTimeout) {
        clearTimeout(debounceTimeout);
        debounceTimeout = null;
    }

    if (title.length < 3)
        return;

    debounceTimeout = setTimeout(() => {
        searchMovie(title)
            .then(titlesArray => state.searchResult = titlesArray)
            .then(() => console.log(state.searchResult))
            .then(() => {
                if (state.searchResult) {
                    DOM.removeFromDOM("option");
                    DOM.createDropDownSearchMenu(state.searchResult);
                }
            })
    }, 1000);
}

function checkInput() {
    const title = $("#newMovie").val().trim();

    if (title.length === 0) {
        console.log('Error: Enter a movie title');
    }

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

            return myFetch(BASE_URL + BASE_API_URL, opts)
                .then(movie => {
                    document.getElementById("form").reset();
                    state.movies.push(movie);
                    DOM.addMovieTitleToList(movie);
                })
                .catch(error => console.error('Error:', error));
        })
        .then(console.log);
}

function deleteMovie(id) {
    const opts = {
        method: 'DELETE',
    };

    return myFetch(BASE_URL + BASE_API_URL + '/' + id, opts)
        .then(() => DOM.removeFromDOM("#movie-item-" + id))
        .then(() => {
            state.movies.splice(state.movies.findIndex(m => m.id === id), 1)
            if (id === state.displayMovieId)
                DOM.removeFromDOM(".right-side");
        })
        .catch(error => console.error('Error:', error));
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

    return myFetch(BASE_URL + BASE_API_URL + '/sort', opts)
        .catch(error => console.error('Error:', error));
}

function show(id) {
    if (state.displayMovieId === id) {
        state.displayMovieId = null;
        DOM.hideMovieDetails();
    } else {
        const idx = state.movies.findIndex(m => m.id === id);
        const seen = state.movies[idx].seen;

        DOM.showMovieDetails(state.movies[idx]);

        if (seen)
            DOM.replaceHTMLClass("#seen", "md-inactive", "seen");
        else
            DOM.replaceHTMLClass("#seen", "seen", "md-inactive");

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
            state.movies[idx].seen = isSeen;
            if (isSeen) {
                DOM.replaceHTMLClass("#seen", "md-inactive", "seen");
            } else {
                DOM.replaceHTMLClass("#seen", "seen", "md-inactive");
            }
        })
        .catch(error => console.error('Error:', error));

}

function filterSeen() {
    const movies = state.movies.filter(m => m.seen);
    const currentMovieIdx = null;

    state.filter.seen = !state.filter.seen;
    state.filter.notSeen = false;

    if (state.filter.seen === state.filter.notSeen)
        refresh();
    else
        DOM.refresh(movies, currentMovieIdx);

    print_state();
}

function filterNotSeen() {
    const movies = state.movies.filter(m => !m.seen);
    const currentMovieIdx = null;

    state.filter.notSeen = !state.filter.notSeen;
    state.filter.seen = false;

    if (state.filter.seen === state.filter.notSeen)
        refresh();
    else
        DOM.refresh(movies, currentMovieIdx);

    print_state();
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
            DOM.removeFromDOM("#comment-id-" + commentIdx);
            state.movies[movieIdx].comments.splice(commentIdx, 1);
        })
        .catch(error => console.error('Error:', error));
}

function postComment(id) {
    const author = DOM.getInput(".author-name");
    const comment = DOM.getInput(".comment-input");
    const opts = {
        method: 'POST',
        body: JSON.stringify({
            comment: comment,
            author: author,
        }),
        headers: new Headers({
            'Content-Type': 'application/json',
        }),
    };

    return myFetch(BASE_URL + BASE_API_URL + '/' + id + '/comments', opts)
        .then(movie => {
            const idx = state.movies.findIndex(m => m.id === id);
            const comment = movie.comments[movie.comments.length - 1];
            const html = DOM.createComment(movie.id, comment);
            state.movies.splice(idx, 1, movie);
            $(".comments-section").append(html);
        })
        .catch(error => console.error('Error:', error));
}

// DOM MANIPULATION

function refresh() {
    let currentMovieIdx = state.movies.findIndex(m => m.id === state.displayMovieId);

    if (currentMovieIdx === -1)
        currentMovieIdx = null;

    DOM.refresh(state.movies, currentMovieIdx);
}

const DOM = {

    /**
     * Replace the .right-side div with a new movie
     */
    showMovieDetails: function showMovieDetails(movie) {
        const html = `
        <div class="right-side">
            <div class="details-container">
                ${DOM.createMovieDetails(movie)}
            </div>
            <div class="comments-section">
                ${movie.comments.map(DOM.createComment)}
            </div>
        </div>`;

        $('.right-side').replaceWith(html);
    },

    /**
     * Hide the currently displayed movie details
     */
    hideMovieDetails: function hideMovieDetails() {
        $('.right-side').empty();
    },

    /**
     * Add a movie title to the list
     */
    addMovieTitleToList: function addMovieTitleToList(movie) {
        $("ul.movies-list").append(DOM.createMovieTitle(movie));
    },

    /**
    * Remove element from DOM
    */

    removeFromDOM: function removeFromDOM(query) {
        $(query).remove();
    },

    /**
    * Create the HTML for all dropdown menu when autocompletion
    */
    getInput: function getInput(query) {
        $(query).val().trim();
    },

    /**
     * Remove a class from a HTML tag and add the other one
     */

    replaceHTMLClass: function replaceHTMLClass(query, remove, add) {
        $(query).removeClass(remove).addClass(add);
    },

    /**
     * Refresh the whole page with new data
     */
    refresh: function refreshHTML(movies, currentMovieIdx) {
        let rightSideHtml = `<div class="right-side"></div>`;

        if (currentMovieIdx) {
            const movie = movies[currentMovieIdx];

            rightSideHtml = `
            <div class="right-side">
                <div class="details-container">
                    ${DOM.createMovieDetails(movie)}
                </div>
                <div class="comments-section">
                    ${movie.comments.map(DOM.createComment).join('')}
                </div>
            </div>`;
        }

        const html = `
        <div class="page-content">
            <div class="left-side">
                ${DOM.createAddMovieInput()}
                <div class="left-overflow">
                    <div class="list-zone">
                        <ul class="movies-list" id="sortable">
                            ${movies.map(DOM.createMovieTitle).join('')}
                        </ul>
                    </div>
                </div>
            </div>
            <div class="right-overflow">
                ${rightSideHtml}
            </div>
        </div>`;

        $('.page-content').replaceWith(html);

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
        $(".sortable").disableSelection();
    },

    /**
    * Create the HTML for all dropdown menu when autocompletion
    */
    createDropDownSearchMenu: function createDropDownSearchMenuHTML(titlesArray) {
        titlesArray.forEach(title => {
            let option = document.createElement('option');
            option.value = title;
            $("#titlesSearch").append(option);
        })
    },

    /**
     * Create the HTML string for the input to add a movie
     */
    createAddMovieInput: function createAddMovieInputHTML() {
        return `
        <div class="input">
            <div class="add-movie">
                <form action="#" id="form">
                    <div class="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">
                        <input class="mdl-textfield__input" type="text" list="titlesSearch" id="newMovie" onkeyup="onMovieInputKeyUp()">
                        <label class="mdl-textfield__label" for="newMovie" >New movie</label>
                    </div>
                    <datalist id="titlesSearch"></datalist>
                </form>
                <div class="add-button" style="width: 35px; height: 35px; min-width: initial;">
                    <button class="mdl-button mdl-js-button mdl-button--fab mdl-button--mini-fab mdl-button--colored"
                    style="width: 35px; height: 35px; min-width: initial;"
                    onclick="checkInput()">
                        <i class="material-icons">add</i>
                    </button>
                </div>
            </div>
            <div class="filter">
                <button class="seen-button" onclick="filterNotSeen()">
                    <i id="filter-not-seen" class="material-icons md-24 md-inactive">done_all</i>
                </button>
                <button class="seen-button" onclick="filterSeen()">
                    <i id="filter-seen" class="material-icons md-24 seen">done_all</i>
                </button>
            </div>
        </div>`;
    },

    /**
     * Create the HTML string for a comment in a movie details
     */
    createComment: function createCommentHTML(comment) {
        return `
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
                    style="width: 20px; height: 20px; min-width: initial;"
                    onclick="deleteComment(${comment.id})">
                        <i class="material-icons md-18">remove</i>
                    </button>
                </div>
            </div>
        </div>`;
    },

    /**
     * Create the HTML string for a movie title in the list
     */
    createMovieTitle: function createMovieTitleHTML(movie) {
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
    },

    /**
     * Create the HTML string for a movie detail
     */
    createMovieDetails: function createMovieDetailsHTML(movie) {
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
        </div>`;
    },
};
