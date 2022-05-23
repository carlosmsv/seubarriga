/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = (knex) => {
  return knex.schema.createTable('accounts', (t) => {
    t.increments('id').primary();
    t.string('name').notNull();
    t.integer('user_id')
      .references('id')
      .inTable('users')
      .notNull();
  })
  
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = (knex) => {
  return knex.schema.dropTable('accounts')
};
