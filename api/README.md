# API

## Install

Install dependancies with `npm install`

## Start

Start the API server with `[PORT=8000] npm start`

## Routes

```
<movie>: {
  "id": integer,
  "title": string,
}
```

- `GET /api/movies`: retrieve all movies. Returns: `[<movie>, ...]`
- `GET /api/movie/:id`: retrieve one movie. Returns: `<movie>`
- `POST /api/movie`: create a movie. Body: `{ "title": string }`. Returns: `<movie>`
- `PUT /api/movie/:id`: update an existing movie. Body: `{ "title": string }`. Returns: `<movie>`
- `DELETE /api/movie/:id`: remove a movie. This route doesn't return anything.
- `POST /api/movies/sort`: Update the movies order. Body: `[integer, ...]` (the new movies ids order). Returns: `[<movie>, ...]`

## Author

[NilsCox](https://github.com/nilscox)
