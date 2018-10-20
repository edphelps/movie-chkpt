

exports.up = (knex) => {
  return knex.schema.createTable('movies', (table) => {
    table.increments();
    table.string('title').unique().notNullable().defaultTo('');
    table.string('director').notNullable().defaultTo('');
    table.integer('year').notNullable().defaultTo(0);
    table.integer('rating').notNullable().defaultTo(0);
    table.string('poster').notNullable().defaultTo('');

    // table.timestamps(true, true);
  });
};

exports.down = (knex) => {
  return knex.schema.dropTable('movies');
};
