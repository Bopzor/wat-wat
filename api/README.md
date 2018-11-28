# Wat-wat API documentation

There are two Models:
+ `Movie`
+ `Comment`
You can perform `GET`, `POST`, `PUT` and `DELETE` requests.

## Movies
A Movie is the following object:

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
}
```
`POST /sort`: reorder movies.  

`GET /movies`: return the full movies' list.  

`GET /movies/:movieId`: return the movie which `id = movieId`.  

`POST /movies`: create a movie with the request body or default values if none are send.  Return the created movie.  
`id`, `createdAt`, `updatedAt` and `deletedAt` are managed by the ORM.

`PUT /movies/:id`: update the given field(s) with the given value(s) and return the movie.  

`DELETE /movies/:id`: delete the movie. Return nothing.  

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