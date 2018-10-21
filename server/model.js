const knex = require('./db')

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
function create(movie) {
  console.log("---- create()");

  return knex('movies')
    .insert([movie]) // param is in the format of the fields so use destructuring
    .returning('*') // gets array of the inserted records
    .then((res) => {
      console.log("--> model::update returning: ", res);
      return res;
    })
}

/*
  read one record
*/
function read(_id) {
  const id = parseInt(_id); // handle int or string param
  return knex('movies')
    .where('id', id)
    .then(aRecs => aRecs[0]); // unpack single record
}

/* find by title, returns array or 0 or 1 record */
function readTitle(sTitle) {
  return knex('movies')
    .where('title', sTitle)
    .then((res) => {
      console.log("--> model::readTitle returning: ", res);
      return res;
    })
}

/*
  read all records
*/
function readAll() {
  return knex('movies')
}

/*
  Update an existing movie.  See create for the format of the record.
  Must include the ID field in the record being passed.

  Returns an array with movie object or empty array if nothing was updated (ie a bad id)
  -- [ { one-movie } ]
  -- []
*/
function update(movie) {
  return knex('movies')
    .update(movie)
    .where('id', movie.id)
    .returning('*')
    .then((res) => {
      console.log("--> model::update returning: ", res);
      return res;
    })
    .catch((error) => {
      console.log("%%% knex:update error :", error);
      throw new Error(error.message);
    })
}

/*
  Delete record
  Return:
  - [ { one-movie } ]
  - []
*/
function destroy(id) {
  return knex('movies')
    .del()
    .where('id', id)
    .returning('*')
}

module.exports = {
  create,
  read,
  readTitle,
  readAll,
  update,
  destroy,
};
