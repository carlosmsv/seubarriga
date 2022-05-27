/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = (knex) => {
  return Promise.all([
    knex.schema.createTable('transfers', (t) => {
      t.increments('id').primary();
      t.string('description').notNull();
      t.date('date').notNull();
      t.decimal('amount', 15, 2).notNull();
      t.integer('acc_ori_id')
        .references('id')
        .inTable('accounts')
        .notNull();
      t.integer('acc_dest_id')
        .references('id')
        .inTable('accounts')
        .notNull();
      t.integer('user_id')
        .references('id')
        .inTable('users')
        .notNull();
    }),
    knex.schema.table('transactions', (t) => {
      t.integer('transfer_id')
        .references('id')
      .inTable('transfers');
    })
  ])
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = (knex) => {
  return Promise.all([
    knex.schema.table('transactions', (t) => {
      t.dropColumn('transfer_id')
    }),
    knex.schema.dropTable('transfers'),
  ]);
};
