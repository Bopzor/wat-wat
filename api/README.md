# Wat-wat API documentation

There are two Models:
+ `Movie`
+ `Comment`

You can perform `GET`, `POST`, `PUT` and `DELETE` requests.

## Movies
A Movie is the following object:

<Movie> return by the API
```
{
  id: int,
  title: string || 'Unknown'
  plot: string || 'Unknown',
  released: string || 'Unknown',
  runtime: string || 'Unknown',
  director: string || 'Unknown',
  writer: string || 'Unknown',
  actors: string || 'Unknown',
  poster: string || 'Unknown',
  seen: boolean || false,
  imdbId: string || null,
  comment: Comment[],
  place: int,
  createdAt: date,
  updatedAt: null || date,
  deletedAt: null,
}
`<Movie>` to send for creation
{
  title: string || 'Unknown'
  plot: string || 'Unknown',
  released: string || 'Unknown',
  runtime: string || 'Unknown',
  director: string || 'Unknown',
  writer: string || 'Unknown',
  actors: string || 'Unknown',
  poster: string || 'Unknown',
  seen: boolean || false,
  imdbId: string || null,
}
```

`GET /movies`: return the full movies' list.

`GET /movies/:movieId`: return the movie which `id = movieId`.

`POST /movies`: create a movie with the request body (without the `id`, `place`, `createdAt`, `updatedAt` and `deletedAt` fields) or default values if none are send.  Return the created movie.
(`id`, `createdAt`, `updatedAt` and `deletedAt` are managed by the ORM.
}`: delete the matching movie. Return nothing.

`POST /sort`: reorder movies. The body must contain a object shape like: `{ order: { prev: int, nxt: int } } ` where `prev` correspond to the current movie place in the list and `nxt` to the new movie place in the list. Return the new reordered movies list.

## Comments
A Comment is the following object:

```
{
  id: int,
  author: string || 'Anonymous',
  comment: string, || '',
  movieID: int,
}
```

`POST /movies/:movieId/comments`: create a comment. Return the corresponding updated movie.

`PUT /movies/:movieId/comments/:commentId`: update an existing comment. Return the corresponding updated movie.

`DELETE /movies/:movieId/comments/:commentId`: delete the comment. Return nothing.