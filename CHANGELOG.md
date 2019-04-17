# Changelog
To keep a trace of changes.


## [Unrealesed]

## [2.3.0] - 2019-04-17
### Added
+ API documentation with Swagger

### Fixed
+ Fix search result

### Changed
+ New version of the API
+ Change how movie details are displayed

## [2.2.0] - 2018-11-21
### Added
+ Possible to add a movie title if the movie is not on OMDB
+ Display default image for movie poster

### Fixed
+ Search with last word if title not found (Issue #8)

## [2.1.3] - 2018-10-06
### Fixed
+ Fix add movie (wrong query for max place)
+ Fix sort movie

## [2.1.2] - 2018-08-26
### Fixed
+ Fix magnet link url

## [2.1.1] - 2018-08-15
### Fixed
+ Fix material ui components display by updating material ui

## [2.1.0] - 2018-08-14
### Added
+ Get and show magnets links of movies
+ Use docker to start wat-wat api
+ Migration and seeders process

### Changed
+ Use snack bars to display errors to the user
+ Responsive design

## [2.0.0] - 2018-05-22
### Added
+ Restart from scratch with React
+ Comments movies (add, delete, update)
+ Autosuggestion to add movie
+ Add progress bar on movie title submit
+ Display alert on movie not found
+ The possibility to note if the movie is already seen
+ Filter movies list by seen or not or both
+ Use media query for screen size under 1100px

### Fixed
+ The two sides of the page stay at the same size when movie detail is showed
+ Better management of the poster size

### Changed
+ Movie details are removed when the movie is delete
+ Returns the full movie instead of the comment only
+ Adapt DB to new features

## [1.2.0] - 2018-03-23
### Added
+ New route: /api/version


## [1.1.1] - 2018-03-23
### Fixed
+ Remove mistakes that have been made with the last merge


## [1.1.0] - 2018-03-23
### Added
+ Use script bundle.sh to set the base url

### Changed
+ New design. Now movie detail is showed on the right side of the page


## [1.0.0] - 2018-03-11
### Added
+ Just everything. This is the first time wat-wat is in production
+ Add a movie to the list
+ Delete a movie from the list
+ Sort movies
+ Show/hide movie detail
