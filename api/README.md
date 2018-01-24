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
  "plot": string,
  "released": string,
  "runtime": string,
  "director": string,
  "writer": string,
  "actors": string,
  "poster": string
}
```

`<partial movie>` is a movie with eventually missing fields.

- `GET /api/movies`: retrieve all movies. Returns: `[<movie>, ...]`
- `GET /api/movie/:id`: retrieve one movie. Returns: `<movie>`
- `POST /api/movie`: create a movie. Body: `<movie>` (without the `id` field). Returns: `<movie>`
- `PUT /api/movie/:id`: update an existing movie. Body: `<partial movie>`. Returns: `<movie>`
- `DELETE /api/movie/:id`: remove a movie. This route doesn't return anything.
- `POST /api/movies/sort`: Update the movies order. Body: `[integer, ...]` (the new movies ids order). Returns: `[<movie>, ...]`

## Author

[NilsCox](https://github.com/nilscox)
