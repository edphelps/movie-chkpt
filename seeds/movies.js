
exports.seed = (knex) => {
  // Deletes ALL existing entries
  return knex('movies').del()
    .then(() => {
      // Inserts seed entries
      // https://www.imdb.com/title/tt0449059/?ref_=fn_al_tt_1
      return knex('movies').insert([
        {id: 1, title: 'Little Miss Sunshine', director: 'Jonathan Dayton, Valerie Faris', year: 2006, rating: 2, poster: 'https://cdn.stg.onebauer.media/one/empire-images/features/59e8d795405a5c6805947751/50%20little%20miss%20sunshine.jpg?format=jpg'},
        {id: 2, title: 'The Graduate', director: 'Mike Nichols', year: 1967, rating: 3, poster: 'https://cdn.stg.onebauer.media/one/empire-images/features/59e8d795405a5c6805947751/49%20The%20Graduate.jpg?format=jpg'},
        {id: 3, title: 'Fear and Loathing', director: 'Terry Gilliam', year: 1998, rating: 4, poster: 'https://cdn.stg.onebauer.media/one/empire-images/features/59e8d795405a5c6805947751/44%20Fear%20and%20Loathing%20in%20Las%20Vegas.jpg?format=jpg'},
        {id: 4, title: 'Breakfast at Tiffanys', director: 'Blake Edwards', year: 1961, rating: 5, poster: 'https://cdn.stg.onebauer.media/one/empire-images/features/59e8d795405a5c6805947751/41%20Breakfast%20at%20Tiffany%27s.jpg?format=jpg'},
      ]);
    })
    .then(() => {
      return knex.raw(
        `SELECT setval('movies_id_seq', (SELECT MAX(id) FROM movies));`
      );
    });
}
