const express = require('express');

const router = express.Router();
const model = require('./model.js');

const { chkBodyParams } = require('./params'); // destructure the chkBodyParams out of require('./params') returned object

/* **************************************************
*  POST /movies
*  Add a new movie
*  @body title
*  @body director
*  @body year (int)
*  @body rating (int)
*  @body poster (url to a poster)
*  @return - the new movie record with id or
*          - { error: { message: "movie already esits" } } or
*          - forwards w/ next(Error)
http POST localhost:3000/movies title='My title' director='director' year=2000 rating=5 poster='http://blah-blah'
***************************************************** */
router.post('', (req, res, next) => {
  const oParams = {
    title: 'string',
    director: 'string',
    year: 'int',
    rating: 'int',
    poster: 'string',
  };
  if (!chkBodyParams(oParams, req, res, next))
    return;
  const oMovie = {
    // id: not-passed-to-create-new-record
    title: req.body.title,
    director: req.body.director,
    year: req.body.year,
    rating: req.body.rating,
    poster: req.body.poster,
  };
  model.create(oMovie)
    .then((newMovie) => {
      res.status(201).json(newMovie);
    })
    .catch((error) => {
      error.status = 400;
      next(error);
    });
});

/* **************************************************
*  GET /movies
*  Return array of all movies
http GET localhost:3000/movies
***************************************************** */
router.get('', (req, res, next) => {
  model.readAll()
    .then((aMovies) => {
      res.status(200).json(aMovies);
    })
    .catch((error) => {
      error.status = 400;
      next(error);
    });
});

/* **************************************************
*  GET /movies/:id
*  Return the movie
http GET localhost:3000/movies/2
***************************************************** */
router.get('/:id', (req, res, next) => {
  model.read(req.params.id)
    .then((oMovie) => {
      res.status(200).json(oMovie);
    })
    .catch((error) => {
      error.status = 404;
      next(error);
    });
});

/* **************************************************
*  PUT /movies/:id
*  Update the movie
*  @body title
*  @body director
*  @body year (int)
*  @body rating (int)
*  @body poster (url to a poster)
*  Return, the updated movie record
http PUT localhost:3000/movies/2  title='My title' director='director' year=2000 rating=5 poster='http://blah-blah'
***************************************************** */
router.put('/:id', (req, res, next) => {
  const oParams = {
    title: 'string',
    director: 'string',
    year: 'int',
    rating: 'int',
    poster: 'string',
  };
  if (!chkBodyParams(oParams, req, res, next))
    return;
  const oMovie = {
    id: req.params.id,
    title: req.body.title,
    director: req.body.director,
    year: req.body.year,
    rating: req.body.rating,
    poster: req.body.poster,
  };
  model.update(oMovie)
    .then((updatedMovie) => {
      res.status(201).json(updatedMovie);
    })
    .catch((error) => {
      error.status = 400;
      next(error);
    });
});

/* **************************************************
*  DELETE /movies/:id
*  Delete the movie
*  Return, the deleted record
http DELETE localhost:3000/movies/2
***************************************************** */
router.delete('/:id', (req, res, next) => {
  model.destroy(req.params.id)
    .then((oMovie) => {
      res.status(200).json(oMovie);
    })
    .catch((error) => {
      error.status = 404;
      next(error);
    });
});


module.exports = router;
