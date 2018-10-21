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

  model.readTitle(oMovie.title)
    .then((aRecs) => {
      // if title already exists , error out
      if (aRecs.length) {
        console.log("--- view::post -- movie exists");
        res.status(412).json({ error: { message: "unable to save, movie title already exists" }});
        return;
      }
      model.create(oMovie)
        .then((aRecs) => {
          res.status(201).json(aRecs[0]);
        })
        .catch((error) => {
          error.THE_CAUSE = error.toString(); // otherwise the actual cause of the error doesn't get reported
          console.log("--- view::post added a catch to update, error: ", error);
          res.status(500).json(error);
          return;
        })
    })
    .catch((error) => {
      console.log("--- view::post -- caught error: ", error);
      error.status = 400;
      next(error);
    });

});
// router.post('', (req, res, next) => {
//   const oParams = {
//     title: 'string',
//     director: 'string',
//     year: 'int',
//     rating: 'int',
//     poster: 'string',
//   };
//   if (!chkBodyParams(oParams, req, res, next))
//     return;
//   const oMovie = {
//     // id: not-passed-to-create-new-record
//     title: req.body.title,
//     director: req.body.director,
//     year: req.body.year,
//     rating: req.body.rating,
//     poster: req.body.poster,
//   };
//   model.create(oMovie)
//     .then((newMovie) => {
//       res.status(201).json(newMovie);
//     })
//     .catch((error) => {
//       error.status = 400;
//       next(error);
//     });
// });

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
*  Return
*     - update movie record: { id:2, title: "title", ...}
*     - { error: { message: "movie title already exists" } }
*     - { error: { message: "movie title already exists" } }
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
  if (!chkBodyParams(oParams, req, res, next)) // will setup the error if param is missing
    return;
  const oMovie = {
    id: req.params.id,
    title: req.body.title,
    director: req.body.director,
    year: req.body.year,
    rating: req.body.rating,
    poster: req.body.poster,
  };

  // check if title already exists
  console.log("--- view::put -- checking is title exists");
  model.readTitle(oMovie.title)
    .then((aRecs) => {
      // if title exists for a differnt movie.id, error out
      if (aRecs.length && aRecs[0].id != oMovie.id) {
        console.log("--- view::put -- movie title already exists");
        const error = new Error("unable to save, movie title already exists" );
        error.status = 412;
        throw error;
        return;
      }
    })
    // attempt update
    .then(() => {
      console.log("--- view::put -- movie ok to update");
      // update the movie
      return model.update(oMovie);
    })
    // check success of update
    .then((aRecs) => {
      console.log("--- view::put -- updated, aRecs", aRecs);
      // movie successfully updated
      if (aRecs.length) {
        console.log("--- view::put -- success");
        res.status(201).json(aRecs[0]);
        return;
      // movie not found so it couldn't be updated
      } else {
        console.log("--- view::put -- movie not fnd");
        res.status(404).json({ error: { message: "unabl;e to save, movie was deleted / id can't be found" }});
        return;
      }
    })
    .catch((error) => {
      error.THE_CAUSE = error.toString(); // otherwise knex/db error message is lost for some reason
      error.status = error.status || 500;
      console.log("--- view::put catch, error: ", error);
      // res.status(500).json(error);
      // return;
      next(error);
    });


  // model.update(oMovie)
  //   .then((updatedMovie) => {
  //     res.status(201).json(updatedMovie);
  //   })
  //   .catch((error) => {
  //     error.status = 400;
  //     next(error);
  //   });
});

// ***************************************************** */
// router.put('/:id', (req, res, next) => {
//
//   const oParams = {
//     title: 'string',
//     director: 'string',
//     year: 'int',
//     rating: 'int',
//     poster: 'string',
//   };
//   if (!chkBodyParams(oParams, req, res, next)) // will setup the error if param is missing
//     return;
//   const oMovie = {
//     id: req.params.id,
//     title: req.body.title,
//     director: req.body.director,
//     year: req.body.year,
//     rating: req.body.rating,
//     poster: req.body.poster,
//   };
//
//   // check if title already exists
//   console.log("--- view::put -- checking is title exists");
//   model.readTitle(oMovie.title)
//     .then((aRecs) => {
//
//       // if title exists for a differnt movie.id, error out
//       if (aRecs.length && aRecs[0].id != oMovie.id) {
//         console.log("--- view::put -- movie exists");
//         res.status(412).json({ error: { message: "unable to save, movie title already exists" }});
//         return;
//       }
//
//       console.log("--- view::put -- movie ok to update, aRecs", aRecs);
//       // update the movie
//       model.update(oMovie)
//         .then((aRecs) => {
//           console.log("--- view::put -- updated, aRecs", aRecs);
//           // movie successfully updated
//           if (aRecs.length) {
//             console.log("--- view::put -- success");
//             res.status(201).json(aRecs[0]);
//             return;
//           // movie not found so it couldn't be updated
//           } else {
//             console.log("--- view::put -- movie not fnd");
//             res.status(404).json({ error: { message: "unabl;e to save, movie was deleted / id can't be found" }});
//             return;
//           }
//         })
//         .catch((error) => {
//           error.THE_CAUSE = error.toString(); // otherwise the actual cause of the error doesn't get reported
//           console.log("--- view::put added a catch to update, error: ", error);
//           res.status(500).json(error);
//           return;
//         })
//
//     })
//     .catch((error) => {
//       console.log("--- view::put -- caught error: ", error);
//       error.status = 400;
//       next(error);
//     });
//
//   // model.update(oMovie)
//   //   .then((updatedMovie) => {
//   //     res.status(201).json(updatedMovie);
//   //   })
//   //   .catch((error) => {
//   //     error.status = 400;
//   //     next(error);
//   //   });
// });

// router.put('/:id', (req, res, next) => {
//   const oParams = {
//     title: 'string',
//     director: 'string',
//     year: 'int',
//     rating: 'int',
//     poster: 'string',
//   };
//   if (!chkBodyParams(oParams, req, res, next))
//     return;
//   const oMovie = {
//     id: req.params.id,
//     title: req.body.title,
//     director: req.body.director,
//     year: req.body.year,
//     rating: req.body.rating,
//     poster: req.body.poster,
//   };
//   model.update(oMovie)
//     .then((aRecs) => {
//       if (aRecs.length) {
//         res.status(201).json(aRecs[0]);
//       } else {
//         res.status(404).json({ error: { message: "movie title already exists" }});
//       }
//     })
//     .catch((error) => {
//       error.status = 400;
//       next(error);
//     });
//
//
//   // model.update(oMovie)
//   //   .then((updatedMovie) => {
//   //     res.status(201).json(updatedMovie);
//   //   })
//   //   .catch((error) => {
//   //     error.status = 400;
//   //     next(error);
//   //   });
// });

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
