const knex = require('./db')

function create(movie) {
  /*
    Insert record.
    movie param is object matching the table field names {
      id: not-passed-in,
      title: string,
      director: string,
      year: int,
      rating: int,
      poster: url
    }
    Returns an array with movie object or empty array (not sure when it would be empty)
      -- [ { one-movie } ]
      -- []
  */
  console.log("---- create()");
  // return knex('movies')
  //   .where('title', movie.title)
  //   .then((aRecs) => {
  //     console.log("---- create aRecs: ", aRecs);
  //     if (aRecs.length)
  //       throw { error: { message: "movie title already exists" }};
  //   })
  //   .then(() => {
  //     console.log("---- ready to insert: ", movie);
  //     return knex('movies')
  //      .insert([movie]) // param is in the format of the fields so use destructuring
  //      .returning('*') // gets array of the inserted records
  //   })
  //   .then(aRecs => aRecs[0]) // unpack single record
  //   .catch((err) => {
  //     console.log("---- error: ", err);
  //     // if this is the error of a movie title exisitng, return it as an object
  //     //   since this is an expected error, not catastrophic like a db connection problem
  //     if (err.error.message) {
  //       console.log("---- return the error ");
  //       return err;
  //     }
  //     console.log("---- throw the error");
  //     // otherwise rethrow the critical error so caller can handle it
  //     throw err;
  //   })

  // THIS IS THE SIMPLE VERSION THAT DOESN'T CHECK IF TITLE ALREADY EXISTS
  // return knex('movies')
  //   .insert([movie]) // param is in the format of the fields so use destructuring
  //   .returning('*') // gets array of the inserted records
  //   .then(aRecs => aRecs[0]); // unpack single record

  return knex('movies')
    .insert([movie]) // param is in the format of the fields so use destructuring
    .returning('*') // gets array of the inserted records
    .then((res) => {
      console.log("--> model::update returning: ", res);
      return res;
    })
}

function read(_id) {
  /*
    read one record
  */
  const id = parseInt(_id); // handle int or string param
  return knex('movies')
    .where('id', id)
    .then(aRecs => aRecs[0]); // unpack single record
}

function readTitle(sTitle) {
  /* find by title, returns array or 0 or 1 record */
  return knex('movies')
    .where('title', sTitle)
    .then((res) => {
      console.log("--> model::readTitle returning: ", res);
      return res;
    })
}

function readAll() {
  /*
    read all records
  */
  return knex('movies')
}

function update(movie) {
  /*
    Update an existing movie.  See create for the format of the record.
    Must include the ID field in the record being passed.

    Returns an array with movie object or empty array if nothing was updated (ie a bad id)
      -- [ { one-movie } ]
      -- []
  */
  return knex('movies')
    .update(movie)
    .where('id', movie.id)
    .returning('*')
    .then((res) => {
      console.log("--> model::update returning: ", res);
      return res;
    })
}

function destroy(id) {
  /*
    Destroy the candidate record with the corresponding id.
    Return deleted record
  */
  return knex('movies')
    .del()
    .where('id', id)
    .returning('*')
    .then(aRecs => aRecs[0]); // unpack single record
}

// TEST

// readAll()
//   .then((aRecs) => {
//     console.log("aRecs: ", aRecs);
//     knex.destroy();
//   });
////////////////
// read("2")
//   .then((rec) => {
//     console.log("rec: ", rec);
//     knex.destroy();
//   });
////////////////
// const movieToCreate = {
//   title: 'New movie',
//   director: 'director',
//   year: 2000,
//   rating: 1,
//   poster: 'poster',
// };
// create(movieToCreate)
//   .then((rec) => {
//     console.log("** rec: ", rec);
//   })
//   .then(() => {
//     readAll()
//       .then((aRecs) => {
//         console.log("** aRecs: ", aRecs);
//         knex.destroy();
//       });
//   });
/////////////////
// const movieToModify = {
//   id: 2,
//   title: 'updated title',
//   director: 'updated director',
//   year: 1900,
//   rating: 10,
//   poster: 'new poster',
// };
// update(movieToModify)
//   .then((rec) => {
//     console.log("**** rec: ", rec);
//   })
//   .then(() => {
//     readAll()
//       .then((aRecs) => {
//         console.log("**** aRecs: ", aRecs);
//         knex.destroy();
//       });
//   });
/////////////////
// destroy("5")
//   .then((rec) => {
//     console.log("rec: ", rec);
//   })
//   .then(() => {
//     readAll()
//       .then((aRecs) => {
//         console.log("** aRecs: ", aRecs);
//         knex.destroy();
//       });
//   });

module.exports = {
  create,
  read,
  readTitle,
  readAll,
  update,
  destroy,
};

// TESTING

// readTitle("Fear and Loathing")
//   .then((res) => {
//     console.log("F&L: ", res);
//   })
//
// readTitle("bad title")
//   .then((res) => {
//     console.log("bad title: ", res);
//   })
