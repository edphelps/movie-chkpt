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
    Return the newly created record as an object.
  */
  return knex('movies')
    .insert([movie]) // param is in the format of the fields so use destructuring
    .returning('*') // gets array of the inserted records
    .then(aRecs => aRecs[0]); // unpack single record
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
  */
  return knex('movies')
    .update(movie)
    .where('id', movie.id)
    .returning('*')
    .then(aRecs => aRecs[0]); // unpack single record
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
  readAll,
  update,
  destroy,
};

// TESTING
